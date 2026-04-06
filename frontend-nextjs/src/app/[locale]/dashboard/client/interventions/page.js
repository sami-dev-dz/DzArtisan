"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, FileQuestion, Loader2, AlertCircle } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { InterventionCard } from "@/components/interventions/InterventionCard"
import { ReviewModal } from "@/components/interventions/ReviewModal"
import api from "@/lib/api-client"

// Loading skeleton for a card
function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-1/2 animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-1/3 animate-pulse" />
        </div>
        <div className="w-20 h-6 rounded-full bg-slate-100 dark:bg-white/5 animate-pulse shrink-0" />
      </div>
    </div>
  )
}

export default function ClientInterventionsPage() {
  const t = useTranslations("interventions")
  const locale = useLocale()

  const [interventions, setInterventions] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [reviewTarget, setReviewTarget] = React.useState(null) // intervention to review
  const [cancellingId, setCancellingId] = React.useState(null)

  const fetchInterventions = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get("/interventions")
      setInterventions(res.data)
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchInterventions()
  }, [fetchInterventions])

  const handleCancel = async (intervention) => {
    if (!confirm(`Annuler la demande "${intervention.titre}" ?`)) return
    setCancellingId(intervention.id)
    try {
      await api.post(`/interventions/${intervention.id}/cancel`)
      // Optimistic update
      setInterventions(prev =>
        prev.map(i => i.id === intervention.id ? { ...i, statut: "annule" } : i)
      )
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation")
    } finally {
      setCancellingId(null)
    }
  }

  const handleReviewSuccess = () => {
    // Refresh to reflect new avis state so button disappears
    fetchInterventions()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {t("history.title")}
          </h1>
          {!loading && (
            <p className="text-xs font-bold text-slate-400 mt-1">
              {interventions.length} demande{interventions.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link href={`/${locale}/dashboard/client/interventions/new`}>
          <Button className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-blue-600/20 px-6">
            <Plus className="w-4 h-4" />
            {t("history.new_request")}
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-500/10 rounded-[24px] text-red-600 border border-red-100 dark:border-red-500/20">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <Button variant="ghost" onClick={fetchInterventions} className="ml-auto text-xs font-black uppercase tracking-widest">
            Réessayer
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && interventions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center space-y-6"
        >
          <div className="w-28 h-28 bg-slate-50 dark:bg-white/5 rounded-[40px] flex items-center justify-center text-slate-300 dark:text-white/10 text-6xl">
            🔧
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {t("history.empty_title")}
            </h2>
            <p className="text-sm font-bold text-slate-400 max-w-xs">
              {t("history.empty_desc")}
            </p>
          </div>
          <Link href={`/${locale}/dashboard/client/interventions/new`}>
            <Button className="h-14 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest gap-2 px-8 shadow-xl shadow-blue-600/20">
              <Plus className="w-4 h-4" />
              {t("history.empty_btn")}
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Interventions List */}
      {!loading && interventions.length > 0 && (
        <AnimatePresence>
          <div className="space-y-4">
            {interventions.map((intervention, i) => (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <InterventionCard
                  intervention={intervention}
                  onReview={setReviewTarget}
                  onCancel={handleCancel}
                  isCancelling={cancellingId === intervention.id}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {reviewTarget && (
          <ReviewModal
            intervention={reviewTarget}
            onClose={() => setReviewTarget(null)}
            onSuccess={handleReviewSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
