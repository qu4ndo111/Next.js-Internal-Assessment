"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"

interface ServerErrorStateProps {
    title?: string
    description?: string
    className?: string
    onRetry?: () => unknown
}

export function ServerErrorState({
    title,
    description,
    className = "",
    onRetry,
}: ServerErrorStateProps) {
    const t = useTranslations("Common")
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isRetrying, setIsRetrying] = useState(false)

    const isLoading = isPending || isRetrying

    const handleRetry = async () => {
        if (onRetry) {
            setIsRetrying(true)
            try {
                await onRetry()
            } catch (error) {
                console.error("Retry error:", error)
            } finally {
                setIsRetrying(false)
            }
        } else {
            startTransition(() => {
                router.refresh()
            })
        }
    }

    const displayTitle = title || t("errorTitle")
    const displayDescription = description || t("errorDescription")

    return (
        <div
            className={[
                "flex flex-col items-center justify-center gap-4 rounded-xl",
                "border border-destructive/30 bg-destructive/5 p-12 text-center",
                className,
            ].join(" ")}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">{displayTitle}</h3>
                <p className="max-w-sm text-sm text-muted-foreground">{displayDescription}</p>
            </div>
            <button
                type="button"
                onClick={handleRetry}
                disabled={isLoading}
                className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:pointer-events-none"
                )}
            >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                {t("retry")}
            </button>
        </div>
    )
}

