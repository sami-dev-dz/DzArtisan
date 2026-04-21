import { TableSkeleton } from "@/components/ui/SkeletonLayouts"
import { Skeleton } from "@/components/ui/Skeleton"

export default function AdminComplaintsLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-3">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-6 w-8 rounded-lg" />
          </div>
        ))}
      </div>

      <TableSkeleton rows={8} cols={6} title={false} />
    </div>
  )
}
