"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, User, MapPin, Calendar, Clock, Tag, 
  Image as ImageIcon, ZoomIn, ShieldCheck, 
  ExternalLink, Info, AlertCircle, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import Image from "next/image"

const STATUS_CONFIG = {
  ouvert:    { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",   dot: "bg-amber-500", label: "En attente" },
  en_cours:  { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",       dot: "bg-blue-500", label: "En cours" },
  termine:   { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500", label: "Terminée" },
  annule:    { color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500", label: "Annulée" },
}

export function InterventionDetailDrawer({ isOpen, onClose, intervention }) {
  const t = useTranslations("admin.interventions_management")
  if (!intervention) return null

  const STATUS_LABELS = {
    ouvert: t("tabs.pending"),
    en_cours: t("tabs.active"),
    termine: t("tabs.completed"),
    annule: t("tabs.canceled"),
  }

  const cfg = STATUS_CONFIG[intervention.statut] || STATUS_CONFIG.ouvert

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-101 w-full max-w-2xl bg-white dark:bg-[#0A0A0A] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {t("details.title")}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="h-5 text-[10px] uppercase font-black border-slate-200 dark:border-white/10">
                       #{intervention.id}
                    </Badge>
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest", cfg.color)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                      {STATUS_LABELS[intervention.statut] || cfg.label}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              {/* Mission Summary */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600">
                    <Tag size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">{t("details.general_info")}</h3>
                </div>
                <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-[#141414] p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                  <InfoItem label={t("table.info")} value={intervention.titre} fullWidth />
                  <InfoItem label={t("table.info")} value={intervention.categorie?.nom} />
                  <InfoItem label="Posté le" value={new Date(intervention.created_at).toLocaleDateString()} />
                  <InfoItem label="Description" value={intervention.description} fullWidth />
                </div>
              </section>

              {/* Stakeholders */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                    <User size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">Parties impliquées</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Client */}
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/50 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-slate-600">
                      {intervention.client?.user?.nomComplet ? String(intervention.client.user.nomComplet).charAt(0) : 'C'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Client</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{intervention.client?.user?.nomComplet || "Client inconnu"}</p>
                    </div>
                  </div>
                  {/* Artisan */}
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/50 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center font-black text-emerald-600">
                      {intervention.artisan?.user?.nomComplet ? String(intervention.artisan.user.nomComplet).charAt(0) : <AlertCircle size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Artisan</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {intervention.artisan?.user?.nomComplet || "Non attribué"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-500/10 text-pink-600">
                    <MapPin size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">Localisation</h3>
                </div>
                <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-[#141414] p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                  <InfoItem label="Wilaya" value={intervention.wilaya?.nom} />
                  <InfoItem label="Commune" value={intervention.commune?.nom} />
                  <InfoItem label="Adresse précise" value={intervention.adresse || "Non fournie"} fullWidth />
                </div>
              </section>

              {/* Photos Grid */}
              {intervention.photos && intervention.photos.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                      <ImageIcon size={18} />
                    </div>
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">Gallerie Photos ({intervention.photos.length})</h3>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {intervention.photos.map((photo, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 relative group cursor-pointer">
                        <Image src={photo.url} alt="Photo intervention" fill unoptimized className="object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414]">
                <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200 dark:border-white/10 font-bold" onClick={onClose}>
                  Fermer
                </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function InfoItem({ label, value, fullWidth = false }) {
  return (
    <div className={cn("space-y-1.5", fullWidth ? "col-span-2" : "col-span-1")}>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <div className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
        {value || "—"}
      </div>
    </div>
  )
}
