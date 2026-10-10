export type ServiceCategory =
  | "website"
  | "bookkeeping"
  | "inventory"
  | "branding"
  | "documentation"
  | "digital_setup"
  | "operations";

export type RequestStatus =
  | "submitted"
  | "in_review"
  | "quoted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ServiceOffering {
  id: ServiceCategory;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  deliverables: string[];
  deliverablesFr: string[];
  indicativePrice: string; // e.g. "From 25,000 XAF"
  indicativePriceFr: string;
  timeline: string;
  timelineFr: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: ServiceCategory;
  serviceTitle: string;
  businessName: string;
  contactName: string;
  phone: string;
  email?: string;
  location?: string;
  requirements: string;
  budget?: string;
  urgency: "normal" | "urgent";
  status: RequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceStore {
  requests: ServiceRequest[];
  version: number;
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  quoted: "Quoted",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
