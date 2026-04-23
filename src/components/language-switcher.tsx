"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { Languages } from "lucide-react"
import { setUserLocale } from "@/src/actions/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const locale = useLocale()
  const [isPending, startTransition] = React.useTransition()

  function handleLocaleChange(newLocale: string) {
    startTransition(async () => {
      await setUserLocale(newLocale)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:pointer-events-none" disabled={isPending}>
        <Languages className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Switch language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLocaleChange("en")}
          className={locale === "en" ? "bg-accent font-bold" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLocaleChange("vi")}
          className={locale === "vi" ? "bg-accent font-bold" : ""}
        >
          Tiếng Việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
