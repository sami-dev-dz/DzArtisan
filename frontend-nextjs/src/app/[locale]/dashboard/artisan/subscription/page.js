"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CreditCard, 
  Wallet, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  Upload, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { useToastStore } from "@/store/toastStore"
import { uploadToCloudinary } from "@/lib/cloudinary"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"

export default function SubscriptionPage() {
  const t = useTranslations("subscription")
  const common = useTranslations("common")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { addToast } = useToastStore()

  // State
  const [loading, setLoading] = React.useState(true)
  const [subStatus, setSubStatus] = React.useState(null)
  const [plans, setPlans] = React.useState([])
  const [history, setHistory] = React.useState([])
  
  const [selectedPlan, setSelectedPlan] = React.useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState("online") // 'online' or 'manual'
  const [isUploading, setIsUploading] = React.useState(false)
  const [proofUrl, setProofUrl] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  // Initialization
  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statusRes, plansRes] = await Promise.all([
        api.get("/subscription/status"),
        api.get("/subscription/plans")
      ])

      setSubStatus(statusRes.data)
      setPlans(plansRes.data.plans)
      setHistory(statusRes.data.history || [])
    } catch (err) {
      console.error("Failed to fetch subscription data", err)
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleSubscribe = (plan) => {
    if (!plan.available) return
    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)
  }

  const handleManualUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    const maxSize = 2 * 1024 * 1024 // 2 MB

    if (!validTypes.includes(file.type)) {
      addToast({ title: "Format non supporté (JPG, PNG, WEBP, PDF).", type: "error" })
      return
    }
    if (file.size > maxSize) {
      addToast({ title: "La taille maximale est de 2 Mo.", type: "error" })
      return
    }
    
    setIsUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setProofUrl(url)
      addToast({ title: t("upload_success"), type: "success" })
    } catch (err) {
      addToast({ title: common("error"), type: "error" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleConfirmPayment = async () => {
    setSubmitting(true)
    try {
      // 1. Initiate subscription
      const subRes = await api.post("/subscribe", {
        plan_id: selectedPlan.id,
        methode: paymentMethod === "online" ? "chargily" : "virement"
      })

      // 2. If manual, upload the proof
      if (paymentMethod === "manual" && proofUrl) {
        await api.post("/payments/proof", {
          paiement_id: subRes.data.paiement_id,
          preuve_paiement: proofUrl
        })
      }

      addToast({ title: t("pending"), type: "success" })
      setIsPaymentModalOpen(false)
      fetchData() // Refresh status
    } catch (err) {
      addToast({ title: common("error"), type: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadReceipt = (row) => {
    if (row.statut !== 'succes') {
      addToast({ title: "Le reçu n'est disponible que pour les paiements confirmés.", type: "error" })
      return
    }
    addToast({ title: "Génération du reçu en cours...", type: "success" })
    // Real logic would be: window.open(`${process.env.NEXT_PUBLIC_API_URL}/v1/receipts/${row.id}`, '_blank')
  }

  if (loading) {

    return <div className="flex items-center justify-center min-h-[60vh] animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{t("title")}</h1>
        <p className="text-slate-500 font-bold">{t("subtitle")}</p>
      </header>

      {/* Current Status Card */}
      <section className={cn(
        "relative rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl border transition-all duration-500",
        subStatus?.statut === 'actif' 
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-emerald-500/20"
          : subStatus?.expiring_soon
          ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/20"
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white"
      )}>
        {/* Background Patterns */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-black/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <ShieldCheck className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter">{t("current_status")}</h2>
              </div>
              
              <div className="flex flex-wrap gap-4">
                 <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70 block mb-1">{t("plan")}</span>
                    <span className="text-xl font-black uppercase">{subStatus?.plan === 'none' ? 'AUCUN' : subStatus?.plan}</span>
                 </div>
                 <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70 block mb-1">{t("expires_on")}</span>
                    <span className="text-xl font-black">
                       {subStatus?.date_fin ? new Date(subStatus.date_fin).toLocaleDateString() : 'N/A'}
                    </span>
                 </div>
              </div>
           </div>

           <div className="text-center md:text-right">
              <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2">
                 {subStatus?.days_left}
              </div>
              <div className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
                 {t("days_left", { count: subStatus?.days_left })}
              </div>
           </div>
        </div>

        {/* Status Badges */}
        <div className="mt-8 flex gap-3">
           {subStatus?.statut === 'actif' && (
             <Badge className="bg-white text-emerald-600 rounded-full px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                <Check className="w-3 h-3 mr-1" /> {t("active")}
             </Badge>
           )}
           {subStatus?.expiring_soon && (
             <Badge className="bg-white text-orange-600 rounded-full px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                <Clock className="w-3 h-3 mr-1" /> {t("expiring_soon")}
             </Badge>
           )}
           {subStatus?.statut === 'expire' && (
             <Badge className="bg-red-500 text-white rounded-full px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                <AlertCircle className="w-3 h-3 mr-1" /> {t("expired")}
             </Badge>
           )}
        </div>
      </section>

      {/* Plans Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
           <Zap className="w-6 h-6 text-blue-600 fill-current" />
           <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t("manage_plans")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {plans.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -10 }}
                className={cn(
                  "relative bg-white dark:bg-slate-900 rounded-[40px] p-8 border-2 transition-all group overflow-hidden",
                  plan.best_value ? "border-blue-600 shadow-2xl shadow-blue-600/10" : "border-slate-100 dark:border-white/5",
                  !plan.available && "opacity-60 saturate-0"
                )}
              >
                 {plan.best_value && (
                    <div className="absolute top-6 right-[-35px] rotate-45 bg-blue-600 text-white text-[10px] font-black uppercase py-1 px-10 tracking-widest shadow-xl">
                       {t("best_value")}
                    </div>
                 )}

                 <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">DA</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-2">{plan.description}</p>
                 </div>

                 <div className="space-y-4 mb-8">
                    {plan.features.map((feat, i) => (
                       <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-tight">{feat}</span>
                       </div>
                    ))}
                 </div>

                 <Button 
                   onClick={() => handleSubscribe(plan)}
                   disabled={!plan.available}
                   className={cn(
                     "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                     plan.best_value ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white"
                   )}
                 >
                    {plan.available ? t("select_plan") : t("trial_used_note")}
                 </Button>
              </motion.div>
           ))}
        </div>
      </section>

      {/* Payment History Table */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
           <History className="w-6 h-6 text-blue-600" />
           <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t("history_title")}</h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl">
           <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                 <tr className="border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("table_date")}</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("table_plan")}</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("table_amount")}</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("table_method")}</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("table_status")}</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                 {history.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                       <td className="p-6 text-sm font-bold text-slate-600 dark:text-slate-300">{new Date(row.created_at).toLocaleDateString()}</td>
                       <td className="p-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{row.plan || 'Plan'}</td>
                       <td className="p-6 text-sm font-black text-blue-600">{row.montant} DA</td>
                       <td className="p-6 text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">{row.methode}</td>
                       <td className="p-6">
                          <Badge className={cn(
                             "rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest",
                             row.statut === 'succes' ? "bg-emerald-100 text-emerald-600" : row.statut === 'en_attente' ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                          )}>
                             {row.statut}
                          </Badge>
                       </td>
                       <td className="p-6 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl"
                            onClick={() => handleDownloadReceipt(row)}
                          >
                             <Download className="w-4 h-4" />
                          </Button>
                       </td>

                    </tr>
                 ))}
                 {history.length === 0 && (
                   <tr>
                      <td colSpan="6" className="p-20 text-center text-slate-400 font-bold italic">Aucune transaction trouvée.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </section>

      {/* Payment Modal */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        title={t("payment_modal_title")}
        maxWidth="2xl"
      >
        <div className="p-8 space-y-8">
           {/* Plan Summary */}
           <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Check className="w-6 h-6 stroke-[3]" />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedPlan?.name}</h4>
                    <p className="text-xs font-bold text-slate-500">{selectedPlan?.description}</p>
                 </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                 {selectedPlan?.price} <span className="text-xs">DA</span>
              </div>
           </div>

           {/* Payment Methods Switch */}
           <div className="flex p-2 bg-slate-100 dark:bg-slate-950 rounded-2xl gap-2">
              <button 
                onClick={() => setPaymentMethod("online")}
                className={cn(
                  "flex-1 h-14 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2 flex items-center justify-center",
                  paymentMethod === "online" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl" : "text-slate-400 opacity-60"
                )}
              >
                 <Zap className="w-4 h-4" />
                 {t("method_online")}
              </button>
              <button 
                onClick={() => setPaymentMethod("manual")}
                className={cn(
                  "flex-1 h-14 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2 flex items-center justify-center",
                  paymentMethod === "manual" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-xl" : "text-slate-400 opacity-60"
                )}
              >
                 <Wallet className="w-4 h-4" />
                 {t("method_manual")}
              </button>
           </div>

           {/* Tab Content */}
           <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                 {paymentMethod === "online" ? (
                    <motion.div 
                      key="online"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                       <div className="p-6 bg-blue-50 dark:bg-blue-600/5 rounded-3xl border border-blue-100 dark:border-blue-600/10 flex gap-4">
                          <Info className="w-6 h-6 text-blue-600 shrink-0" />
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-400 leading-relaxed italic">
                             Vous allez être redirigé vers la plateforme sécurisée de paiement Edahabia/CIB.
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Numéro de carte</label>
                            <Input placeholder="6280 XXXX XXXX XXXX" className="h-14 rounded-2xl font-black tracking-[0.2em] bg-slate-50 dark:bg-slate-900 border-none" />
                         </div>
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Expiration</label>
                            <Input placeholder="MM / YY" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none" />
                         </div>
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">CVV</label>
                            <Input placeholder="XXX" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none" />
                         </div>
                       </div>
                    </motion.div>
                 ) : (
                    <motion.div 
                      key="manual"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                       <div className="p-8 bg-emerald-50 dark:bg-emerald-600/5 rounded-[32px] border border-emerald-100 dark:border-emerald-600/10 space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                                <DollarSign className="w-5 h-5" />
                             </div>
                             <h5 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{t("ccp_details")}</h5>
                          </div>
                          
                          <div className="space-y-2 pt-2">
                             <div className="flex justify-between items-center py-3 border-b border-emerald-100 dark:border-white/5">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("ccp_account")}</span>
                                <Button size="sm" variant="ghost" className="h-8 px-2 text-emerald-600 hover:bg-emerald-100">Copier</Button>
                             </div>
                             <div className="py-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("ccp_name")}</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <p className="text-sm font-bold text-slate-500 italic">{t("upload_instruction")}</p>
                          
                          <label className={cn(
                             "flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-[40px] transition-all cursor-pointer group",
                             proofUrl ? "bg-emerald-50 border-emerald-500/50" : "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-white/5 hover:border-blue-400"
                          )}>
                             <input type="file" className="hidden" accept="image/*" onChange={handleManualUpload} />
                             
                             {proofUrl ? (
                                <div className="text-center space-y-3">
                                   <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20">
                                      <Check className="w-8 h-8 stroke-[3]" />
                                   </div>
                                   <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Reçu téléchargé</p>
                                </div>
                             ) : isUploading ? (
                                <div className="w-12 h-12 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
                             ) : (
                                <>
                                   <Upload className="w-12 h-12 text-slate-300 group-hover:text-blue-500 mb-4" />
                                   <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t("upload_btn")}</span>
                                </>
                             )}
                          </label>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Confirm Button */}
           <Button 
             onClick={handleConfirmPayment}
             disabled={submitting || (paymentMethod === 'manual' && !proofUrl)}
             className="w-full h-18 rounded-[30px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 group transition-all"
           >
              {submitting ? <div className="w-6 h-6 border-2 border-slate-400 border-t-white animate-spin rounded-full" /> : <ShieldCheck className="w-6 h-6 stroke-[3]" />}
              {t("confirm_payment")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </Button>
        </div>
      </Modal>

    </div>
  )
}
