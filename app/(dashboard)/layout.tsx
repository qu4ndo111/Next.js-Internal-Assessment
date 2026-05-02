import Link from "next/link";
import { ModeToggle } from "@/src/components/mode-toggle";

import { Settings } from "lucide-react";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/src/components/language-switcher";

import { getTranslations } from "next-intl/server";
import UserMenu from "./_components/user-menu";
import { SidebarNav } from "./_components/sidebar-nav";

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
          <SidebarNav />
          
          <div className="px-2 lg:px-4 mt-2">
            <div className="my-2 border-t" />
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted text-sm font-medium"
            >
              <Settings className="h-4 w-4" />
              {t("systemSettings")}
            </Link>
          </div>
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
