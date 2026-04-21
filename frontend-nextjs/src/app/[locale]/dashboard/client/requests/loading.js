import { TableSkeleton } from "@/components/ui/SkeletonLayouts"
import { Skeleton } from "@/components/ui/Skeleton"

export default function ClientRequestsLoading() {
  return (
    <div className="px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <TableSkeleton rows={8} cols={5} title={false} />
    </div>
  )
}
