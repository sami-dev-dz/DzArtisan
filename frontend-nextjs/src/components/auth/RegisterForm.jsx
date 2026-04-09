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
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Password strength
───────────────────────────────────────────── */
const calcStrength = (pw) => {
  if (!pw) return { score: 0, label: "strength_empty" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: "strength_weak" };
  if (s === 2) return { score: s, label: "strength_medium" };
  return { score: s, label: "strength_strong" };
};

const strengthMeta = {
  strength_empty: {
    bars: 0,
    text: "text-slate-300 dark:text-slate-700",
    bar: "bg-slate-200 dark:bg-slate-800",
  },
  strength_weak: { bars: 1, text: "text-red-500", bar: "bg-red-500" },
  strength_medium: { bars: 2, text: "text-amber-500", bar: "bg-amber-500" },
  strength_strong: { bars: 3, text: "text-emerald-500", bar: "bg-emerald-500" },
};

/* ─────────────────────────────────────────────
   Google icon
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

const DzFlagIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 rounded-full overflow-hidden" aria-hidden="true">
    <rect x="0" y="0" width="12" height="24" fill="#0f9d58" />
    <rect x="12" y="0" width="12" height="24" fill="#ffffff" />
    <path
      d="M14.4 6.9a5.2 5.2 0 1 0 0 10.2 4.2 4.2 0 1 1 0-10.2z"
      fill="#d93025"
    />
    <path
      d="M16.8 10.3l0.7 2.1h2.2l-1.8 1.3 0.7 2.1-1.8-1.3-1.8 1.3 0.7-2.1-1.8-1.3h2.2z"
      fill="#d93025"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   Reusable field wrapper
───────────────────────────────────────────── */
function Field({
  label,
  id,
  icon: Icon,
  isRTL,
  error,
  hint,
  rightSlot,
  children,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 select-none"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors duration-200",
              "text-slate-400 group-focus-within:text-blue-500 dark:text-slate-500 dark:group-focus-within:text-blue-400",
              isRTL ? "right-4" : "left-4",
            )}
          >
            <Icon className="w-[17px] h-[17px]" />
          </span>
        )}
        {children}
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
      {hint && !error && (
        <p className="text-[11px] text-slate-400 dark:text-slate-600 ml-0.5">
          {hint}
        </p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="flex items-center gap-1.5 text-[12px] font-medium text-red-500 ml-0.5"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* shared input className factory */
const inputCls = (error, isRTL, extra = "") =>
  cn(
    "w-full rounded-xl py-3.5 text-[14px] font-medium transition-all duration-200",
    "bg-slate-50 dark:bg-[#0d1326]",
    "text-slate-900 dark:text-slate-100",
    "placeholder:text-slate-300 dark:placeholder:text-slate-600",
    "focus:outline-none focus:ring-2",
    isRTL ? "pr-11 pl-4" : "pl-11 pr-4",
    error
      ? "border border-red-400 dark:border-red-500 focus:ring-red-500/20"
      : "border border-slate-200 dark:border-white/[0.08] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
    extra,
  );

/* ─────────────────────────────────────────────
   Tab button
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
          layoutId="regTabBg"
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
export function RegisterForm() {
  const t = useTranslations("authentication");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { register } = useAuth();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = React.useState("client");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const submitLockRef = React.useRef(false);
  const [errors, setErrors] = React.useState({});
  const [genericError, setGenericError] = React.useState(null);
  const phoneValid = /^(05|06|07)[0-9]{8}$/.test(formData.phone);

  const strength = calcStrength(formData.password);
  const sm = strengthMeta[strength.label];

  const clearField = (field) =>
    setErrors((p) => {
      const n = { ...p };
      delete n[field];
      return n;
    });

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    clearField(field);

    if (field === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        setErrors((p) => ({ ...p, email: t("email_invalid") }));
      else clearField("email");
    }
    if (field === "phone") {
      if (value && !/^(05|06|07)[0-9]{8}$/.test(value))
        setErrors((p) => ({ ...p, phone: t("phone_invalid") }));
      else clearField("phone");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLockRef.current || loading) return;
    setGenericError(null);
    const errs = {};
    if (strength.score < 3) errs.password = t("password_min_length");
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = t("confirm_mismatch");
    if (!formData.termsAccepted)
      errs.terms = t("terms_required");
    if (Object.keys(errs).length) {
      setErrors((p) => ({ ...p, ...errs }));
      return;
    }

    setLoading(true);
    submitLockRef.current = true;
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: activeTab,
        telephone: formData.phone,
      });
      addToast({
        title: t("success"),
        type: "success",
      });
    } catch (err) {
      if (!err.response) {
        addToast({ title: t("network_error"), type: "error" });
      } else {
        const msg = err.response?.data?.message || "";
        const ve = err.response?.data?.errors || {};
        if (msg.toLowerCase().includes("email") || ve?.email)
          setErrors((p) => ({ ...p, email: t("duplicate_email") }));
        else if (msg.toLowerCase().includes("phone") || ve?.telephone)
          setErrors((p) => ({ ...p, phone: t("duplicate_phone") }));
        else setGenericError(msg || t("error"));
      }
    } finally {
      submitLockRef.current = false;
      setLoading(false);
    }
  };

  const handleGoogleLogin = () =>
    addToast({
      title: t("oauth_coming_soon_title"),
      message: t("oauth_coming_soon_message"),
      type: "info",
    });

  const resetTab = () => {
    setErrors({});
    setGenericError(null);
  };

  return (
    <div className="w-full">
      {/* ── Mobile header ── */}
      <div className="lg:hidden mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">
          {t("register_title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[15px]">
          {t("register_subtitle")}
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className={cn(
          "relative z-10 w-full lg:max-w-[500px] mx-auto",
          "bg-white dark:bg-[#111827]",
          "border border-slate-150 dark:border-white/[0.06]",
          "rounded-2xl overflow-hidden",
          "shadow-[0_8px_40px_rgba(0,0,0,0.07)] dark:shadow-[0_8px_60px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* top accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

        <div className="px-7 py-8 sm:px-8 sm:py-9">
          {/* ── Desktop header ── */}
          <div className="hidden lg:flex items-start justify-between mb-7">
            <div>
              <h2 className="text-[26px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {t("register_title")}
              </h2>
              <p className="mt-1 text-[14px] text-slate-400 dark:text-slate-500">
                {t("register_subtitle")}
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

          {/* ── Tabs ── */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-[#0d1326] border border-slate-200 dark:border-white/[0.05] rounded-xl mb-6">
            <Tab
              active={activeTab === "client"}
              onClick={() => {
                setActiveTab("client");
                resetTab();
              }}
            >
              {t("tab_client")}
            </Tab>
            <Tab
              active={activeTab === "artisan"}
              onClick={() => {
                setActiveTab("artisan");
                resetTab();
              }}
            >
              {t("tab_artisan")}
            </Tab>
          </div>

          {/* ── Artisan notice ── */}
          <AnimatePresence>
            {activeTab === "artisan" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-500 dark:text-blue-400 mt-0.5" />
                <p className="text-[13px] font-medium leading-relaxed text-blue-800 dark:text-blue-300">
                  {t("artisan_pending_note")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <Field
              id="reg-name"
              label={t("name_label")}
              icon={User}
              isRTL={isRTL}
              hint={
                activeTab === "artisan"
                  ? t("name_artisan_hint") ||
                  "Ce nom sera affiché publiquement sur votre profil artisan"
                  : undefined
              }
            >
              <input
                id="reg-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t("name_placeholder")}
                dir={isRTL ? "rtl" : "ltr"}
                autoComplete="name"
                className={inputCls(errors.name, isRTL)}
              />
            </Field>

            {/* Email */}
            <Field
              id="reg-email"
              label={t("email_label")}
              icon={Mail}
              isRTL={isRTL}
              error={errors.email}
            >
              <input
                id="reg-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t("email_placeholder")}
                dir="ltr"
                autoComplete="email"
                className={inputCls(errors.email, isRTL, "h-[54px]")}
              />
            </Field>

            {/* Phone */}
            <Field
              id="reg-phone"
              label={t("phone_label")}
              isRTL={isRTL}
              error={errors.phone}
            >
              <div className="flex h-[54px] group relative">
                <div
                  className={cn(
                    "flex items-center justify-center gap-1.5 px-3.5 text-[13px] font-bold shrink-0 transition-colors duration-200 h-full",
                    "bg-slate-100/50 dark:bg-white/[0.03]",
                    "text-slate-500 dark:text-slate-400",
                    "border border-slate-200 dark:border-white/[0.08]",
                    isRTL ? "rounded-r-xl border-l-0" : "rounded-l-xl border-r-0",
                    errors.phone && "border-red-400 dark:border-red-500/50",
                    "group-focus-within:border-blue-500 dark:group-focus-within:border-blue-400"
                  )}
                >
                  <span className="opacity-70 text-[12px]">+213</span>
                  <DzFlagIcon />
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="05XX XX XX XX"
                  dir="ltr"
                  autoComplete="tel"
                  className={cn(
                    "w-full h-full text-[15px] font-medium transition-all duration-200",
                    "bg-slate-50 dark:bg-[#0d1326]",
                    "text-slate-900 dark:text-white",
                    "placeholder:text-slate-300 dark:placeholder:text-slate-600",
                    "focus:outline-none focus:ring-2",
                    isRTL ? "rounded-l-xl pr-4 pl-10" : "rounded-r-xl pl-3 pr-10",
                    errors.phone
                      ? "border border-red-400 dark:border-red-500/50 focus:ring-red-500/20"
                      : "border border-slate-200 dark:border-white/[0.08] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20",
                  )}
                />
                {phoneValid && (
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2",
                    isRTL ? "left-3" : "right-3"
                  )}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
            </Field>

            {/* Password */}
            <Field
              id="reg-password"
              label={t("password_label")}
              icon={Lock}
              isRTL={isRTL}
              error={errors.password}
              hint={
                t("password_hint") ||
                "8 caractères minimum · majuscule · chiffre"
              }
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg"
                  aria-label={showPassword ? t("hide_password") : t("show_password")}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            >
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={t("password_placeholder")}
                dir="ltr"
                autoComplete="new-password"
                className={inputCls(
                  errors.password,
                  isRTL,
                  isRTL ? "pl-12" : "pr-12",
                )}
              />
            </Field>

            {/* Strength bar */}
            {formData.password && (
              <div className="flex items-center gap-2 -mt-2 px-0.5">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        strength.score >= i
                          ? sm.bar
                          : "bg-slate-200 dark:bg-slate-800",
                      )}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider shrink-0",
                    sm.text,
                  )}
                >
                  {t(strength.label)}
                </span>
              </div>
            )}

            {/* Confirm Password */}
            <Field
              id="reg-confirm"
              label={t("confirm_label")}
              icon={Lock}
              isRTL={isRTL}
              error={errors.confirmPassword}
              rightSlot={
                formData.confirmPassword &&
                  formData.confirmPassword === formData.password ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" />
                ) : null
              }
            >
              <input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder={t("confirm_placeholder")}
                dir="ltr"
                autoComplete="new-password"
                className={inputCls(
                  errors.confirmPassword,
                  isRTL,
                  isRTL ? "pl-10" : "pr-10",
                )}
              />
            </Field>

            {/* Terms */}
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl p-3.5 transition-colors",
                errors.terms
                  ? "bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20"
                  : "bg-slate-50 dark:bg-[#0d1326] border border-slate-100 dark:border-white/[0.04]",
              )}
            >
              <div className="flex items-center h-5 mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    handleChange("termsAccepted", e.target.checked);
                    clearField("terms");
                  }}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/40 dark:bg-slate-900 dark:checked:bg-blue-600 cursor-pointer"
                />
              </div>
              <label
                htmlFor="terms"
                className={cn(
                  "text-[12px] leading-relaxed cursor-pointer",
                  errors.terms
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-500 dark:text-slate-400",
                )}
              >
                {t("terms_prefix")}{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {t("terms_link")}
                </Link>{" "}
                {t("privacy_prefix")}{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {t("privacy_link")}
                </Link>
                .
              </label>
            </div>
            {errors.terms && (
              <p className="text-[12px] text-red-500 font-medium flex items-center gap-1.5 ml-0.5 -mt-2">
                <AlertCircle className="w-3 h-3" />
                {errors.terms}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "relative w-full h-12 mt-1 rounded-xl font-bold text-[15px] tracking-wide transition-all duration-200",
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
                  {t("btn_register")}
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
                  <div className="flex-grow border-t border-slate-100 dark:border-white/[0.05]" />
                  <span className="flex-shrink-0 mx-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300 dark:text-slate-600">
                    {t("or_continue_with")}
                  </span>
                  <div className="flex-grow border-t border-slate-100 dark:border-white/[0.05]" />
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
              {t("have_account_prefix")}{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
              >
                {t("have_account_action")}
              </Link>
            </p>
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
