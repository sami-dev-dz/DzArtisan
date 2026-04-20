"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Calendar, CreditCard, ChevronRight, Zap } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function SubscriptionBanner({ data = {} }) {
  const t = useTranslations("pricing")
  const { status = 'none', days_left = 0, date_fin, plan } = data

  const config = {
    active: {
      color: "bg-emerald-600 border-emerald-500 shadow-emerald-600/10",
      icon: CheckCircle2,
      title: "Abonnement Actif",
      desc: `Il vous reste ${days_left} jours d'abonnement ${plan || ''}.`,
      btn: null
    },
    warning: {
      color: "bg-orange-600 border-orange-500 shadow-orange-600/10",
      icon: AlertCircle,
      title: "Expiration Proche",
      desc: `Votre abonnement expire dans ${days_left} jours. Renouvelez-le pour garder votre visibilité.`,
      btn: "Renouveler"
    },
    expired: {
      color: "bg-red-600 border-red-500 shadow-red-600/20",
      icon: XCircle,
      title: "Abonnement Expiré",
      desc: "Votre profil n'est plus visible aux nouveaux clients. Renouvelez votre abonnement !",
      btn: "Réactiver"
    }
  }

  const current = config[status] || config.expired

  // Don't show banner for no subscription or free plan (handled by free plan banner in parent)
  if (!status || status === 'none' || plan === 'gratuit') return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-3xl p-6 border-b-4 flex flex-col md:flex-row items-center gap-6 overflow-hidden mb-10 group",
        current.color
      )}
    >
      {/* Background Animated Gradient */}
      <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
      
      <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xl border border-white/20 shadow-xl">
         <current.icon className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div className="flex-1 text-center md:text-left rtl:md:text-right relative z-10">
         <h3 className="text-xl font-black text-white mb-1 uppercase tracking-wider">{current.title}</h3>
         <p className="text-white/90 text-sm font-bold flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-4 h-4 opacity-50" />
            {current.desc}
         </p>
      </div>

      {current.btn && (
         <Link href="/dashboard/artisan/subscription" className="relative z-10 w-full md:w-auto">
            <button className="w-full h-14 px-8 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
               <Zap className="w-4 h-4 fill-amber-400 stroke-amber-500" />
               {current.btn}
               <ChevronRight className="w-4 h-4 ml-1" />
            </button>
         </Link>
      )}
    </motion.div>
  )
}

function XCircle({ className }) {
   return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
}
