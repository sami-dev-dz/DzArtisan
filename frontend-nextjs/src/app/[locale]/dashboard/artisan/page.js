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
import { Link, useRouter } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api-client"
import { StatCard } from "@/components/dashboard/StatCard"
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner"
import { MatchingRequestCard } from "@/components/dashboard/MatchingRequestCard"
import { AvailabilityToggle } from "@/components/dashboard/AvailabilityToggle"
import { cn } from "@/lib/utils"
import { DashboardArtisanSkeleton } from "@/components/ui/SkeletonLayouts"

// ─── Main Dashboard ──────────────────────────────────────────────────────
export default function ArtisanDashboard() {
  const t = useTranslations("dashboard")
  const common = useTranslations("common")
  const { user } = useAuth()
  const router = useRouter()

  const [data, setData] = React.useState(null)
  const [matchingRequests, setMatchingRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = React.useState(null)

  const fetchAll = React.useCallback(async () => {
    try {
      const [statsRes, subRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/subscription/status"),
      ])
      setData(statsRes.data)
      setSubscriptionStatus(subRes.data)

      const reqRes = await api.get("/dashboard/matching-requests")
      setMatchingRequests(Array.isArray(reqRes.data) ? reqRes.data : reqRes.data?.data ?? [])
    } catch (err) {
      console.error("Dashboard data fetch error", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchAll() }, [fetchAll])

  // Redirect to onboarding subscription page if no plan chosen yet (fallback)
  React.useEffect(() => {
    if (!loading && subscriptionStatus) {
      const hasPlan = subscriptionStatus.plan && subscriptionStatus.plan !== 'none'
      if (!hasPlan) {
        router.push('/onboarding/artisan/subscription')
      }
    }
  }, [loading, subscriptionStatus, router])

  if (loading) return <DashboardArtisanSkeleton />

  const isPremium = subscriptionStatus?.is_premium ?? false
  const hasPlan = subscriptionStatus?.plan && subscriptionStatus.plan !== 'none'
  const isFreePlan = subscriptionStatus?.plan === 'gratuit'

  // Show skeleton while redirect to subscription page is triggered
  if (!hasPlan) return <DashboardArtisanSkeleton />



  return (
    <div className="space-y-8 relative">
      {/* ── Premium Ambient Background ────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-linear-to-b from-blue-600/5 to-transparent dark:from-blue-600/10 pointer-events-none rounded-t-[3rem]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 dark:bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />


      {/* ── Welcome Header ────────────────────────────────────────── */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 px-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-xl bg-blue-600/10 text-blue-600 shadow-inner backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 drop-shadow-sm" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 drop-shadow-sm">
              Artisan Vérifié
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {common("welcome")},{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 drop-shadow-sm">
              {user?.nomComplet?.split(" ")[0]}
            </span>{" "}
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="inline-block origin-bottom"
            >👋</motion.span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3 max-w-xl leading-relaxed">
            Votre tableau de bord centralisé. Prêt à transformer de nouvelles opportunités en réalisations d'exception ?
          </p>
        </motion.div>

        <div className="flex items-center gap-3 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-2 rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-none">
          {/* AvailabilityToggle will be rendered inside this premium container */}
          <AvailabilityToggle />
        </div>
      </div>



      {/* ── Stats Grid ──────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
      >
        {data?.stats?.map((stat, idx) => (
          <StatCard key={stat.label} {...stat} index={idx} />
        ))}
      </motion.div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 items-start">

        {/* Left: Matching Requests */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Opportunités pour vous
              </h3>
            </div>
            <Link href="/dashboard/artisan/jobs" className="text-sm font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            {matchingRequests.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      </div>
    </div>
  )
}
