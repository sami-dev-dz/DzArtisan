"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserPlus, Info, User, Phone, Check, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link, useRouter } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { useToastStore } from "@/store/toastStore"
import { cn } from "@/lib/utils"

// Password strength calculation
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

export default function RegisterPage() {
  const t = useTranslations("authentication")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const router = useRouter()
  const { register } = useAuth()
  const { addToast } = useToastStore()

  // State
  const [activeTab, setActiveTab] = React.useState("client")
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  })
  
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  
  // Validation Errors
  const [errors, setErrors] = React.useState({})
  const [genericError, setGenericError] = React.useState(null)

  // Derived state
  const strength = calculateStrength(formData.password)

  const handleChange = (field, value) => {
     setFormData(prev => ({ ...prev, [field]: value }))
     // Clear error for this field as user types
     if (errors[field]) {
        setErrors(prev => {
           const newErrors = { ...prev }
           delete newErrors[field]
           return newErrors
        })
     }

     // Real-time validations
     if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
           setErrors(prev => ({ ...prev, email: t("email_invalid") }))
        } else {
           setErrors(prev => {
              const { email, ...rest } = prev
              return rest
           })
        }
     }

     if (field === 'phone') {
        // Algerian phone format: 05, 06, or 07 followed by 8 digits
        const phoneRegex = /^(05|06|07)[0-9]{8}$/
        if (value && !phoneRegex.test(value)) {
           setErrors(prev => ({ ...prev, phone: t("phone_invalid") }))
        } else {
           setErrors(prev => {
              const { phone, ...rest } = prev
              return rest
           })
        }
     }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGenericError(null)
    setLoading(true)

    // Pre-flight validation
    const newErrors = {}
    if (strength.score < 3) newErrors.password = t("password_min_length")
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t("confirm_mismatch")
    if (!formData.termsAccepted) newErrors.terms = "Please accept the terms." // Not translated yet, standard requirement
    
    if (Object.keys(newErrors).length > 0) {
       setErrors(prev => ({ ...prev, ...newErrors }))
       setLoading(false)
       return
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: activeTab,
        telephone: formData.phone,
      })
      
      // On success:
      // "On successful client signup, log them in automatically and redirect to the artisan browsing page. 
      // On successful artisan signup, do not log them in — navigate to the artisan profile setup page"
      addToast({
         title: t("success") || "Compte créé avec succès",
         type: "success"
      })
      
    } catch (err) {
      if (!err.response) {
        addToast({ title: t("network_error"), type: "error" })
      } else {
         const apiError = err.response?.data?.message || ""
         const validationErrors = err.response?.data?.errors || {}
         
         // Duplicate handling required by prompt
         if (apiError.toLowerCase().includes("email") || validationErrors?.email) {
            setErrors(prev => ({ ...prev, email: t("duplicate_email") }))
         } else if (apiError.toLowerCase().includes("phone") || validationErrors?.telephone || validationErrors?.phone) {
            setErrors(prev => ({ ...prev, phone: t("duplicate_phone") }))
         } else {
            setGenericError(apiError || t("error"))
         }
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
        <h1 className="text-3xl font-black mb-2">{t("register_title")}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t("register_subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-[#0a0f1e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/5 relative z-10 w-full lg:max-w-[500px] mx-auto">
        
        <div className="hidden lg:block mb-8">
           <h2 className="text-3xl font-black mb-2 dark:text-white">{t("register_title")}</h2>
           <p className="text-slate-500 dark:text-slate-400">{t("register_subtitle")}</p>
        </div>

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
              <motion.div layoutId="regTab" className="absolute inset-0 bg-blue-600 rounded-xl -z-10" />
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
              <motion.div layoutId="regTab" className="absolute inset-0 bg-blue-600 rounded-xl -z-10" />
            )}
            {t("tab_artisan")}
          </button>
        </div>

        {/* Artisan Pre-Warning */}
        <AnimatePresence>
           {activeTab === "artisan" && (
              <motion.div
                 initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                 animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                 exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                 transition={{ duration: 0.2 }}
                 className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4"
              >
                 <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                 <p className="text-sm font-medium leading-relaxed text-blue-800 dark:text-blue-300">
                    {t("artisan_pending_note")}
                 </p>
              </motion.div>
           )}
        </AnimatePresence>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             {/* Name Field */}
             <div className="space-y-1 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("name_label")}</label>
               <div className="relative group">
                 <User className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                 <input 
                   type="text" 
                   required
                   value={formData.name}
                   onChange={(e) => handleChange('name', e.target.value)}
                   className={cn(
                      "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                   )}
                   placeholder={t("name_placeholder")}
                   dir={isRTL ? "rtl" : "ltr"}
                 />
               </div>
               {activeTab === "artisan" && (
                 <p className="text-xs text-slate-400 font-medium ml-1 mt-1">{t("name_artisan_hint")}</p>
               )}
             </div>

             {/* Phone Field */}
             <div className="space-y-1 ml-col-span-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("phone_label")}</label>
               <div className="relative flex">
                 <div className={cn(
                    "flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 text-slate-600 dark:text-slate-300 font-bold",
                    isRTL ? "rounded-r-2xl border-l-0" : "rounded-l-2xl border-r-0"
                 )}>
                    +213
                 </div>
                 <input 
                   type="tel" 
                   required
                   value={formData.phone}
                   onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                   className={cn(
                      "w-full bg-slate-50 dark:bg-slate-900/50 border py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600",
                      isRTL ? "rounded-l-2xl" : "rounded-r-2xl",
                      errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                   )}
                   placeholder="05 / 06 / 07 XX XX XX"
                   dir="ltr"
                 />
               </div>
               <AnimatePresence>
                  {errors.phone && (
                     <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-medium text-red-500 ml-1 mt-1">
                        {errors.phone}
                     </motion.p>
                  )}
               </AnimatePresence>
             </div>

             {/* Email Field */}
             <div className="space-y-1 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("email_label")}</label>
               <div className="relative flex flex-col">
                  <div className="relative group">
                    <Mail className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={cn(
                         "w-full bg-slate-50 dark:bg-slate-900/50 border rounded-2xl py-3.5 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600",
                         errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                      )}
                      placeholder={t("email_placeholder")}
                      dir="ltr"
                    />
                  </div>
                  {errors.email && errors.email === t("duplicate_email") && (
                     <p className="text-xs font-medium text-red-500 ml-1 mt-1 flex items-center gap-1">
                        {errors.email}
                        <Link href="/login" className="text-blue-600 underline hover:text-blue-700 ml-1">
                           Se connecter
                        </Link>
                     </p>
                  )}
                  {errors.email && errors.email !== t("duplicate_email") && (
                     <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-red-500 ml-1 mt-1">
                        {errors.email}
                     </motion.p>
                  )}
               </div>
             </div>

             {/* Password Field */}
             <div className="space-y-1 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("password_label")}</label>
               <div className="relative group">
                 <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                 <input 
                   type={showPassword ? "text" : "password"}
                   required 
                   value={formData.password}
                   onChange={(e) => handleChange('password', e.target.value)}
                   className={cn(
                      "w-full bg-slate-50 dark:bg-slate-900/50 border rounded-2xl py-3.5 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600",
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
               
               {/* Strength Indicator */}
               <div className="flex items-center gap-2 mt-2 ml-1">
                  <div className="flex gap-1 flex-1 h-1.5">
                     <div className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", formData.password.length > 0 ? strength.color : "bg-slate-200 dark:bg-slate-800")} />
                     <div className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", strength.score >= 2 ? strength.color : "bg-slate-200 dark:bg-slate-800")} />
                     <div className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", strength.score >= 3 ? strength.color : "bg-slate-200 dark:bg-slate-800")} />
                  </div>
                  <span className={cn("text-[10px] uppercase font-black tracking-widest min-w-[50px] text-right", formData.password ? strength.color.replace('bg-', 'text-') : "text-slate-400")}>
                     {t(strength.label)}
                  </span>
               </div>
               <AnimatePresence>
                  {errors.password && (
                     <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-medium text-red-500 ml-1 mt-1">
                        {errors.password}
                     </motion.p>
                  )}
               </AnimatePresence>
             </div>

             {/* Confirm Password */}
             <div className="space-y-1 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("confirm_label")}</label>
               <div className="relative group">
                 <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                 <input 
                   type={showPassword ? "text" : "password"}
                   required 
                   value={formData.confirmPassword}
                   onChange={(e) => handleChange('confirmPassword', e.target.value)}
                   className={cn(
                      "w-full bg-slate-50 dark:bg-slate-900/50 border rounded-2xl py-3.5 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600",
                      errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                   )}
                   placeholder={t("confirm_placeholder")}
                   dir="ltr"
                 />
               </div>
               <AnimatePresence>
                  {errors.confirmPassword && (
                     <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-medium text-red-500 ml-1 mt-1">
                        {errors.confirmPassword}
                     </motion.p>
                  )}
               </AnimatePresence>
             </div>
          </div>

          <div className="flex items-start gap-3 mt-4">
             <div className="flex items-center h-5 mt-0.5">
               <input 
                 type="checkbox" 
                 id="terms" 
                 checked={formData.termsAccepted}
                 onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                 className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/50 dark:bg-slate-900 dark:border-slate-700 dark:checked:bg-blue-600"
               />
             </div>
             <label htmlFor="terms" className={cn("text-xs leading-relaxed text-slate-600 dark:text-slate-400", errors.terms && "text-red-500")}>
                {t("terms_prefix")} <Link href="/terms" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t("terms_link")}</Link> {t("privacy_prefix")} <Link href="/privacy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t("privacy_link")}</Link>.
             </label>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl font-bold text-lg mt-6 group shadow-xl shadow-blue-600/20"
          >
             {loading ? t("btn_submitting") : (
                <>
                  {t("btn_register")}
                  <ArrowRight className={cn("ml-2 h-5 w-5 transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} />
                </>
             )}
          </Button>
        </form>

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
              ) : (
                 <motion.div
                    key="artisan-note"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                 >
                    {/* Empty space filler to prevent jumping too much if desired, but hidden by layout */}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
          <Link href="/login" className="inline-flex items-center text-slate-500 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors group">
             {t("have_account")}
             <ArrowRight className={cn("ml-2 h-4 w-4 transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} />
          </Link>
        </div>
      </div>
    </div>
  )
}
