"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fakeLogin } from "@/src/actions/auth";

interface LoginSchema {
    email: string;
    password: string;
}

export default function LoginPage() {
    const t = useTranslations("Login");

    const loginSchema = z.object({
        email: z.email(t("errors.emailInvalid")),
        password: z.string().min(6, t("errors.passwordMin", { min: 6 })),
    })

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        await fakeLogin(data);
    };

    return (
        <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-[400px] space-y-6">
                {/* Header Section */}
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mt-2">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Form Section */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                {t("emailLabel")}
                            </label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@aq.com"
                                    className="pl-9"
                                    {...register("email")}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs pt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    {t("passwordLabel")}
                                </label>
                                <Link
                                    href="#"
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    {t("forgotPassword")}
                                </Link>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    {...register("password")}
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-xs pt-1">{errors.password.message}</p>}
                            </div>
                        </div>

                        <Button className="w-full font-semibold" type="submit">
                            {t("loginButton")}
                        </Button>
                    </form>

                    {/* Social / SSO Login Section */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                {t("orContinueWith")}
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" type="button" className="w-full gap-2 font-medium">
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"
                                fill="#00a4ef"
                            />
                        </svg>
                        {t("ssoButton")}
                    </Button>
                </div>

                {/* Footer Legal */}
                <p className="px-8 text-center text-xs text-muted-foreground leading-relaxed">
                    {t.rich("terms", {
                        termsLink: (chunks) => (
                            <Link href="#" className="underline underline-offset-4 hover:text-primary">
                                {chunks}
                            </Link>
                        ),
                        privacyLink: (chunks) => (
                            <Link href="#" className="underline underline-offset-4 hover:text-primary">
                                {chunks}
                            </Link>
                        ),
                    })}
                </p>
            </div>
        </div>
    );
}