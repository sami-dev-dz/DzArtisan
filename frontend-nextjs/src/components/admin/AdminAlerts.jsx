"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Briefcase, CreditCard, ArrowRight, MessageSquareWarning } from "lucide-react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

export function AdminAlerts({ alerts }) {
  const locale = useLocale()

  const items = [
    {
      key: "pending_artisans",
      count: alerts?.pending_artisans ?? 0,
      label: "Artisans en attente de validation",
      link: `/${locale}/dashboard/admin/artisans?filter=pending`,
      icon: Briefcase,
      color: "amber",
    },
    {
      key: "unread_complaints",
      count: alerts?.unread_complaints ?? 0,
      label: "Nouvelles plaintes non lues",
      link: `/${locale}/dashboard/admin/complaints?filter=unread`,
      icon: MessageSquareWarning,
      color: "red",
    },
    {
      key: "expiring_subs",
      count: alerts?.expiring_subs ?? 0,
      label: "Abonnements expirant dans 7 jours",
      link: `/${locale}/dashboard/admin/subscriptions?filter=expiring`,
      icon: CreditCard,
      color: "red",
    },
  ].filter((item) => item.count > 0)

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 p-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 text-lg">
          ✓
        </div>
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
          Aucun élément nécessitant une attention immédiate. Tout est en ordre.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-500 flex items-center gap-2 px-1">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        Attention requise
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={item.link}>
              <div className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border transition-all hover:translate-y-[-2px] shadow-sm hover:shadow-md",
                item.color === "amber"
                  ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/40"
                  : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/40"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  item.color === "amber"
                    ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600"
                    : "bg-red-100 dark:bg-red-500/20 text-red-600"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-2xl font-bold leading-none tracking-tight",
                    item.color === "amber" ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400"
                  )}>
                    {item.count}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {item.label}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
