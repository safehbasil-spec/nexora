import Link from "next/link";
import { BusinessDoctorWizard } from "@/components/business-doctor/BusinessDoctorWizard";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Business Doctor — Nexora",
  description: "Diagnose your business and get a clear 30-day improvement plan.",
};

export default function BusinessDoctorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Nexora
          </Link>
          <span className="text-sm font-medium text-slate-700">Business Doctor</span>
          <Link href="/dashboard" className="text-sm text-primary font-medium hover:underline">
            Dashboard
          </Link>
        </div>
      </header>
      <BusinessDoctorWizard />
    </div>
  );
}
