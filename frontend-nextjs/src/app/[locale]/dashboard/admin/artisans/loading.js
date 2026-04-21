import { TableSkeleton } from "@/components/ui/SkeletonLayouts"
import { Skeleton } from "@/components/ui/Skeleton"

export default function AdminArtisansLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      {/* Barre de recherche + filtres */}
      <div className="flex gap-3 flex-wrap">
        <Skeleton className="h-12 w-full md:w-80 rounded-xl" />
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
      <TableSkeleton rows={10} cols={6} title={false} />
    </div>
  )
}
