"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/i18n/routing"
import { useToastStore } from "@/store/toastStore"
import { cn } from "@/lib/utils"

/* ─── Floating orbs background (pure CSS, no JS) ─────────────────── */
function BackgroundOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Soft blue orb — top-left */}
      <div className="
        absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full
        bg-blue-400/10 dark:bg-blue-500/10
        blur-[120px]
      " />
      {/* Soft indigo orb — bottom-right */}
      <div className="
        absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full
        bg-indigo-400/10 dark:bg-indigo-500/10
        blur-[140px]
      " />
      {/* Subtle emerald accent — center */}
      <div className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[300px] h-[300px] rounded-full
        bg-emerald-400/5 dark:bg-emerald-500/5
        blur-[100px]
      " />
    </div>
  )
}

/* ─── Animated step dots ─────────────────────────────────────────── */
function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {[1, 2].map((s) => (
        <motion.div
          key={s}
          animate={{
            width:  s === step ? 24 : 8,
            backgroundColor: s === step
              ? "rgb(59 130 246)"        /* blue-500 */
              : s < step
              ? "rgb(16 185 129)"        /* emerald-500 */
              : "rgb(203 213 225)",      /* slate-300 */
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

/* ─── Floating label input ───────────────────────────────────────── */
function FloatingInput({ id, type = "text", value, onChange, label, placeholder, icon: Icon, dir, required }) {
  const [focused, setFocused] = React.useState(false)
  const filled = value.length > 0

  return (
    <div className="relative">
      {/* Glow ring on focus */}
      <motion.div
        animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.96 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-2xl bg-blue-500/8 dark:bg-blue-400/10 blur-sm pointer-events-none"
      />

      <div className={cn(
        "relative flex items-center overflow-hidden rounded-2xl transition-all duration-200",
        "bg-slate-50/80 dark:bg-slate-800/50",
        "border",
        focused
          ? "border-blue-500 dark:border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
          : "border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600",
      )}>
        {/* Leading icon */}
        <div className={cn("absolute top-1/2 -translate-y-1/2 pl-4 transition-colors duration-200", focused ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")}>
          <Icon className="w-[18px] h-[18px]" />
        </div>

        {/* Input */}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          dir={dir}
          placeholder=" "
          className="
            peer w-full bg-transparent
            pl-11 pr-4 pt-6 pb-2
            text-[15px] font-medium text-slate-900 dark:text-white
            placeholder-transparent
            focus:outline-none
          "
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={cn(
            "absolute left-11 transition-all duration-200 select-none pointer-events-none font-medium",
            focused || filled
              ? "top-2.5 text-[11px] tracking-wider uppercase text-blue-500 dark:text-blue-400"
              : "top-1/2 -translate-y-1/2 text-[15px] text-slate-400 dark:text-slate-500",
          )}
        >
          {label}
        </label>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
export function ForgotPasswordForm() {
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
      await new Promise(resolve => setTimeout(resolve, 1200))
      setSuccess(true)
    } catch {
      addToast({ title: t("network_error"), type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = email.trim().length > 0 && !loading

  return (
    <>
      <BackgroundOrbs />

      <div className="w-full">

        {/* ── Mobile title ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:hidden mb-8 text-center"
        >
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            {t("forgot_title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            {t("forgot_subtitle")}
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="
            relative z-10 w-full lg:max-w-md mx-auto
            bg-white/80 dark:bg-[#0a0f1e]/90
            backdrop-blur-xl
            rounded-[28px]
            border border-slate-200/80 dark:border-white/[0.06]
            shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)]
            dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]
            overflow-hidden
          "
        >

          {/* Card top accent line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400" />

          <div className="p-7 sm:p-9 md:p-10">

            {/* ── Desktop header ── */}
            <div className="hidden lg:flex items-start justify-between mb-7">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                    {t("account_recovery")}
                  </span>
                </div>
                <h2 className="text-[28px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {t("forgot_title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] mt-1">
                  {t("forgot_subtitle")}
                </p>
              </div>
            </div>

            <StepIndicator step={success ? 2 : 1} />

            <AnimatePresence mode="wait">

              {/* ── Success state ── */}
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-4"
                >
                  {/* Icon with pulsing rings */}
                  <div className="relative inline-flex items-center justify-center mb-7">
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-emerald-400/30"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0, 0.15] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="absolute inset-0 rounded-full bg-emerald-400/20"
                    />
                    <div className="relative w-[72px] h-[72px] rounded-full bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/25">
                      <CheckCircle2 className="w-9 h-9 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Sent-to badge */}
                  {email && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 mb-5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">{email}</span>
                    </div>
                  )}

                  <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[300px] mx-auto mb-8">
                    {t("forgot_success_msg")}
                  </p>

                  <Link href="/login">
                    <Button className="
                      w-full h-[54px] rounded-2xl font-bold text-[16px]
                      bg-gradient-to-r from-blue-600 to-indigo-600
                      hover:from-blue-500 hover:to-indigo-500
                      text-white border-0 shadow-lg shadow-blue-500/20
                      transition-all duration-200
                    ">
                      {t("back_to_login")}
                    </Button>
                  </Link>

                  <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-5">
                    {t("no_email_hint")}{" "}
                    <button
                      onClick={() => { setSuccess(false); setEmail("") }}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                    >
                      {t("try_again")}
                    </button>
                  </p>
                </motion.div>

              ) : (

                /* ── Form state ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                  onSubmit={handleSubmit}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {/* Floating label email input */}
                  <FloatingInput
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label={t("email_label")}
                    icon={Mail}
                    dir="ltr"
                  />

                  {/* Hint text */}
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 px-1 leading-relaxed">
                    {t("forgot_hint")}
                  </p>

                  {/* Submit button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={cn(
                        "relative w-full h-[54px] rounded-2xl font-bold text-[16px] text-white",
                        "transition-all duration-200 overflow-hidden",
                        "bg-gradient-to-r from-blue-600 to-indigo-600",
                        "hover:from-blue-500 hover:to-indigo-500",
                        "shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-500/25",
                        "active:scale-[0.99]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                      )}
                    >
                      {/* Shimmer on hover */}
                      <span className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
                              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            {t("btn_submitting")}
                          </>
                        ) : (
                          <>
                            {t("btn_send_link")}
                            <Mail className="w-4 h-4 opacity-80" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center gap-4 pt-1">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                    <span className="text-[12px] text-slate-400 dark:text-slate-600 font-medium">or</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                  </div>

                  {/* Back to login */}
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="
                        inline-flex items-center gap-2
                        text-[14px] font-semibold
                        text-slate-500 dark:text-slate-400
                        hover:text-blue-600 dark:hover:text-blue-400
                        transition-colors duration-150
                        group
                      "
                    >
                      <ArrowLeft className={cn(
                        "w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1",
                        isRTL && "rotate-180 group-hover:translate-x-1 group-hover:-rotate-180"
                      )} />
                      {t("back_to_login")}
                    </Link>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Card bottom footer */}
          <div className="px-9 pb-6 text-center">
            <p className="text-[12px] text-slate-400 dark:text-slate-600">
              {t("secure_note")}{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                {t("privacy_policy")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}