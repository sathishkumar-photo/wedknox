"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { packages, services, site } from "@/config/site";
import { wa } from "./wa";

const CUSTOM_PACKAGE = "Custom Pricing";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    mobile: z
      .string()
      .regex(/^[+]?[0-9 ]{10,14}$/, "Enter a valid mobile number"),
    email: z
      .string()
      .email("Enter a valid email")
      .optional()
      .or(z.literal("")),
    service: z.string().min(1, "Choose a service"),
    pkg: z.string().optional(),
    customPrice: z.string().optional(),
    date: z.string().min(1, "Pick an event date"),
    location: z.string().min(2, "Enter the event location"),
    message: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.pkg !== CUSTOM_PACKAGE) return;

    const amount = data.customPrice?.trim() || "";

    if (
      !/^\d+(\.\d{1,2})?$/.test(amount) ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customPrice"],
        message: "Enter a valid budget greater than ₹0",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    shouldUnregister: true,
    defaultValues: {
      pkg: "",
    },
  });

  const [opened, setOpened] = useState(false);
  const selectedPackage = watch("pkg");
  const isCustomPricing = selectedPackage === CUSTOM_PACKAGE;

  function sendEnquiry(data: FormValues) {
    const budget =
      data.pkg === CUSTOM_PACKAGE && data.customPrice
        ? `\nCustom Budget: ₹${Number(data.customPrice).toLocaleString(
            "en-IN",
            { maximumFractionDigits: 2 }
          )}`
        : "";

    const message =
      `Hi Wedknox, I'd like to enquire.` +
      `\nName: ${data.name}` +
      `\nMobile: ${data.mobile}` +
      (data.email ? `\nEmail: ${data.email}` : "") +
      `\nService: ${data.service}` +
      `\nPackage: ${data.pkg || "Not selected"}` +
      budget +
      `\nDate: ${data.date}` +
      `\nLocation: ${data.location}` +
      (data.message ? `\nMessage: ${data.message}` : "");

    window.open(wa(message), "_blank", "noopener,noreferrer");
    setOpened(true);
  }

  const inputClass =
    "w-full rounded-lg bg-char gold-border px-4 py-3";

  function ErrorMessage({ field }: { field: keyof FormValues }) {
    const error = errors[field];

    return error ? (
      <p role="alert" className="mt-1 text-sm text-red-400">
        {error.message}
      </p>
    ) : null;
  }

  return (
    <section
      id="contact"
      className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-2"
    >
      <div>
        <h2 className="font-serif text-5xl">
          Let's Capture Your Story
        </h2>

        <p className="mt-4 text-mute">
          Call {site.phone} or send your details. Your enquiry
          opens in WhatsApp.
        </p>

        <a
          className="mt-4 block text-gold underline"
          href={wa("Hi Wedknox!")}
        >
          Chat on WhatsApp
        </a>
      </div>

      <form
        onSubmit={handleSubmit(sendEnquiry)}
        noValidate
        className="grid gap-4"
      >
        <div>
          <label htmlFor="contact-name">Full Name</label>
          <input
            id="contact-name"
            autoComplete="name"
            className={inputClass}
            {...register("name")}
          />
          <ErrorMessage field="name" />
        </div>

        <div>
          <label htmlFor="contact-mobile">Mobile Number</label>
          <input
            id="contact-mobile"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            {...register("mobile")}
          />
          <ErrorMessage field="mobile" />
        </div>

        <div>
          <label htmlFor="contact-email">
            Email Address (optional)
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          <ErrorMessage field="email" />
        </div>

        <div>
          <label htmlFor="contact-service">
            Photography Service
          </label>
          <select
            id="contact-service"
            className={inputClass}
            {...register("service")}
          >
            <option value="">Choose…</option>
            {services.map(([name]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ErrorMessage field="service" />
        </div>

        <div>
          <label htmlFor="contact-package">Selected Package</label>
          <select
            id="contact-package"
            className={inputClass}
            {...register("pkg")}
          >
            <option value="">Not sure yet</option>

            {packages.map((pkg) => (
              <option
                key={pkg.name}
                value={`${pkg.name} (${pkg.price})`}
              >
                {pkg.name} ({pkg.price})
              </option>
            ))}

            <option value={CUSTOM_PACKAGE}>Custom Pricing</option>
          </select>
        </div>

        {/* Appears only when Custom Pricing is selected */}
        {isCustomPricing && (
          <div className="gold-border rounded-xl bg-char/50 p-4">
            <label htmlFor="contact-budget">
              Your Budget (₹) <span className="text-gold">*</span>
            </label>

            <input
              id="contact-budget"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="Example: 50000"
              required
              aria-invalid={Boolean(errors.customPrice)}
              aria-describedby="contact-budget-help"
              className={`${inputClass} mt-2`}
              {...register("customPrice")}
            />

            <p
              id="contact-budget-help"
              className="mt-2 text-sm text-mute"
            >
              Share your preferred budget. We’ll discuss a package
              based on your requirements.
            </p>

            <ErrorMessage field="customPrice" />
          </div>
        )}

        <div>
          <label htmlFor="contact-date">Event Date</label>
          <input
            id="contact-date"
            type="date"
            className={inputClass}
            {...register("date")}
          />
          <ErrorMessage field="date" />
        </div>

        <div>
          <label htmlFor="contact-location">Event Location</label>
          <input
            id="contact-location"
            className={inputClass}
            {...register("location")}
          />
          <ErrorMessage field="location" />
        </div>

        <div>
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            rows={3}
            className={inputClass}
            {...register("message")}
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-gold py-3 font-semibold text-ink"
        >
          Send Enquiry on WhatsApp
        </button>

        {opened && (
          <p role="status" className="text-soft">
            If WhatsApp opened, press Send there to finish your enquiry.
          </p>
        )}
      </form>
    </section>
  );
}