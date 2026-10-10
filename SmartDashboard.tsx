"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Package,
  Rocket,
  Users,
  Handshake,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "info" | "action";
  title: string;
  description: string;
  href: string;
  cta: string;
}

interface ToolStatus {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export function SmartDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    hasAssessment: false,
    overallScore: null as number | null,
    productCount: 0,
    lowStock: 0,
    openEnquiries: 0,
    overdueFollowUps: 0,
    pendingRequests: 0,
    hasLaunchpad: false,
  });

  useEffect(() => {
    const nextAlerts: Alert[] = [];
    let hasAssessment = false;
    let overallScore: number | null = null;
    let productCount = 0;
    let lowStock = 0;
    let openEnquiries = 0;
    let overdueFollowUps = 0;
    let pendingRequests = 0;
    let hasLaunchpad = false;

    try {
      const raw = localStorage.getItem("nexora_business_doctor_session");
      if (raw) {
        const session = JSON.parse(raw);
        if (session.completed && session.result) {
          hasAssessment = true;
          overallScore = session.result.overallScore;
          const cats = session.result.categories || [];
          const weakInventory = cats.find(
            (c: { category: string; score: number }) =>
              c.category === "inventory" && c.score < 60
          );
          const weakOnline = cats.find(
            (c: { category: string; score: number }) =>
              c.category === "online_visibility" && c.score < 60
          );
          const weakCustomers = cats.find(
            (c: { category: string; score: number }) =>
              (c.category === "customer_acquisition" || c.category === "customer_service") &&
              c.score < 60
          );
          const weakFinance = cats.find(
            (c: { category: string; score: number }) =>
              (c.category === "financial_records" || c.category === "cash_flow") &&
              c.score < 50
          );

          if (weakInventory) {
            nextAlerts.push({
              id: "bd-inventory",
              type: "action",
              title: "Weak stock control detected",
              description: `Inventory score: ${weakInventory.score}/100. Set up the Stock Tracker to reduce stock-outs and know your real margins.`,
              href: "/dashboard/stock",
              cta: "Open Stock Tracker",
            });
          }
          if (weakOnline) {
            nextAlerts.push({
              id: "bd-online",
              type: "action",
              title: "Low online visibility",
              description: `Online score: ${weakOnline.score}/100. Generate a professional website draft in minutes.`,
              href: "/dashboard/launchpad",
              cta: "Open Launchpad",
            });
          }
          if (weakCustomers) {
            nextAlerts.push({
              id: "bd-customers",
              type: "action",
              title: "Customer follow-up gaps",
              description: "Improve enquiry tracking and follow-ups to recover lost sales.",
              href: "/dashboard/customers",
              cta: "Open Customer Recovery",
            });
          }
          if (weakFinance) {
            nextAlerts.push({
              id: "bd-finance",
              type: "warning",
              title: "Financial records need attention",
              description: "Consider bookkeeping support or start tracking in Stock & Profit.",
              href: "/dashboard/experts",
              cta: "Request expert help",
            });
          }
        } else if (session.businessName && !session.completed) {
          nextAlerts.push({
            id: "bd-incomplete",
            type: "info",
            title: "Assessment in progress",
            description: "You started a Business Doctor assessment. Finish it to get your 30-day plan.",
            href: "/business-doctor",
            cta: "Continue assessment",
          });
        }
      } else {
        nextAlerts.push({
          id: "bd-start",
          type: "info",
          title: "Start with Business Doctor",
          description: "The fastest way to discover your biggest opportunities. Free, 5–8 minutes.",
          href: "/business-doctor",
          cta: "Launch assessment",
        });
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem("nexora_stock_tracker_v1");
      if (raw) {
        const store = JSON.parse(raw);
        productCount = (store.products || []).length;
        lowStock = (store.products || []).filter(
          (p: { currentStock: number; lowStockThreshold: number }) =>
            p.currentStock > 0 && p.currentStock <= p.lowStockThreshold
        ).length;
        const outOfStock = (store.products || []).filter(
          (p: { currentStock: number }) => p.currentStock <= 0
        ).length;
        if (outOfStock > 0) {
          nextAlerts.push({
            id: "stock-out",
            type: "warning",
            title: `${outOfStock} product(s) out of stock`,
            description: "Restock to avoid lost sales.",
            href: "/dashboard/stock",
            cta: "View stock",
          });
        } else if (lowStock > 0) {
          nextAlerts.push({
            id: "stock-low",
            type: "warning",
            title: `${lowStock} product(s) low on stock`,
            description: "Review reorder levels before you run out.",
            href: "/dashboard/stock",
            cta: "View stock",
          });
        }
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem("nexora_crm_v1");
      if (raw) {
        const store = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        const customers = store.customers || [];
        openEnquiries = customers.filter(
          (c: { stage: string }) => c.stage === "new" || c.stage === "contacted"
        ).length;
        overdueFollowUps = customers.filter(
          (c: { nextFollowUp?: string; stage: string }) =>
            c.nextFollowUp &&
            c.nextFollowUp < today &&
            c.stage !== "won" &&
            c.stage !== "lost"
        ).length;
        if (overdueFollowUps > 0) {
          nextAlerts.push({
            id: "crm-overdue",
            type: "warning",
            title: `${overdueFollowUps} overdue follow-up(s)`,
            description: "Contact these prospects before they go cold.",
            href: "/dashboard/customers",
            cta: "Open follow-ups",
          });
        }
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem("nexora_launchpad_project");
      if (raw) {
        const proj = JSON.parse(raw);
        if (proj.content) hasLaunchpad = true;
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem("nexora_marketplace_v1");
      if (raw) {
        const store = JSON.parse(raw);
        pendingRequests = (store.requests || []).filter(
          (r: { status: string }) =>
            r.status === "submitted" || r.status === "in_review" || r.status === "quoted"
        ).length;
      }
    } catch { /* ignore */ }

    setAlerts(nextAlerts);
    setStats({
      hasAssessment,
      overallScore,
      productCount,
      lowStock,
      openEnquiries,
      overdueFollowUps,
      pendingRequests,
      hasLaunchpad,
    });
  }, []);

  const tools: ToolStatus[] = [
    {
      id: "doctor",
      title: "Business Doctor",
      description: "Diagnose weaknesses and get a 30-day plan",
      href: "/business-doctor",
      icon: <Stethoscope className="w-5 h-5" />,
      badge: stats.hasAssessment
        ? stats.overallScore !== null
          ? `Score ${stats.overallScore}`
          : "Done"
        : undefined,
    },
    {
      id: "stock",
      title: "Smart Stock & Profit",
      description: "Track inventory, sales and real gross profit",
      href: "/dashboard/stock",
      icon: <Package className="w-5 h-5" />,
      badge: stats.productCount > 0 ? `${stats.productCount} products` : undefined,
    },
    {
      id: "customers",
      title: "Customer Recovery",
      description: "Follow up enquiries and recover lost sales",
      href: "/dashboard/customers",
      icon: <Users className="w-5 h-5" />,
      badge:
        stats.overdueFollowUps > 0
          ? `${stats.overdueFollowUps} overdue`
          : stats.openEnquiries > 0
            ? `${stats.openEnquiries} open`
            : undefined,
    },
    {
      id: "launchpad",
      title: "Instant Launchpad",
      description: "Generate website and online presence",
      href: "/dashboard/launchpad",
      icon: <Rocket className="w-5 h-5" />,
      badge: stats.hasLaunchpad ? "Draft ready" : undefined,
    },
    {
      id: "experts",
      title: "Expert Help",
      description: "Request bookkeeping, websites, branding help",
      href: "/dashboard/experts",
      icon: <Handshake className="w-5 h-5" />,
      badge: stats.pendingRequests > 0 ? `${stats.pendingRequests} pending` : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommendations
          </h2>
          {alerts.slice(0, 5).map((a) => (
            <div
              key={a.id}
              className={cn(
                "rounded-xl p-4 flex items-start gap-3 border",
                a.type === "warning" && "bg-amber-50 border-amber-200",
                a.type === "info" && "bg-blue-50 border-blue-100",
                a.type === "action" && "bg-teal-50 border-teal-100"
              )}
            >
              {a.type === "warning" ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : a.type === "action" ? (
                <TrendingUp className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">{a.title}</p>
                <p className="text-sm text-slate-600 mt-0.5">{a.description}</p>
                <Link
                  href={a.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2 hover:underline"
                >
                  {a.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {(stats.hasAssessment || stats.productCount > 0 || stats.openEnquiries > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.overallScore !== null && (
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-slate-500">Business score</p>
              <p className="text-xl font-bold mt-1">{stats.overallScore}/100</p>
            </div>
          )}
          {stats.productCount > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-slate-500">Products tracked</p>
              <p className="text-xl font-bold mt-1">{stats.productCount}</p>
            </div>
          )}
          {stats.openEnquiries > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-slate-500">Open enquiries</p>
              <p className="text-xl font-bold mt-1">{stats.openEnquiries}</p>
            </div>
          )}
          {stats.pendingRequests > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-slate-500">Service requests</p>
              <p className="text-xl font-bold mt-1">{stats.pendingRequests}</p>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 mb-4">Your tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="block bg-white border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                  {t.icon}
                </div>
                {t.badge ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-teal-50 px-2 py-0.5 rounded-full">
                    {t.badge}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>
              <h3 className="font-semibold mt-3 text-slate-900">{t.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{t.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">Need hands-on help?</p>
          <p className="text-sm text-slate-500">Kwenyi Basil Safeh · Douala, Cameroon</p>
        </div>
        <a
          href="https://wa.me/237679592027"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700"
        >
          WhatsApp +237 679 592 027
        </a>
      </div>
    </div>
  );
}
