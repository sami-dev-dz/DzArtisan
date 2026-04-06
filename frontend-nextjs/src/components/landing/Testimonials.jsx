"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { StarRating } from "@/components/ui/StarRating"
import { cn } from "@/lib/utils"

export function Testimonials() {
  const t = useTranslations("testimonials")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/40 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mt-32" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mb-32" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 dark:text-white"
          >
            {t("title")}
          </motion.h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
            Avis vérifiés de nos clients.
          </p>
        </div>

        {/* Honest Empty State for Reviews */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-xl mx-auto p-8 md:p-12 text-center rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl shadow-black/5"
        >
           <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500">
             <Star className="h-8 w-8" />
           </div>
           <h3 className="text-xl font-bold dark:text-white mb-2">Aucun avis pour le moment</h3>
           <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
             Les avis et témoignages apparaîtront ici une fois que les premières interventions seront terminées. La transparence totale est notre priorité.
           </p>
        </motion.div>
      </div>
    </section>
  )
}
