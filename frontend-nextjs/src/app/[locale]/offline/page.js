"use client";

import React from "react";
import { WifiOff, Home, RefreshCcw } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
      >
        <WifiOff className="w-12 h-12" />
      </motion.div>

      <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Vous êtes hors ligne</h1>
      <p className="text-slate-400 max-w-md mx-auto mb-10 font-bold leading-relaxed">
        DzArtisan a besoin d&apos;une connexion internet (3G/4G ou Wi-Fi) pour synchroniser vos interventions et vos messages.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <RefreshCcw className="w-4 h-4" />
          Réessayer
        </button>
        <Link href="/">
          <span className="px-8 py-4 bg-slate-900 border border-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer">
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </span>
        </Link>
      </div>

      <p className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">DzArtisan Algérie — Optimisé pour 3G</p>
    </div>
  );
}
