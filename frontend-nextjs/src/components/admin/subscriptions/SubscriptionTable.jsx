"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
  History, 
  Search, 
  Info, 
  Calendar, 
  AlertCircle,
  MoreVertical,
  ExternalLink,
  CreditCard,
  Banknote
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

export function SubscriptionTable({ 
  subscriptions, 
  loading, 
  activeTab, 
  onTabChange,
  onViewHistory 
}) {
  const t = useTranslations("admin.subscription_management")
  const locale = useLocale()
  const isRTL = locale === "ar"

  const tabs = [
    { id: "all", label: t("tabs.all") },
    { id: "active", label: t("tabs.active") },
    { id: "trial", label: t("tabs.trial") },
    { id: "expiring_soon", label: t("tabs.expiring") },
    { id: "expired", label: t("tabs.expired") },
    { id: "suspended", label: t("tabs.suspended") }
  ]

  const getStatusBadge = (sub) => {
    // Logic for calculating status based on dates
    const now = new Date()
    const endDate = new Date(sub.date_fin)
    const isExpired = sub.date_fin && endDate < now
    const daysLeft = sub.date_fin ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : 0
    const isTrial = sub.plan === 'gratuit'
    
    if (sub.statut === 'suspendu') return <Badge variant="secondary">{t("tabs.suspended")}</Badge>
    if (isExpired) return <Badge variant="danger">{t("tabs.expired")}</Badge>
    if (daysLeft <= 7 && !isTrial && daysLeft > 0) return <Badge variant="warning">{t("tabs.expiring")}</Badge>
    if (isTrial) return <Badge variant="primary">{t("tabs.trial")}</Badge>
    
    return <Badge variant="success">{t("tabs.active")}</Badge>
  }

  const getDaysLabel = (sub) => {
    if (!sub.date_fin) return "—"
    const now = new Date()
    const endDate = new Date(sub.date_fin)
    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) return t("table.expired_ago", { days: Math.abs(daysLeft) })
    return t("table.days", { count: daysLeft })
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Tabs Sidebar/Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t("table.artisan")}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                {t("table.plan")}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t("table.dates")}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                {t("table.status")}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                {t("table.payment")}
              </th>
              <th className="px-6 py-4 text-right rtl:text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                   <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td>
                   <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto"></div></td>
                   <td className="px-6 py-4"><div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td>
                   <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto"></div></td>
                   <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto"></div></td>
                   <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                   {t("artisan_management.table.no_data")}
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={sub.artisan?.photo} 
                        className="w-10 h-10 rounded-xl" 
                        initials={sub.artisan?.user?.nomComplet?.charAt(0)} 
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white leading-tight">
                          {sub.artisan?.user?.nomComplet}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                          {sub.artisan?.primary_categorie?.nom || "Artisan"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase">
                        {sub.plan}
                      </span>
                      {sub.plan === 'gratuit' && (
                        <span className="text-[9px] font-bold text-slate-400">TRIAL</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-xs font-bold dark:text-slate-300">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(sub.date_debut).toLocaleDateString(locale)}</span>
                        <span>→</span>
                        <span>{new Date(sub.date_fin).toLocaleDateString(locale)}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 mt-1">
                        {getDaysLabel(sub)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(sub)}
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex justify-center group/pay relative">
                        {sub.paiements?.[0]?.methode === 'chargily' || sub.paiements?.[0]?.methode === 'satim' ? (
                          <CreditCard className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Banknote className="w-5 h-5 text-amber-500" />
                        )}
                        {/* Tooltip for payment method */}
                        <div className="absolute bottom-full mb-2 hidden group-hover/pay:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap">
                           {sub.paiements?.[0]?.methode || t("table.manual_method")}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-xl !h-8 !w-8 p-0"
                      onClick={() => onViewHistory(sub.artisan)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
