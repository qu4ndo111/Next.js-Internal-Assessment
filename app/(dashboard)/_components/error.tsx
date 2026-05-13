"use client"

import { Switch } from "@/src/components/ui/switch"
import { useErrorSimulator } from "@/src/components/error-simulator-provider"

export function ErrorSimulator() {
    const { simulateError, toggle, isPending } = useErrorSimulator()
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="error-sim" className="text-sm text-muted-foreground cursor-pointer select-none">
                Error
            </label>
            <Switch
                id="error-sim"
                checked={simulateError}
                onCheckedChange={toggle}
                disabled={isPending}
            />
        </div>
    )
}
