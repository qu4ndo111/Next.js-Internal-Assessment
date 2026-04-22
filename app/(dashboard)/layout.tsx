import Link from "next/link";
import { ModeToggle } from "@/src/components/mode-toggle";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { LayoutDashboard, FileStack, BarChart3, Settings, CircleUser } from "lucide-react";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";

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

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-muted/40">
      {/* SIDEBAR (CỘT BÊN TRÁI) */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
            {/* Logo giả định */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-primary-foreground text-sm font-bold">A</span>
            </div>
            <span className="text-lg">AQ Portal</span>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4" />
              Tổng quan KPI
            </Link>
            
            <Link
              href="/assessments"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all font-semibold"
            >
              <FileStack className="h-4 w-4" />
              Hồ sơ thẩm định
            </Link>
            
            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4" />
              Báo cáo & Phân tích
            </Link>
            
            <div className="my-2 border-t" /> {/* Dải phân cách */}

            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              Cài đặt hệ thống
            </Link>
          </nav>
        </div>
      </aside>

      {/* KHU VỰC BÊN PHẢI (HEADER + MAIN CONTENT) */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 justify-between">
          <div className="font-semibold text-lg tracking-tight text-foreground/80">
            Hệ thống Quản trị Bồi thường
          </div>
          
          <div className="flex items-center gap-4">
            {/* Nút Đổi Theme (Sáng/Tối) */}
            <ModeToggle />
            
            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Hồ sơ cá nhân</DropdownMenuItem>
                <DropdownMenuItem>Thiết lập thông báo</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* MAIN CONTENT VÙNG RENDER COMPONENT CON */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {/* Tương đương <router-outlet> */}
          {children}
        </main>
      </div>
    </div>
  );
}
