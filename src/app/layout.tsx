import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { ThemeScript } from "@/lib/theme-script";
import NextTopLoader from "nextjs-toploader";
import { getSettings } from "@/lib/settings";
import { getNavCategories } from "@/lib/categories";
import { BrandStyle } from "@/components/layout/brand-style";
import { WhatsAppWidget } from "@/components/layout/whatsapp-widget";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.companyName || "HobbyMart";
  return {
    title: `${name} - Your Premier Drone & Accessories Shop`,
    description: s.footerTagline || `Shop the best drones, accessories, and hobby items at ${name}.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories] = await Promise.all([getSettings(), getNavCategories()]);
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans" suppressHydrationWarning>
        <ThemeScript />
        <BrandStyle settings={settings} />
        <NextTopLoader
          color={settings.primaryColor || "#2563eb"}
          height={3}
          showSpinner={true}
          shadow="0 0 10px rgba(0,0,0,0.25)"
          zIndex={2000}
        />
        <Providers>
          <Header settings={settings} categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <WhatsAppWidget number={settings.whatsappNumber} text={settings.whatsappText} />
        </Providers>
      </body>
    </html>
  );
}
