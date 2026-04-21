/**
 * SkeletonLayouts.jsx
 * ───────────────────
 * Composants skeleton spécialisés par type de page (style YouTube / Udemy).
 * Chaque layout reproduit fidèlement la structure visuelle de la page réelle.
 */

import { Skeleton } from "@/components/ui/Skeleton"

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS — Primitives réutilisables
 ═══════════════════════════════════════════════════════════════════════════ */

/** Carte statistique (petit carré avec icône + chiffre) */
export function StatCardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  )
}

/** KPI Card Admin spécifique */
export function KpiSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-white/10">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-14 h-5 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  )
}

/** Graphique Admin spécifique */
export function ChartSkeleton({ height = 320 }) {
  return (
    <div
      className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm"
      style={{ minHeight: height }}
    >
      <Skeleton className="h-2 w-24 mb-2" />
      <Skeleton className="h-5 w-48 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-end gap-2">
            <Skeleton
              className="w-full"
              style={{ height: `${30 + i * 10}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Alertes Admin spécifique */
export function AlertsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-32" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/** Flux d'activité Admin spécifique */
export function ActivitySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
      <Skeleton className="h-2 w-20 mb-2" />
      <Skeleton className="h-5 w-40 mb-6" />
      <div className="space-y-5 pl-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Ligne de tableau générique */
function TableRowSkeleton({ cols = 5 }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 rounded-md flex-1"
          style={{ maxWidth: i === 0 ? "48px" : undefined }}
        />
      ))}
    </div>
  )
}

/** Card artisan dans la grille de recherche */
function ArtisanCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
      {/* Avatar + nom */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3.5 w-1/2 rounded-md" />
        </div>
      </div>
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-sm" />
        ))}
        <Skeleton className="h-4 w-10 rounded-md ml-2" />
      </div>
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-4/5 rounded-md" />
      </div>
      {/* Badges catégories */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      {/* Bouton CTA */}
      <Skeleton className="h-10 w-full rounded-xl mt-2" />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD ARTISAN
 ═══════════════════════════════════════════════════════════════════════════ */
export function DashboardArtisanSkeleton() {
  return (
    <div className="space-y-10">
      {/* Search/Header simplified */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
        <Skeleton className="h-12 w-48 rounded-2xl shrink-0" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 grow rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD CLIENT
 ═══════════════════════════════════════════════════════════════════════════ */
export function DashboardClientSkeleton() {
  return (
    <div className="space-y-10">
      {/* Header simplified */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
        <Skeleton className="h-12 w-48 rounded-2xl shrink-0" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      {/* Table-like block */}
      <div className="p-1">
        <TableSkeleton rows={4} cols={4} title={true} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD ADMIN
 ═══════════════════════════════════════════════════════════════════════════ */
export function DashboardAdminSkeleton() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Stats grid — 4 colonnes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      {/* Alerts */}
      <AlertsSkeleton />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartSkeleton height={360} />
        <ChartSkeleton height={360} />
      </div>

      {/* Activity Feed */}
      <ActivitySkeleton />

      {/* Tableau (optional, normally after feedback) */}
      <TableSkeleton rows={6} cols={6} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   RECHERCHE ARTISANS
 ═══════════════════════════════════════════════════════════════════════════ */
export function ArtisansSearchSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0B1120]">
      {/* Hero / barre de recherche */}
      <div className="bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/5 py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="space-y-2 text-center">
            <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
            <Skeleton className="h-5 w-80 mx-auto rounded-md" />
          </div>
          {/* Barre de recherche */}
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar filtres */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <Skeleton className="h-5 w-20 rounded-md" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 flex-1 rounded-md" />
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-8 w-full rounded-xl" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 flex-1 rounded-md" />
              </div>
            ))}
          </div>
        </aside>

        {/* Grille résultats */}
        <div className="flex-1 space-y-6">
          {/* Barre de tri */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-xl" />
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <ArtisanCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PROFIL ARTISAN
 ═══════════════════════════════════════════════════════════════════════════ */
export function ArtisanProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0B1120] px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Skeleton className="w-32 h-32 rounded-3xl shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-56 rounded-xl" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <Skeleton className="h-12 w-full md:w-40 rounded-2xl" />
              <Skeleton className="h-12 w-full md:w-40 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Bio / description */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-3">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>

        {/* Galerie photos */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>

        {/* Avis clients */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-slate-100 dark:border-white/5 pb-5 last:border-0">
              <Skeleton className="w-11 h-11 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="w-3.5 h-3.5 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PRICING
 ═══════════════════════════════════════════════════════════════════════════ */
export function PricingSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0B1120] px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-72 mx-auto rounded-xl" />
          <Skeleton className="h-5 w-96 mx-auto rounded-md" />
          {/* Toggle mensuel/annuel */}
          <Skeleton className="h-10 w-48 mx-auto rounded-full mt-4" />
        </div>

        {/* Cards de tarification — 3 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border shadow-sm space-y-6 ${
                i === 1
                  ? "border-blue-500/30 ring-2 ring-blue-500/20 shadow-blue-500/10"
                  : "border-slate-200 dark:border-white/5"
              }`}
            >
              <div className="space-y-3">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 flex-1 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ quick */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5">
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTH (login / register / forgot-password)
 ═══════════════════════════════════════════════════════════════════════════ */
export function AuthSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-[#0B1120] px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-xl space-y-7">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <Skeleton className="h-6 w-36 rounded-xl" />
          <Skeleton className="h-4 w-52 rounded-md" />
        </div>

        {/* Champs formulaire */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>

        {/* Bouton submit */}
        <Skeleton className="h-13 w-full rounded-xl" />

        {/* Liens */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        {/* Divider OAuth */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-8 rounded-md" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   TABLE SKELETON générique (admin)
 ═══════════════════════════════════════════════════════════════════════════ */
export function TableSkeleton({ rows = 8, cols = 5, title = true }) {
  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
      {/* Header de la table */}
      {title && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
          <Skeleton className="h-5 w-36 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
        </div>
      )}

      {/* Entêtes colonnes */}
      <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-white/2 border-b border-slate-100 dark:border-white/5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3.5 rounded-md"
            style={{ flex: i === 0 ? "0 0 48px" : 1 }}
          />
        ))}
      </div>

      {/* Lignes de données */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-white/5">
        <Skeleton className="h-4 w-32 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   GENERIC PAGE SKELETON (fallback global)
 ═══════════════════════════════════════════════════════════════════════════ */
export function GenericPageSkeleton() {
  return (
    <div className="px-4 py-8 md:px-8 space-y-12 max-w-7xl mx-auto">
      {/* Page header simplified */}
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>

      {/* Main content placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
