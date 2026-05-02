"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("authentication");

  const id = searchParams.get("id");
  const hash = searchParams.get("hash");
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id || !hash || !expires || !signature) {
      setStatus("error");
      setErrorMessage("Lien de vérification invalide ou incomplet.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const url = `/auth/verify-email/${id}/${hash}?expires=${expires}&signature=${signature}`;
        const response = await api.get(url);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message || "Une erreur est survenue lors de la vérification de votre email."
        );
      }
    };

    verifyEmail();
  }, [id, hash, expires, signature]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex items-center justify-center p-4">
      
      {/* Background Orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-[#0a0f1e]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-blue-500 to-emerald-500" />

        {status === "loading" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Vérification en cours...</h2>
            <p className="text-slate-500 dark:text-slate-400">Veuillez patienter pendant que nous validons votre adresse email.</p>
          </div>
        )}

        {status === "success" && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-6"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
              <CheckCircle2 className="w-20 h-20 text-emerald-500 relative z-10 bg-white dark:bg-transparent rounded-full" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Email Vérifié !</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Votre adresse email a été confirmée avec succès. Vous pouvez maintenant profiter pleinement de toutes les fonctionnalités de DzArtisan.
            </p>
            <Link href="/login" className="w-full">
              <Button className="w-full h-12 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 font-bold transition-all">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-6"
          >
            <XCircle className="w-20 h-20 text-red-500 mb-6" strokeWidth={1.5} />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Lien expiré ou invalide</h2>
            <p className="text-red-500/80 font-medium bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20 mb-8 text-sm w-full">
              {errorMessage}
            </p>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Retour à la connexion
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
