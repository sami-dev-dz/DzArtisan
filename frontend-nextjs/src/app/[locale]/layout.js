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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "DzArtisan - Services Experts en Algérie",
  description: "Connectez facilement clients et artisans qualifiés en Algérie. 69 Wilayas couvertes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DzArtisan",
  },
  openGraph: {
    title: "DzArtisan - Services Experts en Algérie",
    description: "Trouvez les meilleurs artisans en Algérie pour tous vos travaux. Profils vérifiés, 69 Wilayas.",
    url: "/",
    siteName: "DzArtisan",
    locale: "fr_DZ",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DzArtisan - Plateforme de mise en relation client et artisan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DzArtisan - Services Experts en Algérie",
    description: "Trouvez les meilleurs artisans en Algérie pour tous vos travaux.",
    images: ["/images/og-image.jpg"],
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
  const isRTL = locale === "ar";

  return (
    <div
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
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

    </div>
  );
}
