"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, MessageSquare, Loader2, AlertCircle, Calendar, MapPin, User } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"

function ReviewSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-1/2 animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function StarDisplay({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            size,
            "transition-colors",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-200 dark:fill-white/10 dark:text-white/10"
          )}
        />
      ))}
    </div>
  )
}

export default function ClientReviewsPage() {
  const t = useTranslations("interventions")
  const locale = useLocale()

  const [reviews, setReviews] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const fetchReviews = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch interventions that have reviews (terminé status with avis)
      const res = await api.get("/interventions")
      const interventions = res.data?.data || res.data || []
      const withReviews = Array.isArray(interventions) ? interventions.filter(i => i.avis) : []
      setReviews(withReviews)
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de chargement des avis")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          Mes Avis
        </h1>
        {!loading && (
          <p className="text-sm font-bold text-slate-400">
            {reviews.length} avis laissé{reviews.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-500/10 rounded-[24px] text-red-600 border border-red-100 dark:border-red-500/20">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button 
            onClick={fetchReviews} 
            className="ml-auto text-xs font-black uppercase tracking-widest text-red-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <ReviewSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center space-y-6"
        >
          <div className="w-28 h-28 bg-slate-50 dark:bg-white/5 rounded-[40px] flex items-center justify-center text-6xl">
            ⭐
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Aucun avis pour le moment
            </h2>
            <p className="text-sm font-bold text-slate-400 max-w-xs">
              Vos avis apparaîtront ici après avoir évalué un artisan suite à une intervention terminée.
            </p>
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      {!loading && reviews.length > 0 && (
        <AnimatePresence>
          <div className="space-y-4">
            {reviews.map((intervention, i) => (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ReviewCard intervention={intervention} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

function ReviewCard({ intervention }) {
  const { titre, categorie, avis, artisan, wilaya, commune, created_at } = intervention

  const formattedDate = new Date(avis.created_at || created_at).toLocaleDateString("fr-DZ", {
    day: "2-digit", month: "short", year: "numeric"
  })

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-white/5 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 text-lg">
            🔧
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight line-clamp-1">
              {titre}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {categorie && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {categorie.nom}
                </span>
              )}
              {wilaya && commune && (
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {commune.nom}, {wilaya.nom}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </div>
      </div>

      {/* Artisan Info */}
      {artisan?.user && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 font-black text-sm">
            {artisan.user.nomComplet?.[0] ?? "A"}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{artisan.user.nomComplet}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Artisan</p>
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-3 mb-3">
        <StarDisplay rating={avis.note} size="w-5 h-5" />
        <span className="text-sm font-black text-amber-500">{avis.note}/5</span>
      </div>

      {/* Comment */}
      {avis.commentaire && (
        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              &quot;{avis.commentaire}&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
