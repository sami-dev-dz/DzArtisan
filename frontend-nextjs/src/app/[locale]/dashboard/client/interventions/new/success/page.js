"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, List, Home } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function InterventionSuccessPage() {
  const t = useTranslations("wizard.success")
  const locale = useLocale()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Checkmark Circle */}
        <div className="relative flex justify-center">
           <motion.div 
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ type: "spring", stiffness: 260, damping: 20 }}
             className="w-32 h-32 rounded-[48px] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40"
           >
              <Check className="w-16 h-16 stroke-[4]" />
           </motion.div>
           
           {/* Decorative Rings */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: [0.1, 0], scale: [1, 1.5] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-[48px] border-4 border-emerald-500 z-[-1]"
           />
        </div>

        <div className="space-y-4">
           <motion.h1 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter"
           >
              {t("title")}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-slate-500 font-medium text-lg leading-relaxed px-4"
           >
              {t("message")}
           </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 dark:bg-blue-600/10 p-6 rounded-[32px] border border-blue-100 dark:border-white/5 space-y-3"
        >
           <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" /> Et ensuite ?
           </p>
           <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("explanation")}
           </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 gap-3 pt-6"
        >
           <Link href={`/${locale}/dashboard/client/interventions`}>
              <Button className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest gap-2 shadow-xl">
                 <List className="w-4 h-4" /> {t("view_requests")}
              </Button>
           </Link>
           <Link href={`/${locale}`}>
              <Button variant="ghost" className="w-full h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest gap-2">
                 <Home className="w-4 h-4" /> {t("back_home")}
              </Button>
           </Link>
        </motion.div>

      </div>
    </div>
  )
}
