"use client"

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { motion } from "framer-motion"
import { Clock, CheckCircle2, FileText, UserCheck } from "lucide-react"

export default function PendingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    // If not artisan, or if artisan but already approved/rejected
    if (user.type !== "artisan") {
      router.push("/dashboard")
      return
    }
    if (user.status === "actif") {
      router.push("/dashboard/artisan")
    }
    if (user.status === "rejete") {
      // Could show a rejected message, but let's just leave them here or redirect to a rejected page
      // Wait, we can show rejection text below
    }
  }, [user, loading, router])

  if (loading || !user) return null

  const isRejected = user.status === "rejete"

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className={`h-2 ${isRejected ? 'bg-red-500' : 'bg-orange-400'}`} />
        <div className="p-8 pb-10 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 
            ${isRejected ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}
          >
            {isRejected ? <FileText className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            {isRejected ? "Candidature refusée" : "Compte en cours d'examen"}
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {isRejected 
              ? "Malheureusement, votre profil artisan n'a pas été validé par notre équipe. Veuillez contacter le support pour plus de détails." 
              : "Votre profil artisan est actuellement en cours de vérification par notre équipe. Ce processus prend généralement de 24 à 48 heures."}
          </p>

          {!isRejected && (
            <div className="space-y-4 text-left bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-slate-900">Inscription complétée</p>
                  <p className="text-xs text-slate-500 mt-0.5">Vos informations ont été enregistrées.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-slate-900">Vérification manuelle</p>
                  <p className="text-xs text-slate-500 mt-0.5">Notre équipe examine votre profil.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <UserCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-slate-900">Validation finale</p>
                  <p className="text-xs text-slate-500 mt-0.5">Accès au tableau de bord artisan.</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={() => router.push("/")}
              className="font-bold text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Retourner à l&apos;accueil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
