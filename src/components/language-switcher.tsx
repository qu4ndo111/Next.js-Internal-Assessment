"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { Languages } from "lucide-react"
import { setUserLocale } from "@/src/actions/locale"
import { Button } from "@/src/components/ui/button"
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
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isPending}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
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
