"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, User, Wrench, Phone, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm() {
  const { register, loginWithGoogle } = useAuth();
  const [role, setRole] = useState("client");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    telephone: "",
  });
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
    if (loading) return;
    setError(null);
    setFieldErrors({});

    const phoneRegex = /^0(5|6|7)\d{8}$/;
    if (!phoneRegex.test(form.telephone)) {
      setFieldErrors((prev) => ({
        ...prev,
        telephone: "Format invalide. Utilisez 05/06/07 suivi de 8 chiffres.",
      }));
      setError("Veuillez corriger les erreurs ci-dessous.");
      return;
    }

    setLoading(true);
    try {
      await register({ ...form, type: role });
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setFieldErrors(err.errors);
        setError("Veuillez corriger les erreurs ci-dessous.");
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Une erreur est survenue lors de l'inscription."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const roleContent = {
    client: {
      headline: "Trouvez l'artisan qu'il vous faut.",
      sub: "Créez votre compte et accédez à des pros vérifiés.",
    },
    artisan: {
      headline: "Développez votre activité.",
      sub: null,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Card */}
      <div className="bg-white rounded-[28px] shadow-[0_2px_4px_rgba(44,30,16,0.04),_0_24px_60px_rgba(44,30,16,0.13)] overflow-hidden">
        {/* Top color bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C4793A] to-[#D4622A]" />

        <div className="px-10 py-10">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4793A] to-[#D4622A] flex items-center justify-center shadow-[0_4px_12px_rgba(196,121,58,0.4)]">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-black text-[17px] text-[#1A1208] tracking-tight">
              Dz<span className="text-[#C4793A]">Artisan</span>
            </span>
          </div>

          {/* Dynamic headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mb-8"
            >
              <h1 className="text-[27px] font-black text-[#1A1208] leading-tight tracking-tight mb-1.5">
                {roleContent[role].headline}
              </h1>
              {roleContent[role].sub && (
                <p className="text-sm text-[#9C8B7E] font-medium">
                  {roleContent[role].sub}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Role toggle */}
          <div className="flex bg-[#F0EBE3] rounded-2xl p-1 gap-1 mb-8">
            {[
              { key: "client", icon: User, label: "Je cherche un artisan" },
              { key: "artisan", icon: Wrench, label: "Je suis artisan" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[12.5px] font-semibold transition-all duration-200 ${role === key
                    ? "bg-white text-[#C4793A] shadow-[0_2px_8px_rgba(44,30,16,0.1)]"
                    : "text-[#9C8B7E] hover:text-[#1A1208]"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1208] uppercase tracking-widest mb-2">
                Nom complet
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A898] group-focus-within:text-[#C4793A] transition-colors pointer-events-none"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Prénom Nom"
                  className={`w-full bg-[#F7F3EE] rounded-xl border-[1.5px] ${fieldErrors.name
                      ? "border-red-400 bg-red-50"
                      : "border-transparent focus:border-[#C4793A]"
                    } pl-11 pr-4 py-3.5 text-sm text-[#1A1208] outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,121,58,0.1)] transition-all placeholder:text-[#C4A898]`}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1208] uppercase tracking-widest mb-2">
                Téléphone
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#C4A898] group-focus-within:text-[#C4793A] transition-colors pointer-events-none">
                  +213
                </span>
                <input
                  type="text"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  required
                  placeholder="05 55 55 55 55"
                  pattern="^0[567][0-9]{8}$"
                  className={`w-full bg-[#F7F3EE] rounded-xl border-[1.5px] ${fieldErrors.telephone
                      ? "border-red-400 bg-red-50"
                      : "border-transparent focus:border-[#C4793A]"
                    } pl-14 pr-4 py-3.5 text-sm text-[#1A1208] outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,121,58,0.1)] transition-all placeholder:text-[#C4A898]`}
                />
              </div>
              {fieldErrors.telephone && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{fieldErrors.telephone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1208] uppercase tracking-widest mb-2">
                Adresse e-mail
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A898] group-focus-within:text-[#C4793A] transition-colors pointer-events-none"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="vous@exemple.com"
                  className={`w-full bg-[#F7F3EE] rounded-xl border-[1.5px] ${fieldErrors.email
                      ? "border-red-400 bg-red-50"
                      : "border-transparent focus:border-[#C4793A]"
                    } pl-11 pr-4 py-3.5 text-sm text-[#1A1208] outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,121,58,0.1)] transition-all placeholder:text-[#C4A898]`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1208] uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A898] group-focus-within:text-[#C4793A] transition-colors pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 8 caractères"
                  className={`w-full bg-[#F7F3EE] rounded-xl border-[1.5px] ${fieldErrors.password
                      ? "border-red-400 bg-red-50"
                      : "border-transparent focus:border-[#C4793A]"
                    } pl-11 pr-12 py-3.5 text-sm text-[#1A1208] outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,121,58,0.1)] transition-all placeholder:text-[#C4A898]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4A898] hover:text-[#C4793A] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1208] uppercase tracking-widest mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A898] group-focus-within:text-[#C4793A] transition-colors pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="Répétez votre mot de passe"
                  className={`w-full bg-[#F7F3EE] rounded-xl border-[1.5px] ${form.password_confirmation && form.password !== form.password_confirmation
                      ? "border-red-400 bg-red-50"
                      : "border-transparent focus:border-[#C4793A]"
                    } pl-11 pr-4 py-3.5 text-sm text-[#1A1208] outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,121,58,0.1)] transition-all placeholder:text-[#C4A898]`}
                />
              </div>
              {form.password_confirmation && form.password !== form.password_confirmation && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-0.5 w-4 h-4 rounded accent-[#C4793A] cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-xs font-medium text-[#9C8B7E] cursor-pointer select-none leading-relaxed">
                J&apos;accepte les{" "}
                <Link href="/terms" className="text-[#C4793A] font-bold hover:underline">
                  Conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-[#C4793A] font-bold hover:underline">
                  Politique de confidentialité
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (!!form.password_confirmation && form.password !== form.password_confirmation)}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C4793A] to-[#D4622A] hover:from-[#B86C2F] hover:to-[#C4571F] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-black py-4 shadow-[0_6px_20px_rgba(196,121,58,0.4)] hover:shadow-[0_8px_28px_rgba(196,121,58,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all group"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>
                  Créer mon compte
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Google — clients only */}
          {role === "client" && (
            <>
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-[#EDE8E2]" />
                <span className="text-[10px] font-bold text-[#C4A898] uppercase tracking-[1.5px]">ou</span>
                <div className="flex-1 h-px bg-[#EDE8E2]" />
              </div>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-[1.5px] border-[#EDE8E2] bg-white hover:bg-[#F7F3EE] px-4 py-3.5 text-sm font-semibold text-[#1A1208] transition-all active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.5-.4-3.5z" fill="#FFC107" />
                  <path d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00" />
                  <path d="M24 44c5.3 0 10.2-2 13.8-5.3l-6.4-5.4C29.4 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8H6.2C9.5 35.6 16.2 44 24 44z" fill="#4CAF50" />
                  <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.4 5.4C37.4 39.2 44 34 44 24c0-1.2-.1-2.5-.4-3.5z" fill="#1976D2" />
                </svg>
                Continuer avec Google
              </button>
            </>
          )}

          {/* Footer */}
          <p className="mt-8 text-center text-[13px] font-medium text-[#9C8B7E]">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-[#C4793A] font-bold hover:underline">
              Se connecter →
            </Link>
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
        {["10 000+ artisans", "Paiement sécurisé", "Support 7j/7"].map((badge) => (
          <span key={badge} className="text-[11px] font-semibold text-[#9C8B7E] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4793A] inline-block" />
            {badge}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
