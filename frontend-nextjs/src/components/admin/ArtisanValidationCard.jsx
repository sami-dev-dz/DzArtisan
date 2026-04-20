"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle, XCircle, MapPin, Tag, Calendar,
  ExternalLink, FileText, User, ZoomIn, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export function ArtisanValidationCard({ artisan, onAction }) {
  const [expanded, setExpanded] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleAction = async (action, reason = "") => {
    setLoading(true)
    try {
      await onAction(artisan.id, action, reason)
    } finally {
      setLoading(false)
    }
  }

  const { user, primary_categorie, primary_wilaya, anneesExp, description, diploma_url, artisan_card_url } = artisan

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0 uppercase">
              {user?.nomComplet?.charAt(0)}
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {user?.nomComplet}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {primary_categorie?.nom}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {primary_wilaya?.nom}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {anneesExp} ans exp.</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 px-4 rounded-xl h-11"
            >
              {expanded ? "Masquer" : "Examiner"}
            </Button>
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-white/5 space-y-8">

                {/* Bio Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <User className="w-3 h-3" /> Description du profil
                  </h4>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl bg-slate-50 dark:bg-white/5 p-4 rounded-2xl italic">
                    &quot;{description || "Aucune description fournie."}&quot;
                  </p>
                </div>

                {/* Documents Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Diploma */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Diplôme / Certification
                    </h4>
                    {diploma_url ? (
                      <a
                        href={diploma_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                      >
                        <img src={diploma_url} alt="Diplôme" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase">
                            <ZoomIn className="w-3.5 h-3.5" /> Agrandir
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-4/3 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 text-xs font-bold">
                        Aucun diplôme fourni
                      </div>
                    )}
                  </div>

                  {/* Artisan Card */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Carte d&apos;artisan
                    </h4>
                    {artisan_card_url ? (
                      <a
                        href={artisan_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                      >
                        <img src={artisan_card_url} alt="Carte Artisan" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase">
                            <ZoomIn className="w-3.5 h-3.5" /> Agrandir
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-4/3 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 text-xs font-bold">
                        Aucune carte fournie
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Decision Buttons */}
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-4">
                  <Button
                    onClick={() => handleAction("valide")}
                    disabled={loading}
                    className="flex-1 min-w-[160px] h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-emerald-500/20"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approuver l&apos;artisan
                  </Button>
                  <Button
                    onClick={() => handleAction("rejete")}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 min-w-[160px] h-14 rounded-2xl border-2 border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-black text-xs uppercase tracking-widest gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Rejeter le dossier
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
