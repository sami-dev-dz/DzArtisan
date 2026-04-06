"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/i18n/routing"
import { useToastStore } from "@/store/toastStore"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const t = useTranslations("authentication")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { addToast } = useToastStore()

  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      // await axios.post('/api/forgot-password', { email })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Always show success message for security reasons
      setSuccess(true)
    } catch (err) {
      addToast({
        title: t("network_error"),
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Mobile Title */}
      <div className="lg:hidden mb-8 text-center text-slate-900 dark:text-white">
        <h1 className="text-3xl font-black mb-2">{t("forgot_title")}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t("forgot_subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-[#0a0f1e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/5 relative z-10 w-full lg:max-w-md mx-auto">
        
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
           <h2 className="text-3xl font-black mb-2 dark:text-white">{t("forgot_title")}</h2>
           <p className="text-slate-500 dark:text-slate-400">{t("forgot_subtitle")}</p>
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
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">
                {t("forgot_success_msg")}
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
              className="space-y-5" 
              onSubmit={handleSubmit}
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("email_label")}</label>
                <div className="relative group">
                  <Mail className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder={t("email_placeholder")}
                    dir="ltr"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !email}
                className="w-full h-14 rounded-2xl font-bold text-lg mt-6 group shadow-xl shadow-blue-600/20"
              >
                 {loading ? t("btn_submitting") : t("btn_send_link")}
              </Button>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
                <Link href="/login" className="inline-flex items-center text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors group">
                   <ArrowLeft className={cn("mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1", isRTL && "ml-2 mr-0 rotate-180 group-hover:translate-x-1 group-hover:-rotate-180")} />
                   {t("back_to_login")}
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
