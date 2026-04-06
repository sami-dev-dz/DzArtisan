"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useToastStore } from "@/store/toastStore"
import { cn } from "@/lib/utils"

const calculateStrength = (password) => {
  if (!password) return { score: 0, label: "strength_empty", color: "bg-slate-200 dark:bg-slate-800" }
  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  
  if (score === 0 || score === 1) return { score, label: "strength_weak", color: "bg-red-500" }
  if (score === 2) return { score, label: "strength_medium", color: "bg-amber-500" }
  if (score >= 3) return { score, label: "strength_strong", color: "bg-emerald-500" }
}

export default function ResetPasswordPage() {
  const t = useTranslations("authentication")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || searchParams.get("signature") // Common Laravel token names
  const { addToast } = useToastStore()

  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState(null)

  const strength = calculateStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!token) {
       setError(t("invalid_token"))
       return
    }

    if (strength.score < 3) {
       setError(t("password_min_length"))
       return
    }

    if (password !== confirmPassword) {
       setError(t("confirm_mismatch"))
       return
    }

    setLoading(true)

    try {
      // Simulate API call
      // await axios.post('/api/reset-password', { token, password, password_confirmation: confirmPassword })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
    } catch (err) {
      // If token expired, API typically returns 400 or 422
      if (err.response?.status === 400) {
         setError(t("invalid_token"))
      } else {
         setError(t("network_error"))
      }
    } finally {
      setLoading(false)
    }
  }

  // Pre-validate token visually
  React.useEffect(() => {
     if (searchParams && !token) {
        setError(t("invalid_token"))
     }
  }, [searchParams, token, t])

  return (
    <div className="w-full">
      {/* Mobile Title */}
      <div className="lg:hidden mb-8 text-center text-slate-900 dark:text-white">
        <h1 className="text-3xl font-black mb-2">{t("reset_title")}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t("reset_subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-[#0a0f1e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/5 relative z-10 w-full lg:max-w-md mx-auto">
        
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
           <h2 className="text-3xl font-black mb-2 dark:text-white">{t("reset_title")}</h2>
           <p className="text-slate-500 dark:text-slate-400">{t("reset_subtitle")}</p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Succès</h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">
                {t("reset_success_msg")}
              </p>
              <Link href="/login">
                <Button className="w-full h-14 rounded-2xl font-bold text-lg">
                  {t("back_to_login")}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6" 
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex flex-col items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl p-4 text-sm font-medium text-center"
                  >
                    <div className="flex items-center gap-2">
                       <AlertCircle className="w-5 h-5 shrink-0" />
                       {error}
                    </div>
                    {error === t("invalid_token") && (
                       <Link href="/forgot-password" className="mt-2 w-full">
                          <Button variant="outline" className="w-full bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400">
                             {t("btn_request_new")}
                          </Button>
                       </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Only show inputs if there's no fatal token error, although keeping them editable allows user to retry if it was a network error */}
              <div className="space-y-5">
                 {/* Password Field */}
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("password_label")}</label>
                   <div className="relative group">
                     <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                     <input 
                       type={showPassword ? "text" : "password"}
                       required 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className={cn(
                          "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                       )}
                       placeholder={t("password_placeholder")}
                       dir="ltr"
                     />
                     <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn("absolute top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors", isRTL ? "left-2" : "right-2")}
                     >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                   </div>
                   
                   {/* Strength Indicator */}
                   <div className="flex items-center gap-2 mt-2 ml-1">
                      <div className="flex gap-1 flex-1 h-1.5">
                         <div className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", password.length > 0 ? strength.color : "bg-slate-200 dark:bg-slate-800")} />
                         <div className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", strength.score >= 2 ? strength.color : "bg-slate-200 dark:bg-slate-800")} />
                         <div className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", strength.score >= 3 ? strength.color : "bg-slate-200 dark:bg-slate-800")} />
                      </div>
                      <span className={cn("text-[10px] uppercase font-black tracking-widest min-w-[50px] text-right", password ? strength.color.replace('bg-', 'text-') : "text-slate-400")}>
                         {t(strength.label)}
                      </span>
                   </div>
                 </div>

                 {/* Confirm Password Field */}
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("confirm_label")}</label>
                   <div className="relative group">
                     <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                     <input 
                       type={showPassword ? "text" : "password"}
                       required 
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       className={cn(
                          "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                       )}
                       placeholder={t("confirm_placeholder")}
                       dir="ltr"
                     />
                   </div>
                 </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !token || strength.score < 3 || password !== confirmPassword}
                className="w-full h-14 rounded-2xl font-bold text-lg mt-6 group shadow-xl shadow-blue-600/20"
              >
                 {loading ? t("btn_submitting") : t("btn_reset")}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
