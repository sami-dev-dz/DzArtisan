"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

/* ─── Password strength ──────────────────────────────────────────── */
const calculateStrength = (password) => {
  if (!password) return { score: 0, label: "strength_empty" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (score <= 1) return { score, label: "strength_weak" };
  if (score === 2) return { score, label: "strength_medium" };
  return { score: 3, label: "strength_strong" };
};

const strengthMeta = {
  0: { bars: 0, color: "", textColor: "", label: "" },
  1: { bars: 1, color: "bg-red-500", textColor: "text-red-500", label: "Weak" },
  2: {
    bars: 2,
    color: "bg-amber-500",
    textColor: "text-amber-500",
    label: "Medium",
  },
  3: {
    bars: 3,
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    label: "Strong",
  },
};

/* ─── Background orbs ────────────────────────────────────────────── */
function BackgroundOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-400/5 dark:bg-violet-500/5 blur-[100px]" />
    </div>
  );
}

/* ─── Step indicator ─────────────────────────────────────────────── */
function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {[1, 2].map((s) => (
        <motion.div
          key={s}
          animate={{
            width: s === step ? 24 : 8,
            backgroundColor:
              s === step
                ? "rgb(59,130,246)"
                : s < step
                  ? "rgb(16,185,129)"
                  : "rgb(203,213,225)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

/* ─── Floating label password input ─────────────────────────────── */
function PasswordInput({
  id,
  value,
  onChange,
  label,
  showPassword,
  toggleShow,
  isRTL,
  showToggle = false,
  status = "idle",
}) {
  const [focused, setFocused] = React.useState(false);
  const filled = value.length > 0;

  const borderColor =
    status === "error"
      ? "border-red-400 dark:border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,.12)]"
      : status === "match"
        ? "border-emerald-400 dark:border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.12)]"
        : focused
          ? "border-blue-500 dark:border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,.12)]"
          : "border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600";

  const labelColor =
    status === "error"
      ? "text-red-500"
      : status === "match"
        ? "text-emerald-500"
        : focused
          ? "text-blue-500 dark:text-blue-400"
          : "text-slate-400 dark:text-slate-500";

  const iconColor =
    status === "error"
      ? "text-red-400"
      : status === "match"
        ? "text-emerald-500"
        : focused
          ? "text-blue-500 dark:text-blue-400"
          : "text-slate-400 dark:text-slate-500";

  return (
    <div className="relative">
      {/* Focus glow */}
      <motion.div
        animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.96 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-2xl bg-blue-500/8 dark:bg-blue-400/10 blur-sm pointer-events-none"
      />
      <div
        className={cn(
          "relative flex items-center overflow-hidden rounded-2xl transition-all duration-200",
          "bg-slate-50/80 dark:bg-slate-800/50 border",
          borderColor,
        )}
      >
        {/* Lock icon */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 pl-4 transition-colors duration-200",
            iconColor,
            isRTL ? "right-0 pl-0 pr-4" : "left-0",
          )}
        >
          <Lock className="w-[18px] h-[18px]" />
        </div>

        {/* Input */}
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          dir="ltr"
          placeholder=" "
          className={cn(
            "peer w-full bg-transparent",
            "pl-11 pt-6 pb-2 text-[15px] font-medium",
            isRTL ? "pr-11" : "pr-12",
            "text-slate-900 dark:text-white placeholder-transparent focus:outline-none",
          )}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={cn(
            "absolute transition-all duration-200 select-none pointer-events-none font-medium",
            isRTL ? "right-11" : "left-11",
            filled || focused
              ? cn("top-2.5 text-[11px] tracking-wider uppercase", labelColor)
              : "top-1/2 -translate-y-1/2 text-[15px] text-slate-400 dark:text-slate-500",
          )}
        >
          {label}
        </label>

        {/* Eye toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={toggleShow}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
              isRTL ? "left-2" : "right-2",
            )}
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" />
            ) : (
              <Eye className="w-[18px] h-[18px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Strength bar ───────────────────────────────────────────────── */
function StrengthBar({ password }) {
  const { score } = calculateStrength(password);
  const meta = strengthMeta[score];

  return (
    <div className="flex items-center gap-3 px-1 mt-2.5">
      <div className="flex gap-1.5 flex-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor:
                i <= meta.bars
                  ? score === 1
                    ? "rgb(239,68,68)"
                    : score === 2
                      ? "rgb(245,158,11)"
                      : "rgb(16,185,129)"
                  : "rgb(226,232,240)",
            }}
            transition={{ duration: 0.3 }}
            className="h-1.5 flex-1 rounded-full dark:bg-slate-700"
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {password && (
          <motion.span
            key={score}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={cn(
              "text-[10px] uppercase font-black tracking-widest min-w-[46px] text-right",
              meta.textColor,
            )}
          >
            {meta.label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Requirements checklist ─────────────────────────────────────── */
function RequirementItem({ met, label }) {
  return (
    <motion.div
      animate={{ opacity: met ? 1 : 0.5 }}
      className="flex items-center gap-2"
    >
      <div
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300",
          met ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700",
        )}
      >
        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
          <path
            d="M2 5l2.5 2.5L8 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <span
        className={cn(
          "text-[12px] font-medium transition-colors duration-300",
          met
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-500",
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Error banner ───────────────────────────────────────────────── */
function ErrorBanner({ error, invalidToken, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-2xl p-4">
        <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
          <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-[14px] font-semibold">{error}</span>
        </div>
        {invalidToken && (
          <Link href="/forgot-password">
            <button className="w-full h-10 rounded-xl border border-red-200 dark:border-red-500/30 bg-white dark:bg-slate-900/60 text-red-600 dark:text-red-400 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              {t("btn_request_new")}
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function ResetPasswordForm() {
  const t = useTranslations("authentication");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("signature");
  const { addToast } = useToastStore();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  const { score } = calculateStrength(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = token && score >= 3 && passwordsMatch && !loading;

  const confirmStatus =
    confirmPassword.length === 0 ? "idle" : passwordsMatch ? "match" : "error";

  React.useEffect(() => {
    if (searchParams && !token) setError(t("invalid_token"));
  }, [searchParams, token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError(t("invalid_token"));
      return;
    }
    if (score < 3) {
      setError(t("password_min_length"));
      return;
    }
    if (!passwordsMatch) {
      setError(t("confirm_mismatch"));
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.status === 400 ? t("invalid_token") : t("network_error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundOrbs />
      <div className="w-full">
        {/* Mobile title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:hidden mb-8 text-center"
        >
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            {t("reset_title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            {t("reset_subtitle")}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative z-10 w-full lg:max-w-md mx-auto",
            "bg-white/80 dark:bg-[#0a0f1e]/90 backdrop-blur-xl",
            "rounded-[28px] overflow-hidden",
            "border border-slate-200/80 dark:border-white/6",
            "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)]",
            "dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]",
          )}
        >
          {/* Top accent */}
          <div className="h-[3px] w-full bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="p-7 sm:p-9 md:p-10">
            {/* Desktop header */}
            <div className="hidden lg:flex items-start gap-4 mb-7">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck
                  className="w-5 h-5 text-blue-500 dark:text-blue-400"
                  strokeWidth={2}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-500">
                    Secure Reset
                  </span>
                </div>
                <h2 className="text-[26px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {t("reset_title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] mt-0.5">
                  {t("reset_subtitle")}
                </p>
              </div>
            </div>

            <StepIndicator step={success ? 2 : 1} />

            <AnimatePresence mode="wait">
              {/* ── Success ── */}
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-4"
                >
                  <div className="relative inline-flex items-center justify-center mb-7">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-emerald-400/25"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.38, 1],
                        opacity: [0.15, 0, 0.15],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: 0.3,
                      }}
                      className="absolute inset-0 rounded-full bg-emerald-400/15"
                    />
                    <div className="relative w-[72px] h-[72px] rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25 flex items-center justify-center">
                      <CheckCircle2
                        className="w-9 h-9 text-emerald-500 dark:text-emerald-400"
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>

                  <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {t("reset_success_title") || "Password Updated!"}
                  </h3>
                  <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto mb-8">
                    {t("reset_success_msg")}
                  </p>

                  <Link href="/login">
                    <button
                      className="
                      w-full h-[54px] rounded-2xl font-bold text-[16px] text-white
                      bg-linear-to-r from-blue-600 to-indigo-600
                      hover:from-blue-500 hover:to-indigo-500
                      shadow-lg shadow-blue-500/20 hover:shadow-xl
                      transition-all duration-200 active:scale-[0.99]
                      flex items-center justify-center gap-2
                    "
                    >
                      {t("back_to_login")}
                    </button>
                  </Link>
                </motion.div>
              ) : (
                /* ── Form ── */
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
                  {/* Error banner */}
                  <AnimatePresence>
                    {error && (
                      <ErrorBanner
                        key="err"
                        error={error}
                        invalidToken={error === t("invalid_token")}
                        t={t}
                      />
                    )}
                  </AnimatePresence>

                  {/* Password */}
                  <div className="space-y-2">
                    <PasswordInput
                      id="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label={t("password_label")}
                      showPassword={showPassword}
                      toggleShow={() => setShowPassword(!showPassword)}
                      showToggle
                      isRTL={isRTL}
                    />
                    <StrengthBar password={password} />

                    {/* Requirements */}
                    <AnimatePresence>
                      {password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 px-1 grid grid-cols-2 gap-y-2 gap-x-4">
                            <RequirementItem
                              met={password.length >= 8}
                              label="8+ characters"
                            />
                            <RequirementItem
                              met={/[0-9]/.test(password)}
                              label="One number"
                            />
                            <RequirementItem
                              met={/[a-z]/.test(password)}
                              label="Lowercase letter"
                            />
                            <RequirementItem
                              met={/[A-Z]/.test(password)}
                              label="Uppercase letter"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 dark:bg-white/5" />

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <PasswordInput
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label={t("confirm_label")}
                      showPassword={showPassword}
                      isRTL={isRTL}
                      status={confirmStatus}
                    />
                    <AnimatePresence>
                      {confirmStatus === "match" && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 px-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Passwords match
                          </span>
                        </motion.div>
                      )}
                      {confirmStatus === "error" &&
                        confirmPassword.length > 2 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 px-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[12px] font-semibold text-red-500">
                              Passwords don't match
                            </span>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={cn(
                        "relative w-full h-[54px] rounded-2xl font-bold text-[16px] text-white",
                        "transition-all duration-200 overflow-hidden",
                        "bg-linear-to-r from-blue-600 to-indigo-600",
                        "hover:from-blue-500 hover:to-indigo-500",
                        "shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-500/25",
                        "active:scale-[0.99]",
                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
                        "flex items-center justify-center gap-2",
                      )}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeOpacity=".25"
                            />
                            <path
                              d="M12 2a10 10 0 0 1 10 10"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                          {t("btn_submitting")}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 opacity-80" />
                          {t("btn_reset")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Back link */}
                  <div className="text-center pt-1">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                      <ArrowLeft
                        className={cn(
                          "w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1",
                          isRTL && "rotate-180 group-hover:translate-x-1",
                        )}
                      />
                      {t("back_to_login")}
                    </Link>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-9 pb-6 text-center">
            <p className="text-[12px] text-slate-400 dark:text-slate-600">
              {t("secure_note")}{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
              >
                {t("privacy_policy")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
