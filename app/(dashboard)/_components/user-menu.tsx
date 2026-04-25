"use client"
import { logout } from "@/src/actions/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { CircleUser } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserMenu() {
    const t = useTranslations("Dashboard");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center rounded-full h-9 w-9 bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
                <DropdownMenuItem>{t("notificationSettings")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={logout}>{t("logout")}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}