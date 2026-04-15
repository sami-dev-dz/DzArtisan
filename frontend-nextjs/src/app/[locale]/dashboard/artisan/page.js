"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Bell, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Phone,
  Settings,
  MoreVertical,
  LogOut,
  Camera,
  Link as LinkIcon,
  FileText,
  CreditCard
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api-client"
import { StatCard } from "@/components/dashboard/StatCard"
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner"
import { ProfileCompletenessWidget } from "@/components/dashboard/ProfileCompletenessWidget"
import { MatchingRequestCard } from "@/components/dashboard/MatchingRequestCard"
import { AvailabilityToggle } from "@/components/dashboard/AvailabilityToggle"
import { cn } from "@/lib/utils"

export default function ArtisanDashboard() {
  const t = useTranslations("dashboard")
  const common = useTranslations("common")
  const locale = useLocale()
  const { user } = useAuth()
  
  const [data, setData] = React.useState(null)
  const [matchingRequests, setMatchingRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, requestsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/matching-requests")
        ])
        setData(statsRes.data)
        setMatchingRequests(requestsRes.data)
      } catch (err) {
        console.error("Dashboard data fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-[32px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[32px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
           <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
        </div>
      </div>
    )
  }

  // Map missing items to icons for the widget
  const getIcon = (id) => {
    if (id === 'photo') return Camera
    if (id === 'whatsapp') return Phone
    if (id === 'about') return FileText
    if (id === 'card') return CreditCard
    return Sparkles
  }

  const widgetItems = data?.missing_items?.map(item => ({
     ...item,
     icon: getIcon(item.id)
  })) || []

  return (
    <div className="space-y-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
         >
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Artisan Vérifié</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
               {common("welcome")}, <span className="text-blue-600">{user?.nomComplet?.split(" ")[0]}</span>
               <motion.span 
                 animate={{ rotate: [0, 20, 0] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="inline-block origin-bottom"
               >👋</motion.span>
            </h1>
            <p className="text-slate-500 font-bold mt-2">Prêt à transformer de nouvelles opportunités en réalisations ?</p>
         </motion.div>

         <div className="flex items-center gap-3">
            <AvailabilityToggle />
         </div>
      </div>

      {/* Subscription Banner */}
      <SubscriptionBanner data={data?.subscription} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats?.map((stat, idx) => (
          <StatCard key={stat.label} {...stat} index={idx} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Recent Matching Requests */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Zap className="w-5 h-5 fill-current" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Opportunités pour vous</h3>
              </div>
              <Link href="/dashboard/interventions" className="text-sm font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                 Tout voir <ArrowRight className="w-4 h-4" />
              </Link>
           </div>

           <div className="space-y-4">
              {matchingRequests.length > 0 ? (
                matchingRequests.map((request, idx) => (
                   <MatchingRequestCard key={request.id} request={request} index={idx} />
                ))
              ) : (
                <div className="bg-white dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] p-12 text-center flex flex-col items-center gap-4">
                   <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                      <LayoutDashboard className="w-10 h-10" />
                   </div>
                   <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">Aucune demande trouvée</p>
                      <p className="text-sm font-bold text-slate-400">Élargissez vos wilayas ou vos catégories pour plus de visibilité.</p>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: Profile Completeness */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Croissance</h3>
           </div>
           
           <ProfileCompletenessWidget 
              percentage={data?.completeness} 
              items={widgetItems}
           />
           
           {/* Quick Action Card (Simplified for now) */}
           <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Support Premium</h4>
              <p className="text-indigo-100 text-sm font-bold mb-6">Besoin d&apos;aide pour optimiser votre profil ou gérer un client ?</p>
              <button className="h-14 w-full bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95">
                 Contacter l&apos;assistance
              </button>
           </div>
        </div>

      </div>

    </div>
  )
}
