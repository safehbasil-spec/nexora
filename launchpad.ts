export type Industry =
  | "retail"
  | "restaurant"
  | "salon"
  | "clinic"
  | "hotel"
  | "education"
  | "service"
  | "wholesale"
  | "other";

export type Language = "en" | "fr";

export interface LaunchpadInput {
  businessName: string;
  industry: Industry;
  tagline?: string;
  productsServices: string; // free text, one per line or comma-separated
  location: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  preferredLanguage: Language;
  targetCustomers?: string;
  brandColor?: string; // hex
  aboutText?: string; // optional override
}

export interface GeneratedContent {
  businessName: string;
  tagline: string;
  about: string;
  services: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
  seoTitle: string;
  seoDescription: string;
  whatsappMessage: string;
}

export interface LaunchpadProject {
  id: string;
  input: LaunchpadInput;
  content: GeneratedContent;
  createdAt: string;
  updatedAt: string;
}

export const INDUSTRY_LABELS: Record<Industry, string> = {
  retail: "Retail / Shop",
  restaurant: "Restaurant / Food",
  salon: "Beauty Salon / Spa",
  clinic: "Clinic / Pharmacy / Health",
  hotel: "Hotel / Lodge",
  education: "School / Training",
  service: "Service Business",
  wholesale: "Wholesale",
  other: "Other",
};

export const COLOR_PRESETS = [
  { name: "Teal", value: "#0d9488" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Orange", value: "#ea580c" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Red", value: "#dc2626" },
  { name: "Slate", value: "#334155" },
];
