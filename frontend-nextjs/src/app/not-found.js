"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Home, Search } from "lucide-react"

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
          className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-red-500/10"
        >
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight mb-4">
            Page introuvable
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 text-base md:text-lg leading-relaxed">
            La page que vous recherchez semble avoir été déplacée, supprimée ou n'a peut-être jamais existé.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la page précédente
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Aller à l'accueil
          </Link>
        </motion.div>

        {/* Separator & Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Besoin d'aide ? Utilisez la barre de recherche ou contactez le support technique.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
