"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileStack, BarChart3, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    labelKey: "kpiOverview",
    icon: LayoutDashboard,
  },
  {
    href: "/assessments",
    labelKey: "assessments",
    icon: FileStack,
  },
  {
    href: "/reports",
    labelKey: "reportsAnalytics",
    icon: BarChart3,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
