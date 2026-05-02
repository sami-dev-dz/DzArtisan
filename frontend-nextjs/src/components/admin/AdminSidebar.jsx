"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Briefcase, CreditCard, ClipboardList,
  BarChart3, ChevronLeft, ChevronRight,
  LogOut, ShieldCheck, MessageSquareWarning, FileText
} from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { useLocale, useTranslations } from "next-intl"
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
      exact: true,
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
      badgeColor: "amber",
    },
    {
      href: "/dashboard/admin/subscriptions",
      label: t("subscriptions"),
      icon: CreditCard,
      badge: pendingCounts.expiring_subs > 0 ? pendingCounts.expiring_subs : null,
      badgeColor: "red",
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
      badgeColor: "red",
    },
    {
      href: "/dashboard/admin/statistics",
      label: t("statistics_nav"),
      icon: BarChart3,
    },
    {
      href: "/dashboard/admin/pages",
      label: "Pages CMS",
      icon: FileText,
    },
  ]

  const badgeColorMap = {
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 272 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col h-screen sticky top-0 z-50 overflow-hidden shrink-0 bg-white dark:bg-[#0C0C0C] border-r border-slate-200 dark:border-white/6"
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="relative px-4 py-4 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-white/6">
        {/* Subtle gradient glow behind brand */}
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <div className="relative w-8 h-8 rounded-xl bg-linear-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-lg shadow-blue-500/10 ring-1 ring-blue-100/60 dark:ring-blue-800/30 overflow-hidden">
                <Image src="/logo.png" alt="DzArtisan" width={26} height={26} className="w-auto h-auto object-contain" style={{ width: "auto", height: "auto" }} />
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm leading-none tracking-tight">DzArtisan</p>
                <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400/80 uppercase tracking-[0.15em] mt-0.5">Admin Panel</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="brand-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-lg shadow-blue-500/10 ring-1 ring-blue-100/60 dark:ring-blue-800/30 overflow-hidden">
                <Image src="/logo.png" alt="DzArtisan" width={26} height={26} className="w-auto h-auto object-contain" style={{ width: "auto", height: "auto" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
        >
          {collapsed
            ? (isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)
            : (isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />)
          }
        </button>
      </div>

      {/* ── NAVIGATION ─────────────────────────────────────── */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
        <div className="px-2.5 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer select-none",
                    isActive
                      ? "text-blue-600 dark:text-white bg-blue-50 dark:bg-blue-500/10"
                      : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80 hover:bg-slate-50 dark:hover:bg-transparent"
                  )}
                >
                  {/* Hover BG – Only in dark mode; light mode uses Tailwind hover classes above */}
                  {!isActive && (
                    <div className="hidden dark:block absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/4" />
                  )}

                  {/* Active left accent bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "relative shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-200",
                    isActive ? "text-blue-500 dark:text-blue-400" : "text-current"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )} strokeWidth={isActive ? 2.5 : 1.8} />
                    {/* Active glow under icon */}
                    {isActive && (
                      <div className="absolute inset-0 blur-md bg-blue-400/30 rounded-full scale-150" />
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "text-sm font-semibold whitespace-nowrap overflow-hidden flex-1 tracking-tight",
                          isActive ? "font-bold" : ""
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {item.badge && (
                    <span className={cn(
                      "shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black text-white flex items-center justify-center",
                      badgeColorMap[item.badgeColor] ?? "bg-blue-500",
                      collapsed ? "absolute -top-0.5 -right-0.5 z-10" : ""
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <div className="p-2.5 shrink-0 border-t border-slate-200 dark:border-white/6">
        {/* User card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/6"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-blue-600 dark:text-blue-300 ring-2 ring-blue-500/20"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.08))" }}
              >
                {user?.nomComplet ? String(user.nomComplet).charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">{user?.nomComplet || "Administrateur"}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest">En ligne · Admin</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 dark:text-red-400/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/8 transition-all duration-200 font-semibold text-sm group",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
