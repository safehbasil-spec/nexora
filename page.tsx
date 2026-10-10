import Link from "next/link";
import {
  Stethoscope,
  Package,
  Rocket,
  Users,
  Handshake,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Nexora</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">
              Features
            </a>
            <a href="#how" className="hover:text-foreground transition">
              How it works
            </a>
            <Link href="/dashboard" className="hover:text-foreground transition">
              Dashboard
            </Link>
          </nav>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
          >
            Open Platform
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-slate-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" />
              Based in Douala, Cameroon • Serving Africa & Worldwide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Diagnose. Organise.{" "}
              <span className="text-primary">Grow.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              Nexora is an intelligent business growth platform that helps small businesses
              identify real problems, organise operations, improve financial visibility,
              attract customers, and implement practical solutions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/business-doctor"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-medium hover:bg-primary-dark transition shadow-lg shadow-teal-500/20"
              >
                <Stethoscope className="w-5 h-5" />
                Start Business Doctor
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition"
              >
                Open Dashboard
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Free assessment • No account required to start • Results in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Everything your business needs to grow</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Five powerful modules that work together — not separate tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Stethoscope className="w-6 h-6" />}
              title="Business Doctor"
              description="Guided assessment that diagnoses financial, operational and marketing weaknesses and produces a clear 30-day action plan."
              badge="Signature"
              href="/business-doctor"
            />
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title="Smart Stock & Profit"
              description="Track products, stock movements, sales and expenses. See real gross profit based on your actual costs."
              href="/dashboard"
            />
            <FeatureCard
              icon={<Rocket className="w-6 h-6" />}
              title="Instant Launchpad"
              description="Generate a professional mobile-first website, business description and WhatsApp-ready presence in minutes."
              href="/dashboard"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Customer Recovery"
              description="Never lose an enquiry again. Track prospects, set follow-ups and get AI-assisted message drafts."
              href="/dashboard"
            />
            <FeatureCard
              icon={<Handshake className="w-6 h-6" />}
              title="Expert Help Marketplace"
              description="Request practical help for bookkeeping, websites, branding, documentation and operations."
              href="/dashboard"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Unified Dashboard"
              description="See alerts, outstanding tasks and recommendations from every module in one place."
              href="/dashboard"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">How Nexora works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Diagnose", text: "Complete the Business Doctor assessment in 5–8 minutes." },
              { step: "02", title: "Understand", text: "Receive a clear report with priorities and a 30-day plan." },
              { step: "03", title: "Act", text: "Use the recommended Nexora tools or request expert help." },
              { step: "04", title: "Grow", text: "Track progress, recover customers and improve visibility." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to see where your business stands?</h2>
          <p className="mt-4 text-slate-600">
            Start with the free Business Doctor assessment. No credit card. No long forms.
          </p>
          <Link
            href="/business-doctor"
            className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition shadow-lg shadow-teal-500/25"
          >
            Launch Business Doctor
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-semibold">Nexora</span>
          </div>
          <div className="text-sm text-slate-500 text-center md:text-right space-y-1">
            <p>© 2026 Nexora · Built by Kwenyi Basil Safeh</p>
            <p>
              Douala, Cameroon ·{" "}
              <a
                href="https://wa.me/237679592027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                WhatsApp +237 679 592 027
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-teal-500/5 transition"
    >
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-teal-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition">
        Open <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
