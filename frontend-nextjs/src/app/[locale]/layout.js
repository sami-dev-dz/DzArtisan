import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Outfit, Inter, Cairo } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/Toast";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata = {
  title: "DzArtisan - Services Experts en Algérie",
  description: "Connectez facilement clients et artisans qualifiés en Algérie. 69 Wilayas couvertes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DzArtisan",
  },
};

export const viewport = {
  themeColor: "#1e3a8a",
};

export default async function LocaleLayout({ children, params }) {
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.locale) {
    return notFound();
  }

  const { locale } = resolvedParams;

  if (!routing.locales.includes(locale)) {
    return notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`antialiased ${outfit.variable} ${inter.variable} ${cairo.variable}`}
      >
        {/* ✅ External file reference works correctly in Next.js 15 App Router */}
        <Script
          id="theme-init"
          src="/scripts/theme-init.js"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
            <CookieConsent />
            <Toaster />
          </AuthProvider>
        </NextIntlClientProvider>

        {/* Register Service Worker for PWA */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}