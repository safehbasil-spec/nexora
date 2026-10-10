"use client";

import { v4 as uuidv4 } from "uuid";
import {
  ServiceRequest,
  MarketplaceStore,
  RequestStatus,
  ServiceCategory,
} from "@/types/marketplace";
import { getService } from "./services";

const STORAGE_KEY = "nexora_marketplace_v1";
const ADMIN_WHATSAPP = "237679592027";

function emptyStore(): MarketplaceStore {
  return { requests: [], version: 1 };
}

export function loadMarketplace(): MarketplaceStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as MarketplaceStore;
  } catch {
    return emptyStore();
  }
}

export function saveMarketplace(store: MarketplaceStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function submitRequest(
  data: Omit<ServiceRequest, "id" | "status" | "serviceTitle" | "createdAt" | "updatedAt">
): ServiceRequest {
  const store = loadMarketplace();
  const service = getService(data.serviceId);
  const now = new Date().toISOString();
  const request: ServiceRequest = {
    id: uuidv4(),
    ...data,
    serviceTitle: service?.title || data.serviceId,
    status: "submitted",
    createdAt: now,
    updatedAt: now,
  };
  store.requests.unshift(request);
  saveMarketplace(store);
  return request;
}

export function updateRequestStatus(
  id: string,
  status: RequestStatus,
  adminNotes?: string
): ServiceRequest | null {
  const store = loadMarketplace();
  const idx = store.requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.requests[idx] = {
    ...store.requests[idx],
    status,
    adminNotes: adminNotes ?? store.requests[idx].adminNotes,
    updatedAt: new Date().toISOString(),
  };
  saveMarketplace(store);
  return store.requests[idx];
}

export function deleteRequest(id: string) {
  const store = loadMarketplace();
  store.requests = store.requests.filter((r) => r.id !== id);
  saveMarketplace(store);
}

export function buildRequestWhatsAppLink(request: ServiceRequest): string {
  const lines = [
    `Hello Nexora, I would like to request: *${request.serviceTitle}*`,
    ``,
    `Business: ${request.businessName}`,
    `Contact: ${request.contactName}`,
    `Phone: ${request.phone}`,
    request.location ? `Location: ${request.location}` : null,
    request.budget ? `Budget: ${request.budget}` : null,
    `Urgency: ${request.urgency}`,
    ``,
    `Requirements:`,
    request.requirements,
    ``,
    `(Request ID: ${request.id.slice(0, 8)})`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(lines)}`;
}
