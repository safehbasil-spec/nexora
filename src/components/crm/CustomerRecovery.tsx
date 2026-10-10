"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Customer,
  Communication,
  CrmSummary,
  PipelineStage,
  PIPELINE_LABELS,
  PIPELINE_ORDER,
  SOURCE_OPTIONS,
} from "@/types/crm";
import {
  loadCrm,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addCommunication,
  getCommunications,
  getCrmSummary,
  getOverdueFollowUps,
  getInactiveCustomers,
  generateFollowUpDraft,
  whatsappLink,
  exportCustomersCSV,
  downloadCSV,
} from "@/lib/crm/store";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Users,
  Plus,
  Search,
  Download,
  AlertTriangle,
  Clock,
  MessageCircle,
  Phone,
  Copy,
  Check,
  X,
  ChevronRight,
  UserPlus,
  Wallet,
  Filter,
} from "lucide-react";

type Tab = "overview" | "pipeline" | "all" | "followups" | "inactive";

export function CustomerRecovery() {
  const [tab, setTab] = useState<Tab>("overview");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<CrmSummary | null>(null);
  const [overdue, setOverdue] = useState<Customer[]>([]);
  const [inactive, setInactive] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "all">("all");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [comms, setComms] = useState<Communication[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refresh = useCallback(() => {
    const store = loadCrm();
    setCustomers([...store.customers].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    setSummary(getCrmSummary());
    setOverdue(getOverdueFollowUps());
    setInactive(getInactiveCustomers());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selected) {
      setComms(getCommunications(selected.id));
      setDraft(generateFollowUpDraft(selected));
    }
  }, [selected]);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || "").includes(search) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "pipeline", label: "Pipeline" },
    { id: "all", label: "All contacts", count: customers.length },
    { id: "followups", label: "Follow-ups", count: overdue.length },
    { id: "inactive", label: "Inactive", count: inactive.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Customer Recovery Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track enquiries, follow-ups and recover lost sales
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              downloadCSV(
                `nexora-customers-${new Date().toISOString().slice(0, 10)}.csv`,
                exportCustomersCSV()
              );
              flash("ok", "Exported");
            }}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={() => setModal("add")}
            className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" /> Add contact
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

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setSelected(null);
            }}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition",
              tab === t.id
                ? "bg-white border border-b-white text-primary -mb-px"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {t.label}
            {typeof t.count === "number" && t.count > 0 && (
              <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────── */}
      {tab === "overview" && summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Open enquiries" value={String(summary.openEnquiries)} />
            <Kpi
              label="Overdue follow-ups"
              value={String(summary.overdueFollowUps)}
              warn={summary.overdueFollowUps > 0}
            />
            <Kpi
              label="Outstanding invoices"
              value={formatCurrency(summary.outstandingTotal)}
              sub={`${summary.outstandingInvoices} invoice(s)`}
            />
            <Kpi
              label="Inactive (30+ days)"
              value={String(summary.inactiveCount)}
              warn={summary.inactiveCount > 0}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Kpi label="Customers" value={String(summary.totalCustomers)} />
            <Kpi label="Prospects" value={String(summary.totalProspects)} />
            <Kpi label="Won this month" value={String(summary.wonThisMonth)} />
          </div>

          {overdue.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="font-medium text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Overdue follow-ups
              </p>
              <ul className="mt-2 space-y-2">
                {overdue.slice(0, 6).map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <button
                      onClick={() => {
                        setSelected(c);
                        setTab("all");
                      }}
                      className="text-amber-800 hover:underline font-medium"
                    >
                      {c.name}
                    </button>
                    <span className="text-amber-600 text-xs">Due {c.nextFollowUp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {inactive.length > 0 && (
            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="font-medium text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Inactive contacts (no contact in 30+ days)
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {inactive.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        setSelected(c);
                        setTab("all");
                      }}
                      className="hover:underline"
                    >
                      {c.name}
                    </button>
                    {c.phone && <span className="text-slate-400 ml-2">{c.phone}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {customers.length === 0 && (
            <Empty text="No contacts yet. Add your first customer or prospect to start recovering enquiries." />
          )}
        </div>
      )}

      {/* ── PIPELINE ─────────────────────────────────────── */}
      {tab === "pipeline" && (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {PIPELINE_ORDER.filter((s) => s !== "lost").map((stage) => {
              const list = customers.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="w-64 shrink-0">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {PIPELINE_LABELS[stage]}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                      {list.length}
                    </span>
                  </div>
                  <div className="space-y-2 min-h-[120px] bg-slate-50 rounded-xl p-2">
                    {list.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelected(c);
                          setTab("all");
                        }}
                        className="w-full text-left bg-white border rounded-lg p-3 hover:border-primary/40 transition"
                      >
                        <p className="font-medium text-sm text-slate-900 truncate">{c.name}</p>
                        {c.phone && (
                          <p className="text-xs text-slate-400 mt-0.5">{c.phone}</p>
                        )}
                        {c.nextFollowUp && (
                          <p className="text-xs text-amber-600 mt-1">Follow-up {c.nextFollowUp}</p>
                        )}
                      </button>
                    ))}
                    {list.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">Empty</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ALL / FOLLOWUPS / INACTIVE ───────────────────── */}
      {(tab === "all" || tab === "followups" || tab === "inactive") && (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* List */}
          <div className={cn("space-y-3", selected ? "lg:col-span-2" : "lg:col-span-5")}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or phone..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {tab === "all" && (
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value as PipelineStage | "all")}
                  className="px-3 py-2.5 rounded-xl border text-sm bg-white"
                >
                  <option value="all">All stages</option>
                  {PIPELINE_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {PIPELINE_LABELS[s]}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {(() => {
              const list =
                tab === "followups"
                  ? overdue
                  : tab === "inactive"
                    ? inactive
                    : filtered;
              if (list.length === 0)
                return <Empty text="No contacts in this view." />;
              return (
                <div className="bg-white border rounded-xl divide-y max-h-[60vh] overflow-y-auto">
                  {list.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-center justify-between gap-2",
                        selected?.id === c.id && "bg-teal-50"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{c.name}</p>
                        <p className="text-xs text-slate-400">
                          {PIPELINE_LABELS[c.stage]}
                          {c.phone ? ` · ${c.phone}` : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="lg:col-span-3 bg-white border rounded-xl p-5 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <p className="text-sm text-slate-500">
                    {selected.type === "customer" ? "Customer" : "Prospect"} ·{" "}
                    {PIPELINE_LABELS[selected.stage]}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stage selector */}
              <div>
                <label className="text-xs font-medium text-slate-500">Pipeline stage</label>
                <select
                  value={selected.stage}
                  onChange={(e) => {
                    const updated = updateCustomer(selected.id, {
                      stage: e.target.value as PipelineStage,
                    });
                    if (updated) {
                      setSelected(updated);
                      refresh();
                    }
                  }}
                  className="mt-1 w-full px-3 py-2 rounded-xl border text-sm bg-white"
                >
                  {PIPELINE_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {PIPELINE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact info */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selected.phone}</span>
                    <a
                      href={whatsappLink(selected.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs font-medium hover:underline ml-1"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
                {selected.email && (
                  <div className="text-slate-600">{selected.email}</div>
                )}
                {selected.source && (
                  <div className="text-slate-500 text-xs">Source: {selected.source}</div>
                )}
                {selected.nextFollowUp && (
                  <div className="text-amber-600 text-xs">
                    Next follow-up: {selected.nextFollowUp}
                  </div>
                )}
                {selected.outstandingAmount && selected.outstandingAmount > 0 && (
                  <div className="text-red-600 text-xs font-medium">
                    Outstanding: {formatCurrency(selected.outstandingAmount)}
                  </div>
                )}
              </div>

              {selected.notes && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{selected.notes}</p>
              )}

              {/* Follow-up date */}
              <div>
                <label className="text-xs font-medium text-slate-500">Next follow-up date</label>
                <input
                  type="date"
                  value={selected.nextFollowUp || ""}
                  onChange={(e) => {
                    const updated = updateCustomer(selected.id, {
                      nextFollowUp: e.target.value || undefined,
                    });
                    if (updated) {
                      setSelected(updated);
                      refresh();
                    }
                  }}
                  className="mt-1 w-full px-3 py-2 rounded-xl border text-sm"
                />
              </div>

              {/* Message draft */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-500">
                    Follow-up message draft
                  </label>
                  <button
                    onClick={() => setDraft(generateFollowUpDraft(selected))}
                    className="text-xs text-primary hover:underline"
                  >
                    Regenerate
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(draft);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  {selected.phone && (
                    <a
                      href={whatsappLink(selected.phone, draft)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <MessageCircle className="w-4 h-4" /> Open WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => {
                      addCommunication({
                        customerId: selected.id,
                        channel: "whatsapp",
                        direction: "outbound",
                        summary: "Follow-up message sent / prepared",
                        messageDraft: draft,
                        date: new Date().toISOString().slice(0, 10),
                      });
                      setComms(getCommunications(selected.id));
                      refresh();
                      flash("ok", "Logged as communication");
                    }}
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
                  >
                    Log as sent
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Messages are never sent automatically. You review and send from your own WhatsApp.
                </p>
              </div>

              {/* Communication history */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Communication history</h3>
                {comms.length === 0 ? (
                  <p className="text-xs text-slate-400">No communications logged yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {comms.map((c) => (
                      <li key={c.id} className="text-xs bg-slate-50 rounded-lg px-3 py-2">
                        <span className="font-medium">{c.date}</span> · {c.channel} · {c.direction}
                        <p className="text-slate-600 mt-0.5">{c.summary}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selected.name}?`)) {
                      deleteCustomer(selected.id);
                      setSelected(null);
                      refresh();
                      flash("ok", "Deleted");
                    }
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete contact
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add modal */}
      {modal === "add" && (
        <AddContactModal
          onClose={() => setModal(null)}
          onSave={(data) => {
            const c = addCustomer(data);
            refresh();
            setModal(null);
            setSelected(c);
            setTab("all");
            flash("ok", "Contact added");
          }}
        />
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function Kpi({
  label,
  value,
  sub,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className={cn("bg-white border rounded-xl p-4", warn && "border-amber-200 bg-amber-50/50")}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn("text-lg font-bold mt-1", warn && "text-amber-700")}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="bg-white border rounded-xl p-10 text-center text-sm text-slate-500">{text}</div>
  );
}

function AddContactModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Omit<Customer, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"customer" | "prospect">("prospect");
  const [stage, setStage] = useState<PipelineStage>("new");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [outstanding, setOutstanding] = useState("");

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
          <h3 className="font-semibold">Add contact</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Name *</label>
            <input className={inputClass + " mt-1"} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name or business name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Phone / WhatsApp</label>
              <input className={inputClass + " mt-1"} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6XX XXX XXX" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input className={inputClass + " mt-1"} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select className={inputClass + " mt-1"} value={type} onChange={(e) => setType(e.target.value as "customer" | "prospect")}>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Stage</label>
              <select className={inputClass + " mt-1"} value={stage} onChange={(e) => setStage(e.target.value as PipelineStage)}>
                {PIPELINE_ORDER.map((s) => (
                  <option key={s} value={s}>{PIPELINE_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Source</label>
            <select className={inputClass + " mt-1"} value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">— Select —</option>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Next follow-up</label>
              <input type="date" className={inputClass + " mt-1"} value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Outstanding (XAF)</label>
              <input type="number" min="0" className={inputClass + " mt-1"} value={outstanding} onChange={(e) => setOutstanding(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Notes</label>
            <textarea className={inputClass + " mt-1"} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button
            disabled={!name.trim()}
            onClick={() =>
              onSave({
                name: name.trim(),
                phone: phone || undefined,
                email: email || undefined,
                type,
                stage,
                source: source || undefined,
                notes: notes || undefined,
                nextFollowUp: followUp || undefined,
                outstandingAmount: outstanding ? Number(outstanding) : undefined,
              })
            }
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
          >
            Save contact
          </button>
        </div>
      </div>
    </div>
  );
}
