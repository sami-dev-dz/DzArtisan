"use client";

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { DashboardLayoutSkeleton } from "@/components/ui/SkeletonLayouts"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { BottomNav } from "@/components/dashboard/BottomNav"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [collapsed, setCollapsed] = React.useState(false)

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Initialize WebSockets for real-time notifications
  React.useEffect(() => {
    if (user && !loading) {
      import('@/lib/echo').then(({ initEcho }) => {
        const echo = initEcho();
        if (echo) {
          echo.private(`App.Models.User.${user.id}`)
            .notification((notification) => {
              // Add a toast notification dynamically
              import('@/store/toastStore').then(({ useToastStore }) => {
                useToastStore.getState().addToast({
                  title: notification.title || "Nouvelle notification",
                  message: notification.text || "Vous avez une nouvelle activité.",
                  type: "info"
                });
              });
            });
        }
      });
    }
  }, [user, loading]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) return null

  // ── Admin users get their own layout from the nested /admin/layout.js ──
  const isAdmin = user.type === "admin"

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex text-slate-900 dark:text-white"
    >
      
      {/* Desktop Sidebar — placed first so RTL dir flips it to the right side */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header (Mobile Only) */}
        <header className="lg:hidden h-20 bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 flex items-center justify-between sticky top-0 z-40">
           <div className="font-black text-xl text-blue-600 dark:text-blue-500 tracking-tighter">DzArtisan</div>
           <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 border border-blue-500/10">
              {user?.nomComplet?.charAt(0).toUpperCase()}
           </div>
        </header>

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 p-6 sm:p-10 lg:p-12 pb-32 lg:pb-12 transition-all duration-300",
          collapsed ? (isRTL ? "lg:pr-12" : "lg:pl-12") : ""
        )}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  )
}