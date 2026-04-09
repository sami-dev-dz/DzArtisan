"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Google SVG (inline, no external dependency)
───────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-[18px] h-[18px] shrink-0"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   Floating label input wrapper
───────────────────────────────────────────── */
function InputField({
  label,
  id,
  icon: Icon,
  error,
  rightSlot,
  isRTL,
  inputProps,
  hint,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 select-none"
      >
        {label}
      </label>
      <div className="relative group">
        {/* left/right icon */}
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors duration-200",
            "text-slate-350 group-focus-within:text-blue-500 dark:text-slate-500 dark:group-focus-within:text-blue-400",
            isRTL ? "right-4" : "left-4",
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>

        <input
          id={id}
          {...inputProps}
          className={cn(
            "peer w-full rounded-xl py-3.5 text-[15px] font-medium transition-all duration-200",
            "bg-slate-50 dark:bg-[#0d1326]",
            "text-slate-900 dark:text-slate-100",
            "placeholder:text-slate-300 dark:placeholder:text-slate-600",
            "focus:outline-none focus:ring-2",
            isRTL ? "pr-11 pl-12" : "pl-11 pr-12",
            error
              ? "border border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-500/20"
              : "border border-slate-200 dark:border-white/8 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
          )}
        />

        {/* right slot (e.g., show/hide password) */}
        {rightSlot && (
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              isRTL ? "left-2" : "right-2",
            )}
          >
            {rightSlot}
          </span>
        )}
      </div>

      {/* hint text below field */}
      {hint && !error && (
        <p className="text-[11px] text-slate-400 dark:text-slate-600 ml-1">
          {hint}
        </p>
      )}

      {/* animated error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-[12px] font-medium text-red-500 ml-1"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab pill
───────────────────────────────────────────── */
function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-colors duration-200 z-10",
        active
          ? "text-white"
          : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
      )}
    >
      {active && (
        <motion.span
          layoutId="loginTabBg"
          className="absolute inset-0 rounded-lg bg-blue-600 shadow-md shadow-blue-600/30 -z-10"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function LoginForm() {
  const t = useTranslations("authentication");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { login } = useAuth();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = React.useState("client");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [genericError, setGenericError] = React.useState(null);

  const validateEmail = (val) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setErrors((prev) => {
      if (val && !ok) return { ...prev, email: t("email_invalid") };
      const { email: _, ...rest } = prev;
      return rest;
    });
  };

  const resetForm = () => {
    setErrors({});
    setGenericError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetForm();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login({ email, password, role: activeTab });
      addToast({ title: t("success"), type: "success" });
    } catch (err) {
      if (!err.response) {
        addToast({ title: t("network_error"), type: "error" });
      } else {
        setGenericError(t("generic_login_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    addToast({
      title: t("oauth_coming_soon_title"),
      message: t("oauth_coming_soon_message"),
      type: "info",
    });
  };

  return (
    <div className="w-full">
      {/* ── Mobile header ── */}
      <div className="lg:hidden mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">
          {t("login_title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[15px]">
          {t("login_subtitle")}
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className={cn(
          "relative z-10 w-full lg:max-w-[420px] mx-auto",
          "bg-white dark:bg-[#111827]",
          "border border-slate-150 dark:border-white/[0.06]",
          "rounded-2xl overflow-hidden",
          "shadow-[0_8px_40px_rgba(0,0,0,0.07)] dark:shadow-[0_8px_60px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* ── top accent bar ── */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

        <div className="px-7 py-8 sm:px-8 sm:py-9">
          {/* ── Desktop header ── */}
          <div className="hidden lg:flex items-start justify-between mb-7">
            <div>
              <h2 className="text-[26px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {t("login_title")}
              </h2>
              <p className="mt-1 text-[14px] text-slate-400 dark:text-slate-500">
                {t("login_subtitle")}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* ── Generic error ── */}
          <AnimatePresence>
            {genericError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-[13px] font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {genericError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Tab toggle ── */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-[#0d1326] border border-slate-200 dark:border-white/[0.05] rounded-xl mb-7">
            <Tab
              active={activeTab === "client"}
              onClick={() => {
                setActiveTab("client");
                resetForm();
              }}
            >
              {t("tab_client")}
            </Tab>
            <Tab
              active={activeTab === "artisan"}
              onClick={() => {
                setActiveTab("artisan");
                resetForm();
              }}
            >
              {t("tab_artisan")}
            </Tab>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <InputField
              id="login-email"
              label={t("email_label")}
              icon={Mail}
              isRTL={isRTL}
              error={errors.email}
              hint={
                t("email_hint")
              }
              inputProps={{
                type: "email",
                required: true,
                value: email,
                autoComplete: "email",
                placeholder: t("email_placeholder"),
                dir: "ltr",
                onChange: (e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                },
              }}
            />

            {/* Password */}
            <InputField
              id="login-password"
              label={t("password_label")}
              icon={Lock}
              isRTL={isRTL}
              error={errors.password}
              hint={
                t("password_hint")
              }
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-2 text-slate-350 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg"
                  aria-label={
                    showPassword
                      ? t("hide_password")
                      : t("show_password")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              inputProps={{
                type: showPassword ? "text" : "password",
                required: true,
                value: password,
                autoComplete: "current-password",
                placeholder: t("password_placeholder"),
                dir: "ltr",
                onChange: (e) => setPassword(e.target.value),
              }}
            />

            {/* Forgot link — phrased as "reminder" */}
            <div
              className={cn("flex", isRTL ? "justify-start" : "justify-end")}
            >
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {t("forgot_link")}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "relative w-full h-12 mt-2 rounded-xl font-bold text-[15px] tracking-wide transition-all duration-200",
                "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]",
                "text-white shadow-lg shadow-blue-600/25",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#080d1c]",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
                "flex items-center justify-center gap-2 group",
              )}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  {t("btn_submitting")}
                </>
              ) : (
                <>
                  {t("btn_login")}
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5",
                      isRTL && "rotate-180",
                    )}
                  />
                </>
              )}
            </button>
          </form>

          {/* ── Google OAuth (clients only) ── */}
          <AnimatePresence mode="wait">
            {activeTab === "client" && (
              <motion.div
                key="client-oauth"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="mt-6"
              >
                <div className="relative flex items-center my-5">
                  <div className="flex-grow border-t border-slate-100 dark:border-white/[0.06]" />
                  <span className="flex-shrink-0 mx-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300 dark:text-slate-600">
                    {t("or_continue_with")}
                  </span>
                  <div className="flex-grow border-t border-slate-100 dark:border-white/[0.06]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={cn(
                    "w-full flex items-center justify-center gap-2.5 h-11 rounded-xl",
                    "border border-slate-200 dark:border-white/[0.07]",
                    "bg-white dark:bg-[#0d1326]",
                    "text-slate-700 dark:text-slate-300 text-[13px] font-semibold",
                    "hover:bg-slate-50 dark:hover:bg-[#161c2e] transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700",
                  )}
                >
                  <GoogleIcon />
                  {t("google_btn")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer ── */}
          <div className="mt-7 pt-6 border-t border-slate-100 dark:border-white/[0.05] flex flex-col items-center gap-3">
            <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">
              {t("no_account_prefix")}{" "}
              <Link
                href="/register"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
              >
                {t("no_account_action")}
              </Link>
            </p>

            {/* Trust signal */}
            <span className="flex items-center gap-1.5 text-[11px] text-slate-300 dark:text-slate-700 font-medium select-none">
              <ShieldCheck className="w-3 h-3" />
              {t("trust_signal")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
