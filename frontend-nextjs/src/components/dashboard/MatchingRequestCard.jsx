"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { MapPin, Calendar, ClipboardCheck, ArrowRight, Star, Clock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function MatchingRequestCard({ request, index }) {
  const t = useTranslations("onboarding")
  const common = useTranslations("common")

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 p-6 rounded-[32px] hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 relative overflow-hidden backdrop-blur-md"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-600/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-blue-600/20 transition-all duration-500" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 flex items-center justify-center p-2.5 shadow-inner">
              <ClipboardCheck className="w-full h-full" />
           </div>
           <div>
              <h5 className="font-black text-slate-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {request.titre || "Demande d'intervention"}
              </h5>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
                 {request.categorie?.nom || "Bricolage"}
              </p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
           <Clock className="w-3.5 h-3.5 text-blue-500" />
           <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {new Date(request.created_at).toLocaleDateString()}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
               <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
               {request.wilaya?.nom || "Alger"}
            </span>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
               <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
               Urgent
            </span>
         </div>
      </div>

      <Link href={`/dashboard/interventions/${request.id}`}>
         <button className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-slate-900/10 active:scale-95">
            Voir les détails
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </button>
      </Link>
    </motion.div>
  )
}
