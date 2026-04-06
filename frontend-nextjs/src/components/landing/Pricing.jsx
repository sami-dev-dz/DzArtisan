"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { Check, CreditCard, Zap, CalendarDays, CalendarRange, Trophy, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const planConfig = [
  { key: "basic",   icon: Zap,           highlight: false },
  { key: "pro",     icon: CalendarDays,  highlight: false },
  { key: "premium", icon: CalendarRange, highlight: false },
  { key: "annual",  icon: Trophy,        highlight: true  },
]

export function Pricing() {
  const t = useTranslations("pricing")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <section id="pricing" className="py-28 bg-[#f0f4ff] dark:bg-[#060a14] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute pointer-events-none rounded-full blur-[110px]"
        style={{ width: 700, height: 600, background: "radial-gradient(circle, rgba(29,78,216,0.09) 0%, transparent 70%)", top: "-15%", left: "-10%" }} />
      <div className="absolute pointer-events-none rounded-full blur-[110px]"
        style={{ width: 500, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)", bottom: "0%", right: "-5%" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-[11px] font-bold tracking-[0.1em] uppercase text-blue-400"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            {t("title")}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0c1428] dark:text-[#eef2ff] mb-3 leading-tight">
            {t("subtitle")}
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {planConfig.map((plan, i) => {
            const planData = t.raw(`plans.${plan.key}`)
            const Icon = plan.icon
            const isFree = planData.price === "0"

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {plan.highlight ? (
                  /* ─── Annual highlighted card ─── */
                  <div
                    className="relative overflow-hidden rounded-[20px] p-7 flex flex-col lg:-translate-y-3"
                    style={{
                      background: "linear-gradient(145deg, #1d4ed8 0%, #1e3a8a 60%, #0f1f55 100%)",
                      border: "1px solid rgba(96,165,250,0.3)",
                      boxShadow: "0 24px 60px rgba(29,78,216,0.35), 0 0 0 1px rgba(96,165,250,0.15) inset, 0 1px 0 rgba(255,255,255,0.12) inset",
                    }}
                  >
                    {/* Inner glow */}
                    <div className="absolute -top-14 -right-10 w-52 h-52 rounded-full pointer-events-none"
                      style={{ background: "radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)" }} />

                    {/* Badge */}
                    {planData.badge && (
                      <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full mb-5 text-[11px] font-bold tracking-wide uppercase text-white"
                        style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)" }}>
                        <Trophy className="h-2.5 w-2.5" />
                        {planData.badge}
                      </div>
                    )}

                    {/* Icon */}
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-6"
                      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Icon className="h-5 w-5 text-blue-200" strokeWidth={2} />
                    </div>

                    {/* Name */}
                    <p className="text-sm font-semibold tracking-tight mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {planData.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="text-5xl font-black tracking-tight text-white leading-none">{planData.price}</span>
                      <span className="text-lg font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>DA</span>
                      <span className="text-sm ml-1" style={{ color: "rgba(255,255,255,0.5)" }}>/ {planData.duration}</span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.12)" }} />

                    {/* Features */}
                    <div className="flex flex-col gap-3 flex-1 mb-7">
                      {[
                        planData.benefit,
                        "Accès à toutes les fonctionnalités",
                        "Support prioritaire",
                      ].map((feat, j) => (
                        <div key={j} className="flex items-center gap-2.5 text-[13.5px] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                          <div className="flex items-center justify-center w-4.5 h-4.5 rounded-md shrink-0"
                            style={{ background: "rgba(255,255,255,0.18)", minWidth: 18, minHeight: 18 }}>
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                          </div>
                          {feat}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/register?role=artisan"
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-blue-700 text-sm font-black transition-all hover:bg-blue-50 hover:-translate-y-0.5 shadow-lg shadow-black/20 relative z-10"
                    >
                      {t("cta")}
                      <ArrowRight className={cn("h-3.5 w-3.5", isRTL && "rotate-180")} strokeWidth={2.5} />
                    </Link>
                  </div>
                ) : (
                  /* ─── Standard cards ─── */
                  <div
                    className="relative rounded-[20px] p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 group"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(15,23,42,0.08)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Dark mode override via class will be needed — using CSS variable approach */}
                    <div className="dark:hidden" />

                    {/* Icon */}
                    <div
                      className="flex items-center justify-center w-11 h-11 rounded-xl mb-6 transition-colors"
                      style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.12)" }}
                    >
                      <Icon className="h-5 w-5 text-blue-500" strokeWidth={2} />
                    </div>

                    {/* Name */}
                    <p className="text-sm font-semibold tracking-tight text-[#3d5080] dark:text-[#8da0c4] mb-2">
                      {planData.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-5">
                      {isFree ? (
                        <>
                          <span className="text-5xl font-black tracking-tight text-[#0c1428] dark:text-[#eef2ff] leading-none">Gratuit</span>
                          <span className="text-sm font-medium text-[#8898b8] ml-1.5">· {planData.duration}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-5xl font-black tracking-tight text-[#0c1428] dark:text-[#eef2ff] leading-none">{planData.price}</span>
                          <span className="text-lg font-bold text-[#8898b8]">DA</span>
                          <span className="text-sm text-[#8898b8] ml-1">/ {planData.duration}</span>
                        </>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-black/[0.06] dark:bg-white/[0.06] mb-6" />

                    {/* Features */}
                    <div className="flex flex-col gap-3 flex-1 mb-7">
                      {/* Real benefit */}
                      <div className="flex items-center gap-2.5 text-[13.5px] font-medium text-[#3d5080] dark:text-[#8da0c4]">
                        <div className="flex items-center justify-center shrink-0 rounded-md"
                          style={{ minWidth: 18, minHeight: 18, background: "rgba(37,99,235,0.1)" }}>
                          <Check className="h-2.5 w-2.5 text-blue-500" strokeWidth={2.5} />
                        </div>
                        {planData.benefit}
                      </div>
                      {/* Skeleton rows */}
                      {[70, 50].map((w, j) => (
                        <div key={j} className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center shrink-0 rounded-md"
                            style={{ minWidth: 18, minHeight: 18, background: "rgba(15,23,42,0.05)" }}>
                            <Check className="h-2.5 w-2.5 text-[#8898b8]" strokeWidth={2.5} />
                          </div>
                          <div className="h-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.05]" style={{ width: `${w}%` }} />
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/register?role=artisan"
                      className="flex items-center justify-center w-full h-12 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      style={{ border: "1.5px solid rgba(37,99,235,0.2)" }}
                    >
                      {t("cta")}
                    </Link>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Footer note */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-medium text-[#3d5080] dark:text-[#8da0c4]"
            style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(15,23,42,0.07)" }}
          >
            <CreditCard className="h-4 w-4 text-blue-500 shrink-0" />
            {t("note")}
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8898b8] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t("faq_link")}
            <ArrowRight className={cn("h-3.5 w-3.5", isRTL && "rotate-180")} strokeWidth={2.2} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
