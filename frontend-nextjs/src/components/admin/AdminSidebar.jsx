"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Briefcase, CreditCard, ClipboardList,
  AlertTriangle, BarChart3, Settings, ChevronLeft, ChevronRight,
  LogOut, ShieldCheck, MessageSquareWarning
} from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export function AdminSidebar({ collapsed, setCollapsed, pendingCounts = {} }) {
  const { user, logout } = useAuth()
  const locale = useLocale()
  const isRTL = locale === "ar"
  const pathname = usePathname()
  const t = useTranslations("admin")

  const navItems = [
    {
      href: "/dashboard/admin",
      label: t("overview"),
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/admin/users",
      label: t("users"),
      icon: Users,
    },
    {
      href: "/dashboard/admin/artisans/validation",
      label: t("artisans"),
      icon: Briefcase,
      badge: pendingCounts.pending_artisans > 0 ? pendingCounts.pending_artisans : null,
      badgeColor: "bg-amber-500",
    },
    {
      href: "/dashboard/admin/subscriptions",
      label: t("subscriptions"),
      icon: CreditCard,
      badge: pendingCounts.expiring_subs > 0 ? pendingCounts.expiring_subs : null,
      badgeColor: "bg-red-500",
    },
    {
      href: "/dashboard/admin/interventions",
      label: t("interventions"),
      icon: ClipboardList,
    },
    {
      href: "/dashboard/admin/complaints",
      label: t("complaints"),
      icon: MessageSquareWarning,
      badge: pendingCounts.unread_complaints > 0 ? pendingCounts.unread_complaints : null,
      badgeColor: "bg-red-500",
    },
    {
      href: "/dashboard/admin/statistics",
      label: t("statistics"),
      icon: BarChart3,
    },
    {
      href: "/dashboard/admin/settings",
      label: t("settings"),
      icon: Settings,
    },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-[#0a0f1e] border-r border-slate-100 dark:border-white/5 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-white/5">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                Admin Panel
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 shrink-0"
        >
          {collapsed
            ? (isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
            : (isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
          }
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group relative",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}>
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive && "stroke-[2.5]")} />

                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-bold text-sm whitespace-nowrap overflow-hidden flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    "shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black text-white flex items-center justify-center",
                    item.badgeColor ?? "bg-blue-500",
                    collapsed ? "absolute -top-1 -right-1" : ""
                  )}>
                    {item.badge}
                  </span>
                )}

                {/* Active dot (collapsed mode) */}
                {isActive && collapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-l-full" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer: User + Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-white/5 shrink-0 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600 text-sm shrink-0">
              {user?.nomComplet?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user?.nomComplet}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold gap-3 transition-colors",
            collapsed ? "px-0 justify-center h-10" : "px-3 h-10 justify-start"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm">Déconnexion</span>}
        </Button>
      </div>
    </motion.aside>
  )
}
