"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LaunchpadInput,
  GeneratedContent,
  Industry,
  Language,
  INDUSTRY_LABELS,
  COLOR_PRESETS,
} from "@/types/launchpad";
import { generateContent, generateHTML, buildWhatsAppUrl } from "@/lib/launchpad/generate";
import { cn } from "@/lib/utils";
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  Eye,
  Code,
  Copy,
  Check,
  Download,
  MessageCircle,
  RefreshCw,
  Info,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "nexora_launchpad_project";

type Step = "form" | "content" | "preview";

const defaultInput: LaunchpadInput = {
  businessName: "",
  industry: "retail",
  productsServices: "",
  location: "Douala, Cameroon",
  phone: "",
  whatsapp: "",
  email: "",
  preferredLanguage: "en",
  targetCustomers: "",
  brandColor: "#0d9488",
  tagline: "",
};

export function LaunchpadWizard() {
  const [step, setStep] = useState<Step>("form");
  const [input, setInput] = useState<LaunchpadInput>(defaultInput);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [htmlCopied, setHtmlCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.input) setInput({ ...defaultInput, ...parsed.input });
        if (parsed.content) {
          setContent(parsed.content);
          setStep("content");
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = (inp: LaunchpadInput, cont: GeneratedContent | null) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        id: uuidv4(),
        input: inp,
        content: cont,
        updatedAt: new Date().toISOString(),
      })
    );
  };

  const update = <K extends keyof LaunchpadInput>(key: K, value: LaunchpadInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    if (!input.businessName.trim()) return;
    const generated = generateContent(input);
    setContent(generated);
    save(input, generated);
    setStep("content");
  };

  const handleRegenerate = () => {
    const generated = generateContent(input);
    setContent(generated);
    save(input, generated);
  };

  const html = useMemo(() => {
    if (!content) return "";
    return generateHTML(input, content);
  }, [input, content]);

  const waUrl = buildWhatsAppUrl(input.whatsapp || input.phone, content?.whatsappMessage || "");

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${input.businessName.replace(/\s+/g, "-").toLowerCase() || "site"}-draft.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          Instant Business Launchpad
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Create a mobile-first website draft with WhatsApp, services, FAQ and SEO content
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(["form", "content", "preview"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-6 h-px bg-slate-200" />}
            <button
              onClick={() => {
                if (s === "form" || content) setStep(s);
              }}
              className={cn(
                "px-3 py-1 rounded-full font-medium transition",
                step === s
                  ? "bg-primary text-white"
                  : content || s === "form"
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-slate-50 text-slate-300 cursor-not-allowed"
              )}
            >
              {i + 1}. {s === "form" ? "Details" : s === "content" ? "Content" : "Preview"}
            </button>
          </div>
        ))}
      </div>

      {/* ── FORM ─────────────────────────────────────────── */}
      {step === "form" && (
        <div className="bg-white border rounded-2xl p-5 sm:p-6 space-y-5 max-w-2xl">
          <Field label="Business name *">
            <input
              className={inputClass}
              value={input.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="e.g. Chez Mama Ndolé"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Industry">
              <select
                className={inputClass}
                value={input.industry}
                onChange={(e) => update("industry", e.target.value as Industry)}
              >
                {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Language">
              <select
                className={inputClass}
                value={input.preferredLanguage}
                onChange={(e) => update("preferredLanguage", e.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </Field>
          </div>

          <Field label="Location">
            <input
              className={inputClass}
              value={input.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Douala, Cameroon"
            />
          </Field>

          <Field label="Products & services (one per line or comma-separated)">
            <textarea
              className={inputClass}
              rows={3}
              value={input.productsServices}
              onChange={(e) => update("productsServices", e.target.value)}
              placeholder={"Grilled fish\nNdolé\nDelivery\nCatering"}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="WhatsApp number">
              <input
                className={inputClass}
                value={input.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="679592027"
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputClass}
                value={input.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              className={inputClass}
              value={input.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="Optional"
            />
          </Field>

          <Field label="Tagline (optional)">
            <input
              className={inputClass}
              value={input.tagline || ""}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="Short phrase under your name"
            />
          </Field>

          <Field label="Target customers (optional)">
            <input
              className={inputClass}
              value={input.targetCustomers || ""}
              onChange={(e) => update("targetCustomers", e.target.value)}
              placeholder="e.g. Families, offices, students"
            />
          </Field>

          <Field label="Brand colour">
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update("brandColor", c.value)}
                  className={cn(
                    "w-9 h-9 rounded-full border-2 transition",
                    input.brandColor === c.value ? "border-slate-900 scale-110" : "border-transparent"
                  )}
                  style={{ background: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </Field>

          <button
            disabled={!input.businessName.trim()}
            onClick={handleGenerate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
          >
            Generate website draft
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── CONTENT EDITOR ───────────────────────────────── */}
      {step === "content" && content && (
        <div className="space-y-5 max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" /> Edit details
            </button>
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button
              onClick={() => setStep("preview")}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
            >
              <Eye className="w-4 h-4" /> Preview site
            </button>
          </div>

          <div className="bg-white border rounded-2xl p-5 space-y-4">
            <EditField
              label="Tagline"
              value={content.tagline}
              onChange={(v) => {
                const next = { ...content, tagline: v };
                setContent(next);
                save(input, next);
              }}
            />
            <EditField
              label="About"
              value={content.about}
              multiline
              onChange={(v) => {
                const next = { ...content, about: v };
                setContent(next);
                save(input, next);
              }}
            />
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Services</p>
              {content.services.map((s, i) => (
                <div key={i} className="mb-3 grid sm:grid-cols-2 gap-2">
                  <input
                    className={inputClass}
                    value={s.title}
                    onChange={(e) => {
                      const services = [...content.services];
                      services[i] = { ...services[i], title: e.target.value };
                      const next = { ...content, services };
                      setContent(next);
                      save(input, next);
                    }}
                  />
                  <input
                    className={inputClass}
                    value={s.description}
                    onChange={(e) => {
                      const services = [...content.services];
                      services[i] = { ...services[i], description: e.target.value };
                      const next = { ...content, services };
                      setContent(next);
                      save(input, next);
                    }}
                  />
                </div>
              ))}
            </div>
            <EditField
              label="Primary CTA"
              value={content.ctaPrimary}
              onChange={(v) => {
                const next = { ...content, ctaPrimary: v };
                setContent(next);
                save(input, next);
              }}
            />
            <EditField
              label="SEO title"
              value={content.seoTitle}
              onChange={(v) => {
                const next = { ...content, seoTitle: v };
                setContent(next);
                save(input, next);
              }}
            />
            <EditField
              label="SEO description"
              value={content.seoDescription}
              multiline
              onChange={(v) => {
                const next = { ...content, seoDescription: v };
                setContent(next);
                save(input, next);
              }}
            />
          </div>
        </div>
      )}

      {/* ── PREVIEW ──────────────────────────────────────── */}
      {step === "preview" && content && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStep("content")}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" /> Edit content
            </button>
            <button
              onClick={downloadHtml}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              <Download className="w-4 h-4" /> Download HTML
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(html);
                setHtmlCopied(true);
                setTimeout(() => setHtmlCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              {htmlCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Code className="w-4 h-4" />}
              {htmlCopied ? "Copied" : "Copy HTML"}
            </button>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <MessageCircle className="w-4 h-4" /> Test WhatsApp link
              </a>
            )}
          </div>

          {/* Live preview frame */}
          <div className="bg-slate-200 rounded-2xl p-2 sm:p-4">
            <div className="mx-auto max-w-md bg-white rounded-xl overflow-hidden shadow-lg border">
              <div className="bg-slate-800 text-slate-300 text-[10px] px-3 py-1.5 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="truncate">
                  {input.businessName.toLowerCase().replace(/\s+/g, "")}.com — preview
                </span>
              </div>
              <iframe
                title="Site preview"
                srcDoc={html}
                className="w-full h-[520px] border-0"
                sandbox="allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>

          {/* Important notice */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-sm text-amber-900">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">This is a draft preview — not a live published website</p>
              <p className="mt-1 text-amber-800">
                Download the HTML file and host it on any web host, or contact Nexora (WhatsApp{" "}
                <a
                  href="https://wa.me/237679592027"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  +237 679 592 027
                </a>
                ) to publish it with a real domain, hosting and Google Business Profile.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          className={inputClass}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
