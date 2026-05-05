"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { Award, Zap, ArrowRight, ShieldCheck } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { PlanSelection } from "@/components/subscription/PlanSelection"
import { useAuth } from "@/context/AuthContext"

export default function ArtisanOnboardingSubscriptionPage() {
  const { user } = useAuth()
  const t = useTranslations("onboarding")
  const locale = useLocale()
  const artisanConfirmed = user?.artisan?.statutValidation === "valide"

  const handleSuccess = () => {
    // Force a page refresh to update auth context from the modified user load
    window.location.href = "/dashboard/artisan"
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#09090b] flex flex-col" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Navigation Bar */}
      <div className="flex-none p-6 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Award className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight block">DzArtisan Pro</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t("step_final")}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{t("account_approved")}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 pt-6">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <PlanSelection onSuccess={handleSuccess} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
