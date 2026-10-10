import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { LaunchpadWizard } from "@/components/launchpad/LaunchpadWizard";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Instant Business Launchpad — Nexora",
  description: "Generate a mobile-first website draft with WhatsApp, services, FAQ and SEO.",
};

export default function LaunchpadPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <header className="h-14 border-b bg-white flex items-center px-4 sm:px-6 sticky top-0 z-10 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-600">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </header>
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <LaunchpadWizard />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
