import Link from "next/link";
import { ModeToggle } from "@/src/components/mode-toggle";

import { LayoutDashboard, FileStack, BarChart3, Settings } from "lucide-react";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/src/components/language-switcher";

import { getTranslations } from "next-intl/server";
import UserMenu from "./_components/user-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const t = await getTranslations("Dashboard");

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-primary-foreground text-sm font-bold">A</span>
            </div>
            <span className="text-lg">AQ Portal</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t("kpiOverview")}
            </Link>
            
            <Link
              href="/assessments"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all font-semibold"
            >
              <FileStack className="h-4 w-4" />
              {t("assessments")}
            </Link>
            
            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4" />
              {t("reportsAnalytics")}
            </Link>
            
            <div className="my-2 border-t" /> {/* Dải phân cách */}

            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              {t("systemSettings")}
            </Link>
          </nav>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 justify-between">
          <div className="font-semibold text-lg tracking-tight text-foreground/80">
            {t("systemTitle")}
          </div>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
