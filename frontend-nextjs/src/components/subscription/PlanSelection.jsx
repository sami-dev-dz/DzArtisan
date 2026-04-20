"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, X, Zap, Crown, Star, Shield, ArrowRight,
  Sparkles, Lock, TrendingUp, AlertTriangle
} from "lucide-react"
import api from "@/lib/api-client"

const plans = [
  {
    id: "gratuit",
    name: "Free",
    price: 0,
    priceLabel: "Gratuit",
    duration: null,
    description: "Accès limité pour découvrir la plateforme",
    badge: null,
    color: "slate",
    icon: Shield,
    features: [
      { text: "Profil artisan visible", included: true },
      { text: "Tableau de bord de base", included: true },
      { text: "Soumettre des propositions", included: false },
      { text: "Contacter les clients", included: false },
      { text: "Badge vérifié premium", included: false },
      { text: "Support prioritaire", included: false },
    ],
  },
  {
    id: "mensuel",
    name: "1 Mois",
    price: 500,
    priceLabel: "500 DA",
    duration: "/ mois",
    description: "Idéal pour tester toutes les fonctionnalités",
    badge: null,
    color: "blue",
    icon: Zap,
    features: [
      { text: "Profil artisan visible", included: true },
      { text: "Tableau de bord complet", included: true },
      { text: "Soumettre des propositions", included: true },
      { text: "Contacter les clients", included: true },
      { text: "Badge Artisan Pro", included: true },
      { text: "Support prioritaire", included: false },
    ],
  },
  {
    id: "trimestriel",
    name: "3 Mois",
    price: 1500,
    priceLabel: "1 500 DA",
    duration: "/ 3 mois",
    description: "Le choix le plus populaire – économisez 17%",
    badge: "Recommandé",
    color: "indigo",
    icon: Star,
    features: [
      { text: "Profil artisan visible", included: true },
      { text: "Tableau de bord complet", included: true },
      { text: "Soumettre des propositions", included: true },
      { text: "Contacter les clients", included: true },
      { text: "Badge Artisan Pro", included: true },
      { text: "Support prioritaire", included: true },
    ],
  },
  {
    id: "annuel",
    name: "1 An",
    price: 4000,
    priceLabel: "4 000 DA",
    duration: "/ an",
    description: "Visibilité maximale – économisez 33%",
    badge: "Meilleure valeur",
    color: "amber",
    icon: Crown,
    features: [
      { text: "Profil artisan visible", included: true },
      { text: "Tableau de bord complet", included: true },
      { text: "Soumettre des propositions", included: true },
      { text: "Contacter les clients", included: true },
      { text: "Badge Elite toutes wilayas", included: true },
      { text: "Support premium dédié", included: true },
    ],
  },
]

const colorMap = {
  slate: {
    bg: "bg-slate-50 dark:bg-slate-900/30",
    border: "border-slate-200 dark:border-white/8",
    icon: "bg-slate-100 dark:bg-white/5 text-slate-500",
    badge: "bg-slate-100 text-slate-600",
    btn: "bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white",
    check: "text-slate-400",
  },
  blue: {
    bg: "bg-blue-50/50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-500/20",
    icon: "bg-blue-100 dark:bg-blue-500/20 text-blue-600",
    badge: "bg-blue-100 text-blue-600",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    check: "text-blue-500",
  },
  indigo: {
    bg: "bg-indigo-50/50 dark:bg-indigo-900/10",
    border: "border-indigo-400 dark:border-indigo-400/50 ring-2 ring-indigo-500/20",
    icon: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600",
    badge: "bg-indigo-600 text-white",
    btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
    check: "text-indigo-500",
  },
  amber: {
    bg: "bg-amber-50/50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-500/20",
    icon: "bg-amber-100 dark:bg-amber-500/20 text-amber-600",
    badge: "bg-amber-500 text-white",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
    check: "text-amber-500",
  },
}

export function PlanSelection({ onSuccess }) {
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false)
  const [loading, setLoading] = React.useState(null)
  const [error, setError] = React.useState(null)

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
      setError(err?.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(null)
    }
  }

  const confirmFree = async () => {
    await doSubscribe("gratuit")
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Bienvenue sur DzArtisan !</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Votre compte a été validé par l&apos;administrateur. Sélectionnez un plan pour commencer à recevoir des missions.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold max-w-2xl mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, idx) => {
          const c = colorMap[plan.color]
          const Icon = plan.icon
          const isLoading = loading === plan.id
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className={`relative flex flex-col rounded-3xl border-2 p-6 ${c.bg} ${c.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm ${c.badge}`}>
                  {plan.badge}
                </div>
              )}

              {/* Icon + Name */}
              <div className="mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-current/10">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.priceLabel}</span>
                  {plan.duration && <span className="text-sm text-slate-400 font-medium mb-1">{plan.duration}</span>}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    {f.included ? (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${c.check}`} />
                    ) : (
                      <X className="w-4 h-4 shrink-0 mt-0.5 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={`text-sm font-medium ${f.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600 line-through"}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => selectPlan(plan.id)}
                disabled={!!loading}
                className={`w-full h-11 rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${c.btn}`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Activation...
                  </span>
                ) : plan.id === "gratuit" ? (
                  <>Continuer gratuitement</>
                ) : (
                  <>Choisir ce plan <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Upsell Modal when user clicks Free */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0C0C0C] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/8 overflow-hidden"
            >
              {/* Top gradient decoration */}
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />

              <div className="p-8">
                {/* Close */}
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-5">
                  <TrendingUp className="w-7 h-7 text-amber-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  Attendez un instant !
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                  Avec le plan <strong>Free</strong>, vous ne pourrez pas contacter de clients ni soumettre de propositions.
                </p>

                {/* Comparison card */}
                <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/10 p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">Plan 3 Mois — 1 500 DA</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">≈ 500 DA/mois · Le plus populaire</p>
                      <ul className="mt-2.5 space-y-1">
                        {["Propositions illimitées", "Contact direct clients", "Badge Artisan Pro", "Support prioritaire"].map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => { setShowUpgradeModal(false); selectPlan("trimestriel") }}
                    className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4" />
                    Choisir le plan 3 Mois (1 500 DA)
                  </button>
                  <button
                    onClick={confirmFree}
                    disabled={!!loading}
                    className="w-full h-10 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {loading === "gratuit" ? "Activation..." : "Continuer avec le plan gratuit (accès limité)"}
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
