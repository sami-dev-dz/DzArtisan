"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { 
  MapPin, Calendar, Clock, Tag, ChevronDown, ChevronUp,
  Image as ImageIcon, Loader2, X, ZoomIn
} from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Skeleton } from "@/components/ui/Skeleton"

// Lazy-load map to avoid SSR and 3G overhead
const MiniMap = dynamic(() => import("./MiniMap").then(m => m.MiniMap), {
  ssr: false,
  loading: () => <div className="h-48 rounded-[24px] overflow-hidden"><Skeleton className="w-full h-full" /></div>
})

const STATUS_CONFIG = {
  ouvert:    { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",   dot: "bg-amber-500" },
  en_cours:  { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",       dot: "bg-blue-500" },
  termine:   { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  annule:    { color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500" },
}

export function InterventionCard({ intervention, onReview, onCancel }) {
  const t = useTranslations("interventions")
  const [expanded, setExpanded] = React.useState(false)
  const [lightbox, setLightbox] = React.useState(null)

  const { titre, categorie, wilaya, commune, statut, created_at, date_souhaitee, description, photos, artisan, avis } = intervention
  const cfg = STATUS_CONFIG[statut] ?? STATUS_CONFIG.ouvert
  const canCancel = statut === "ouvert"
  const canReview = statut === "termine" && !avis
  const statusLabel = t(`status.${statut}`)

  const formattedCreated = new Date(created_at).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" })
  const formattedPreferred = date_souhaitee
    ? new Date(date_souhaitee).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" })
    : null

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-300 flex items-center justify-center bg-black/90 p-4"
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white">
              <X className="w-8 h-8" />
            </button>
            <Image src={lightbox} alt="Photo" unoptimized width={0} height={0} style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '90vh' }} className="rounded-2xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
      >
        {/* Card Header */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full text-left p-6 flex items-start gap-4"
        >
          {/* Category Icon placeholder */}
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 text-xl">
            🔧
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight truncate pr-2">
                {titre}
              </h3>
              {/* Status Badge */}
              <span className={cn("shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", cfg.color)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                {statusLabel}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {categorie && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {categorie.nom}
                </span>
              )}
              {wilaya && commune && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {commune.nom}, {wilaya.nom}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formattedCreated}
              </span>
              {formattedPreferred && (
                <span className="flex items-center gap-1 text-blue-500">
                  <Calendar className="w-3 h-3" /> {formattedPreferred}
                </span>
              )}
            </div>

            {/* Artisan Pill */}
            <div className="flex items-center gap-2">
              {artisan?.user ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {artisan.user.nomComplet}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">{t("history.no_artisan")}</span>
              )}
            </div>
          </div>

          {/* Chevron */}
          <div className="shrink-0 mt-1 text-slate-300 dark:text-white/20">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6 border-t border-slate-100 dark:border-white/5 pt-6">

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("history.description")}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{description}</p>
                </div>

                {/* Photos Grid */}
                {photos && photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <ImageIcon className="inline w-3 h-3 mr-1" />
                      {t("history.photos")}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {photos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setLightbox(photo.url)}
                          className="relative aspect-square rounded-[16px] overflow-hidden group bg-slate-100 dark:bg-white/5"
                        >
                          <Image
                            src={photo.url}
                            alt={`Photo ${i + 1}`}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map */}
                {intervention.latitude && intervention.longitude && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {t("history.map")}
                    </p>
                    <MiniMap lat={parseFloat(intervention.latitude)} lng={parseFloat(intervention.longitude)} />
                  </div>
                )}

                {/* Status Timeline */}
                <StatusTimeline statut={statut} />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {canReview && (
                    <button
                      onClick={() => onReview?.(intervention)}
                      className="flex-1 min-w-[140px] h-11 rounded-2xl bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-colors"
                    >
                      ⭐ {t("history.review_btn")}
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => onCancel?.(intervention)}
                      className="flex-1 min-w-[140px] h-11 rounded-2xl border-2 border-red-200 dark:border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      {t("history.cancel_btn")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

function StatusTimeline({ statut }) {
  const steps = [
    { key: "ouvert",   label: "Publiée",   done: true },
    { key: "en_cours", label: "En contact", done: statut === "en_cours" || statut === "termine" },
    { key: "termine",  label: "Terminée",   done: statut === "termine" },
  ]
  if (statut === "annule") return null
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all",
              step.done
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-400"
            )}>
              {step.done ? "✓" : i + 1}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-wider",
              step.done ? "text-emerald-600" : "text-slate-400"
            )}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mb-4",
              steps[i+1].done ? "bg-emerald-400" : "bg-slate-100 dark:bg-white/5"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
