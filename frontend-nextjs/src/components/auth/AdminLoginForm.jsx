"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AdminLoginForm() {
  const t = useTranslations("authentication");
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ ...form, role: "admin" });
    } catch (err) {
      if (
        !err.response &&
        (err.code === "ERR_NETWORK" || err.message === "Network Error")
      ) {
        setError(t("network_error"));
      } else if (err.status === 422 && err.errors) {
        setFieldErrors(err.errors);
        setError(t("error_required_fields"));
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            t("generic_login_error"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Brand / Logo area */}
        <div className="flex flex-col items-center mb-8">
          {/* Replace with your actual logo */}
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-sm">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <rect x="3" y="3" width="6" height="6" rx="1.5" fill="white" />
              <rect
                x="11"
                y="3"
                width="6"
                height="6"
                rx="1.5"
                fill="white"
                fillOpacity="0.6"
              />
              <rect
                x="3"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                fill="white"
                fillOpacity="0.6"
              />
              <rect x="11" y="11" width="6" height="6" rx="1.5" fill="white" />
            </svg>
          </div>
          <h1 className="text-[15px] font-semibold text-[#0f172a] tracking-tight">
            Administration
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.07)] border border-[#e8eaf0] px-8 py-9">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-[#0f172a] tracking-tight mb-1">
              {t("admin_login_title")}
            </h2>
            <p className="text-sm text-[#64748b]">
              {t("admin_login_subtitle")}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3"
              >
                <div className="mt-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold leading-none">
                    !
                  </span>
                </div>
                <p className="text-[13px] text-red-700 font-medium leading-snug">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                {t("email_label")}
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder={t("email_placeholder")}
                  className={`w-full bg-[#f9fafb] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#0f172a] placeholder:text-[#c4c9d4] focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? "border-red-300 focus:ring-red-100"
                      : "border-[#e2e8f0] focus:border-blue-400 focus:ring-blue-50"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[12px] text-red-500 mt-1.5">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                {t("password_label")}
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder={t("password_placeholder")}
                  className={`w-full bg-[#f9fafb] border rounded-lg py-2.5 pl-10 pr-11 text-sm text-[#0f172a] placeholder:text-[#c4c9d4] focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? "border-red-300 focus:ring-red-100"
                      : "border-[#e2e8f0] focus:border-blue-400 focus:ring-blue-50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[12px] text-red-500 mt-1.5">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 h-[42px] rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="h-[15px] w-[15px] rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{t("admin_login_btn")}...</span>
                </>
              ) : (
                t("admin_login_btn")
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-[12px] text-[#94a3b8] mt-6">
          Accès réservé aux administrateurs autorisés.
        </p>
      </motion.div>
    </div>
  );
}
