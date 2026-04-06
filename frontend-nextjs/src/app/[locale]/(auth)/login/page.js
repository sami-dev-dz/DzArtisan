"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link, useRouter } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { useToastStore } from "@/store/toastStore"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const t = useTranslations("authentication")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const router = useRouter()
  const { login } = useAuth()
  const { addToast } = useToastStore()

  // State
  const [activeTab, setActiveTab] = React.useState("client")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  
  // Validation Errors
  const [errors, setErrors] = React.useState({})
  const [genericError, setGenericError] = React.useState(null)

  // Real-time Email Validation
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (val && !emailRegex.test(val)) {
      setErrors((prev) => ({ ...prev, email: t("email_invalid") }))
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev
        return rest
      })
    }
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    validateEmail(val)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGenericError(null)
    setErrors({})
    setLoading(true)

    // Final pre-flight validation
    if (!email || !password) {
      setLoading(false)
      return
    }
    
    try {
      await login({ email, password })
      addToast({
         title: t("success") || "Connexion réussie",
         type: "success"
      })
    } catch (err) {
      if (!err.response) {
        addToast({
          title: t("network_error"),
          type: "error"
        })
      } else {
        setGenericError(t("generic_login_error"))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    addToast({
      title: "Google OAuth en développement",
      message: "Cette fonctionnalité sera disponible prochainement.",
      type: "info"
    })
  }

  return (
    <div className="w-full">
      {/* Mobile Title */}
      <div className="lg:hidden mb-8 text-center text-slate-900 dark:text-white">
        <h1 className="text-3xl font-black mb-2">{t("login_title")}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t("login_subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-[#0a0f1e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/5 relative z-10 w-full lg:max-w-md mx-auto">
        
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
           <h2 className="text-3xl font-black mb-2 dark:text-white">{t("login_title")}</h2>
           <p className="text-slate-500 dark:text-slate-400">{t("login_subtitle")}</p>
        </div>

        {/* Generic Error message */}
        <AnimatePresence>
          {genericError && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl px-4 py-3 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {genericError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl mb-8 border border-slate-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => { setActiveTab("client"); setErrors({}); setGenericError(null); }}
            className={cn(
               "relative flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10",
               activeTab === "client" ? "text-white shadow-lg" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            {activeTab === "client" && (
              <motion.div layoutId="loginTab" className="absolute inset-0 bg-blue-600 rounded-xl -z-10" />
            )}
            {t("tab_client")}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("artisan"); setErrors({}); setGenericError(null); }}
            className={cn(
               "relative flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10",
               activeTab === "artisan" ? "text-white shadow-lg" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            {activeTab === "artisan" && (
              <motion.div layoutId="loginTab" className="absolute inset-0 bg-blue-600 rounded-xl -z-10" />
            )}
            {t("tab_artisan")}
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("email_label")}</label>
            <div className="relative group">
              <Mail className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
              <input 
                type="email" 
                required
                value={email}
                onChange={handleEmailChange}
                className={cn(
                   "w-full bg-slate-50 dark:bg-slate-900/50 border rounded-2xl py-4 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600",
                   errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                )}
                placeholder={t("email_placeholder")}
                dir="ltr"
              />
            </div>
            <AnimatePresence>
               {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-medium text-red-500 ml-1 mt-1">
                     {errors.email}
                  </motion.p>
               )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className={cn("flex items-center ml-1", isRTL ? "justify-end" : "justify-between")}>
               {!isRTL && <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("password_label")}</label>}
               <Link href="/forgot-password" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                  {t("forgot_link")}
               </Link>
               {isRTL && <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-auto">{t("password_label")}</label>}
            </div>
            
            <div className="relative group">
              <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                   "w-full bg-slate-50 dark:bg-slate-900/50 border rounded-2xl py-4 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600",
                   errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                )}
                placeholder={t("password_placeholder")}
                dir="ltr"
              />
              <button 
                 type="button" 
                 onClick={() => setShowPassword(!showPassword)}
                 className={cn("absolute top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors", isRTL ? "left-2" : "right-2")}
              >
                 {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <AnimatePresence>
               {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-medium text-red-500 ml-1 mt-1">
                     {errors.password}
                  </motion.p>
               )}
            </AnimatePresence>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl font-bold text-lg mt-4 group shadow-xl shadow-blue-600/20"
          >
             {loading ? t("btn_submitting") : (
                <>
                  {t("btn_login")}
                  <ArrowRight className={cn("ml-2 h-5 w-5 transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} />
                </>
             )}
          </Button>
        </form>

        {/* Dynamic Action Section */}
        <div className="mt-8">
           <AnimatePresence mode="wait">
              {activeTab === "client" ? (
                 <motion.div
                    key="client-oauth"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                 >
                    <div className="relative flex items-center py-4">
                       <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                       <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">
                          {t("or_continue_with")}
                       </span>
                       <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    
                    <button
                       type="button"
                       onClick={handleGoogleLogin}
                       className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                       </svg>
                       {t("google_btn")}
                    </button>
                 </motion.div>
              ) : null}
           </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
          <Link href="/register" className="inline-flex items-center text-slate-500 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors group">
             {t("no_account")}
             <ArrowRight className={cn("ml-2 h-4 w-4 transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} />
          </Link>
        </div>
      </div>
    </div>
  )
}
