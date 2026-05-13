import { AlertCircle, RefreshCw } from "lucide-react"
import { getTranslations } from "next-intl/server"

interface ServerErrorStateProps {
    title?: string
    description?: string
    className?: string
}

export async function ServerErrorState({
    title,
    description,
    className = "",
}: ServerErrorStateProps) {
    const t = await getTranslations("Common")

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
            <form>
                <button
                    formAction={async () => {
                        "use server"
                        const { revalidatePath } = await import("next/cache")
                        revalidatePath("/assessments")
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                    <RefreshCw className="h-4 w-4" />
                    {t("retry")}
                </button>
            </form>
        </div>
    )
}

