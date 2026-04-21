import { TableSkeleton } from "@/components/ui/SkeletonLayouts"
import { Skeleton } from "@/components/ui/Skeleton"

export default function SubscriptionLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      {/* Plan actuel card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-36 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-7 w-12 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Plans disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-2xl" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 flex-1 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
