import { Skeleton } from "@/components/ui/Skeleton"

/** Loading pour l'onboarding artisan (profil + abonnement) */
export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-[#0B1120] px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              {i < 2 && <Skeleton className="h-1 w-12 rounded-full" />}
            </div>
          ))}
        </div>

        {/* Card principale */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-5 w-80 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          <div className="flex justify-between pt-2">
            <Skeleton className="h-12 w-28 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
