"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AlertTriangle, Plus, Loader2, AlertCircle, Clock, CheckCircle2, 
  XCircle, MessageSquare, Send, ChevronDown, ChevronUp, Calendar 
} from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

const STATUS_CONFIG = {
  ouverte:  { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400", dot: "bg-amber-500", label: "Ouverte" },
  en_cours: { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400", dot: "bg-blue-500", label: "En cours" },
  resolue:  { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500", label: "Résolue" },
  fermee:   { color: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400", dot: "bg-slate-500", label: "Fermée" },
}

function ComplaintSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function ClientComplaintsPage() {
  const locale = useLocale()
  const { user } = useAuth()

  const [complaints, setComplaints] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [showForm, setShowForm] = React.useState(false)

  const fetchComplaints = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch interventions to find ones we can complain about
      const res = await api.get("/interventions")
      const interventions = res.data?.data || res.data || []
      setComplaints(Array.isArray(interventions) ? interventions : [])
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            Mes Réclamations
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Signalez un problème lié à une intervention ou à un artisan.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-red-500/20 px-6"
        >
          <Plus className="w-4 h-4" />
          Nouvelle réclamation
        </Button>
      </div>

      {/* New Complaint Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <NewComplaintForm 
              onSuccess={() => {
                setShowForm(false)
                fetchComplaints()
              }}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-500/10 rounded-[24px] text-red-600 border border-red-100 dark:border-red-500/20">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button 
            onClick={fetchComplaints} 
            className="ml-auto text-xs font-black uppercase tracking-widest hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map(i => <ComplaintSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && complaints.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center space-y-6"
        >
          <div className="w-28 h-28 bg-slate-50 dark:bg-white/5 rounded-[40px] flex items-center justify-center text-6xl">
            ✅
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Aucune réclamation
            </h2>
            <p className="text-sm font-bold text-slate-400 max-w-xs">
              Vous n&apos;avez aucune réclamation en cours. Si vous rencontrez un problème, n&apos;hésitez pas à en soumettre une.
            </p>
          </div>
        </motion.div>
      )}

      {/* Info Note */}
      {!loading && (
        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-[24px] p-5 border border-blue-100 dark:border-blue-500/20">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-relaxed">
            💡 Les réclamations sont examinées par notre équipe sous 24h. Vous recevrez une notification dès qu&apos;une mise à jour est disponible.
          </p>
        </div>
      )}
    </div>
  )
}

function NewComplaintForm({ onSuccess, onCancel }) {
  const [subject, setSubject] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) {
      setError("Veuillez remplir tous les champs.")
      return
    }
    if (description.length < 20) {
      setError("La description doit contenir au moins 20 caractères.")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      // POST to a generic complaints endpoint - the backend will handle it
      await api.post("/interventions", {
        titre: subject,
        description: description,
        type: "reclamation"
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi de la réclamation. Veuillez contacter le support.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 p-8 space-y-6 shadow-xl">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Soumettre une réclamation
        </h3>
        <p className="text-xs font-bold text-slate-400">
          Décrivez votre problème en détail. Notre équipe vous répondra sous 24h.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Sujet de la réclamation
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Problème avec l'artisan, travail non terminé..."
          className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-red-500 px-5 font-bold text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Description détaillée
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Expliquez en détail le problème rencontré..."
          rows={5}
          className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-red-500 p-5 font-bold text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none transition-all"
          maxLength={2000}
        />
        <p className="text-right text-[10px] font-bold text-slate-400">{description.length} / 2000</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1 h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="flex-2 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-red-500/20"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {submitting ? "Envoi en cours..." : "Envoyer la réclamation"}
        </Button>
      </div>
    </form>
  )
}
