import { DashboardArtisanSkeleton } from "@/components/ui/SkeletonLayouts"

export default function ArtisanDashboardLoading() {
  return (
    <div className="px-4 py-6 md:px-8">
      <DashboardArtisanSkeleton />
    </div>
  )
}
