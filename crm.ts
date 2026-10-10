export type PipelineStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export type ContactType = "customer" | "prospect";

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  type: ContactType;
  stage: PipelineStage;
  source?: string; // walk-in, WhatsApp, Google, referral...
  notes?: string;
  tags?: string[];
  lastContactAt?: string;
  nextFollowUp?: string; // ISO date
  outstandingAmount?: number; // XAF
  createdAt: string;
  updatedAt: string;
}

export interface Communication {
  id: string;
  customerId: string;
  channel: "whatsapp" | "call" | "email" | "in_person" | "other";
  direction: "outbound" | "inbound";
  summary: string;
  messageDraft?: string;
  date: string;
  createdAt: string;
}

export interface CrmStore {
  customers: Customer[];
  communications: Communication[];
  version: number;
}

export interface CrmSummary {
  totalCustomers: number;
  totalProspects: number;
  openEnquiries: number; // new + contacted
  overdueFollowUps: number;
  outstandingInvoices: number;
  outstandingTotal: number;
  inactiveCount: number; // no contact in 30+ days
  wonThisMonth: number;
}

export const PIPELINE_LABELS: Record<PipelineStage, string> = {
  new: "New Enquiry",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export const PIPELINE_ORDER: PipelineStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export const SOURCE_OPTIONS = [
  "WhatsApp",
  "Walk-in",
  "Google / Maps",
  "Referral",
  "Facebook / Instagram",
  "Phone call",
  "Website",
  "Other",
];
