// LOCATION: components/ChatBot.tsx   (NEW FILE - create it inside the "components" folder)
// A rule-based chat assistant: no API key, no monthly cost, works offline from your own content.
// What it says comes from config/chatbot.ts + your live website content (packages, services, offer, reviews).
"use client";

import { useEffect, useRef, useState } from "react";
import type { PackagesData, Pkg, Service, Testimonial } from "@/lib/content-schema";
import { chatbot as b } from "@/config/chatbot";
import { wa } from "./wa";

type Chip = { label: string; id?: string; href?: string; text?: string };
type Part = { text?: string; pkgs?: Pkg[]; link?: { label: string; href: string } };
type Msg = Part & { id: number; from: "bot" | "user" };
type Lead = { interest: string; name: string; date: string; place: string; note: string };
type Flow = null | { kind: "book"; step: "interest" | "name" | "date" | "place" | "note"; data: Lead } | { kind: "budget" };

type Props = {
  whatsapp: string;
  phone: string;
  packages: PackagesData;
  services: Service[];
  categories: string[];
  testimonials: Testimonial[];
};

/* ---------- small helpers ---------- */
const norm = (s: string) => " " + s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() + " ";
// Short words must match whole words ("hi"); longer words match the start of a word ("package" -> "packages").
const hit = (t: string, k: string) => {
  const key = norm(k).trim();
  return key.length <= 3 ? t.includes(" " + key + " ") : t.includes(" " + key);
};
const priceNum = (p: Pkg) => {
  const n = Number(p.price.replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const money = (n: number) => "₹" + n.toLocaleString("en-IN");

// Understands "80000", "80,000", "1 lakh", "1.5 lakh", "75k"
function parseBudget(text: string): number | null {
  const s = text.toLowerCase().replace(/(\d),(?=\d)/g, "$1");
  for (const m of s.matchAll(/(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lk|k|thousand)?/g)) {
    let v = Number(m[1]);
    const unit = m[2] || "";
    if (/^(lakh|lac|lk)/.test(unit)) v *= 100000;
    else if (unit === "k" || unit === "thousand") v *= 1000;
    if (v >= 5000 && v <= 100000000) return Math.round(v);
  }
  return null;
}

// Sends an event to Google Tag Manager (already installed in app/layout.tsx) so you can count chatbot leads.
function track(event: string, extra: Record<string, string> = {}) {
  try {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event, ...extra });
  } catch {
    /* tracking must never break the chat */
  }
}

const baseRules: { id: string; keys: string[] }[] = [
  { id: "hello", keys: ["hi", "hello", "hey", "hii", "namaste", "good morning", "good evening", "good afternoon"] },
  { id: "thanks", keys: ["thanks", "thank you", "thankyou", "ok thanks", "great", "awesome"] },
  { id: "packages", keys: ["package", "price", "pricing", "rate", "cost", "how much is", "how much for", "how much does", "charges", "fee", "plans"] },
  { id: "find", keys: ["suggest", "recommend", "which package", "help me choose", "help me pick", "best for", "confused"] },
  { id: "budget", keys: ["budget", "afford", "cheap", "under", "within", "below", "low cost", "lakh", "lac"] },
  { id: "services", keys: ["service", "what do you do", "what you offer", "what do you offer", "cover"] },
  { id: "trust", keys: ["why", "trust", "experience", "quality", "reliable", "genuine", "about", "who are you", "safe"] },
  { id: "offer", keys: ["offer", "discount", "free", "complimentary", "deal", "coupon"] },
  { id: "reviews", keys: ["review", "testimonial", "feedback", "rating"] },
  { id: "process", keys: ["process", "how to book", "how do i book", "procedure", "steps", "how it works"] },
  { id: "work", keys: ["portfolio", "photos", "sample", "gallery", "pictures", "work", "films"] },
  { id: "contact", keys: ["contact", "call", "phone", "number", "address", "reach", "whatsapp", "talk", "speak", "human", "agent", "owner", "email", "location", "where"] },
  { id: "book", keys: ["book", "booking", "reserve", "confirm", "schedule", "available", "availability"] },
  { id: "faq", keys: ["faq", "question", "doubt", "help"] },
];

