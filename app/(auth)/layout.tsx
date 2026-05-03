import { LanguageSwitcher } from "@/src/components/language-switcher";
import { ModeToggle } from "@/src/components/mode-toggle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export default async function AuthLayout(
    { children }: { children: React.ReactNode }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row bg-muted/40">
            <div className="absolute top-4 right-4 z-10 flex space-x-4">
                <ModeToggle />
                <LanguageSwitcher />
            </div>
            <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 m-auto">
                {children}
            </main>
        </div>
    )
}