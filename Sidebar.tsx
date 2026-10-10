"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Package,
  Rocket,
  Users,
  Handshake,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: any[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/business-doctor", label: "Business Doctor", icon: Stethoscope, badge: "Core" },
  { href: "/dashboard/stock", label: "Stock & Profit", icon: Package },
  { href: "/dashboard/launchpad", label: "Launchpad", icon: Rocket },
  { href: "/dashboard/customers", label: "Customer Recovery", icon: Users },
  { href: "/dashboard/experts", label: "Expert Help", icon: Handshake },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-white h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2 px-5 border-b">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <span className="font-semibold text-lg">Nexora</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                active
                  ? "bg-teal-50 text-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                item.soon && "opacity-60 cursor-not-allowed"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                  {item.badge}
                </span>
              )}
              {item.soon && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </aside>
  );
}
