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
import { RegistrationsChart, WilayaBarChart } from "@/components/admin/AdminCharts"
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

/* ─────────────────────── KPI SKELETON CARD ─────────────────────── */
function KpiSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-xl animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5" />
        <div className="w-16 h-6 rounded-full bg-slate-100 dark:bg-white/5" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-24 rounded bg-slate-100 dark:bg-white/5" />
        <div className="h-8 w-32 rounded bg-slate-100 dark:bg-white/5" />
        <div className="h-2 w-20 rounded bg-slate-100 dark:bg-white/5" />
      </div>
    </div>
  )
}

/* ────────────────────── CHART SKELETON ─────────────────────────── */
function ChartSkeleton({ height = 320 }) {
  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-xl animate-pulse"
      style={{ minHeight: height }}
    >
      <div className="h-2 w-24 rounded bg-slate-100 dark:bg-white/5 mb-2" />
      <div className="h-5 w-48 rounded bg-slate-100 dark:bg-white/5 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-end gap-2">
            <div
              className="w-full rounded bg-slate-100 dark:bg-white/5"
              style={{ height: `${20 + 40 /* replaced random */}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────── ALERTS SKELETON ───────────────────────── */
function AlertsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-3 w-32 rounded bg-slate-100 dark:bg-white/5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-[24px] bg-slate-100 dark:bg-white/5"
          />
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────── ACTIVITY SKELETON ─────────────────────── */
function ActivitySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-xl animate-pulse">
      <div className="h-2 w-20 rounded bg-slate-100 dark:bg-white/5 mb-2" />
      <div className="h-5 w-40 rounded bg-slate-100 dark:bg-white/5 mb-6" />
      <div className="space-y-5 pl-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-white/5" />
              <div className="h-2 w-1/3 rounded bg-slate-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────── ERROR BANNER ─────────────────────────── */
function ErrorBanner({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-[24px]"
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
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
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500">
              Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
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
            "flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all",
            "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400",
            "hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200",
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
