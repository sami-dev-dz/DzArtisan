// app/components/ConditionalLayout.jsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.split("/").some((seg) => seg.includes("admin"));

  if (isAdminRoute) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[68px]">{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
