"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { loadingService } from "@/lib/loading-service"

export function FullScreenLoader() {
  const [state, setState] = React.useState(loadingService.getState())

  React.useEffect(() => {
    const unsubscribe = loadingService.subscribe((newState) => {
      setState({ ...newState })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (!state.isLoading) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-100 flex flex-col items-center justify-center",
        "bg-background/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/10 blur-xl" />
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/5" />
        
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-2xl border border-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>

      {state.message && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-lg font-semibold tracking-tight text-foreground animate-in slide-in-from-bottom-2 duration-500">
            {state.message}
          </p>
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      )}
    </div>
  )
}
