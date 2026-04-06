"use client"

import * as React from "react"
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
import { AvailabilityToggle } from "./AvailabilityToggle"
import { cn } from "@/lib/utils"

export function Sidebar({ collapsed, setCollapsed }) {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = user?.type === 'artisan' ? [
    { href: "/dashboard/artisan", icon: BarChart3, label: t("dashboard") },
    { href: "/dashboard/artisan/profile", icon: User, label: t("profile") },
    { href: "/dashboard/artisan/jobs", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/artisan/subscription", icon: CreditCard, label: t("my_subscription") },
    { href: "/dashboard/artisan/complaints", icon: AlertTriangle, label: t("my_complaints") },
  ] : [
    { href: "/dashboard/client", icon: BarChart3, label: t("dashboard") },
    { href: "/dashboard/client/profile", icon: User, label: t("profile") },
    { href: "/dashboard/client/requests", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/client/reviews", icon: Star, label: t("my_reviews") || "Mes avis" },
    { href: "/dashboard/client/complaints", icon: AlertTriangle, label: t("my_complaints") },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-[#0a0f1e] border-r border-slate-100 dark:border-white/5 z-50 transition-all duration-300"
    >
      {/* Header: Logo & Toggle */}
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-black text-2xl text-blue-600 dark:text-blue-500 tracking-tighter"
            >
              DzArtisan
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Availability Toggle - Only if not collapsed or as a tooltip-like dot */}
      <div className={cn("px-6 mb-8 transition-all", collapsed ? "flex justify-center" : "block")}>
         <AvailabilityToggle compact={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}>
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive && "stroke-[2.5]")} />
                
                {!collapsed && (
                  <span className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}

                {/* Active Indicator (Small dot on inner edge) */}
                {isActive && collapsed && (
                   <div className={cn(
                     "absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full",
                     isRTL ? "left-0 rounded-l-full" : "right-0 rounded-r-full"
                   )} />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer: User & Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-2">
         {!collapsed && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
               <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600">
                  {user?.nomComplet?.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.nomComplet}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{user?.type}</p>
               </div>
            </div>
         )}

         <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold gap-4 transition-colors",
              collapsed ? "px-0 justify-center" : "px-4"
            )}
         >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>{t("logout")}</span>}
         </Button>
      </div>
    </motion.aside>
  )
}
