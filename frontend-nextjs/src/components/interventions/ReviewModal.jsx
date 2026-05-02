"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, Loader2, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

export function ReviewModal({ intervention, onClose, onSuccess }) {
  const t = useTranslations("interventions.review_modal")
  const [rating, setRating] = React.useState(0)
  const [hovered, setHovered] = React.useState(0)
  const [comment, setComment] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleSubmit = async () => {
    if (!rating) return
    setLoading(true)
    setError(null)
    try {
      await api.post(`/interventions/${intervention.id}/avis`, { note: rating, commentaire: comment })
      setSubmitted(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1800)
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 space-y-6 border border-slate-100 dark:border-white/5"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <CheckCircle className="w-20 h-20 text-emerald-500" />
              </motion.div>
              <p className="text-xl font-black text-slate-900 dark:text-white">{t("success")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {t("title")}
                </h2>
                <p className="text-xs font-bold text-slate-400">{t("subtitle")}</p>
              </div>

              {/* Artisan snippet */}
              {intervention?.artisan?.user && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-[24px]">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 font-black text-sm uppercase">
                    {intervention.artisan.user.nomComplet?.[0] ?? "A"}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{intervention.artisan.user.nomComplet}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{intervention.categorie?.nom}</p>
                  </div>
                </div>
              )}

              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {t("rating_label")}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 active:scale-110"
                    >
                      <Star
                        className={cn(
                          "w-10 h-10 transition-colors",
                          (hovered || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-200 dark:fill-white/10 dark:text-white/10"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {t("comment_label")}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("comment_placeholder")}
                  maxLength={500}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 rounded-[20px] px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 resize-none outline-none transition-colors"
                />
                <p className="text-right text-[10px] font-bold text-slate-400">{comment.length}/500</p>
              </div>

              {error && (
                <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-2xl">
                  {error}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!rating || loading}
                className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest gap-2 shadow-xl disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t("submit_btn")}
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
