"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, X, Zap, Crown, Star, Shield, ArrowRight,
  Sparkles, TrendingUp, AlertTriangle, Loader2
} from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

// Color config per plan id
const colorMap = {
  gratuit: {
    bg: "bg-slate-50 dark:bg-slate-900/30",
    border: "border-slate-200 dark:border-white/8",
    icon: "bg-slate-100 dark:bg-white/5 text-slate-500",
    badge: null,
    btn: "bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white",
    check: "text-slate-400",
    icon_comp: Shield,
  },
  mensuel: {
    bg: "bg-blue-50/50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-500/20",
    icon: "bg-blue-100 dark:bg-blue-500/20 text-blue-600",
    badge: null,
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    check: "text-blue-500",
    icon_comp: Zap,
  },
  trimestriel: {
    bg: "bg-indigo-50/50 dark:bg-indigo-900/10",
    border: "border-indigo-400 dark:border-indigo-400/50 ring-2 ring-indigo-500/20",
    icon: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600",
    badge: "bg-indigo-600 text-white",
    btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
    check: "text-indigo-500",
    icon_comp: Star,
  },
  annuel: {
    bg: "bg-amber-50/50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-500/20",
    icon: "bg-amber-100 dark:bg-amber-500/20 text-amber-600",
    badge: "bg-amber-500 text-white",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
    check: "text-amber-500",
    icon_comp: Crown,
  },
}

export function PlanSelection({ onSuccess, compact = false }) {
  const t = useTranslations("subscription.selection")
  const locale = useLocale()
  const durationLabel = {
    mensuel: t("per_month"),
    trimestriel: t("per_3_months"),
    annuel: t("per_year"),
  }
  const [plans, setPlans] = React.useState([])
  const [fetchLoading, setFetchLoading] = React.useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false)
  const [loading, setLoading] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    api.get("/subscription/plans")
      .then(res => setPlans(res.data.plans || []))
      .catch(() => setError(t("error_load")))
      .finally(() => setFetchLoading(false))
  }, [])

  const selectPlan = async (planId) => {
    if (planId === "gratuit") {
      setShowUpgradeModal(true)
      return
    }
    await doSubscribe(planId)
  }

  const doSubscribe = async (planId) => {
    setLoading(planId)
    setError(null)
    try {
      await api.post("/subscribe", { plan_id: planId })
      setShowUpgradeModal(false)
      if (onSuccess) onSuccess(planId)
    } catch (err) {
      setError(err?.response?.data?.message || t("error_generic"))
    } finally {
      setLoading(null)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      {!compact && (
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 mb-5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{t("badge")}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {t("title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan, idx) => {
          const c = colorMap[plan.id] ?? colorMap.mensuel
          const Icon = c.icon_comp
          const isLoading = loading === plan.id
          const priceLabel = plan.price === 0 ? t("price_free") : `${plan.price.toLocaleString()} ${t("currency")}`

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className={`relative flex flex-col rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.bg} ${c.border}`}
            >
              {/* Badge */}
              {plan.best_value && c.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm ${c.badge}`}>
                  {t("recommended")}
                </div>
              )}

              {/* Icon + Name */}
              <div className="mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-5 pb-5 border-b border-slate-200/60 dark:border-white/8">
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{priceLabel}</span>
                  {durationLabel[plan.id] && (
                    <span className="text-sm text-slate-400 font-medium mb-0.5">{durationLabel[plan.id]}</span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => selectPlan(plan.id)}
                disabled={!!loading}
                className={`w-full h-11 rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${c.btn}`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {t("activation")}
                  </span>
                ) : plan.id === "gratuit" ? (
                  <>{t("continue_free")}</>
                ) : (
                  <>{t("choose")} <ArrowRight className={cn("w-4 h-4", locale === 'ar' && "rotate-180")} /></>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Upsell Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0C0C0C] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/8 overflow-hidden"
            >
              <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500" />
              <div className="p-8">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-5">
                  <TrendingUp className="w-7 h-7 text-amber-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {t("modal.title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                  {t("modal.desc")}
                </p>

                <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/10 p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">{t("modal.plan_3_months")}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{t("modal.popular_hint")}</p>
                      <ul className="mt-2.5 space-y-1">
                        {["unlimited", "direct", "badge", "support"].map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            {t(`features.${f}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setShowUpgradeModal(false); doSubscribe("trimestriel") }}
                    className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4" />
                    {t("modal.choose_3_months")}
                  </button>
                  <button
                    onClick={() => doSubscribe("gratuit")}
                    disabled={!!loading}
                    className="w-full h-10 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {loading === "gratuit" ? t("activation") : t("modal.continue_limited")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
