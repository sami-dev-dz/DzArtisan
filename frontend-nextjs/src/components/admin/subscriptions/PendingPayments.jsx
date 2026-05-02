"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AlertCircle, 
  Check, 
  X, 
  ExternalLink,
  Eye,
  Info,
  Banknote
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function PendingPayments({ payments, onConfirm, onReject }) {
  const t = useTranslations("admin.subscription_management.pending_payments")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [selectedProof, setSelectedProof] = React.useState(null)

  if (!payments || payments.length === 0) {
    return (
      <div className="mb-12 p-8 rounded-xl bg-slate-50 dark:bg-white/2 border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
          <Check className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">{t("no_pending")}</p>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-600 text-white">
          <Banknote className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold dark:text-white">{t("title")}</h2>
        <Badge variant="primary" className="ml-2 px-2 py-0.5 rounded-full animate-pulse">
          {payments.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {payments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-5 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-white/10 shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all"
          >
            <div className="flex items-start gap-4">
               <Avatar 
                 src={payment.abonnement?.artisan?.photo} 
                 initials={payment.abonnement?.artisan?.user?.nomComplet ? String(payment.abonnement.artisan.user.nomComplet).charAt(0) : 'A'}
                 className="w-12 h-12 rounded-2xl"
               />
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {payment.abonnement?.artisan?.user?.nomComplet}
                    </h3>
                    <Badge variant="secondary" className="uppercase text-[10px] tracking-tighter">
                      {payment.abonnement?.plan}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span>{payment.montant} DA</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="capitalize">{payment.methode}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="rounded-xl grow"
                      onClick={() => onConfirm(payment)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {t("confirm_btn")}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => onReject(payment)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t("reject_btn")}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-xl px-3"
                      onClick={() => setSelectedProof(payment.preuve_paiement)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Basic Proof Modal/Lightbox */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-4xl max-h-full overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute top-4 right-4 z-10 rounded-full"
                onClick={() => setSelectedProof(null)}
              >
                <X className="w-5 h-5" />
              </Button>
              <Image 
                src={selectedProof} 
                alt="Proof of Payment"
                unoptimized
                width={0}
                height={0}
                style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
