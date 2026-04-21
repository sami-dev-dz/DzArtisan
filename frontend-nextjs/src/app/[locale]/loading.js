import { GenericPageSkeleton } from "@/components/ui/SkeletonLayouts"

/**
 * loading.js global — affiché automatiquement par Next.js (Suspense)
 * lors de n'importe quelle navigation sur le site.
 */
export default function GlobalLoading() {
  return <GenericPageSkeleton />
}
