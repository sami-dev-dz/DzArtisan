"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Check, ChevronRight, AlertCircle, Sparkles } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function ProfileCompletenessWidget({ percentage = 0, items = [] }) {
  const t = useTranslations("dashboard");
  
  // If no items passed, we show them based on percentage or default list
  // Usually items are passed from the parent which knows which ones are missing
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-blue-600/5 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 relative">
           <Target className="w-8 h-8" />
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="absolute -top-1 -right-1 bg-blue-600 text-white p-1 rounded-lg shadow-lg border-2 border-white dark:border-slate-900"
           >
              <Sparkles className="w-3 h-3" />
           </motion.div>
        </div>
        
        <div className="flex-1">
           <div className="flex justify-between items-end mb-2">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Profil</h4>
              <span className="text-2xl font-black text-blue-600">{percentage}%</span>
           </div>
           {/* Mini Progress Bar */}
           <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
              />
           </div>
        </div>
      </div>

      <div className="space-y-3">
         <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Actions suggérées</p>
         
         <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              items.map((item, idx) => (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ delay: idx * 0.05 }}
                 >
                    <Link href={item.link || "/dashboard/profile"}>
                       <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 hover:bg-blue-600 border border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                <item.icon className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                       </div>
                    </Link>
                 </motion.div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tout est parfait !</span>
              </div>
            )}
         </AnimatePresence>
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-blue-50 dark:bg-blue-600/5 border border-blue-100 dark:border-blue-600/20 flex gap-3">
         <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
         <p className="text-[11px] text-blue-700 dark:text-slate-400 font-bold leading-relaxed">
            Un profil complet à 100% est <span className="text-blue-600 dark:text-blue-400">mieux classé</span> dans les résultats de recherche.
         </p>
      </div>
    </motion.div>
  )
}
