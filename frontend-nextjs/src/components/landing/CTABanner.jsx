"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { UserPlus, Briefcase, ArrowRight, ShieldCheck } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function CTABanner() {
  const t = useTranslations("cta_banner")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <section className="py-20 bg-[#f0f4ff] dark:bg-[#060a14] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          className="relative overflow-hidden rounded-[28px] px-8 py-16 md:px-16 md:py-20 flex flex-col items-center text-center"
          style={{
            background: "linear-gradient(140deg, #1d4ed8 0%, #1e3a8a 55%, #0f1f55 100%)",
            boxShadow: "0 32px 80px rgba(29,78,216,0.4), 0 0 0 1px rgba(96,165,250,0.2) inset, 0 1px 0 rgba(255,255,255,0.12) inset",
          }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-16 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-16 -right-12 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />

          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="cta-grid-pat" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid-pat)" />
          </svg>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Eyebrow */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-[11px] font-bold tracking-[0.1em] uppercase"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
              Plateforme vérifiée · DzArtisan
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.1] mb-4 max-w-2xl"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("title")}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-[1.05rem] leading-[1.75] font-normal max-w-lg mb-12"
              style={{ color: "rgba(255,255,255,0.65)" }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t("subtitle")}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28 }}
            >
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-2.5 px-8 h-14 rounded-2xl bg-white text-blue-800 text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:bg-blue-50 shadow-xl shadow-black/20 hover:shadow-black/30"
              >
                <UserPlus className="h-[17px] w-[17px]" strokeWidth={2} />
                {t("client_btn")}
                <ArrowRight className={cn("h-3.5 w-3.5 transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} strokeWidth={2.5} />
              </Link>
              <Link
                href="/register?role=artisan"
                className="inline-flex items-center gap-2.5 px-7 h-14 rounded-2xl text-[15px] font-semibold transition-all hover:-translate-y-px"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px solid rgba(255,255,255,0.22)",
                  color: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.18)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"
                }}
              >
                <Briefcase className="h-[17px] w-[17px]" strokeWidth={1.8} />
                {t("artisan_btn")}
                <ArrowRight className={cn("h-3.5 w-3.5", isRTL && "rotate-180")} strokeWidth={2.5} />
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.38 }}
            >
              {[
                { icon: ShieldCheck, label: "Inscription gratuite" },
                { label: "Paiement sécurisé" },
                { label: "Profil vérifié" },
              ].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                  )}
                  <span
                    className="flex items-center gap-1.5 text-[12.5px] font-medium"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {item.icon && <item.icon className="h-3.5 w-3.5" style={{ color: "rgba(96,165,250,0.8)" }} strokeWidth={2.2} />}
                    {item.label}
                  </span>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
