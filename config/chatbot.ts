// LOCATION: config/chatbot.ts   (NEW FILE - create it inside the "config" folder, next to site.ts)
//
// This is the "brain notes" of your chat assistant. Edit the text here to change what it says.
// Packages, prices, services, offer and reviews are NOT here - the bot reads those live from
// your website / admin page, so they are always up to date.
//
// RULE: Anything you leave as "" (empty) is simply NOT shown by the bot. Fill in only what is TRUE
// for your business. Real details build trust; invented claims destroy it.

export const chatbot = {
  // ---------- 1. BOT IDENTITY ----------
  botName: "Knox", // the assistant's first name
  brand: "Wedknox Photography",
  headerSubtitle: "Instant answers • Book on WhatsApp",
  teaser: "Hi 👋 Planning a shoot? Ask me about packages & prices!", // small bubble beside the chat button
  // The first message the customer receives on WhatsApp when they tap a generic WhatsApp button.
  whatsappIntro: "Hi Wedknox, I found you on your website chat and I'd like to know more.",

  // ---------- 2. BUSINESS DETAILS (fill what is TRUE, leave the rest "") ----------
  business: {
    location: "", // e.g. "Based in Hyderabad, Telangana"
    experience: "", // e.g. "5+ years of wedding & cinematic photography experience"
    eventsCovered: "", // e.g. "300+ weddings and events covered"
    workingHours: "", // e.g. "Mon-Sun, 9 AM - 9 PM"
    email: "", // e.g. "hello@wedknox.com"
    travel: "", // e.g. "We travel across Telangana and Andhra Pradesh. Travel charges are shared upfront."
    advancePayment: "", // e.g. "A 30% advance locks your date; the balance is due before delivery."
    deliveryTime: "", // e.g. "Photos in 15-20 days, wedding film in 30 days."
    cancellation: "", // e.g. "Dates can be rescheduled once, subject to availability."
  },

  // Said when a detail above is empty. Honest + sends the customer to WhatsApp.
  confirmOnWhatsApp:
    "This depends on your event and date, so our team will confirm the exact details with you directly on WhatsApp.",

  // ---------- 3. WHY CHOOSE US (shown when the customer asks "why Wedknox / can I trust you") ----------
  // These are taken from your website. Edit, add or remove lines freely.
  trustPoints: [
    "Professional cameras and gimbal rigs, so photos feel candid and films feel cinematic",
    "Photography and cinematic videography from one team",
    "Package prices are listed openly on this website - no guessing",
    "You can talk to the team directly on WhatsApp or phone before you decide",
  ],

  // ---------- 4. HOW BOOKING WORKS ----------
  process: [
    "Tell us your event type, date and location (right here in this chat).",
    "We check availability and confirm the best package for you on WhatsApp.",
    "You lock your date with the booking confirmation we share.",
    "We shoot your event with full attention to every moment.",
    "You receive your photos and films.",
  ],

  // ---------- 5. EVENT TYPES (used by "Find my package") ----------
  // packageKeys = words that must appear in the PACKAGE NAME (lowercase) to be suggested.
  // textKeys    = words a customer may TYPE to mean this event.
  // If you rename a package in the admin page, update packageKeys here to match.
  eventTypes: [
    { label: "Wedding", packageKeys: ["basic", "classic", "premium"], textKeys: ["wedding", "marriage", "muhurtam", "engagement", "reception"] },
    { label: "Pre-Wedding", packageKeys: ["pre-wedding", "pre wedding"], textKeys: ["pre wedding", "prewedding", "couple shoot", "save the date"] },
    { label: "Half Saree", packageKeys: ["half saree"], textKeys: ["half saree", "langa voni", "saree function"] },
    { label: "Baby Shoot", packageKeys: ["baby"], textKeys: ["baby", "newborn", "kids", "child", "birthday"] },
    { label: "Car Delivery", packageKeys: ["car"], textKeys: ["car delivery", "new car", "car shoot"] },
  ],

  // ---------- 6. FAQ ----------
  // q = question shown as a button, a = answer ("" = use confirmOnWhatsApp text / business detail),
  // keys = words that trigger this answer when the customer types a question.
  // `useBusiness` pulls the answer from the business section above when it is filled.
  faqs: [
    {
      q: "What equipment do you use?",
      a: "We shoot with professional cameras and gimbal rigs, so photos and films feel both candid and cinematic.",
      keys: ["equipment", "camera", "gimbal", "lens"],
    },
    {
      q: "Do you shoot videos too?",
      a: "Yes. We offer cinematic videography along with photography, so you can get both from one team.",
      keys: ["video", "videography", "film", "cinematic", "reel"],
    },
    {
      q: "Can I get a custom package?",
      a: "Yes. If the listed packages don't fit your event, tell us your budget and requirements and we'll suggest a custom plan on WhatsApp.",
      keys: ["custom", "customize", "customise", "modify", "own package", "tailor"],
    },
    {
      q: "How much advance do I pay?",
      a: "",
      useBusiness: "advancePayment",
      keys: ["advance", "payment", "pay", "deposit", "token", "installment", "emi"],
    },
    {
      q: "How long does delivery take?",
      a: "",
      useBusiness: "deliveryTime",
      keys: ["delivery time", "how long", "when will i get", "turnaround", "deliver"],
    },
    {
      q: "Do you travel to other cities?",
      a: "",
      useBusiness: "travel",
      keys: ["travel", "outstation", "outside", "destination", "another city", "other city", "venue"],
    },
    {
      q: "Can I reschedule or cancel?",
      a: "",
      useBusiness: "cancellation",
      keys: ["cancel", "reschedule", "refund", "postpone"],
    },
  ] as {
    q: string;
    a: string;
    keys: string[];
    useBusiness?: "advancePayment" | "deliveryTime" | "travel" | "cancellation";
  }[],
};