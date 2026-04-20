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
    { href: "/dashboard/client/requests", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/client/reviews", icon: Star, label: t("my_reviews") || "Mes avis" },
    { href: "/dashboard/client/complaints", icon: AlertTriangle, label: t("my_complaints") },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 bg-white dark:bg-[#0a0f1e] border-r border-slate-100 dark:border-white/5 z-50 transition-all duration-300"
    >
      {/* Header: Toggle Only (Since primary Navbar has the logo) */}
      <div className={cn("p-4 flex items-center", collapsed ? "justify-center" : "justify-end")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-all hover:scale-105 active:scale-95"
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Availability Toggle - Only for artisans */}
      {user?.type === 'artisan' && (
        <div className={cn("px-4 mb-6 transition-all", collapsed ? "flex justify-center" : "block")}>
           <AvailabilityToggle compact={collapsed} />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{ outline: 'none' }}>
              <div className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/25 ring-1 ring-blue-500/50" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-white"
              )}>
                <item.icon className={cn("w-[22px] h-[22px] shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "stroke-[2.5]" : "stroke-[2]")} />
                
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
      <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-2 bg-slate-50/50 dark:bg-[#0a0f1e]/80">
         {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-black text-white shadow-inner">
                  {user?.nomComplet?.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user?.nomComplet}</p>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest truncate">{user?.type}</p>
               </div>
            </div>
         )}

         <Button
            variant="ghost"
            onClick={logout}
            className={cn(
               "w-full justify-start rounded-2xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 font-bold gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]",
               collapsed ? "px-0 justify-center h-12 w-12 mx-auto" : "px-4 h-11"
            )}
         >
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && <span>{t("logout")}</span>}
         </Button>
      </div>
    </motion.aside>
  )
}
