import { Skeleton } from "@/components/ui/Skeleton"

/** Loading pour la page notifications */
export default function NotificationsLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-6 max-w-3xl mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40 rounded-xl" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Liste notifications */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex items-start gap-4"
          >
            <Skeleton className="w-10 h-10 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3.5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-3/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
