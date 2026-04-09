"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  Search, 
  Mail, 
  Smartphone, 
  ArrowLeft, 
  Home, 
  Pencil, 
  HelpCircle,
  AlertCircle,
  Clock,
  Send,
  Zap,
  ShieldCheck
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export default function PendingVerificationPage() {
  const t = useTranslations("artisan_waiting")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { user, logout } = useAuth()

  const timelineSteps = [
    {
      id: "submitted",
      title: t("status_submitted"),
      desc: t("status_submitted_desc"),
      status: "completed",
      icon: CheckCircle2,
    },
    {
      id: "review",
      title: t("status_review"),
      desc: t("status_review_desc"),
      status: "current",
      icon: Search,
    },
    {
      id: "notification",
      title: t("status_notification"),
      desc: t("status_notification_desc"),
      status: "pending",
      icon: Mail,
    },
    {
      id: "activation",
      title: t("status_activation"),
      desc: t("status_activation_desc"),
      status: "pending",
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-slate-900 shadow-2xl rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden relative"
      >
        {/* Animated Background Highlights */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 p-8 sm:p-12 text-center">
           
           {/* Hourglass / Clock Animation */}
           <div className="mb-10 relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center shadow-inner">
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 >
                    <Clock className="w-10 h-10 text-blue-600" />
                 </motion.div>
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900"
              >
                 <CheckCircle2 className="w-5 h-5" />
              </motion.div>
           </div>

           <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {t("title")}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mb-12 max-w-md mx-auto">
              {t("explanation")}
           </p>

           {/* Vertical Timeline */}
           <div className="space-y-1 w-full max-w-sm mx-auto text-left rtl:text-right mb-12">
              {timelineSteps.map((step, idx) => {
                 const isCompleted = step.status === "completed"
                 const isCurrent = step.status === "current"
                 
                 return (
                    <div key={idx} className="relative group">
                       {/* Connector Line */}
                       {idx !== timelineSteps.length - 1 && (
                          <div className={cn(
                             "absolute top-8 left-6 rtl:right-6 w-0.5 h-12 transition-colors duration-500",
                             isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                          )} />
                       )}
                       
                       <div className="flex gap-4 items-start pb-10">
                          <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-300 relative z-10",
                             isCompleted && "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20",
                             isCurrent && "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 animate-pulse",
                             step.status === "pending" && "bg-white dark:bg-slate-950 border-slate-100 dark:border-white/5 text-slate-300"
                          )}>
                             <step.icon className={cn("w-5 h-5", isCompleted || isCurrent ? "stroke-[2.5]" : "stroke-[2]")} />
                          </div>
                          
                          <div>
                             <h3 className={cn(
                                "font-black text-base uppercase tracking-wider mb-0.5",
                                isCompleted ? "text-slate-900 dark:text-white" : 
                                isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                             )}>
                                {step.title}
                             </h3>
                             <p className="text-sm font-medium text-slate-500 dark:text-slate-500">{step.desc}</p>
                          </div>
                       </div>
                    </div>
                 )
              })}
           </div>

           {/* Info Cards Row */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                 <Mail className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t("info_email")}</span>
                 <span className="text-xs font-black text-slate-700 dark:text-slate-300 truncate block">{user?.email}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                 <AlertCircle className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t("info_spam")}</span>
                 <span className="text-xs font-black text-slate-700 dark:text-slate-300">{t("spam_folder")}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-blue-600/30 transition-colors cursor-help">
                 <HelpCircle className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t("support_label")}</span>
                 <span className="text-xs font-black text-slate-700 dark:text-slate-300">{t("support_email")}</span>
              </div>
           </div>

           {/* Navigation Buttons */}
           <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1"
                onClick={logout}
              >
                 <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 group">
                    <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t("btn_home")}
                 </Button>
              </button>
              <Link href="/onboarding/artisan/profile" className="flex-1">
                 <Button className="w-full h-14 rounded-2xl font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-none flex items-center justify-center gap-2 group">
                    <Pencil className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {t("btn_edit")}
                 </Button>
              </Link>
           </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-100 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-center gap-3">
           <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
              {t("compliance_note")}
           </p>
        </div>

      </motion.div>
    </div>
  )
}
