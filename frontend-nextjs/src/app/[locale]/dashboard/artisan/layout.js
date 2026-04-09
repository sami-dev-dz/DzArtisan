"use client"

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { Loader2, ShieldX, Clock } from "lucide-react"
import Link from "next/link"

export default function ArtisanLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect non-artisans
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
    if (!loading && user && user.type !== "artisan") {
      router.push("/dashboard")
      return
    }
    if (!loading && user && user.type === "artisan" && user.artisan?.statutValidation === "en_attente") {
      router.push("/onboarding/artisan/waiting")
      return
    }
    if (!loading && user && user.type === "artisan" && user.needs_artisan_onboarding) {
      router.push("/onboarding/artisan/profile")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!user || user.type !== "artisan") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <ShieldX className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Accès refusé</h2>
        <p className="text-slate-500">Cette zone est réservée aux artisans.</p>
      </div>
    )
  }

  return <>{children}</>
}
