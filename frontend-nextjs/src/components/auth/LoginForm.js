"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, User, Wrench, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const [role, setRole] = useState("client");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ ...form, role });
    } catch (err) {
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-[32px] shadow-2xl p-8 md:p-12 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4">
          <User size={28} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bon retour !</h1>
        <p className="text-gray-500 mt-2 font-medium">Connectez-vous à votre espace DzArtisan</p>
      </div>

      <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
        <button
          onClick={() => setRole("client")}
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            role === "client" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={16} />
          Client
        </button>
        <button
          onClick={() => setRole("artisan")}
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            role === "artisan" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Wrench size={16} />
          Artisan
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Adresse e-mail</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full bg-white rounded-xl border border-gray-200 pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="text-sm font-bold text-gray-700">Mot de passe</label>
            <a href="#" className="text-xs font-semibold text-blue-600 link-premium">Mot de passe oublié ?</a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
              className="w-full bg-white rounded-xl border border-gray-200 pl-11 pr-11 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center ml-1">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="remember" className="ml-2 text-xs font-semibold text-gray-500 cursor-pointer">Se souvenir de moi</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-sm font-bold py-4 shadow-lg shadow-blue-500/25 transition-all group active:scale-[0.98]"
        >
          {loading ? "Chargement..." : "Se connecter"}
          {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> }
        </button>
      </form>

      {role === "client" && (
        <>
          <div className="relative flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ou continuer avec</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-3.5 text-sm font-bold text-gray-700 transition-all active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.5-.4-3.5z" fill="#FFC107" />
              <path d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00" />
              <path d="M24 44c5.3 0 10.2-2 13.8-5.3l-6.4-5.4C29.4 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8H6.2C9.5 35.6 16.2 44 24 44z" fill="#4CAF50" />
              <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.4 5.4C37.4 39.2 44 34 44 24c0-1.2-.1-2.5-.4-3.5z" fill="#1976D2" />
            </svg>
            Continuer avec Google
          </button>
        </>
      )}

      <p className="mt-8 text-center text-sm font-semibold text-gray-500">
        Pas encore de compte ?{" "}
        <a href="/register" className="text-blue-600 font-bold link-premium">S'inscrire</a>
      </p>
    </motion.div>
  );
}
