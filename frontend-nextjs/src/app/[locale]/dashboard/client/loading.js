import { DashboardClientSkeleton } from "@/components/ui/SkeletonLayouts"

export default function ClientDashboardLoading() {
  return (
    <div className="px-4 py-6 md:px-8">
      <DashboardClientSkeleton />
    </div>
  )
}
