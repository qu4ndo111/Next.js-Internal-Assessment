"use client";

import Link from "next/link";
import { Settings, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { SidebarNav } from "./sidebar-nav";

interface MobileSidebarProps {
  systemSettingsLabel: string;
}

export function MobileSidebar({ systemSettingsLabel }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0 gap-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navigation Menu</SheetDescription>
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
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
              {systemSettingsLabel}
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
