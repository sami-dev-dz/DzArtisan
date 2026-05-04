"use client"

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ShieldX } from "lucide-react"
import { ClientLayoutSkeleton } from "@/components/ui/SkeletonLayouts"

export default function ClientLayout({ children }) {
  const t = useTranslations("common")
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect non-clients
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
    if (!loading && user && user.type !== "client") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return <ClientLayoutSkeleton />
  }

  if (!user || user.type !== "client") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <ShieldX className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">{t("access_denied")}</h2>
        <p className="text-slate-500">{t("client_only")}</p>
      </div>
    )
  }

  return <>{children}</>
}
