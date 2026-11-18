// LOCATION: lib/content-schema.ts
// Shared by the website AND the admin page.
// Defines what content exists, how it is checked, and the starting (default) content.
// The defaults come from config/site.ts, so your website looks exactly the same until you save changes in the admin.
import { z } from "zod";
import {
  site,
  packages as defaultPackages,
  complimentaryPreWeddingFor,
  services as defaultServices,
  categories as defaultCategories,
  photos as defaultPhotos,
  films as defaultFilms,
  testimonials as defaultTestimonials,
} from "@/config/site";

const text = (max: number) => z.string().trim().max(max);
// Only normal web links are allowed (blocks "javascript:" tricks).
const link = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Must start with http:// or https://");
// A file on this site ("/media/...") or a secure web address.
const asset = z
  .string()
  .trim()
  .max(600)
  .refine(
    (v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\/\S+$/i.test(v),
    "Must be a /path or an https:// link"
  );
const assetRequired = asset.refine((v) => v !== "", "This is required");

export const settingsSchema = z.object({
  phone: text(30).min(5, "Enter a phone number"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "WhatsApp number: digits only, with country code (example 918897963108)"),
  photographerPhoto: asset,
  social: z.object({ instagram: link, youtube: link, facebook: link }),
});

export const seoSchema = z.object({
  title: text(120).min(1, "Enter a page title"),
  description: text(300),
});

export const heroSchema = z.object({
  eyebrow: text(60),
  title: text(60).min(1, "Enter the main heading"),
  accent: text(60),
  tagline: text(100),
  description: text(300),
});

export const aboutSchema = z.object({
  title: text(80).min(1, "Enter a heading"),
  paragraph1: text(800),
  paragraph2: text(800),
});

export const serviceSchema = z.object({
  name: text(60).min(1, "Every service needs a name"),
  description: text(200),
  category: text(40),
  image: asset,
});
export const servicesSchema = z.array(serviceSchema).max(30);

export const categoriesSchema = z
  .array(text(40).min(1, "Category name cannot be empty"))
  .max(30)
  .refine((list) => new Set(list.map((c) => c.toLowerCase())).size === list.length, "Category names must be different from each other");

export const photoSchema = z.object({
  src: assetRequired,
  cat: text(40),
  alt: text(200),
  w: z.number().int().min(1).max(20000),
  h: z.number().int().min(1).max(20000),
});
export const photosSchema = z.array(photoSchema).max(600);

export const filmSchema = z.object({
  title: text(80).min(1, "Every film needs a title"),
  src: assetRequired,
  poster: asset,
});
export const filmsSchema = z.array(filmSchema).max(60);

export const packageSchema = z.object({
  name: text(60).min(1, "Every package needs a name"),
  price: text(30).min(1, "Every package needs a price"),
  note: text(120),
  complimentary: z.boolean(),
});
export const packagesSchema = z.object({
  offerEnabled: z.boolean(),
  offerTitle: text(100),
  items: z.array(packageSchema).max(30),
});

export const testimonialSchema = z.object({
  quote: text(600).min(1, "Write the review text"),
  name: text(80).min(1, "Add the client's name"),
});
export const testimonialsSchema = z.array(testimonialSchema).max(60);

export const schemas = {
  settings: settingsSchema,
  seo: seoSchema,
  hero: heroSchema,
  about: aboutSchema,
  services: servicesSchema,
  categories: categoriesSchema,
  photos: photosSchema,
  films: filmsSchema,
  packages: packagesSchema,
  testimonials: testimonialsSchema,
} as const;

export type SectionKey = keyof typeof schemas;
export const SECTION_KEYS = Object.keys(schemas) as SectionKey[];
export const SECTION_LABELS: Record<SectionKey, string> = {
  settings: "Contact & social",
  seo: "Search & sharing text",
  hero: "Home page top",
  about: "About text",
  services: "Services",
  categories: "Portfolio categories",
  photos: "Portfolio photos",
  films: "Films",
  packages: "Packages",
  testimonials: "Client reviews",
};
export function isSectionKey(k: string): k is SectionKey {
  return (SECTION_KEYS as string[]).includes(k);
}

export type Settings = z.infer<typeof settingsSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type Film = z.infer<typeof filmSchema>;
export type Pkg = z.infer<typeof packageSchema>;
export type PackagesData = z.infer<typeof packagesSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Content = { [K in SectionKey]: z.infer<(typeof schemas)[K]> };

// Which portfolio category supplies the cover photo of each service (same as the original website).
const originalServiceCategory: Record<string, string> = {
  "Wedding Photography": "Weddings",
  "Pre-Wedding Photography": "Pre-Weddings",
  "Half Saree Photography": "Half Saree",
  "Baby Photography": "Baby Shoot",
  "Events & Functions": "Muhurtam",
};

export const defaults: Content = {
  settings: {
    phone: site.phone,
    whatsapp: site.whatsapp,
    photographerPhoto: site.photographerPhoto,
    social: { instagram: site.social.instagram, youtube: site.social.youtube, facebook: site.social.facebook },
  },
  seo: {
    title: "Wedknox Photography | Wedding & Cinematic Photography",
    description: "Premium photography and cinematic filmmaking: weddings, pre-weddings, maternity, baby and events.",
  },
  hero: {
    eyebrow: "Wedknox Photography",
    title: "Wedding Stories",
    accent: "in Frames",
    tagline: "Capturing Your Special Stories",
    description:
      "Transforming your most precious moments into timeless memories through cinematic photography and creative storytelling.",
  },
  about: {
    title: "The Story Behind Wedknox",
    paragraph1:
      "At Wedknox Photography, we believe every moment has a story worth remembering. Through creative photography and cinematic filmmaking, we transform emotions, celebrations, and meaningful experiences into timeless visual memories.",
    paragraph2: "We shoot with professional cameras and gimbal rigs, so photos and films feel both candid and cinematic.",
  },
  services: defaultServices.map(([name, description]) => ({
    name,
    description,
    category: originalServiceCategory[name] ?? "",
    image: "",
  })),
  categories: [...defaultCategories],
  photos: defaultPhotos.map((p) => ({ ...p })),
  films: defaultFilms.map((f) => ({ ...f })),
  packages: {
    offerEnabled: true,
    offerTitle: "Special Offer: Complimentary Pre-Wedding Shoot",
    items: defaultPackages.map((p) => ({
      name: p.name,
      price: p.price,
      note: p.note ?? "",
      complimentary: complimentaryPreWeddingFor.includes(p.name),
    })),
  },
  testimonials: defaultTestimonials.map((t) => ({ ...t })),
};