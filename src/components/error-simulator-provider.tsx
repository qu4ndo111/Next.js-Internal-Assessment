"use client"

import { createContext, useContext, useState, useTransition } from "react"
import { setErrorSimulatorCookie } from "../actions/error-simulator.action" 

interface ErrorSimulatorContextValue {
    simulateError: boolean
    toggle: () => void
    isPending: boolean
}

const ErrorSimulatorContext = createContext<ErrorSimulatorContextValue | null>(null)


export function ErrorSimulatorProvider({
    children,
    initialValue = false,
}: {
    children: React.ReactNode
    initialValue?: boolean
}) {
    const [simulateError, setSimulateError] = useState(initialValue)
    const [isPending, startTransition] = useTransition()

    const toggle = () => {
        const next = !simulateError
        setSimulateError(next)
        startTransition(async () => {
            await setErrorSimulatorCookie(next)
        })
    }

    return (
        <ErrorSimulatorContext value={{ simulateError, toggle, isPending }}>
            {children}
        </ErrorSimulatorContext>
    )
}

export function useErrorSimulator() {
    const ctx = useContext(ErrorSimulatorContext)
    if (!ctx) throw new Error("useErrorSimulator must be used within <ErrorSimulatorProvider>")
    return ctx
}
