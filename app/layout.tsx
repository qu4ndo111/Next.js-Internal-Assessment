import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/src/components/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Toaster } from "sonner";
import { FullScreenLoader } from "@/src/components/ui/full-screen-loader";
import { StoreProvider } from "@/src/store/store-provider";
import { ErrorSimulatorProvider } from "@/src/components/error-simulator-provider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const t = await getTranslations("Dashboard");
  return {
    title: t("systemTitle"),
    description: t("systemTitle"),
    openGraph: {
      title: t("systemTitle"),
      description: t("systemTitle"),
      images: [
        {
          url: "/nextjs.png",
          width: 1200,
          height: 630,
          alt: t("systemTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("systemTitle"),
      description: t("systemTitle"),
      images: ["/nextjs.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const cookieStore = await cookies();
  const simulateError = cookieStore.get("dev_simulate_error")?.value === "1";

  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ErrorSimulatorProvider initialValue={simulateError}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider messages={messages}>
                {children}
                <FullScreenLoader />
                <Toaster position="top-right" richColors />
              </NextIntlClientProvider>
            </ThemeProvider>
          </ErrorSimulatorProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
