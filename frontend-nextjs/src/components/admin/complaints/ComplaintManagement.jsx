"use client"

import { Briefcase } from 'lucide-react';
import React, { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, RefreshCw, AlertCircle,
  MoreVertical, Eye, MessageSquare, AlertTriangle,
  UserX, Trash2, CheckCircle2, CloudAlert, Camera,
  Calendar, User, ArrowRight, ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { useToastStore } from "@/store/toastStore"
import { format } from "date-fns"
import { fr, arDZ, enUS } from "date-fns/locale"
import { useLocale } from "next-intl"
import axios from "@/lib/axios"

export default function ComplaintManagement() {
  const t = useTranslations("admin.complaints_management")
  const commonT = useTranslations("common")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const addToast = useToastStore((state) => state.addToast)
  const showToast = (msg, type = 'success') => addToast({ title: msg, type })

  const [activeTab, setActiveTab] = useState("new")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [stats, setStats] = useState({
    nouveau: 0,
    en_cours: 0,
    resolu: 0,
    rejete: 0
  })

  // Fetch data from real API
  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/admin/complaints`, {
        params: { status: activeTab, search: searchQuery }
      })
      setComplaints(response.data.complaints?.data || [])
      setStats(response.data.stats || { nouveau: 0, en_cours: 0, resolu: 0, rejete: 0 })
    } catch (error) {
      // showToast(commonT("error"), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [activeTab, searchQuery])

  const handleUpdateStatus = async (status) => {
    if (!selectedComplaint) return
    try {
      await axios.post(`/admin/complaints/${selectedComplaint.id}/status`, { status })
      showToast(t("notifications.status_updated"))
      fetchComplaints()
      setSelectedComplaint(prev => ({ ...prev, statut: status }))
    } catch (error) {
      showToast(commonT("error"), 'error')
    }
  }

  const handleAddNote = async (notes) => {
    if (!selectedComplaint) return
    try {
      await axios.post(`/admin/complaints/${selectedComplaint.id}/note`, { notes })
      showToast(t("notifications.note_added"))
      // Reload history
      const detailRes = await axios.get(`/admin/complaints/${selectedComplaint.id}`)
      setSelectedComplaint(detailRes.data.complaint)
    } catch (error) {
      showToast(commonT("error"), 'error')
    }
  }

  const getDateLocale = () => {
    if (locale === "fr") return fr
    if (locale === "ar") return arDZ
    return enUS
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "nouveau":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20">{t("status.new")}</Badge>
      case "en_cours":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20">{t("status.investigating")}</Badge>
      case "resolu":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20">{t("status.resolved")}</Badge>
      case "rejete":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/20">{t("status.dismissed")}</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-[#0a0f1e] p-2 rounded-2xl border border-slate-100 dark:border-white/5">
        <div className="flex items-center p-1 bg-slate-50 dark:bg-white/5 rounded-xl self-start lg:self-auto overflow-x-auto max-w-full">
          {["new", "investigating", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-black transition-all whitespace-nowrap",
                activeTab === tab
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {t(`tabs.${tab}`)}
              {tab === "new" && stats.nouveau > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                  {stats.nouveau}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={commonT("search")}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold placeholder:text-slate-400 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table/List Section */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 bg-slate-50 dark:bg-white/5 border-none h-24 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-[#0a0f1e] border-dashed border-2 border-slate-100 dark:border-white/5 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{t("status.resolved")}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{commonT("all_clear")}</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  layoutId={`complaint-${complaint.id}`}
                  onClick={() => setSelectedComplaint(complaint)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer group shadow-sm",
                    selectedComplaint?.id === complaint.id
                      ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20"
                      : "bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                        {complaint.accuse.role === 'artisan' ? <Briefcase className="w-6 h-6 text-blue-600" /> : <User className="w-6 h-6 text-slate-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white">{complaint.demandeur.name}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-black text-slate-900 dark:text-white">{complaint.accuse.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tighter">
                          <span>{complaint.categorie}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                          <span>{format(new Date(complaint.created_at), 'dd MMM yyyy', { locale: getDateLocale() })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-1 text-slate-400 font-bold text-xs uppercase">
                        <Camera className="w-3 h-3" />
                        {complaint.photos_count}
                      </div>
                      {getStatusBadge(complaint.statut)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Action/Detail Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedComplaint ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="sticky top-24"
              >
                <Card className="bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 rounded-xl overflow-hidden overflow-y-auto max-h-[calc(100vh-120px)] shadow-sm">
                  {/* Detailed View - Mock content for now */}
                  <div className="p-6 bg-blue-600 text-white">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-black">{t("details.title")}</h2>
                      <button onClick={() => setSelectedComplaint(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 rotate-180" />
                      </button>
                    </div>
                    <p className="text-blue-100 text-sm font-bold mt-1 uppercase tracking-widest">#{selectedComplaint.id}</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Parties */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("table.complainant")}</label>
                      <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center font-black text-blue-600">
                          {selectedComplaint.demandeur.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">{selectedComplaint.demandeur.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedComplaint.demandeur.role}</p>
                        </div>
                      </div>

                      <div className="flex justify-center -my-2 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0a0f1e] border-2 border-slate-100 dark:border-white/5 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </div>
                      </div>

                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("table.accused")}</label>
                      <div className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/10">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center font-black text-red-600">
                          {selectedComplaint.accuse.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">{selectedComplaint.accuse.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedComplaint.accuse.role}</p>
                            {selectedComplaint.accuse_strikes >= 3 && (
                              <Badge className="bg-red-500 text-[8px] h-4 font-black">{t("three_strikes.badge")}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facts */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("details.description")}</label>
                      <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedComplaint.description}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-4">
                      {selectedComplaint.statut === 'nouveau' && (
                        <Button
                          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          {t("actions.investigate")}
                        </Button>
                      )}
                      <Button variant="outline" className="rounded-xl font-bold gap-2 py-6">
                        <MessageSquare className="w-4 h-4" />
                        {t("actions.add_note")}
                      </Button>
                      <Button variant="outline" className="rounded-xl font-bold gap-2 py-6 border-amber-200 text-amber-600 hover:bg-amber-50">
                        <AlertCircle className="w-4 h-4" />
                        {t("actions.send_warning")}
                      </Button>
                      <Button variant="outline" className="rounded-xl font-bold gap-2 py-6 border-red-200 text-red-600 hover:bg-red-50">
                        <UserX className="w-4 h-4" />
                        {t("actions.suspend_account")}
                      </Button>
                      <Button className="rounded-xl font-bold gap-2 py-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                        <CheckCircle2 className="w-4 h-4" />
                        {t("actions.resolve")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-8 h-[500px] flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/2 border-dashed border-2 border-slate-200 dark:border-white/5 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-black">{t("details.title")}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-bold">{t("subtitle")}</p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
