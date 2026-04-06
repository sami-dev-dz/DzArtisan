"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  ShieldAlert
} from "lucide-react"

export function Features() {
  const t = useTranslations("features")
  
  const featureList = [
    { 
      key: "verified", 
      icon: ShieldCheck, 
      color: "bg-blue-600",
      secondaryIcon: CheckCircle2,
      secondaryColor: "text-blue-600"
    },
    { 
      key: "fast", 
      icon: Zap, 
      color: "bg-emerald-600",
      secondaryIcon: Phone,
      secondaryColor: "text-emerald-600"
    },
    { 
      key: "coverage", 
      icon: Globe, 
      color: "bg-indigo-600",
      secondaryIcon: MapPin,
      secondaryColor: "text-indigo-600"
    },
    { 
      key: "secure", 
      icon: Lock, 
      color: "bg-amber-600",
      secondaryIcon: ShieldAlert,
      secondaryColor: "text-amber-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 dark:text-white"
          >
            {t("title")}
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg text-slate-600 dark:text-slate-400"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featureList.map((feature) => (
            <motion.div 
              key={feature.key}
              variants={itemVariants}
              className="group p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden"
            >
              {/* Background Abstract */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full transition-transform duration-500 group-hover:scale-[2]" />

              <div className="relative z-10">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:-rotate-6 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                  {t(`${feature.key}.title`)}
                  <feature.secondaryIcon className={`h-4 w-4 ${feature.secondaryColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {t(`${feature.key}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
