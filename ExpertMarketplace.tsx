"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ServiceRequest,
  RequestStatus,
  ServiceCategory,
  STATUS_LABELS,
} from "@/types/marketplace";
import { SERVICE_CATALOGUE, getService } from "@/lib/marketplace/services";
import {
  loadMarketplace,
  submitRequest,
  updateRequestStatus,
  deleteRequest,
  buildRequestWhatsAppLink,
} from "@/lib/marketplace/store";
import { cn } from "@/lib/utils";
import {
  Handshake,
  Plus,
  MessageCircle,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  FileText,
  ExternalLink,
} from "lucide-react";

type View = "catalogue" | "requests" | "detail";

export function ExpertMarketplace() {
  const [view, setView] = useState<View>("catalogue");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refresh = useCallback(() => {
    setRequests(loadMarketplace().requests);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-primary" />
            Expert Help Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Request practical help — websites, bookkeeping, branding, operations and more
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setView("catalogue");
              setSelectedService(null);
              setShowForm(false);
            }}
            className={cn(
              "text-sm px-3 py-2 rounded-lg font-medium",
              view === "catalogue" ? "bg-primary text-white" : "border hover:bg-slate-50"
            )}
          >
            Services
          </button>
          <button
            onClick={() => {
              setView("requests");
              setSelectedRequest(null);
            }}
            className={cn(
              "text-sm px-3 py-2 rounded-lg font-medium",
              view === "requests" ? "bg-primary text-white" : "border hover:bg-slate-50"
            )}
          >
            My requests
            {requests.length > 0 && (
              <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium",
            message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          )}
        >
          {message.text}
        </div>
      )}

      {/* ── CATALOGUE ────────────────────────────────────── */}
      {view === "catalogue" && !showForm && (
        <div className="grid sm:grid-cols-2 gap-4">
          {SERVICE_CATALOGUE.map((s) => (
            <div
              key={s.id}
              className="bg-white border rounded-2xl p-5 hover:border-primary/30 transition flex flex-col"
            >
              <h3 className="font-semibold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5 flex-1">{s.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-primary">{s.indicativePrice}</p>
                  <p className="text-xs text-slate-400">{s.timeline}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedService(s.id);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Request <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service detail + form */}
      {view === "catalogue" && showForm && selectedService && (
        <RequestForm
          serviceId={selectedService}
          onBack={() => {
            setShowForm(false);
            setSelectedService(null);
          }}
          onSubmit={(data) => {
            const req = submitRequest(data);
            refresh();
            setShowForm(false);
            setSelectedService(null);
            setSelectedRequest(req);
            setView("requests");
            flash("ok", "Request submitted. Open WhatsApp to send it to Nexora.");
          }}
        />
      )}

      {/* ── REQUESTS LIST ────────────────────────────────── */}
      {view === "requests" && !selectedRequest && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="bg-white border rounded-xl p-10 text-center text-sm text-slate-500">
              No requests yet. Browse services and submit your first request.
            </div>
          ) : (
            requests.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRequest(r)}
                className="w-full text-left bg-white border rounded-xl p-4 hover:border-primary/30 transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{r.serviceTitle}</p>
                  <p className="text-sm text-slate-500">
                    {r.businessName} · {r.createdAt.slice(0, 10)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </button>
            ))
          )}
        </div>
      )}

      {/* Request detail */}
      {view === "requests" && selectedRequest && (
        <RequestDetail
          request={selectedRequest}
          onBack={() => setSelectedRequest(null)}
          onStatusChange={(status) => {
            const updated = updateRequestStatus(selectedRequest.id, status);
            if (updated) {
              setSelectedRequest(updated);
              refresh();
            }
          }}
          onDelete={() => {
            if (confirm("Delete this request?")) {
              deleteRequest(selectedRequest.id);
              setSelectedRequest(null);
              refresh();
              flash("ok", "Request deleted");
            }
          }}
        />
      )}

      {/* Admin contact note */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-900">
        <p className="font-medium">How it works</p>
        <p className="mt-1 text-teal-800">
          Submit a request, then send it via WhatsApp to{" "}
          <a
            href="https://wa.me/237679592027"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            +237 679 592 027
          </a>{" "}
          (Kwenyi Basil Safeh, Douala). You receive a fixed quote before any work starts. No
          automatic payments or commissions in this version.
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const colors: Record<RequestStatus, string> = {
    submitted: "bg-blue-50 text-blue-700",
    in_review: "bg-amber-50 text-amber-700",
    quoted: "bg-purple-50 text-purple-700",
    in_progress: "bg-teal-50 text-teal-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={cn("text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap", colors[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function RequestForm({
  serviceId,
  onBack,
  onSubmit,
}: {
  serviceId: ServiceCategory;
  onBack: () => void;
  onSubmit: (
    data: Omit<ServiceRequest, "id" | "status" | "serviceTitle" | "createdAt" | "updatedAt">
  ) => void;
}) {
  const service = getService(serviceId)!;
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Douala, Cameroon");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="max-w-xl space-y-5">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to services
      </button>

      <div className="bg-white border rounded-2xl p-5">
        <h2 className="font-semibold text-lg">{service.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{service.description}</p>
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Deliverables</p>
          <ul className="mt-2 space-y-1">
            {service.deliverables.map((d, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-sm font-semibold text-primary">{service.indicativePrice}</p>
        <p className="text-xs text-slate-400">{service.timeline} · Final quote after short discussion</p>
      </div>

      <div className="bg-white border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold">Your request</h3>
        <div>
          <label className="text-sm font-medium text-slate-700">Business name *</label>
          <input className={inputClass + " mt-1"} value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Your name *</label>
            <input className={inputClass + " mt-1"} value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">WhatsApp / Phone *</label>
            <input className={inputClass + " mt-1"} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="679592027" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input className={inputClass + " mt-1"} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input className={inputClass + " mt-1"} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">What do you need? *</label>
          <textarea
            className={inputClass + " mt-1"}
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe your project, current situation and goals..."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Budget range (optional)</label>
            <input className={inputClass + " mt-1"} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 20,000 – 50,000 XAF" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Urgency</label>
            <select className={inputClass + " mt-1"} value={urgency} onChange={(e) => setUrgency(e.target.value as "normal" | "urgent")}>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <button
          disabled={!businessName.trim() || !contactName.trim() || !phone.trim() || !requirements.trim()}
          onClick={() =>
            onSubmit({
              serviceId,
              businessName: businessName.trim(),
              contactName: contactName.trim(),
              phone: phone.trim(),
              email: email || undefined,
              location: location || undefined,
              requirements: requirements.trim(),
              budget: budget || undefined,
              urgency,
            })
          }
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
        >
          Submit request
        </button>
      </div>
    </div>
  );
}

function RequestDetail({
  request,
  onBack,
  onStatusChange,
  onDelete,
}: {
  request: ServiceRequest;
  onBack: () => void;
  onStatusChange: (s: RequestStatus) => void;
  onDelete: () => void;
}) {
  const waLink = buildRequestWhatsAppLink(request);

  return (
    <div className="max-w-xl space-y-4">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
        ← All requests
      </button>

      <div className="bg-white border rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">{request.serviceTitle}</h2>
            <p className="text-sm text-slate-500">{request.businessName}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-400">Contact</span>
            <p className="font-medium">{request.contactName}</p>
          </div>
          <div>
            <span className="text-slate-400">Phone</span>
            <p className="font-medium">{request.phone}</p>
          </div>
          {request.location && (
            <div>
              <span className="text-slate-400">Location</span>
              <p>{request.location}</p>
            </div>
          )}
          {request.budget && (
            <div>
              <span className="text-slate-400">Budget</span>
              <p>{request.budget}</p>
            </div>
          )}
          <div>
            <span className="text-slate-400">Urgency</span>
            <p className="capitalize">{request.urgency}</p>
          </div>
          <div>
            <span className="text-slate-400">Submitted</span>
            <p>{request.createdAt.slice(0, 10)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Requirements</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">
            {request.requirements}
          </p>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700"
        >
          <MessageCircle className="w-5 h-5" />
          Send request via WhatsApp
          <ExternalLink className="w-4 h-4 opacity-70" />
        </a>
        <p className="text-xs text-slate-400 text-center">
          Opens WhatsApp to +237 679 592 027 with your request details pre-filled
        </p>

        {/* Simple status update for admin/self */}
        <div>
          <label className="text-xs font-medium text-slate-500">Update status</label>
          <select
            value={request.status}
            onChange={(e) => onStatusChange(e.target.value as RequestStatus)}
            className="mt-1 w-full px-3 py-2 rounded-xl border text-sm bg-white"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <button onClick={onDelete} className="text-sm text-red-600 hover:underline">
          Delete request
        </button>
      </div>
    </div>
  );
}
