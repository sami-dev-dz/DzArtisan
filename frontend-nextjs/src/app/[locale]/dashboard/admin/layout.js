"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminMobileNav } from "@/components/admin/AdminMobileNav"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { Loader2, ShieldX } from "lucide-react"
import axios from "@/lib/axios"

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = React.useState(false)
  const [pendingCounts, setPendingCounts] = React.useState({})

  // Redirect non-admins
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
    if (!loading && user && user.type !== "admin") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Fetch pending badge counts (lightweight, cached)
  React.useEffect(() => {
    if (!user || user.type !== "admin") return
    axios
      .get("/v1/admin/overview")
      .then(({ data }) => {
        setPendingCounts({
          pending_artisans: data?.alerts?.pending_artisans ?? 0,
          unread_complaints: data?.alerts?.unread_complaints ?? 0,
          expiring_subs: data?.alerts?.expiring_subs ?? 0,
        })
      })
      .catch(() => {
        // silent – badge counts are non-critical
      })
  }, [user])

  /* ─── Loading state ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-2xl animate-pulse" />
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
            Admin Panel
          </span>
        </div>
      </div>
    )
  }

  /* ─── Unauthorized state ──────────────────────────────────────── */
  if (!user || user.type !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <p className="font-black text-lg text-slate-900 dark:text-white">
            Accès refusé
          </p>
          <p className="text-sm text-slate-500">
            Cette zone est réservée aux administrateurs de la plateforme.
          </p>
        </div>
      </div>
    )
  }

  return (
    /*
     * The [locale]/layout.js wraps everything in <main className="min-h-screen pt-20">
     * We use -mt-20 to pull our layout back to the very top of the viewport
     * (the public Navbar is still visible above, as on all dashboard pages).
     * Then we use our own AdminMobileNav top bar instead of the shared header.
     */
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0f1e] -mt-20 -mx-6 sm:-mx-10 lg:-mx-12 relative">
      {/* ── Admin Sidebar (desktop) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        pendingCounts={pendingCounts}
      />

      {/* ── Right content area ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile top nav */}
        <AdminMobileNav pendingCounts={pendingCounts} />

        {/* Ambient gradients */}
        <div className="pointer-events-none absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-1/2 h-1/2 bg-violet-600/5 rounded-full blur-[120px]" />

        <main className="flex-1 p-5 sm:p-8 lg:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
