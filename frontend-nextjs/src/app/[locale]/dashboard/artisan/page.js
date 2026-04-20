"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import {
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Phone,
  FileText,
  CreditCard,
  TrendingUp,
  Lock,
  Camera,
  Crown,
  Star,
  AlertTriangle
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api-client"
import { StatCard } from "@/components/dashboard/StatCard"
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner"
import { ProfileCompletenessWidget } from "@/components/dashboard/ProfileCompletenessWidget"
import { MatchingRequestCard } from "@/components/dashboard/MatchingRequestCard"
import { AvailabilityToggle } from "@/components/dashboard/AvailabilityToggle"
import { PlanSelection } from "@/components/subscription/PlanSelection"
import { cn } from "@/lib/utils"

// ─── Locked Feature Overlay ───────────────────────────────────────────────
function LockedOverlay({ title = "Fonctionnalité Premium", message = "Passez à un plan payant pour accéder à cette fonctionnalité." }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl backdrop-blur-sm bg-white/70 dark:bg-[#0C0C0C]/70">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
        <Lock className="w-7 h-7 text-indigo-500" />
      </div>
      <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center max-w-[180px]">{message}</p>
      <Link
        href="/dashboard/artisan/subscription"
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wide hover:bg-indigo-700 transition-colors"
      >
        <Crown className="w-3.5 h-3.5" />
        Passer Premium
      </Link>
    </div>
  )
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-3xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-80 bg-slate-100 dark:bg-slate-800/50 rounded-3xl" />
        <div className="h-80 bg-slate-100 dark:bg-slate-800/50 rounded-3xl" />
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────
export default function ArtisanDashboard() {
  const t = useTranslations("dashboard")
  const common = useTranslations("common")
  const { user } = useAuth()

  const [data, setData] = React.useState(null)
  const [matchingRequests, setMatchingRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = React.useState(null)  // null = loading

  const fetchAll = React.useCallback(async () => {
    try {
      const [statsRes, subRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/subscription/status"),
      ])
      setData(statsRes.data)
      setSubscriptionStatus(subRes.data)

      // Only fetch matching requests if premium
      if (subRes.data?.is_premium) {
        const reqRes = await api.get("/dashboard/matching-requests")
        setMatchingRequests(Array.isArray(reqRes.data) ? reqRes.data : reqRes.data?.data ?? [])
      }
    } catch (err) {
      console.error("Dashboard data fetch error", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchAll() }, [fetchAll])

  const handlePlanSelected = () => {
    setLoading(true)
    fetchAll()
  }

  if (loading) return <DashboardSkeleton />

  const isPremium = subscriptionStatus?.is_premium ?? false
  const hasPlan = subscriptionStatus && subscriptionStatus.plan && subscriptionStatus.plan !== 'none'
  const isFreePlan = subscriptionStatus?.plan === 'gratuit'

  // Map icons for profile completeness widget
  const getIcon = (id) => {
    if (id === "photo") return Camera
    if (id === "whatsapp") return Phone
    if (id === "about") return FileText
    if (id === "card") return CreditCard
    return Sparkles
  }
  const widgetItems = data?.missing_items?.map(item => ({ ...item, icon: getIcon(item.id) })) || []

  return (
    <div className="space-y-8">

      {/* ── Plan Selection Banner (no plan chosen yet) ──────── */}
      {!hasPlan && (
        <div className="rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-blue-200 dark:border-blue-500/20 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Première étape</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Choisissez votre plan pour commencer</h2>
            <p className="text-sm text-slate-500 mt-1">Sélectionnez un plan pour débloquer les fonctionnalités.</p>
          </div>
          <PlanSelection onSuccess={handlePlanSelected} compact />
        </div>
      )}

      {/* ── Welcome Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              Artisan Vérifié
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {common("welcome")},{" "}
            <span className="text-blue-600">{user?.nomComplet?.split(" ")[0]}</span>{" "}
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block origin-bottom"
            >👋</motion.span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Prêt à transformer de nouvelles opportunités en réalisations ?
          </p>
        </motion.div>

        <div className="flex items-center gap-3 shrink-0">
          <AvailabilityToggle />
        </div>
      </div>

      {/* ── Free Plan Warning Banner (only when plan = gratuit) ─── */}
      {isFreePlan && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 px-6 py-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-black text-slate-900 dark:text-white text-sm">
              Vous utilisez le Plan Gratuit
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Passez à un abonnement Premium pour soumettre des propositions et contacter les clients directement.
            </p>
          </div>
          <Link
            href="/dashboard/artisan/subscription"
            className="shrink-0 h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wide flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Crown className="w-3.5 h-3.5" />
            Passer Premium
          </Link>
        </motion.div>
      )}

      {/* ── Subscription Banner ─────────────────────────────────────── */}
      <SubscriptionBanner data={data?.subscription} />

      {/* ── Stats Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats?.map((stat, idx) => (
          <StatCard key={stat.label} {...stat} index={idx} />
        ))}
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left: Matching Requests — locked for free users */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Opportunités pour vous
              </h3>
            </div>
            {isPremium && (
              <Link href="/dashboard/artisan/jobs" className="text-sm font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                Tout voir <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Content — locked if free */}
          <div className={cn("relative", !isPremium && "min-h-[280px]")}>
            {!isPremium ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/6 bg-slate-50/50 dark:bg-white/2 min-h-[280px] flex flex-col items-center justify-center gap-4 p-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-900 dark:text-white">Accès Premium requis</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">Les opportunités de missions sont réservées aux abonnés.</p>
                </div>
                <Link
                  href="/dashboard/artisan/subscription"
                  className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wide transition-all hover:scale-[1.03]"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Voir les plans
                </Link>
              </div>
            ) : matchingRequests.length > 0 ? (
              <div className="space-y-4">
                {matchingRequests.map((request, idx) => (
                  <MatchingRequestCard key={request.id} request={request} index={idx} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/6 p-12 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Aucune demande trouvée</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">Élargissez vos wilayas ou vos catégories pour plus de visibilité.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Profile Completeness + Promo */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Croissance</h3>
          </div>

          <ProfileCompletenessWidget
            percentage={data?.completeness}
            items={widgetItems}
          />

          {/* Promotion card */}
          {!isPremium ? (
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-7 text-white relative overflow-hidden shadow-xl shadow-blue-600/25">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h4 className="text-lg font-black mb-1.5 tracking-tight">Passez Premium</h4>
              <p className="text-indigo-100 text-sm font-medium mb-5 leading-relaxed">
                Débloquez toutes les fonctionnalités dès 500 DA/mois et multipliez vos revenus.
              </p>
              <Link
                href="/dashboard/artisan/subscription"
                className="h-11 w-full bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.03] transition-transform active:scale-[0.97]"
              >
                <Crown className="w-4 h-4" />
                Voir les plans Premium
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-7 text-white relative overflow-hidden shadow-xl shadow-blue-600/25">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <h4 className="text-lg font-black mb-1.5 tracking-tight">Support Premium</h4>
              <p className="text-indigo-100 text-sm font-medium mb-5">
                Besoin d&apos;aide pour optimiser votre profil ou gérer un client ?
              </p>
              <button className="h-11 w-full bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.03] transition-transform active:scale-[0.97]">
                Contacter l&apos;assistance
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
