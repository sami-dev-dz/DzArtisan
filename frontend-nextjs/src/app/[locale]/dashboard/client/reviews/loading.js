import { Skeleton } from "@/components/ui/Skeleton"

export default function ClientReviewsLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Skeleton className="h-7 w-36 rounded-xl" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </div>

      {/* Résumé global */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-6 flex items-center gap-6">
        <div className="text-center space-y-1">
          <Skeleton className="h-12 w-16 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-14 rounded-md mx-auto" />
        </div>
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3.5 w-8 rounded-md" />
              <Skeleton className="h-2.5 flex-1 rounded-full" />
              <Skeleton className="h-3.5 w-6 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Avis individuels */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-5 flex gap-4"
          >
            <Skeleton className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3.5 w-20 rounded-md" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="w-4 h-4 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
