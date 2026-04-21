"use client"

import * as React from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BarChart3, 
  User, 
  ClipboardList, 
  CreditCard, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Settings,
  Briefcase,
  Star
} from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export function Sidebar({ collapsed, setCollapsed }) {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = user?.type === 'artisan' ? [
    { type: 'heading', label: 'PRINCIPAL' },
    { href: "/dashboard/artisan", icon: BarChart3, label: t("dashboard") },
    { href: "/dashboard/artisan/profile", icon: User, label: t("profile") },
    { type: 'heading', label: 'ACTIVITÉ' },
    { href: "/dashboard/artisan/jobs", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/artisan/complaints", icon: AlertTriangle, label: t("my_complaints") },
    { type: 'heading', label: 'FACTURATION' },
    { href: "/dashboard/artisan/subscription", icon: CreditCard, label: t("my_subscription") },
  ] : [
    { type: 'heading', label: 'PRINCIPAL' },
    { href: "/dashboard/client", icon: BarChart3, label: t("dashboard") },
    { type: 'heading', label: 'ACTIVITÉ' },
    { href: "/dashboard/client/requests", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/client/reviews", icon: Star, label: t("my_reviews") || "Mes avis" },
    { href: "/dashboard/client/complaints", icon: AlertTriangle, label: t("my_complaints") },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 272 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 z-50 overflow-hidden shrink-0 bg-white dark:bg-[#0C0C0C] border-r border-slate-200 dark:border-white/6"
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="relative px-4 py-4 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-white/6">
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
                <Image src="/logo.png" alt="DzArtisan" width={26} height={26} className="w-auto h-auto object-contain" />
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm leading-none tracking-tight">
                   {user?.type === 'artisan' ? 'Espace Artisan' : 'Espace Client'}
                </p>
                <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400/80 uppercase tracking-widest mt-0.5">
                   Navigation
                </p>
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
                <Image src="/logo.png" alt="DzArtisan" width={26} height={26} className="object-contain" />
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
      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
        <div className="px-4 space-y-1.5">
          {navItems.map((item, index) => {
            if (item.type === 'heading') {
              if (collapsed) return <div key={`heading-${index}`} className="h-6" />
              return (
                <div key={`heading-${index}`} className="px-4 pt-5 pb-2">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-white/30 uppercase">
                    {item.label}
                  </p>
                </div>
              )
            }
            
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer select-none",
                    isActive
                      ? "text-blue-600 dark:text-white bg-blue-50/80 dark:bg-blue-500/10 shadow-sm ring-1 ring-blue-500/10 dark:ring-blue-500/20"
                      : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80 hover:bg-slate-50 dark:hover:bg-transparent"
                  )}
                >
                  {/* Hover BG for Dark mode */}
                  {!isActive && (
                    <div className="hidden dark:block absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5" />
                  )}

                  {/* Active Accent Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBarClient"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "relative shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-200",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-current"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )} strokeWidth={isActive ? 2.5 : 1.8} />
                    
                    {isActive && (
                      <div className="absolute inset-0 blur-md bg-blue-500/30 rounded-full scale-150" />
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-sm whitespace-nowrap overflow-hidden flex-1 tracking-wide pt-0.5",
                          isActive ? "font-black" : "font-bold"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <div className="p-4 shrink-0 border-t border-slate-200 dark:border-white/5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl mb-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-blue-600 dark:text-blue-300 ring-2 ring-blue-500/20 bg-blue-100 dark:bg-blue-900/40 shadow-inner">
                {user?.nomComplet ? String(user.nomComplet).charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight tracking-tight">{user?.nomComplet}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{user?.type}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400/80 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all duration-300 font-bold text-sm tracking-wide group",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.5} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                {t("logout")}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
