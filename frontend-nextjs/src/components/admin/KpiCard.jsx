"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const COLOR_CONFIG = {
  blue:    { bg: "bg-blue-50 dark:bg-blue-500/10",   icon: "text-blue-600",   glow: "shadow-blue-500/10" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: "text-emerald-600", glow: "shadow-emerald-500/10" },
  violet:  { bg: "bg-violet-50 dark:bg-violet-500/10",  icon: "text-violet-600",  glow: "shadow-violet-500/10" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-500/10",   icon: "text-amber-600",   glow: "shadow-amber-500/10" },
}

export function KpiCard({ label, value, trend, icon: Icon, color = "blue", delay = 0 }) {
  const cfg = COLOR_CONFIG[color] ?? COLOR_CONFIG.blue
  const trendNum = parseFloat(trend)
  const isPositive = trendNum > 0
  const isNeutral = trendNum === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "bg-white dark:bg-[#0A0A0A] rounded-xl p-6 border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md",
        cfg.glow
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cfg.bg)}>
          {Icon && <Icon className={cn("w-5 h-5", cfg.icon)} />}
        </div>

        {/* Trend badge */}
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
          isNeutral
            ? "bg-slate-100 dark:bg-white/5 text-slate-500"
            : isPositive
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
            : "bg-red-50 dark:bg-red-500/10 text-red-600"
        )}>
          {isNeutral
            ? <Minus className="w-3 h-3" />
            : isPositive
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />
          }
          {isNeutral ? "─" : `${isPositive ? "+" : ""}${trendNum}%`}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  )
}
