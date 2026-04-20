"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { 
  CreditCard, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SubscriptionStats({ stats }) {
  const t = useTranslations("admin.subscription_management.stats")

  const items = [
    {
      label: t("active"),
      value: stats?.active || 0,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
      trend: "+12%"
    },
    {
      label: t("pending"),
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
      trend: "5 waiting"
    },
    {
      label: t("expiring"),
      value: stats?.expiring || 0,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
      trend: "Action req."
    },
    {
      label: t("expired"),
      value: stats?.expired || 0,
      icon: Users,
      color: "text-slate-600 bg-slate-50 dark:bg-slate-500/10",
      trend: "-2%"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-xl", item.color)}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {item.trend}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold dark:text-white tracking-tight">
              {item.value}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {item.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
