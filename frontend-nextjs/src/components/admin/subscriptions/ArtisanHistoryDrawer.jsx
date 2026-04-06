"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  History, 
  Calendar, 
  Banknote, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  User,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

export function ArtisanHistoryDrawer({ isOpen, onClose, artisan }) {
  const t = useTranslations("admin.subscription_management.modals")
  const locale = useLocale()
  const [history, setHistory] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen && artisan) {
      fetchHistory()
    }
  }, [isOpen, artisan])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/subscriptions/history/${artisan.id}`)
      const data = await res.json()
      setHistory(data.history || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col rtl:right-auto rtl:left-0 rtl:initial-x-[-100%] rtl:animate-x-[0] rtl:exit-x-[-100%]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <History className="w-5 h-5" />
                 </div>
                 <h2 className="font-black dark:text-white">
                   {t("history_title", { name: artisan?.user?.nomComplet })}
                 </h2>
               </div>
               <Button variant="outline" size="sm" onClick={onClose} className="rounded-full !w-8 !h-8 p-0">
                 <X className="w-4 h-4" />
               </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {loading ? (
                 <div className="space-y-4 animate-pulse">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-24 w-full bg-slate-50 dark:bg-slate-800 rounded-2xl" />
                    ))}
                 </div>
               ) : history.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <Clock className="w-12 h-12 mb-4" />
                    <p className="font-bold">Aucun historique trouvé.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {history.map((item, idx) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                      >
                         {/* Timeline Line */}
                         {idx < history.length - 1 && (
                           <div className="absolute left-7 top-14 bottom-[-1rem] w-px bg-slate-200 dark:bg-slate-800 z-0" />
                         )}

                         <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                               <Badge variant={item.statut === 'actif' ? 'success' : 'secondary'} className="uppercase text-[9px] tracking-widest font-black">
                                 {item.statut}
                               </Badge>
                               <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.created_at).toLocaleDateString(locale)}
                               </span>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                               <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                                  <Banknote className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                               </div>
                               <div>
                                  <h4 className="text-sm font-black dark:text-white uppercase">
                                     {item.plan}
                                  </h4>
                                  <p className="text-[10px] font-medium text-slate-500">
                                     {new Date(item.date_debut).toLocaleDateString(locale)} → {new Date(item.date_fin).toLocaleDateString(locale)}
                                  </p>
                               </div>
                            </div>

                            {item.paiements?.[0] && (
                              <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                 <div className="flex gap-2 items-center">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                       <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-bold dark:text-slate-200">
                                       {item.paiements[0].montant} DA
                                    </span>
                                 </div>
                                 <span className="text-[10px] text-slate-400 capitalize bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold">
                                    {item.paiements[0].methode}
                                 </span>
                              </div>
                            )}
                         </div>
                      </motion.div>
                    ))}
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800">
               <Button className="w-full rounded-2xl h-12 font-bold" variant="secondary" onClick={onClose}>
                  Fermer
               </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
