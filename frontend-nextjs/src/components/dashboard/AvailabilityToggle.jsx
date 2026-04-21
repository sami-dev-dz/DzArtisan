"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Power, Check, X, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToastStore } from "@/store/toastStore"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"

export function AvailabilityToggle({ compact = false }) {
  const t = useTranslations("onboarding")
  const common = useTranslations("common")
  const { user, setUser } = useAuth()
  const { addToast } = useToastStore()
  const [loading, setLoading] = React.useState(false)

  const isAvailable = user?.artisan?.disponibilite === "disponible"

  const handleToggle = async () => {
    setLoading(true)
    try {
      const { data } = await api.post("/profile/toggle-availability")
      
      // Update local user state properly reading data.data.status
      setUser(prev => ({
        ...prev,
        artisan: {
          ...prev?.artisan,
          disponibilite: data.data?.status || (prev?.artisan?.disponibilite === "disponible" ? "indisponible" : "disponible")
        }
      }))

      addToast({
        title: data.message || "Mis à jour",
        type: "success"
      })
    } catch (err) {
      const msg = err.response?.data?.message || err.message || common("error");
      addToast({
        title: msg,
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all relative border-2 border-slate-100 dark:border-white/5",
          isAvailable ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400"
        )}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <div className="relative">
            <Power className="w-5 h-5" />
            <div className={cn(
              "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900",
              isAvailable ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-slate-300"
            )} />
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
          {t("availability_title")}
        </label>
        <span className={cn(
          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
          isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
        )}>
          {isAvailable ? "On" : "Off"}
        </span>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "h-[54px] w-full rounded-2xl border-2 flex items-center px-4 gap-3 transition-all duration-300 group overflow-hidden relative",
          isAvailable 
            ? "bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-600/10" 
            : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-500"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
          isAvailable ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800"
        )}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
             <Power className="w-4 h-4 stroke-3" />
          )}
        </div>
        
        <span className={cn(
          "font-black text-xs uppercase tracking-wider flex-1 text-left rtl:text-right",
          isAvailable ? "text-white" : "text-slate-600 dark:text-slate-400"
        )}>
          {isAvailable ? "Disponible" : "Indisponible"}
        </span>

        {isAvailable && (
           <motion.div 
             layoutId="check"
             className="w-5 h-5 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg"
           >
              <Check className="w-3.5 h-3.5 stroke-4" />
           </motion.div>
        )}
      </button>
    </div>
  )
}
