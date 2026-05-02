"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Users, Briefcase, ClipboardList, TrendingUp,
  RefreshCw, ShieldCheck, AlertTriangle, CheckCircle2
} from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useAdminOverview } from "@/hooks/useAdminOverview"
import { KpiCard } from "@/components/admin/KpiCard"
import { AdminAlerts } from "@/components/admin/AdminAlerts"
import dynamic from "next/dynamic"
const RegistrationsChart = dynamic(() => import("@/components/admin/AdminCharts").then(mod => mod.RegistrationsChart), { ssr: false })
const WilayaBarChart = dynamic(() => import("@/components/admin/AdminCharts").then(mod => mod.WilayaBarChart), { ssr: false })
import { ActivityFeed } from "@/components/admin/ActivityFeed"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

/* ─────────────────────────── ICON MAP ──────────────────────────── */
const ICON_MAP = {
  Users,
  Briefcase,
  ClipboardList,
  TrendingUp,
}

import { 
  KpiSkeleton, 
  ChartSkeleton, 
  AlertsSkeleton, 
  ActivitySkeleton 
} from "@/components/ui/SkeletonLayouts"

/* ──────────────────────── ERROR BANNER ─────────────────────────── */
function ErrorBanner({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl shadow-sm"
    >
      <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="font-black text-sm text-red-700 dark:text-red-400">
          Impossible de charger le tableau de bord
        </p>
        <p className="text-xs text-red-500/70 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Réessayer
      </button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function AdminOverviewPage() {
  const { user } = useAuth()
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { data, loading, error, refresh } = useAdminOverview()

  const now = new Date()
  const monthName = now.toLocaleDateString(
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US",
    { month: "long", year: "numeric" }
  )

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">
              Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Vue d&apos;ensemble
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Bienvenue{user?.nomComplet ? `, ${user.nomComplet.split(" ")[0]}` : ""}. — {monthName}
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={refresh}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all shadow-sm bg-white dark:bg-black",
            "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400",
            "hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-700 dark:hover:text-blue-200",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Actualiser
        </button>
      </motion.div>

      {/* ── Error banner ──────────────────────────────────────────── */}
      {error && !loading && (
        <ErrorBanner message={error} onRetry={refresh} />
      )}

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <section aria-label="Indicateurs clés de performance">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : (data?.kpis ?? []).map((kpi, i) => {
                const Icon = ICON_MAP[kpi.icon] ?? Users
                return (
                  <KpiCard
                    key={kpi.key}
                    label={kpi.label}
                    value={String(kpi.value)}
                    trend={kpi.trend}
                    icon={Icon}
                    color={kpi.color}
                    delay={i * 0.08}
                  />
                )
              })}
        </div>
      </section>

      {/* ── Alerts ────────────────────────────────────────────────── */}
      <section aria-label="Alertes nécessitant une attention immédiate">
        {loading ? (
          <AlertsSkeleton />
        ) : (
          <AdminAlerts alerts={data?.alerts} />
        )}
      </section>

      {/* ── Charts ────────────────────────────────────────────────── */}
      <section aria-label="Graphiques d&apos;activité">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton height={360} />
              <ChartSkeleton height={360} />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RegistrationsChart
                  data={data?.charts?.weekly_registrations ?? []}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <WilayaBarChart
                  data={data?.charts?.top_wilayas ?? []}
                />
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* ── Activity Feed ─────────────────────────────────────────── */}
      <section aria-label="Flux d&apos;activité récente">
        {loading ? (
          <ActivitySkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActivityFeed items={data?.activity_feed ?? []} />
          </motion.div>
        )}
      </section>

      {/* ── Footer spacer ─────────────────────────────────────────── */}
      <div className="h-8" />
    </div>
  )
}
