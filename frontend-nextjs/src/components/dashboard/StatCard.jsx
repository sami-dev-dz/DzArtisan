"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Eye, PhoneCall, Star, MessagesSquare, 
  ArrowUpRight, ArrowDownRight, Zap, 
  Send, ShieldCheck, ClipboardList, 
  CheckCircle, Wallet, Radar 
} from "lucide-react"
import { cn } from "@/lib/utils"

const Icons = {
  Eye, PhoneCall, Star, MessagesSquare, 
  Zap, Send, ShieldCheck, ClipboardList, 
  CheckCircle, Wallet, Radar
}

export function StatCard({ label, value, icon, trend, index }) {
  const Icon = Icons[icon] || Eye
  const isPositive = trend?.startsWith('+')
  
  // Custom color palettes based on index for a premium enterprise look
  const palettes = [
    "from-blue-500/20 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/0 text-blue-600 dark:text-blue-400 group-hover:from-blue-600 group-hover:to-blue-500",
    "from-emerald-500/20 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/0 text-emerald-600 dark:text-emerald-400 group-hover:from-emerald-600 group-hover:to-emerald-500",
    "from-violet-500/20 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/0 text-violet-600 dark:text-violet-400 group-hover:from-violet-600 group-hover:to-violet-500",
    "from-amber-500/20 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/0 text-amber-600 dark:text-amber-400 group-hover:from-amber-500 group-hover:to-orange-500"
  ]
  const currentPalette = palettes[index % palettes.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }}
      className="relative overflow-hidden group bg-white dark:bg-[#0c0c0e] rounded-[32px] p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 border border-slate-200/60 dark:border-white/5"
    >
      {/* Background glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-current rounded-full blur-[50px] opacity-10 dark:opacity-[0.03] transition-all duration-500 group-hover:scale-150 rotate-12" />
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm bg-linear-to-br",
          currentPalette, "group-hover:text-white group-hover:shadow-lg group-hover:scale-110"
        )}>
           <Icon className="w-6 h-6 stroke-2" />
        </div>
        
        {trend && (
           <div className={cn(
              "flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl backdrop-blur-sm",
              isPositive 
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                : "text-slate-500 bg-slate-50 border border-slate-200/50 dark:text-slate-400 dark:bg-white/5 dark:border-white/10"
           )}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : null}
              {trend}
           </div>
        )}
      </div>

      <div className="space-y-1.5 relative z-10 mt-2">
         <h4 className="text-4xl lg:text-[40px] font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1">
           {value}
         </h4>
         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      
      {/* Subtle border bottom gradient on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-blue-500 via-indigo-500 to-purple-500" />
    </motion.div>
  )
}
