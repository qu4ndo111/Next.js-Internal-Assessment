"use server"

import { cookies } from "next/headers"

const COOKIE_KEY = "dev_simulate_error"

export async function setErrorSimulatorCookie(value: boolean) {
    const cookieStore = await cookies()
    if (value) {
        cookieStore.set(COOKIE_KEY, "1", {
            path: "/",
            httpOnly: false,
            maxAge: 60 * 60,
        })
    } else {
        cookieStore.delete(COOKIE_KEY)
    }
}

export async function shouldSimulateError(): Promise<boolean> {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_KEY)?.value === "1"
}
