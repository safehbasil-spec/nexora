"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BusinessType,
  AssessmentSession,
  AssessmentResult,
  BUSINESS_TYPE_LABELS,
  CATEGORY_LABELS,
} from "@/types/business-doctor";
import { getQuestionsForBusinessType } from "@/lib/business-doctor/questions";
import { calculateAssessment } from "@/lib/business-doctor/scoring";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Printer,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  Target,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "nexora_business_doctor_session";

type Step = "intro" | "profile" | "questions" | "results";

export function BusinessDoctorWizard() {
  const [step, setStep] = useState<Step>("intro");
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Load saved session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AssessmentSession = JSON.parse(raw);
        setSession(parsed);
        if (parsed.completed && parsed.result) {
          setResult(parsed.result);
          setStep("results");
        } else if (parsed.businessName) {
          setStep("questions");
          setCurrentQ(parsed.currentStep || 0);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveSession = useCallback((s: AssessmentSession) => {
    setSession(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, []);

  const startNew = () => {
    const s: AssessmentSession = {
      id: uuidv4(),
      businessName: "",
      businessType: "retail",
      currentStep: 0,
      answers: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
    };
    saveSession(s);
    setResult(null);
    setCurrentQ(0);
    setStep("profile");
  };

  const updateProfile = (name: string, type: BusinessType, location?: string) => {
    if (!session) return;
    const updated = {
      ...session,
      businessName: name,
      businessType: type,
      location,
      updatedAt: new Date().toISOString(),
    };
    saveSession(updated);
    setStep("questions");
  };

  const answerQuestion = (questionId: string, value: string) => {
    if (!session) return;
    const updated = {
      ...session,
      answers: { ...session.answers, [questionId]: value },
      currentStep: currentQ,
      updatedAt: new Date().toISOString(),
    };
    saveSession(updated);
  };

  const finish = () => {
    if (!session) return;
    const res = calculateAssessment(
      session.businessName,
      session.businessType,
      session.answers,
      session.location
    );
    const updated: AssessmentSession = {
      ...session,
      completed: true,
      result: res,
      updatedAt: new Date().toISOString(),
    };
    saveSession(updated);
    setResult(res);
    setStep("results");
  };

  const questions = session
    ? getQuestionsForBusinessType(session.businessType)
    : [];

  // ── INTRO ───────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-primary flex items-center justify-center mx-auto mb-5">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Business Doctor</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            A practical assessment that diagnoses the real problems in your business
            and gives you a clear, prioritised 30-day action plan.
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-6 space-y-4 mb-8">
          <p className="text-sm font-medium text-slate-700">What we examine:</p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
            {[
              "Financial record-keeping",
              "Sales & profitability",
              "Inventory & stock",
              "Customer acquisition",
              "Online visibility",
              "Supplier management",
              "Operations & productivity",
              "Cash-flow management",
              "Customer service",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={startNew}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-medium hover:bg-primary-dark transition"
          >
            Start new assessment
            <ArrowRight className="w-5 h-5" />
          </button>
          {session && !session.completed && (
            <button
              onClick={() => setStep(session.businessName ? "questions" : "profile")}
              className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition"
            >
              Continue previous
            </button>
          )}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Your answers are saved on this device. No account required.
        </p>
      </div>
    );
  }

  // ── PROFILE ─────────────────────────────────────────────
  if (step === "profile") {
    return (
      <ProfileForm
        initialName={session?.businessName || ""}
        initialType={session?.businessType || "retail"}
        initialLocation={session?.location || ""}
        onSubmit={updateProfile}
        onBack={() => setStep("intro")}
      />
    );
  }

  // ── QUESTIONS ───────────────────────────────────────────
  if (step === "questions" && session) {
    const q = questions[currentQ];
    if (!q) {
      finish();
      return null;
    }

    const progress = ((currentQ + 1) / questions.length) * 100;
    const selected = session.answers[q.id] as string | undefined;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
            <span>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-3">
            {CATEGORY_LABELS[q.category]}
          </p>
          <h2 className="text-xl font-semibold text-slate-900 leading-snug">{q.text}</h2>
          {q.helpText && <p className="mt-2 text-sm text-slate-500">{q.helpText}</p>}

          <div className="mt-6 space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => answerQuestion(q.id, opt.value)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-xl border transition",
                  selected === opt.value
                    ? "border-primary bg-teal-50 text-slate-900 ring-2 ring-primary/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentQ === 0) setStep("profile");
              else setCurrentQ((c) => c - 1);
            }}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            disabled={!selected}
            onClick={() => {
              if (currentQ >= questions.length - 1) finish();
              else setCurrentQ((c) => c + 1);
            }}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition",
              selected
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {currentQ >= questions.length - 1 ? "See results" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────
  if (step === "results" && result) {
    return <ResultsView result={result} onRestart={startNew} />;
  }

  return null;
}

function ProfileForm({
  initialName,
  initialType,
  initialLocation,
  onSubmit,
  onBack,
}: {
  initialName: string;
  initialType: BusinessType;
  initialLocation: string;
  onSubmit: (name: string, type: BusinessType, location?: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<BusinessType>(initialType);
  const [location, setLocation] = useState(initialLocation);

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-slate-900">Tell us about your business</h1>
      <p className="mt-2 text-slate-600 text-sm">This helps us ask the most relevant questions.</p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Business name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chez Mama Ndolé"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Business type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BusinessType)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          >
            {Object.entries(BUSINESS_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Location <span className="text-slate-400">(optional)</span>
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Douala, Cameroon"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <button
        disabled={!name.trim()}
        onClick={() => onSubmit(name.trim(), type, location.trim() || undefined)}
        className={cn(
          "mt-8 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition",
          name.trim()
            ? "bg-primary text-white hover:bg-primary-dark"
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
        )}
      >
        Continue to questions
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function ResultsView({
  result,
  onRestart,
}: {
  result: AssessmentResult;
  onRestart: () => void;
}) {
  const statusColor = (s: string) => {
    if (s === "strong") return "text-emerald-600 bg-emerald-50";
    if (s === "moderate") return "text-amber-600 bg-amber-50";
    if (s === "weak") return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const priorityColor = (p: string) => {
    if (p === "critical") return "bg-red-100 text-red-700";
    if (p === "high") return "bg-orange-100 text-orange-700";
    if (p === "medium") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Business Doctor Report</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{result.businessName}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {BUSINESS_TYPE_LABELS[result.businessType]}
              {result.location ? ` · ${result.location}` : ""}
            </p>
          </div>
          <div className="text-center">
            <div
              className={cn(
                "text-4xl font-bold",
                result.overallScore >= 75
                  ? "text-emerald-600"
                  : result.overallScore >= 50
                    ? "text-amber-600"
                    : "text-red-600"
              )}
            >
              {result.overallScore}
            </div>
            <p className="text-xs text-slate-500 mt-1">Overall score / 100</p>
          </div>
        </div>
        <p className="mt-4 text-slate-600 leading-relaxed">{result.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-slate-50"
          >
            New assessment
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Assessment by category
        </h2>
        <div className="space-y-3">
          {result.categories.map((cat) => (
            <div key={cat.category} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900">{cat.label}</span>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusColor(cat.status))}>
                      {cat.status}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        cat.score >= 80
                          ? "bg-emerald-500"
                          : cat.score >= 60
                            ? "bg-amber-500"
                            : cat.score >= 35
                              ? "bg-orange-500"
                              : "bg-red-500"
                      )}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-semibold text-slate-700 tabular-nums">{cat.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Opportunities */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" /> Risks to address
          </h3>
          <ul className="mt-3 space-y-2">
            {result.risks.length === 0 ? (
              <li className="text-sm text-slate-500">No major risks identified.</li>
            ) : (
              result.risks.map((r, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-red-400">•</span> {r}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold flex items-center gap-2 text-emerald-700">
            <TrendingUp className="w-5 h-5" /> Opportunities
          </h3>
          <ul className="mt-3 space-y-2">
            {result.opportunities.length === 0 ? (
              <li className="text-sm text-slate-500">Focus on improving weaker areas first.</li>
            ) : (
              result.opportunities.map((o, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-emerald-400">•</span> {o}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Recommended actions
        </h2>
        <div className="space-y-4">
          {result.categories
            .flatMap((c) => c.recommendations)
            .sort((a, b) => {
              const order = { critical: 0, high: 1, medium: 2, low: 3 };
              return order[a.priority] - order[b.priority];
            })
            .map((rec) => (
              <div key={rec.id} className="bg-white border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", priorityColor(rec.priority))}>
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-500">{rec.effort} effort · {rec.timeframe}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">{rec.description}</p>
                <ol className="mt-3 space-y-1">
                  {rec.actionSteps.map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-primary font-medium">{i + 1}.</span> {s}
                    </li>
                  ))}
                </ol>
                {rec.nexoraTool && (
                  <p className="mt-3 text-xs font-medium text-primary">
                    Recommended Nexora tool: {rec.nexoraTool}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* 30-day plan */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">30-day action plan</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {result.actionPlan30Days.map((week) => (
            <div key={week.week} className="bg-white border rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Week {week.week}
              </p>
              <h3 className="font-semibold mt-1">{week.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {week.tasks.map((t, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 text-center no-print">
        <h3 className="font-semibold text-lg text-slate-900">Need help implementing this plan?</h3>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Request professional assistance for bookkeeping, website setup, inventory systems or
          operations support.
        </p>
        <a
          href="https://wa.me/237679592027?text=Hello%20Nexora%2C%20I%20just%20completed%20the%20Business%20Doctor%20assessment%20and%20would%20like%20help%20implementing%20the%20plan."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Expert Help
        </a>
        <p className="mt-3 text-xs text-slate-500">
          Douala, Cameroon · +237 679 592 027 · Kwenyi Basil Safeh
        </p>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        This report is generated from your answers using transparent scoring rules.
        Scores and recommendations are based solely on the information you provided.
        No external financial data was accessed.
      </p>
    </div>
  );
}
