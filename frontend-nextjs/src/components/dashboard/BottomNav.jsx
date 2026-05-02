"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  BarChart3, 
  ClipboardList, 
  CreditCard, 
  AlertTriangle,
  Star,
  Calendar
} from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = user?.type === 'artisan' ? [
    { href: "/dashboard/artisan", icon: BarChart3, label: t("dashboard") },
    { href: "/dashboard/artisan/calendar", icon: Calendar, label: "Planning" },
    { href: "/dashboard/artisan/jobs", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/artisan/subscription", icon: CreditCard, label: t("subscription") },
    { href: "/dashboard/artisan/complaints", icon: AlertTriangle, label: t("my_complaints") },
  ] : [
    { href: "/dashboard/client", icon: BarChart3, label: t("dashboard") },
    { href: "/dashboard/client/requests", icon: ClipboardList, label: t("my_requests") },
    { href: "/dashboard/client/reviews", icon: Star, label: t("my_reviews") || "Avis" },
    { href: "/dashboard/client/complaints", icon: AlertTriangle, label: t("my_complaints") },
  ]

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-2xl border border-slate-100 dark:border-white/5 rounded-[32px] shadow-2xl p-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className={cn(
                "flex flex-col items-center justify-center py-2 rounded-2xl transition-all gap-1",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}>
                <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-tighter",
                  isActive ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  {item.label?.split(" ").pop()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
