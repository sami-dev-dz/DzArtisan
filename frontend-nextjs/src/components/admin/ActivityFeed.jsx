"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, ClipboardList, CreditCard, ArrowRight, UserX, MessageSquareWarning } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const EVENT_CONFIG = {
  artisan_submitted: {
    icon: Briefcase,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    dot: "bg-violet-500",
  },
  intervention_created: {
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    dot: "bg-blue-500",
  },
  subscription_renewed: {
    icon: CreditCard,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
  complaint_filed: {
    icon: MessageSquareWarning,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    dot: "bg-amber-500",
  },
  account_suspended: {
    icon: UserX,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-500/10",
    dot: "bg-red-500",
  },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "À l&apos;instant"
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

export function ActivityFeed({ items }) {
  if (!items?.length) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm font-bold">Aucune activité récente.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-xl">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Flux d&apos;activité</p>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Événements récents</h3>
      </div>

      <div className="relative space-y-0 pl-5">
        {/* Vertical line */}
        <div className="absolute left-0 inset-y-0 w-px bg-slate-100 dark:bg-white/5 my-2" />

        {items.map((item, i) => {
          const cfg = EVENT_CONFIG[item.type] ?? EVENT_CONFIG.intervention_created
          const Icon = cfg.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex items-start gap-4 pb-5 group"
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900",
                cfg.dot
              )} />

              {/* Icon */}
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                <Icon className={cn("w-4 h-4", cfg.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">
                  {item.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-400">{timeAgo(item.at)}</span>
                  {item.link && (
                    <Link href={item.link} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                      Voir <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
