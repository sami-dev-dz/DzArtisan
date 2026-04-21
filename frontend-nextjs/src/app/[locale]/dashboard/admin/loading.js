import { DashboardAdminSkeleton } from "@/components/ui/SkeletonLayouts"

export default function AdminDashboardLoading() {
  return (
    <div className="px-4 py-6 md:px-8">
      <DashboardAdminSkeleton />
    </div>
  )
}
