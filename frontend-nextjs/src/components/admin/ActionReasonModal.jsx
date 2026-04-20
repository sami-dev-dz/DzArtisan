"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Modal } from "@/components/ui/Modal"

export function ActionReasonModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = 'reject', // 'reject' or 'suspend'
  loading = false 
}) {
  const t = useTranslations("admin.artisan_management")
  const [reason, setReason] = React.useState("")
  const [error, setError] = React.useState("")

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(t("modals.reason_required"))
      return
    }
    setError("")
    onConfirm(reason)
  }

  React.useEffect(() => {
    if (isOpen) {
      setReason("")
      setError("")
    }
  }, [isOpen])

  const config = {
    reject: {
       title: t("modals.rejection_title"),
       label: t("modals.rejection_label"),
       icon: <X className="text-red-500" />,
       buttonClass: "bg-red-600 hover:bg-red-700",
       accentColor: "red"
    },
    suspend: {
       title: t("modals.suspension_title"),
       label: t("modals.suspension_label"),
       icon: <AlertTriangle className="text-amber-500" />,
       buttonClass: "bg-amber-600 hover:bg-amber-700",
       accentColor: "amber"
    }
  }

  const current = config[type] || config.reject

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={current.title}
      className="max-w-md p-0 overflow-hidden"
    >
      <div className="p-8 space-y-6">
         <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-3xl bg-${current.accentColor}-50 dark:bg-${current.accentColor}-500/10 flex items-center justify-center shadow-inner`}>
               {React.cloneElement(current.icon, { size: 32 })}
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-xs">
               {current.label}
            </p>
         </div>

         <div className="space-y-2">
            <Textarea 
               value={reason}
               onChange={(e) => setReason(e.target.value)}
               placeholder="Ex: Documents illisibles, Manque d'expérience..."
               className="min-h-[120px] rounded-2xl border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-indigo-500 transition-all font-black text-sm"
            />
            {error && <span className="text-[10px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1"><AlertTriangle size={12} /> {error}</span>}
         </div>

         <div className="flex gap-4 pt-2">
            <Button 
               variant="ghost" 
               className="flex-1 rounded-2xl h-12 border-slate-100 dark:border-white/5 font-black hover:bg-slate-50"
               onClick={onClose}
               disabled={loading}
            >
               Annuler
            </Button>
            <Button 
               className={`flex-1 rounded-2xl h-12 ${current.buttonClass} text-white font-black shadow-xl shadow-transparent hover:shadow-${current.accentColor}-500/20 transition-all`}
               onClick={handleConfirm}
               isLoading={loading}
            >
               Confirmer
            </Button>
         </div>
      </div>
    </Modal>
  )
}
