import { TableSkeleton } from "@/components/ui/SkeletonLayouts"
import { Skeleton } from "@/components/ui/Skeleton"

export default function AdminSubscriptionsLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Stat cards revenus */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-5 space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>

      <TableSkeleton rows={8} cols={5} title={false} />
    </div>
  )
}
