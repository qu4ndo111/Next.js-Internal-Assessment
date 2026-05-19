import { LoginForm } from "./_components/login-form";

interface PageProps {
    searchParams: Promise<{ returnUrl?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
    const { returnUrl } = await searchParams;

    return <LoginForm returnUrl={returnUrl} />
}