export default function ChatBot({ whatsapp, phone, packages, services, categories, testimonials }: Props) {
  const items = packages.items;
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState<Flow>(null);

  const idRef = useRef(1);
  const timers = useRef<number[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const teaserDismissed = useRef(false);
  const uid = () => idRef.current++;

  const link = (msg: string) => wa(msg, whatsapp);
  const generalLink = () => link(b.whatsappIntro);

  /* ---------- lifecycle ---------- */
  // Small "Ask me about packages" bubble appears a few seconds after the page loads.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!teaserDismissed.current) setTeaser(true);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs, typing, chips]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  /* ---------- building blocks ---------- */
  function say(parts: Part[], next: Chip[]) {
    setTyping(true);
    setChips([]);
    const t = window.setTimeout(() => {
      setMsgs((m) => [...m, ...parts.map((p) => ({ ...p, id: uid(), from: "bot" as const }))]);
      setChips(next);
      setTyping(false);
    }, 450);
    timers.current.push(t);
  }

  const menuChips = (): Chip[] => [
    { label: "Packages & prices", id: "packages" },
    { label: "Find my package", id: "find" },
    { label: "Within my budget", id: "budget" },
    { label: "Why Wedknox?", id: "trust" },
    ...(packages.offerEnabled && packages.offerTitle ? [{ label: "Special offer", id: "offer" }] : []),
    ...(testimonials.length ? [{ label: "Client reviews", id: "reviews" }] : []),
    { label: "Our work", id: "work" },
    { label: "FAQs", id: "faq" },
    { label: "Book a shoot", id: "book" },
    { label: "Chat on WhatsApp", href: generalLink() },
  ];

  const moreChips = (): Chip[] => [
    { label: "Book a shoot", id: "book" },
    { label: "Chat on WhatsApp", href: generalLink() },
    { label: "Main menu", id: "menu" },
  ];

  function budgetReply(n: number) {
    const fits = items
      .map((p) => ({ p, v: priceNum(p) }))
      .filter((x) => x.v !== null && x.v <= n)
      .sort((a, c) => (c.v ?? 0) - (a.v ?? 0))
      .slice(0, 4)
      .map((x) => x.p);
    if (fits.length) {
      say(
        [
          { text: `Great! For a budget of ${money(n)}, these packages fit:`, pkgs: fits },
          { text: "Need something tailored to your budget? Share your plan on WhatsApp and our team will suggest the best option." },
        ],
        moreChips()
      );
    } else {
      say(
        [
          {
            text: `${money(n)} is a little below our listed packages, but don't worry. Tell us what you need and we'll see what we can plan together.`,
            link: { label: "Discuss on WhatsApp", href: link(`Hi Wedknox, my budget is ${money(n)}. Can you suggest something for me?`) },
          },
        ],
        moreChips()
      );
    }
  }

  function startBooking(interest: string) {
    const data: Lead = { interest, name: "", date: "", place: "", note: "" };
    if (!interest) {
      setFlow({ kind: "book", step: "interest", data });
      say(
        [{ text: "Happy to help you book! What are you planning?" }],
        [
          ...items.slice(0, 6).map((p, i) => ({ label: p.name, id: `bookpkg:${i}` })),
          { label: "Not sure yet", id: "bookpkg:-1" },
          { label: "Cancel", id: "menu" },
        ]
      );
    } else {
      setFlow({ kind: "book", step: "name", data });
      say([{ text: `Lovely choice: ${interest}.\nMay I have your name?` }], [{ label: "Cancel", id: "menu" }]);
    }
  }

  function bookStep(text: string) {
    if (flow?.kind !== "book") return;
    const d = { ...flow.data };
    const cancel: Chip[] = [{ label: "Cancel", id: "menu" }];
    if (flow.step === "interest") {
      d.interest = text;
      setFlow({ kind: "book", step: "name", data: d });
      say([{ text: `Lovely choice: ${text}.\nMay I have your name?` }], cancel);
    } else if (flow.step === "name") {
      if (text.length < 2) return say([{ text: "Please enter your name so our team knows who to speak with." }], cancel);
      d.name = text;
      setFlow({ kind: "book", step: "date", data: d });
      say([{ text: `Nice to meet you, ${text}! What is your event date?\n(Example: 12 Feb 2027, or tell us if it's not fixed yet)` }], [{ label: "Not fixed yet", text: "Not fixed yet" }, ...cancel]);
    } else if (flow.step === "date") {
      d.date = text;
      setFlow({ kind: "book", step: "place", data: d });
      say([{ text: "Where will the event take place? (city or venue)" }], cancel);
    } else if (flow.step === "place") {
      d.place = text;
      setFlow({ kind: "book", step: "note", data: d });
      say([{ text: "Anything else we should know? (type of event, number of guests, special requests)" }], [{ label: "Nothing, continue", text: "skip" }, ...cancel]);
    } else {
      d.note = /^(skip|no|nothing|none|nope)$/i.test(text) ? "" : text;
      setFlow(null);
      const msg =
        `Hi Wedknox, I'd like to book a shoot.` +
        `\nName: ${d.name}` +
        `\nInterested in: ${d.interest || "Not sure yet"}` +
        `\nEvent date: ${d.date}` +
        `\nLocation: ${d.place}` +
        (d.note ? `\nNote: ${d.note}` : "") +
        `\n(Sent from the website chat assistant)`;
      track("chatbot_lead_ready", { interest: d.interest || "unknown" });
      // AUTO-OPEN WHATSAPP: this runs straight from the customer's tap/Enter, so the browser allows it.
      // WhatsApp opens with the full message ready; the customer only has to press Send inside WhatsApp.
      window.open(link(msg), "_blank", "noopener,noreferrer");
      say(
        [
          { text: `Thank you, ${d.name}! WhatsApp is opening with all your details filled in. Just press Send there, and our team will confirm availability and the best package for you.\n\nIf WhatsApp did not open, tap the button below.` },
          { text: `📋 ${d.interest || "Not sure yet"}\n📅 ${d.date}\n📍 ${d.place}${d.note ? `\n📝 ${d.note}` : ""}`, link: { label: "Open WhatsApp again", href: link(msg) } },
        ],
        [{ label: "Main menu", id: "menu" }]
      );
    }
  }

  /* ---------- answers ---------- */
  function respond(id: string, userText = "") {
    if (!id.startsWith("bookpkg:")) setFlow(null);

    if (id === "menu") return say([{ text: "Sure! What would you like to know?" }], menuChips());

    if (id === "hello")
      return say([{ text: "Hello! 😊 How can I help you today?" }], menuChips());

    if (id === "thanks")
      return say([{ text: "You're most welcome! If you'd like to go ahead, I can take your details and pass them to our team on WhatsApp." }], moreChips());

    if (id === "packages") {
      if (!items.length)
        return say([{ text: "Please message us on WhatsApp for our latest packages and prices.", link: { label: "Chat on WhatsApp", href: generalLink() } }], moreChips());
      const parts: Part[] = [{ text: "Here are our current packages and prices:", pkgs: items }];
      if (packages.offerEnabled && packages.offerTitle) parts.push({ text: `🎁 ${packages.offerTitle}` });
      return say(parts, [{ label: "Find my package", id: "find" }, { label: "Within my budget", id: "budget" }, ...moreChips()]);
    }

    if (id === "find")
      return say(
        [{ text: "Let's find the right package. What are you planning?" }],
        [...b.eventTypes.map((e, i) => ({ label: e.label, id: `find:${i}` })), { label: "Something else", id: "book" }]
      );

    if (id.startsWith("find:")) {
      const ev = b.eventTypes[Number(id.slice(5))];
      if (!ev) return respond("find");
      const list = items.filter((p) => ev.packageKeys.some((k) => p.name.toLowerCase().includes(k)));
      if (list.length)
        return say(
          [{ text: `For ${ev.label}, these packages suit you best:`, pkgs: list }, { text: "Not sure which one? Tell us your date and plan, and our team will guide you personally." }],
          moreChips()
        );
      return say(
        [{ text: `We'd love to plan your ${ev.label} shoot. Let's talk about it on WhatsApp and we'll create the right plan for you.`, link: { label: "Chat on WhatsApp", href: link(`Hi Wedknox, I'm interested in a ${ev.label} shoot.`) } }],
        moreChips()
      );
    }

    if (id === "budget") {
      const n = userText ? parseBudget(userText) : null;
      if (n) return budgetReply(n);
      setFlow({ kind: "budget" });
      return say(
        [{ text: "Tell me your budget and I'll show what fits.\n(Type an amount like 80000 or 1 lakh, or tap one below)" }],
        [
          { label: "₹50,000", text: "50000" },
          { label: "₹75,000", text: "75000" },
          { label: "₹1 lakh", text: "100000" },
          { label: "₹1.5 lakh", text: "150000" },
          { label: "Main menu", id: "menu" },
        ]
      );
    }

    if (id === "services") {
      const list = services.map((s) => `• ${s.name}${s.description ? ` - ${s.description}` : ""}`).join("\n");
      return say([{ text: list ? `Here's what we offer:\n${list}` : "Please ask on WhatsApp about the services we offer." }], [{ label: "Packages & prices", id: "packages" }, ...moreChips()]);
    }

    if (id === "trust") {
      const lines: string[] = [];
      const bi = b.business;
      if (bi.experience) lines.push(bi.experience);
      if (bi.eventsCovered) lines.push(bi.eventsCovered);
      if (bi.location) lines.push(bi.location);
      lines.push(...b.trustPoints);
      if (categories.length) lines.push(`Real work across ${categories.join(", ")} - see it in our portfolio`);
      if (testimonials.length) lines.push(`${testimonials.length} client review${testimonials.length > 1 ? "s" : ""} on this website`);
      return say(
        [{ text: `Why clients choose ${b.brand}:\n` + lines.map((l) => `✔ ${l}`).join("\n") }],
        [{ label: "Our work", id: "work" }, ...(testimonials.length ? [{ label: "Client reviews", id: "reviews" }] : []), ...moreChips()]
      );
    }

    if (id === "offer") {
      if (packages.offerEnabled && packages.offerTitle) {
        const names = items.filter((p) => p.complimentary).map((p) => p.name);
        return say(
          [{ text: `🎁 ${packages.offerTitle}${names.length ? `\nApplies to: ${names.join(", ")}` : ""}` }],
          [{ label: "Packages & prices", id: "packages" }, ...moreChips()]
        );
      }
      return say(
        [{ text: "For our current offers, please check with the team directly on WhatsApp.", link: { label: "Ask about offers", href: link("Hi Wedknox, are there any offers running now?") } }],
        moreChips()
      );
    }

    if (id === "reviews") {
      if (!testimonials.length) return respond("work");
      const text = testimonials.slice(0, 3).map((t) => `“${t.quote}”\n- ${t.name}`).join("\n\n");
      return say([{ text }], [{ label: "Our work", id: "work" }, ...moreChips()]);
    }

    if (id === "work")
      return say(
        [{ text: `See our real work for ${categories.length ? categories.join(", ") : "weddings, pre-weddings, half saree and baby shoots"}. Tap below to jump to it.` }],
        [{ label: "View portfolio", href: "#portfolio" }, { label: "Watch films", href: "#films" }, ...moreChips()]
      );

    if (id === "process")
      return say(
        [{ text: "Booking with us is simple:\n" + b.process.map((s, i) => `${i + 1}. ${s}`).join("\n") }],
        [{ label: "Start booking", id: "book" }, { label: "Chat on WhatsApp", href: generalLink() }, { label: "Main menu", id: "menu" }]
      );

    if (id === "faq")
      return say(
        [{ text: "Here are common questions. Tap one:" }],
        [...b.faqs.map((f, i) => ({ label: f.q, id: `faq:${i}` })), { label: "How booking works", id: "process" }]
      );

    if (id.startsWith("faq:")) {
      const f = b.faqs[Number(id.slice(4))];
      if (!f) return respond("faq");
      const answer = f.a || (f.useBusiness && b.business[f.useBusiness]) || b.confirmOnWhatsApp;
      return say(
        [{ text: answer, link: { label: "Ask the team on WhatsApp", href: link(`Hi Wedknox, I have a question: ${f.q}`) } }],
        [{ label: "More FAQs", id: "faq" }, { label: "Book a shoot", id: "book" }, { label: "Main menu", id: "menu" }]
      );
    }

    if (id === "contact") {
      const bi = b.business;
      const lines = [`📞 ${phone}`, "💬 WhatsApp (fastest reply)"];
      if (bi.email) lines.push(`✉️ ${bi.email}`);
      if (bi.location) lines.push(`📍 ${bi.location}`);
      if (bi.workingHours) lines.push(`🕘 ${bi.workingHours}`);
      return say(
        [{ text: "You can reach the Wedknox team here:\n" + lines.join("\n"), link: { label: "Chat on WhatsApp", href: generalLink() } }],
        [{ label: "Call now", href: `tel:${phone.replace(/[^\d+]/g, "")}` }, { label: "Book a shoot", id: "book" }, { label: "Main menu", id: "menu" }]
      );
    }

    if (id === "book") return startBooking("");

    if (id.startsWith("bookpkg:")) {
      const i = Number(id.slice(8));
      return startBooking(i >= 0 && items[i] ? `${items[i].name} (${items[i].price})` : "Not sure yet");
    }

    // Nothing matched: be honest and hand over to a human on WhatsApp, with the customer's question filled in.
    const q = userText.slice(0, 300);
    return say(
      [
        {
          text: "I'm not fully sure about that one, but our team can answer it personally. You can send your question on WhatsApp in one tap, or pick something below.",
          link: { label: "Ask on WhatsApp", href: link(`Hi Wedknox, I have a question: ${q}`) },
        },
      ],
      menuChips()
    );
  }

  function detectIntent(text: string): string {
    const t = norm(text);
    const rules = [
      ...b.eventTypes.map((e, i) => ({ id: `find:${i}`, keys: e.textKeys })),
      ...b.faqs.map((f, i) => ({ id: `faq:${i}`, keys: f.keys })),
      ...baseRules,
    ];
    let best = "fallback";
    let bestScore = 0;
    for (const r of rules) {
      const s = r.keys.reduce((sum, k) => (hit(t, k) ? sum + k.length : sum), 0);
      if (s > bestScore) {
        bestScore = s;
        best = r.id;
      }
    }
    if (best === "fallback" && parseBudget(text) !== null) return "budget";
    return best;
  }

  /* ---------- user actions ---------- */
  function pushUser(text: string) {
    setMsgs((m) => [...m, { id: uid(), from: "user", text }]);
  }

  function onText(raw: string, display = raw) {
    const t = raw.trim();
    if (!t || typing) return;
    pushUser(display.trim());
    if (/^(menu|cancel|stop|back|start over)$/i.test(t)) return respond("menu");
    if (flow?.kind === "book") return bookStep(t);
    if (flow?.kind === "budget") {
      const n = parseBudget(t);
      if (n) {
        setFlow(null);
        return budgetReply(n);
      }
    }
    respond(detectIntent(t), t);
  }

  function onChip(c: Chip) {
    if (typing) return;
    if (c.text !== undefined) return onText(c.text, c.label);
    if (c.id) {
      pushUser(c.label);
      respond(c.id);
    }
  }

  function openChat() {
    teaserDismissed.current = true;
    setTeaser(false);
    setOpen(true);
    track("chatbot_open");
    if (msgs.length === 0) {
      const parts: Part[] = [
        { text: `Hi 👋 I'm ${b.botName}, the virtual assistant of ${b.brand}.\nI can show packages and prices, help you pick the right one, and connect you with our team on WhatsApp.` },
      ];
      say(parts, menuChips());
    }
    if (typeof window !== "undefined" && window.matchMedia("(min-width:640px)").matches) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  /* ---------- UI ---------- */
  const chipClass = "rounded-full border border-[rgba(217,173,114,.45)] bg-char px-3 py-1.5 text-xs text-ivory hover:bg-gold hover:text-ink";

  return (
    <>
      {!open && (
        <div className="fixed bottom-20 right-4 z-[55] flex flex-col items-end gap-2 lg:bottom-6 lg:right-6">
          {teaser && (
            <div className="gold-border relative max-w-[220px] rounded-2xl bg-char px-4 py-3 text-sm text-ivory shadow-xl">
              <button
                type="button"
                aria-label="Dismiss"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-mute gold-border"
                onClick={() => {
                  teaserDismissed.current = true;
                  setTeaser(false);
                }}
              >
                ✕
              </button>
              <button type="button" className="text-left" onClick={openChat}>
                {b.teaser}
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={openChat}
            aria-label={`Chat with ${b.botName}`}
            className="relative flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-ink shadow-2xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.6-.8L3 21l1.9-5.1A8.4 8.4 0 1 1 21 11.5z" />
            </svg>
            <span className="hidden sm:inline">Chat with us</span>
            {!teaserDismissed.current && <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-500" />}
          </button>
        </div>
      )}

      {open && (
        <section
          role="dialog"
          aria-label={`Chat with ${b.botName}`}
          className="fixed inset-x-2 bottom-2 top-16 z-[60] flex flex-col overflow-hidden rounded-2xl bg-[#0d0d0d] shadow-2xl gold-border sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-auto sm:h-[600px] sm:max-h-[calc(100dvh-2.5rem)] sm:w-[390px]"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 border-b border-[rgba(217,173,114,.3)] bg-char px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-serif text-xl font-bold text-ink">{b.botName.charAt(0)}</span>
              <div>
                <p className="font-serif text-lg leading-tight">{b.botName} · {b.brand}</p>
                <p className="flex items-center gap-1.5 text-xs text-mute">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> {b.headerSubtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={generalLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("chatbot_whatsapp_click", { from: "header" })}
                className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-ink"
              >
                WhatsApp
              </a>
              <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-mute hover:text-gold">
                ✕
              </button>
            </div>
          </header>

          {/* Messages */}
          <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] space-y-2 ${m.from === "user" ? "" : "w-full"}`}>
                  {m.text && (
                    <div
                      className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "user" ? "ml-auto w-fit rounded-br-sm bg-gold text-ink" : "w-fit max-w-full rounded-bl-sm bg-char text-ivory"
                      }`}
                    >
                      {m.text}
                    </div>
                  )}
                  {m.pkgs && (
                    <div className="space-y-2">
                      {m.pkgs.map((p, i) => (
                        <div key={`${i}-${p.name}`} className="gold-border rounded-xl bg-char/80 p-3">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-serif text-lg">{p.name}</p>
                            <p className="font-serif text-lg text-gold">{p.price}</p>
                          </div>
                          {p.note && <p className="text-xs text-mute">{p.note}</p>}
                          {p.complimentary && <p className="text-xs text-soft">Includes complimentary pre-wedding shoot</p>}
                          <a
                            href={link(`Hi Wedknox, I'd like to book the ${p.name} (${p.price}).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track("chatbot_whatsapp_click", { from: "package", package: p.name })}
                            className="mt-2 block rounded-full bg-gold py-1.5 text-center text-xs font-semibold text-ink"
                          >
                            Book on WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.link && (
                    <a
                      href={m.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("chatbot_whatsapp_click", { from: "message" })}
                      className="block w-fit rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink"
                    >
                      {m.link.label} →
                    </a>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-char px-4 py-3" aria-label="Typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-mute" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          {chips.length > 0 && (
            <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto border-t border-[rgba(217,173,114,.2)] px-4 py-3">
              {chips.map((c, i) =>
                c.href ? (
                  <a
                    key={`${i}-${c.label}`}
                    href={c.href}
                    className={chipClass}
                    {...(c.href.startsWith("#")
                      ? { onClick: () => setOpen(false) }
                      : c.href.startsWith("tel:")
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer", onClick: () => track("chatbot_whatsapp_click", { from: "chip" }) })}
                  >
                    {c.label}
                  </a>
                ) : (
                  <button key={`${i}-${c.label}`} type="button" className={chipClass} onClick={() => onChip(c)}>
                    {c.label}
                  </button>
                )
              )}
            </div>
          )}

          {/* Text box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = input;
              setInput("");
              onText(v);
            }}
            className="flex items-center gap-2 border-t border-[rgba(217,173,114,.3)] bg-char px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={300}
              placeholder="Type your question..."
              aria-label="Type your message"
              className="min-w-0 flex-1 rounded-full bg-ink px-4 py-2.5 text-sm gold-border"
            />
            <button type="submit" className="rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-ink" aria-label="Send message">
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}