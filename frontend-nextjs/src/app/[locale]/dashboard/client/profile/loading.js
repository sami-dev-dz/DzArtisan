import { Skeleton } from "@/components/ui/Skeleton"

export default function ClientProfileLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-8 max-w-4xl">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48 rounded-xl" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
        </div>
      </div>
      {/* Formulaire */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    </div>
  )
}
