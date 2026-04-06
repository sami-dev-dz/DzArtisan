"use client"

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { Loader2, ShieldX } from "lucide-react"

export default function ClientLayout({ children }) {
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
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!user || user.type !== "client") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <ShieldX className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Accès refusé</h2>
        <p className="text-slate-500">Cette zone est réservée aux clients.</p>
      </div>
    )
  }

  return <>{children}</>
}
