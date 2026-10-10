"use client";

import { v4 as uuidv4 } from "uuid";
import {
  Customer,
  Communication,
  CrmStore,
  CrmSummary,
  PipelineStage,
  ContactType,
} from "@/types/crm";

const STORAGE_KEY = "nexora_crm_v1";
const INACTIVE_DAYS = 30;

function emptyStore(): CrmStore {
  return { customers: [], communications: [], version: 1 };
}

export function loadCrm(): CrmStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as CrmStore;
  } catch {
    return emptyStore();
  }
}

export function saveCrm(store: CrmStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function addCustomer(
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
): Customer {
  const store = loadCrm();
  const now = new Date().toISOString();
  const customer: Customer = {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  store.customers.push(customer);
  saveCrm(store);
  return customer;
}

export function updateCustomer(
  id: string,
  updates: Partial<Customer>
): Customer | null {
  const store = loadCrm();
  const idx = store.customers.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  store.customers[idx] = {
    ...store.customers[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveCrm(store);
  return store.customers[idx];
}

export function deleteCustomer(id: string) {
  const store = loadCrm();
  store.customers = store.customers.filter((c) => c.id !== id);
  store.communications = store.communications.filter((c) => c.customerId !== id);
  saveCrm(store);
}

export function addCommunication(
  data: Omit<Communication, "id" | "createdAt">
): Communication {
  const store = loadCrm();
  const now = new Date().toISOString();
  const comm: Communication = {
    id: uuidv4(),
    ...data,
    createdAt: now,
  };
  store.communications.push(comm);

  // Update last contact on customer
  const cust = store.customers.find((c) => c.id === data.customerId);
  if (cust) {
    cust.lastContactAt = data.date || now.slice(0, 10);
    cust.updatedAt = now;
  }
  saveCrm(store);
  return comm;
}

export function getCommunications(customerId: string): Communication[] {
  return loadCrm()
    .communications.filter((c) => c.customerId === customerId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function getCrmSummary(): CrmSummary {
  const store = loadCrm();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const inactiveCutoff = new Date(now);
  inactiveCutoff.setDate(inactiveCutoff.getDate() - INACTIVE_DAYS);
  const cutoffStr = inactiveCutoff.toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  let openEnquiries = 0;
  let overdueFollowUps = 0;
  let outstandingInvoices = 0;
  let outstandingTotal = 0;
  let inactiveCount = 0;
  let wonThisMonth = 0;
  let totalCustomers = 0;
  let totalProspects = 0;

  for (const c of store.customers) {
    if (c.type === "customer") totalCustomers++;
    else totalProspects++;

    if (c.stage === "new" || c.stage === "contacted") openEnquiries++;

    if (c.nextFollowUp && c.nextFollowUp < today && c.stage !== "won" && c.stage !== "lost") {
      overdueFollowUps++;
    }

    if (c.outstandingAmount && c.outstandingAmount > 0) {
      outstandingInvoices++;
      outstandingTotal += c.outstandingAmount;
    }

    const last = c.lastContactAt || c.createdAt.slice(0, 10);
    if (last < cutoffStr && c.stage !== "lost") inactiveCount++;

    if (c.stage === "won" && c.updatedAt.slice(0, 10) >= monthStart) wonThisMonth++;
  }

  return {
    totalCustomers,
    totalProspects,
    openEnquiries,
    overdueFollowUps,
    outstandingInvoices,
    outstandingTotal,
    inactiveCount,
    wonThisMonth,
  };
}

export function getOverdueFollowUps(): Customer[] {
  const today = new Date().toISOString().slice(0, 10);
  return loadCrm().customers.filter(
    (c) =>
      c.nextFollowUp &&
      c.nextFollowUp < today &&
      c.stage !== "won" &&
      c.stage !== "lost"
  );
}

export function getInactiveCustomers(): Customer[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - INACTIVE_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return loadCrm().customers.filter((c) => {
    const last = c.lastContactAt || c.createdAt.slice(0, 10);
    return last < cutoffStr && c.stage !== "lost";
  });
}

/** Simple template-based message drafts (no external AI required). */
export function generateFollowUpDraft(customer: Customer): string {
  const firstName = customer.name.split(" ")[0];
  const stage = customer.stage;

  if (stage === "new") {
    return `Bonjour ${firstName}, thank you for your enquiry. We are happy to help you. When would be a good time to discuss your needs? — Nexora / ${customer.name}`;
  }
  if (stage === "contacted") {
    return `Hello ${firstName}, just following up on our conversation. Do you still need assistance with this? We are ready when you are.`;
  }
  if (stage === "qualified" || stage === "proposal") {
    return `Hello ${firstName}, I wanted to check if you had any questions about the proposal/offer we sent. Happy to adjust it to fit your needs better.`;
  }
  if (customer.outstandingAmount && customer.outstandingAmount > 0) {
    return `Hello ${firstName}, a friendly reminder regarding the outstanding balance of ${customer.outstandingAmount.toLocaleString()} XAF. Please let us know if you need any clarification. Thank you.`;
  }
  // inactive / retention
  return `Hello ${firstName}, it has been a while since we last spoke. We hope you are well. We have new offers that might interest you — feel free to reply if you would like details.`;
}

export function whatsappLink(phone: string, message?: string): string {
  // Normalise Cameroon numbers
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "237" + cleaned.slice(1);
  if (!cleaned.startsWith("237") && cleaned.length === 9) cleaned = "237" + cleaned;
  const base = `https://wa.me/${cleaned}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
}

export function exportCustomersCSV(): string {
  const store = loadCrm();
  const headers = [
    "Name",
    "Type",
    "Stage",
    "Phone",
    "Email",
    "Source",
    "Last Contact",
    "Next Follow-up",
    "Outstanding (XAF)",
    "Notes",
  ];
  const rows = store.customers.map((c) => [
    c.name,
    c.type,
    c.stage,
    c.phone || "",
    c.email || "",
    c.source || "",
    c.lastContactAt || "",
    c.nextFollowUp || "",
    c.outstandingAmount || 0,
    (c.notes || "").replace(/,/g, ";"),
  ]);
  return [headers, ...rows].map((r) => r.join(",")).join("\n");
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
