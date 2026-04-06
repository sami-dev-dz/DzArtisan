"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Eye, PhoneCall, Star, MessagesSquare, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const Icons = {
  Eye,
  PhoneCall,
  Star,
  MessagesSquare
}

export function StatCard({ label, value, icon, trend, index }) {
  const Icon = Icons[icon] || Eye
  const isPositive = trend?.startsWith('+')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[100px] h-[100px] bg-blue-600/5 group-hover:bg-blue-600/10 rounded-full blur-[40px] transition-colors" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
           <Icon className="w-6 h-6 stroke-[2.5]" />
        </div>
        
        {trend && (
           <div className={cn(
              "flex items-center gap-0.5 text-[10px] font-black uppercase px-2 py-1 rounded-lg",
              isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-red-500 bg-red-50 dark:bg-red-500/10"
           )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
           </div>
        )}
      </div>

      <div className="space-y-1 relative z-10">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
         <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
      </div>
    </motion.div>
  )
}
