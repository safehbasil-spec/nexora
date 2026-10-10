import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SmartDashboard } from "@/components/dashboard/SmartDashboard";

export const metadata = {
  title: "Dashboard — Nexora",
  description: "Your Nexora business growth hub.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div>
            <h1 className="font-semibold text-lg">Dashboard</h1>
            <p className="text-xs text-slate-500">Welcome back</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">Kwenyi Basil Safeh</p>
              <a
                href="https://wa.me/237679592027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                WhatsApp +237 679 592 027
              </a>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              KB
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <SmartDashboard />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
