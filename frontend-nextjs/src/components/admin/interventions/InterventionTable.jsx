"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ExternalLink,
  ChevronRight,
  User,
  Tool,
  AlertCircle
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/Badge"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

const STATUS_CONFIG = {
  ouvert:    { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",   dot: "bg-amber-500", label: "En attente" },
  en_cours:  { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",       dot: "bg-blue-500", label: "En cours" },
  termine:   { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500", label: "Terminée" },
  annule:    { color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500", label: "Annulée" },
}

export function InterventionTable({ interventions = [], onViewDetails }) {
  const t = useTranslations("admin.interventions_management")
  const commonT = useTranslations("common")

  if (interventions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-white/2">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-4">
          <AlertCircle size={32} />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Aucune donnée trouvée</p>
      </div>
    )
  }

  const STATUS_LABELS = {
    ouvert: t("tabs.pending"),
    en_cours: t("tabs.active"),
    termine: t("tabs.completed"),
    annule: t("tabs.canceled"),
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left rtl:text-right border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-slate-200 dark:border-white/10">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.info")}</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.client")}</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.artisan")}</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.location")}</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{t("table.status")}</th>
            <th className="px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {interventions.map((item) => {
            const cfg = STATUS_CONFIG[item.statut] || STATUS_CONFIG.ouvert
            return (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onViewDetails?.(item)}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {/* Intervention Info */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.titre}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">#{item.id}</span>
                      <span className="flex items-center gap-1"><Tag size={12} /> {item.categorie?.nom}</span>
                    </div>
                  </div>
                </td>

                {/* Client Info */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={item.client?.user?.photo} 
                      className="w-8 h-8 rounded-lg" 
                      initials={item.client?.user?.nomComplet ? String(item.client.user.nomComplet).charAt(0) : 'C'} 
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {item.client?.user?.nomComplet || "Client inconnu"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Bénéficiaire</span>
                    </div>
                  </div>
                </td>

                {/* Artisan Info */}
                <td className="px-6 py-5">
                  {item.artisan ? (
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={item.artisan?.user?.photo} 
                        className="w-8 h-8 rounded-lg" 
                        initials={item.artisan?.user?.nomComplet ? String(item.artisan.user.nomComplet).charAt(0) : 'A'} 
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {item.artisan?.user?.nomComplet}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Attribué</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                         <User size={14} />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-wider italic">Non attribué</span>
                    </div>
                  )}
                </td>

                {/* Location */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <MapPin size={12} className="text-blue-500" />
                      {item.commune?.nom}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-4">
                      {item.wilaya?.nom}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-5 text-center">
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", cfg.color)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                    {STATUS_LABELS[item.statut] || cfg.label}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetails?.(item)
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 hover:shadow-lg transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
