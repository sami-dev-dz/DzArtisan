"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { ShieldCheck, Zap, Users, Star } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function AuthLayout({ children }) {
  const t = useTranslations("hero")
  const locale = useLocale()

  const highlights = [
    { icon: ShieldCheck, label: t("trust_verified") },
    { icon: Zap,         label: t("trust_fast") },
    { icon: Users,       label: t("trust_wilayas") },
  ]

  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1d4ed8 0%, #1e3a8a 55%, #0f1f55 100%)" }}>
        
        {/* BG decoration */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)" }} />
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <Star size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">DzArtisan</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl xl:text-[2.75rem] font-black text-white leading-tight mb-6 tracking-tight"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-base leading-relaxed mb-12"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {t("subtitle")}
          </motion.p>

          {/* Trust highlights */}
          <div className="space-y-4">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}>
                  <item.icon size={18} className="text-white" strokeWidth={2} />
                </div>
                <span className="font-semibold text-white text-[15px]">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
          DzArtisan © {new Date().getFullYear()} · Crafted in Algeria
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 bg-[#F7F3EE] flex items-center justify-center min-h-screen p-4 sm:p-8 relative overflow-auto">
        {/* Soft light decoration for mobile */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none lg:hidden opacity-50"
          style={{ background: "radial-gradient(circle, rgba(196,121,58,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="w-full max-w-[460px] relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}
