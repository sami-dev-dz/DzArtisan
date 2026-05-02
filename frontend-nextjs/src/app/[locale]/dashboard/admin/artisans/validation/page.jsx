"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { 
  Users, Search, Filter, RefreshCw, 
  CheckCircle, XCircle, Clock, Slash,
  LayoutGrid, List
} from "lucide-react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { useToastStore } from "@/store/toastStore"
import { ArtisanManagementTable } from "@/components/admin/ArtisanManagementTable"
import { ArtisanDetailDrawer } from "@/components/admin/ArtisanDetailDrawer"
import { ActionReasonModal } from "@/components/admin/ActionReasonModal"
import { cn } from "@/lib/utils"

export default function ArtisanManagementPage() {
  const t = useTranslations("admin.artisan_management")
  const commonT = useTranslations("common")
  const { addToast } = useToastStore()

  // State
  const [artisans, setArtisans] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState("pending") // pending, approved, rejected, suspended
  const [searchQuery, setSearchQuery] = React.useState("")
  const [pagination, setPagination] = React.useState({ current: 1, last: 1, total: 0 })
  
  // Selection State
  const [selectedArtisan, setSelectedArtisan] = React.useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [actionModal, setActionModal] = React.useState({ isOpen: false, type: 'reject', artisanId: null })
  const [isActionLoading, setIsActionLoading] = React.useState(false)

  const fetchArtisans = React.useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/users/artisans", {
        params: {
          status: activeTab,
          search: searchQuery,
          page: page
        }
      })
      setArtisans(response.data.data)
      setPagination({
        current: response.data.current_page,
        last: response.data.last_page,
        total: response.data.total
      })
    } catch (error) {
      console.error("Error fetching artisans:", error)
      addToast({
        title: "Erreur",
        message: "Impossible de charger les artisans.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchQuery, addToast])

  React.useEffect(() => {
    fetchArtisans()
  }, [fetchArtisans])

  // Handlers
  const handleAction = (artisanId, type) => {
    if (type === 'reject' || type === 'suspend') {
      setActionModal({ isOpen: true, type, artisanId })
    } else {
      executeStatusUpdate(artisanId, type)
    }
  }

  const executeStatusUpdate = async (artisanId, action, reason = "") => {
    setIsActionLoading(true)
    try {
      await axios.post(`/admin/artisans/${artisanId}/status`, {
        action,
        reason
      })
      
      const actionMap = { approve: 'approved', reject: 'rejected', suspend: 'suspended', unsuspend: 'unsuspended' }
      addToast({
        title: "Succès",
        message: t(`notifications.${actionMap[action]}`),
        type: "success"
      })
      
      // Refresh list
      fetchArtisans(pagination.current)
      setActionModal({ isOpen: false, type: 'reject', artisanId: null })
    } catch (error) {
      addToast({
        title: "Erreur",
        message: "L'opération a échoué.",
        type: "error"
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handlePromote = async (artisanId, type, value) => {
    try {
      await axios.post(`/admin/artisans/${artisanId}/promote`, {
        type,
        value
      })
      addToast({
        title: "Statut mis à jour",
        message: t("notifications.promoted"),
        type: "success"
      })
      fetchArtisans(pagination.current)
    } catch (error) {
      addToast({
        title: "Erreur",
        message: "Impossible de mettre à jour le statut de promotion.",
        type: "error"
      })
    }
  }

  const tabs = [
    { id: "pending", label: t("tabs.pending"), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { id: "approved", label: t("tabs.approved"), icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "rejected", label: t("tabs.rejected"), icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    { id: "suspended", label: t("tabs.suspended"), icon: Slash, color: "text-slate-500", bg: "bg-slate-50" },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
               <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("title")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                {t("subtitle")}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
           <Button 
            variant="outline" 
            onClick={() => fetchArtisans()} 
            className="rounded-xl h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group shadow-sm font-semibold"
           >
              <RefreshCw size={16} className={cn("mr-2 text-slate-500 transition-transform duration-500", loading && "animate-spin")} />
              {commonT("refresh")}
           </Button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
         {/* Tabs */}
         <div className="flex items-center p-1.5 bg-slate-100 dark:bg-white/5 rounded-[22px] w-full lg:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap flex-1 lg:flex-none",
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <tab.icon size={16} className={cn(activeTab === tab.id ? tab.color : "text-slate-400")} />
                {tab.label}
                {tab.id === 'pending' && pagination.total > 0 && activeTab !== 'pending' && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            ))}
         </div>

         {/* Search */}
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un artisan..." 
              className="pl-12 h-12 rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 font-bold"
            />
         </div>
      </div>

      {/* Main Content Table */}
      <ArtisanManagementTable 
        artisans={artisans}
        loading={loading}
        onAction={handleAction}
        onPromote={handlePromote}
        onViewDetails={(artisan) => {
          setSelectedArtisan(artisan)
          setIsDrawerOpen(true)
        }}
      />

      {/* Pagination */}
      {pagination.last > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
           {Array.from({ length: pagination.last }, (_, i) => i + 1).map(page => (
             <Button
                key={page}
                variant={pagination.current === page ? "default" : "outline"}
                size="icon"
                onClick={() => fetchArtisans(page)}
                className={cn(
                  "h-10 w-10 rounded-xl font-black",
                  pagination.current === page ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : "border-slate-100 dark:border-white/5"
                )}
             >
               {page}
             </Button>
           ))}
        </div>
      )}

      {/* Modals & Overlays */}
      <ArtisanDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        artisan={selectedArtisan}
      />

      <ActionReasonModal 
        isOpen={actionModal.isOpen}
        type={actionModal.type}
        loading={isActionLoading}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={(reason) => executeStatusUpdate(actionModal.artisanId, actionModal.type, reason)}
      />
    </div>
  )
}
