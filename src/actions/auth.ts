"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface LoginSchema {
  email: string;
  password: string;
}

export async function fakeLogin(formData: LoginSchema, returnUrl?: string) {
  const email = formData.email
  const password = formData.password

  if (email === "admin@aq.com" && password === "123456aA@") {
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    const cookieStore = await cookies()
    cookieStore.set("access_token", fakeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    const validatedUrl = validateReturnUrl(returnUrl || "/")

    redirect(validatedUrl);
  }

  return { error: "Sai email hoặc mật khẩu!" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("access_token")
  redirect("/login")
}


function validateReturnUrl(returnUrl: string, allowedDomains: string[] = []): string {
  try {
    if (returnUrl.startsWith("/")) {
      return returnUrl;
    }

    const url = new URL(returnUrl);

    if (allowedDomains.includes(url.hostname)) {
      return returnUrl;
    }

    return "/dashboard";
  } catch {
    return "/dashboard";
  }
}
