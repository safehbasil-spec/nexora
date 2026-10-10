export type BusinessType =
  | "retail"
  | "wholesale"
  | "restaurant"
  | "service"
  | "clinic"
  | "salon"
  | "hotel"
  | "education"
  | "other";

export type AssessmentCategory =
  | "financial_records"
  | "sales_profitability"
  | "inventory"
  | "customer_acquisition"
  | "online_visibility"
  | "supplier_management"
  | "operations"
  | "cash_flow"
  | "customer_service";

export type Priority = "critical" | "high" | "medium" | "low";

export interface QuestionOption {
  value: string;
  label: string;
  score: number; // 0–100
}

export interface Question {
  id: string;
  category: AssessmentCategory;
  text: string;
  helpText?: string;
  type: "single" | "multiple" | "scale";
  options: QuestionOption[];
  applicableTo?: BusinessType[]; // if undefined, applies to all
}

export interface Answer {
  questionId: string;
  value: string | string[];
  score: number;
}

export interface CategoryResult {
  category: AssessmentCategory;
  label: string;
  score: number; // 0–100
  maxScore: number;
  status: "strong" | "moderate" | "weak" | "critical";
  findings: string[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  effort: "low" | "medium" | "high";
  timeframe: string;
  nexoraTool?: string;
  actionSteps: string[];
}

export interface AssessmentResult {
  id: string;
  businessName: string;
  businessType: BusinessType;
  location?: string;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
  overallScore: number;
  categories: CategoryResult[];
  risks: string[];
  opportunities: string[];
  actionPlan30Days: {
    week: number;
    title: string;
    tasks: string[];
  }[];
  recommendedTools: string[];
  summary: string;
}

export interface AssessmentSession {
  id: string;
  businessName: string;
  businessType: BusinessType;
  location?: string;
  currentStep: number;
  answers: Record<string, string | string[]>;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  result?: AssessmentResult;
}

export const CATEGORY_LABELS: Record<AssessmentCategory, string> = {
  financial_records: "Financial Record-Keeping",
  sales_profitability: "Sales & Profitability",
  inventory: "Inventory & Stock Management",
  customer_acquisition: "Customer Acquisition & Retention",
  online_visibility: "Online Visibility & Branding",
  supplier_management: "Supplier Management",
  operations: "Business Operations & Productivity",
  cash_flow: "Cash-Flow Management",
  customer_service: "Customer Service",
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  retail: "Retail / Shop",
  wholesale: "Wholesale",
  restaurant: "Restaurant / Food Business",
  service: "Service Business",
  clinic: "Clinic / Pharmacy / Health",
  salon: "Beauty Salon / Spa",
  hotel: "Hotel / Lodge / Hospitality",
  education: "School / Training Centre",
  other: "Other",
};
