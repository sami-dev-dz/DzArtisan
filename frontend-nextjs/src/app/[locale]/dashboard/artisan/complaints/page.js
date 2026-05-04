"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AlertTriangle, Plus, Loader2, AlertCircle,
  Send
} from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

const STATUS_KEYS = {
  ouverte:  { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400", key: "status.ouverte" },
  en_cours: { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",    key: "status.en_cours" },
  resolue:  { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", key: "status.resolue" },
  fermee:   { color: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400", key: "status.fermee" },
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

export default function ArtisanComplaintsPage() {
  const t = useTranslations("dashboard.artisan_complaints")
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
      const res = await api.get("/complaints")
      const data = res.data?.data || res.data || []
      setComplaints(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.error || t("error_loading"))
    } finally {
      setLoading(false)
    }
  }, [t])

  React.useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* ── Premium Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-linear-to-b from-red-500/5 to-transparent dark:from-red-500/10 pointer-events-none rounded-t-[3rem] -z-10" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-red-500/10 dark:bg-red-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            {t("title")}
          </h1>
          <p className="text-sm font-bold text-slate-400">
            {t("subtitle")}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-red-500/20 px-6"
        >
          <Plus className="w-4 h-4" />
          {t("new_btn")}
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
            {t("retry")}
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
              {t("empty_title")}
            </h2>
            <p className="text-sm font-bold text-slate-400 max-w-xs">
              {t("empty_desc")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Complaint List */}
      {!loading && !error && complaints.length > 0 && !showForm && (
        <div className="space-y-4">
          <AnimatePresence>
            {complaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} t={t} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Info Note */}
      {!loading && (
        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-[24px] p-5 border border-blue-100 dark:border-blue-500/20">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-relaxed">
            {t("info_note")}
          </p>
        </div>
      )}
    </div>
  )
}

function ComplaintCard({ complaint, t }) {
  const config = STATUS_KEYS[complaint.statut]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            {complaint.titre || complaint.description?.split('\n')[0]?.replace('Sujet: ', '')}
          </h3>
          <p className="text-xs font-bold text-slate-400">
            {t("linked_to", { id: complaint.intervention_id })}
          </p>
        </div>
        <div className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest", config?.color)}>
          {t(config?.key) || complaint.statut}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {complaint.description}
      </p>
      {complaint.notes_admin && (
        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400">{t("admin_reply")}</p>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-300 mt-1">{complaint.notes_admin}</p>
        </div>
      )}
    </motion.div>
  )
}

function NewComplaintForm({ onSuccess, onCancel }) {
  const t = useTranslations("dashboard.artisan_complaints.form")
  const [subject, setSubject] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [interventionId, setInterventionId] = React.useState("")
  const [interventions, setInterventions] = React.useState([])
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    api.get("/artisan/interventions").then(res => {
      const data = res.data?.data || res.data || []
      setInterventions(Array.isArray(data) ? data : [])
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim() || !interventionId) {
      setError(t("error_fields"))
      return
    }
    if (description.length < 20) {
      setError(t("error_min_length"))
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await api.post("/complaints", {
        intervention_id: interventionId,
        titre: subject,
        description: description,
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || t("error_send"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 p-8 space-y-6 shadow-xl">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
          {t("title")}
        </h3>
        <p className="text-xs font-bold text-slate-400">
          {t("subtitle")}
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
          {t("select_intervention")}
        </label>
        <select
          value={interventionId}
          onChange={(e) => setInterventionId(e.target.value)}
          className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-red-500 px-5 font-bold text-slate-900 dark:text-white outline-none transition-all"
        >
          <option value="">{t("select_placeholder")}</option>
          {interventions.map(int => (
            <option key={int.id} value={int.id}>
              {int.titre} ({int.statut})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("subject_label")}
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("subject_placeholder")}
          className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-red-500 px-5 font-bold text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("desc_label")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("desc_placeholder")}
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
          {t("cancel")}
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
          {submitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  )
}
