"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Package,
  Users,
  Rocket,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/business-doctor", label: "Doctor", icon: Stethoscope },
  { href: "/dashboard/stock", label: "Stock", icon: Package },
  { href: "/dashboard/customers", label: "CRM", icon: Users },
  { href: "/dashboard/launchpad", label: "Site", icon: Rocket },
  { href: "/dashboard/experts", label: "Help", icon: Handshake },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t safe-bottom">
      <div className="flex items-stretch justify-around h-14">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition",
                active ? "text-primary" : "text-slate-400"
              )}
            >
              <item.icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
