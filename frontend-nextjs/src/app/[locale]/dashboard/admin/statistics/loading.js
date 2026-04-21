import { Skeleton } from "@/components/ui/Skeleton"

export default function AdminStatisticsLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-6 space-y-4">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Graphique large */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-5 w-44 rounded-md" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  )
}
