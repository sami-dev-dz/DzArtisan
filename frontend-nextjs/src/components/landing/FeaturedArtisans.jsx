"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
  ChevronRight, 
  BriefcaseBusiness,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function FeaturedArtisans() {
  const t = useTranslations("featured_artisans")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60">
      <div className="container mx-auto px-4 md:px-6">

        {/* Global Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl text-center md:text-left rtl:md:text-right">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white"
            >
              {t("title")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 dark:text-slate-400"
            >
              {t("subtitle")}
            </motion.p>
          </div>
          <Link href="/artisans" className="hidden md:flex shrink-0">
            <Button variant="outline" className="group rounded-full px-6 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              {t("view_all")}
              <ChevronRight className={cn("ml-2 h-4 w-4 transition-transform", isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
            </Button>
          </Link>
        </div>

        {/* Call to join the network */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
        >
          {/* Subtle background pattern/gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-emerald-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 lg:p-16 gap-10">
            <div className="hidden md:flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
              <BriefcaseBusiness className="h-10 w-10 text-emerald-600 dark:text-emerald-500" strokeWidth={1.5} />
            </div>

            <div className="flex-1 text-center md:text-left rtl:md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                {t("join_title")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-2xl text-lg">
                {t("join_desc")}
              </p>
              
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 text-sm font-medium text-slate-700 dark:text-slate-300 items-center md:items-start rtl:md:items-start">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>{t("benefit_verified")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>{t("benefit_dashboard")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>{t("benefit_direct")}</span>
                </li>
              </ul>

              <Link href="/register?role=artisan">
                <Button
                  size="lg"
                  className="rounded-xl px-8 w-full sm:w-auto font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all group"
                >
                  {t("cta_register")}
                  <ChevronRight className={cn("ml-2 h-4 w-4 transition-transform", isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden">
          <Link href="/artisans">
            <Button variant="outline" className="w-full h-12 rounded-xl group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              {isRTL ? <ChevronRight className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 rotate-180" /> : null}
              {t("view_all")}
              {!isRTL ? <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> : null}
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}