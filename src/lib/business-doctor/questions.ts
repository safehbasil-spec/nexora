import { Question, BusinessType } from "@/types/business-doctor";

export const ASSESSMENT_QUESTIONS: Question[] = [
  // ── Financial Record-Keeping ──────────────────────────────
  {
    id: "fin_1",
    category: "financial_records",
    text: "How do you currently track your daily sales and expenses?",
    helpText: "Accurate records are the foundation of good decisions.",
    type: "single",
    options: [
      { value: "software", label: "Dedicated software or spreadsheet (Excel/Google Sheets)", score: 95 },
      { value: "notebook", label: "Handwritten notebook or exercise book", score: 55 },
      { value: "memory", label: "Mostly from memory or informal notes", score: 20 },
      { value: "none", label: "I do not track them regularly", score: 5 },
    ],
  },
  {
    id: "fin_2",
    category: "financial_records",
    text: "Do you separate business money from personal money?",
    type: "single",
    options: [
      { value: "fully", label: "Yes – separate bank account or mobile money wallet", score: 100 },
      { value: "partially", label: "Sometimes, but money mixes", score: 45 },
      { value: "no", label: "No – everything is mixed", score: 10 },
    ],
  },
  {
    id: "fin_3",
    category: "financial_records",
    text: "How often do you review your financial numbers?",
    type: "single",
    options: [
      { value: "weekly", label: "At least once a week", score: 95 },
      { value: "monthly", label: "Once a month", score: 70 },
      { value: "rarely", label: "Only when there is a problem", score: 30 },
      { value: "never", label: "Almost never", score: 5 },
    ],
  },

  // ── Sales & Profitability ─────────────────────────────────
  {
    id: "sales_1",
    category: "sales_profitability",
    text: "Do you know your gross profit margin on your main products/services?",
    type: "single",
    options: [
      { value: "exact", label: "Yes – I calculate it regularly", score: 100 },
      { value: "approx", label: "I have a rough idea", score: 55 },
      { value: "no", label: "No, I only look at total sales", score: 15 },
    ],
  },
  {
    id: "sales_2",
    category: "sales_profitability",
    text: "How consistent is your monthly revenue?",
    type: "single",
    options: [
      { value: "stable", label: "Fairly stable and predictable", score: 90 },
      { value: "seasonal", label: "Seasonal but I plan for it", score: 70 },
      { value: "volatile", label: "Highly unpredictable", score: 30 },
      { value: "declining", label: "Generally declining", score: 10 },
    ],
  },
  {
    id: "sales_3",
    category: "sales_profitability",
    text: "Do you know which products or services make you the most profit?",
    type: "single",
    options: [
      { value: "yes", label: "Yes, clearly identified", score: 95 },
      { value: "some", label: "I have some idea", score: 50 },
      { value: "no", label: "Not really", score: 15 },
    ],
  },

  // ── Inventory ─────────────────────────────────────────────
  {
    id: "inv_1",
    category: "inventory",
    text: "How do you currently manage your stock/inventory?",
    type: "single",
    applicableTo: ["retail", "wholesale", "restaurant", "clinic", "salon", "other"],
    options: [
      { value: "system", label: "Digital system or spreadsheet with quantities", score: 95 },
      { value: "physical", label: "Physical count only (no continuous tracking)", score: 45 },
      { value: "visual", label: "I just look and reorder when it looks low", score: 25 },
      { value: "none", label: "No formal inventory management", score: 5 },
    ],
  },
  {
    id: "inv_2",
    category: "inventory",
    text: "How often do you experience stock-outs (running out of popular items)?",
    type: "single",
    applicableTo: ["retail", "wholesale", "restaurant", "clinic", "salon", "other"],
    options: [
      { value: "rare", label: "Rarely (once a month or less)", score: 90 },
      { value: "occasional", label: "Occasionally (a few times a month)", score: 55 },
      { value: "frequent", label: "Frequently (weekly)", score: 20 },
      { value: "constant", label: "Almost constantly", score: 5 },
    ],
  },
  {
    id: "inv_3",
    category: "inventory",
    text: "Do you know the total value of your current stock?",
    type: "single",
    applicableTo: ["retail", "wholesale", "restaurant", "clinic", "salon", "other"],
    options: [
      { value: "exact", label: "Yes, I can give an accurate figure", score: 100 },
      { value: "approx", label: "Approximate only", score: 50 },
      { value: "no", label: "No idea", score: 10 },
    ],
  },

  // ── Customer Acquisition ──────────────────────────────────
  {
    id: "cust_1",
    category: "customer_acquisition",
    text: "How do most new customers find your business?",
    type: "single",
    options: [
      { value: "online", label: "Online (Google, social media, website)", score: 85 },
      { value: "referral", label: "Referrals and word-of-mouth", score: 80 },
      { value: "walkin", label: "Walk-ins / location", score: 60 },
      { value: "ads", label: "Paid advertising", score: 70 },
      { value: "unclear", label: "I am not sure", score: 20 },
    ],
  },
  {
    id: "cust_2",
    category: "customer_acquisition",
    text: "Do you actively collect and use customer contact details (phone/WhatsApp)?",
    type: "single",
    options: [
      { value: "system", label: "Yes – organised list and regular contact", score: 95 },
      { value: "informal", label: "Sometimes, but not organised", score: 45 },
      { value: "no", label: "Rarely or never", score: 10 },
    ],
  },
  {
    id: "cust_3",
    category: "customer_acquisition",
    text: "What percentage of your sales come from returning customers?",
    type: "single",
    options: [
      { value: "high", label: "More than 60%", score: 95 },
      { value: "medium", label: "30–60%", score: 65 },
      { value: "low", label: "Less than 30%", score: 25 },
      { value: "unknown", label: "I do not know", score: 15 },
    ],
  },

  // ── Online Visibility ─────────────────────────────────────
  {
    id: "online_1",
    category: "online_visibility",
    text: "Does your business have a professional website that works well on mobile?",
    type: "single",
    options: [
      { value: "yes", label: "Yes – modern and mobile-friendly", score: 100 },
      { value: "basic", label: "Yes, but it is basic or outdated", score: 50 },
      { value: "social_only", label: "Only social media pages (Facebook/Instagram)", score: 35 },
      { value: "none", label: "No online presence", score: 5 },
    ],
  },
  {
    id: "online_2",
    category: "online_visibility",
    text: "Is your business listed and claimed on Google Business Profile (Google Maps)?",
    type: "single",
    options: [
      { value: "complete", label: "Yes – complete with photos, hours, and reviews", score: 100 },
      { value: "basic", label: "Listed but incomplete or not claimed", score: 40 },
      { value: "no", label: "No", score: 5 },
    ],
  },
  {
    id: "online_3",
    category: "online_visibility",
    text: "Do you use a professional business email (e.g. info@yourbusiness.com) instead of Gmail/Yahoo?",
    type: "single",
    options: [
      { value: "yes", label: "Yes", score: 100 },
      { value: "no", label: "No – still using free email", score: 15 },
    ],
  },

  // ── Supplier Management ───────────────────────────────────
  {
    id: "supp_1",
    category: "supplier_management",
    text: "How many reliable suppliers do you have for your main products?",
    type: "single",
    applicableTo: ["retail", "wholesale", "restaurant", "clinic", "salon", "other"],
    options: [
      { value: "multiple", label: "2 or more reliable alternatives", score: 95 },
      { value: "one_good", label: "One main reliable supplier", score: 70 },
      { value: "unstable", label: "Suppliers are unreliable or frequently change", score: 25 },
      { value: "none", label: "I struggle to find good suppliers", score: 10 },
    ],
  },
  {
    id: "supp_2",
    category: "supplier_management",
    text: "Do you keep records of supplier prices and delivery performance?",
    type: "single",
    applicableTo: ["retail", "wholesale", "restaurant", "clinic", "salon", "other"],
    options: [
      { value: "yes", label: "Yes – written or digital records", score: 95 },
      { value: "mental", label: "Mostly from memory", score: 35 },
      { value: "no", label: "No", score: 10 },
    ],
  },

  // ── Operations ────────────────────────────────────────────
  {
    id: "ops_1",
    category: "operations",
    text: "Do you have clear written processes for key daily activities?",
    type: "single",
    options: [
      { value: "documented", label: "Yes – documented and followed", score: 95 },
      { value: "verbal", label: "Verbal only (staff know what to do)", score: 50 },
      { value: "ad_hoc", label: "Mostly ad-hoc / depends on who is present", score: 20 },
    ],
  },
  {
    id: "ops_2",
    category: "operations",
    text: "How well can the business run if you are away for a few days?",
    type: "single",
    options: [
      { value: "well", label: "Well – staff can handle most things", score: 95 },
      { value: "partial", label: "Partially – some decisions still need me", score: 55 },
      { value: "poor", label: "Poorly – almost everything depends on me", score: 15 },
    ],
  },

  // ── Cash Flow ─────────────────────────────────────────────
  {
    id: "cash_1",
    category: "cash_flow",
    text: "Do you know how much cash you need to cover the next 30 days of expenses?",
    type: "single",
    options: [
      { value: "yes", label: "Yes – I plan ahead", score: 100 },
      { value: "approx", label: "I have a rough idea", score: 50 },
      { value: "no", label: "No – I react when money is short", score: 10 },
    ],
  },
  {
    id: "cash_2",
    category: "cash_flow",
    text: "How often do you experience cash shortages that delay payments or purchases?",
    type: "single",
    options: [
      { value: "rare", label: "Rarely", score: 95 },
      { value: "occasional", label: "Occasionally", score: 55 },
      { value: "frequent", label: "Frequently", score: 20 },
      { value: "chronic", label: "Almost every month", score: 5 },
    ],
  },

  // ── Customer Service ──────────────────────────────────────
  {
    id: "cs_1",
    category: "customer_service",
    text: "How quickly do you typically respond to customer enquiries (WhatsApp, calls, messages)?",
    type: "single",
    options: [
      { value: "fast", label: "Within 1–2 hours during business hours", score: 95 },
      { value: "same_day", label: "Same day", score: 70 },
      { value: "slow", label: "Often takes more than a day", score: 25 },
      { value: "missed", label: "Many enquiries go unanswered", score: 5 },
    ],
  },
  {
    id: "cs_2",
    category: "customer_service",
    text: "Do you have a system to follow up on unanswered enquiries or incomplete sales?",
    type: "single",
    options: [
      { value: "yes", label: "Yes – organised follow-up system", score: 100 },
      { value: "informal", label: "Sometimes, when I remember", score: 40 },
      { value: "no", label: "No formal system", score: 10 },
    ],
  },
];

export function getQuestionsForBusinessType(type: BusinessType): Question[] {
  return ASSESSMENT_QUESTIONS.filter(
    (q) => !q.applicableTo || q.applicableTo.includes(type)
  );
}
