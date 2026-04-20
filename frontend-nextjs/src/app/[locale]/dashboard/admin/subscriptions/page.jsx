"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CreditCard, 
  RotateCcw, 
  Plus, 
  Search,
  Filter,
  Download,
  Terminal,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/hooks/use-toast"
import axios from "@/lib/axios"

// Internal Components
import { SubscriptionStats } from "@/components/admin/subscriptions/SubscriptionStats"
import { PendingPayments } from "@/components/admin/subscriptions/PendingPayments"
import { SubscriptionTable } from "@/components/admin/subscriptions/SubscriptionTable"
import { ManualActivationModal } from "@/components/admin/subscriptions/ManualActivationModal"
import { ArtisanHistoryDrawer } from "@/components/admin/subscriptions/ArtisanHistoryDrawer"

export default function SubscriptionsAdminPage() {
  const t = useTranslations("admin.subscription_management")
  const common = useTranslations("common")
  const { toast } = useToast()
  const locale = useLocale()
  
  // State
  const [data, setData] = React.useState({
    stats: {},
    pending_payments: [],
    subscriptions: [],
    all_artisans: []
  })
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState("all")
  const [search, setSearch] = React.useState("")
  
  // Modals/Drawers State
  const [isManualModalOpen, setIsManualModalOpen] = React.useState(false)
  const [historyArtisan, setHistoryArtisan] = React.useState(null)
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false)

  // Fetch Data
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/admin/subscriptions`, { params: { tab: activeTab, search } })
      setData(res.data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [activeTab, search])

  // Actions
  const handleConfirmPayment = async (payment) => {
    try {
      const res = await axios.post(`/admin/subscriptions/confirm/${payment.id}`)
      if (res.status === 200) {
        toast({ title: t("manual_activation.success") })
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRejectPayment = async (payment) => {
    const motif = window.prompt("Motif du rejet (transmis à l'artisan) :")
    if (!motif) return

    try {
      const res = await axios.post(`/admin/subscriptions/reject/${payment.id}`, { motif })
      if (res.status === 200) {
        toast({ title: "Paiement rejeté." })
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleManualActivate = async (formData) => {
    try {
      const res = await axios.post('/admin/subscriptions/manual-activate', formData)
      if (res.status === 200) {
        setIsManualModalOpen(false)
        toast({ title: t("manual_activation.success") })
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-[#0A0A0A] p-8 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-1 bg-blue-600 rounded-full" />
            <span className="text-sm font-black text-blue-600 uppercase tracking-widest italic flex items-center gap-2">
               DzArtisan Admin <span className="opacity-30">/</span> Finance
            </span>
          </motion.div>
          <h1 className="text-4xl font-black dark:text-white tracking-tight">
             {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-medium">
             {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="secondary" className="rounded-xl h-12 bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all font-semibold" onClick={fetchData}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("refresh")}
           </Button>
           <Button 
            className="rounded-xl h-12 font-bold shadow-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
            onClick={() => setIsManualModalOpen(true)}
           >
              <Plus className="w-4 h-4 mr-2" />
              {t("manual_activation.btn")}
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <SubscriptionStats stats={data.stats} />

      {/* Core Layout: Pending on top (if any), then main table */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Pending Payments Section - Priority View */}
        <PendingPayments 
          payments={data.pending_payments} 
          onConfirm={handleConfirmPayment}
          onReject={handleRejectPayment}
        />

        {/* Main List Section */}
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <Filter className="w-5 h-5 text-slate-400" />
                 {t("table.history")}
              </h2>
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder={t("manual_activation.search_artisan")}
                      className="pl-10 rounded-xl"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                 </div>
                 <Button variant="secondary" className="rounded-xl h-10 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                 </Button>
              </div>
           </div>

           <SubscriptionTable 
             subscriptions={data.subscriptions}
             loading={loading}
             activeTab={activeTab}
             onTabChange={setActiveTab}
             onViewHistory={(artisan) => {
               setHistoryArtisan(artisan)
               setIsHistoryOpen(true)
             }}
           />
        </div>
      </div>

      {/* Manual Activation Modal */}
      <ManualActivationModal 
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onActivate={handleManualActivate}
        artisans={data.all_artisans || []}
      />

      {/* History Drawer */}
      <ArtisanHistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        artisan={historyArtisan}
      />

      {/* Admin Quick Tip */}
      <div className="mt-12 p-6 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-white/10 flex items-start gap-4">
         <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
            <Info className="w-5 h-5" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Information sur la conformité</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
               Conformément à la réglementation de la Banque d&apos;Algérie sur les services numériques, assurez-vous de conserver une trace numérique pour chaque preuve de virement CCP validé manuellement. Les audits pourront nécessiter ces documents.
            </p>
         </div>
      </div>
    </div>
  )
}
