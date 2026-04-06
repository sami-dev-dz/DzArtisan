"use client"
import { Briefcase } from 'lucide-react';

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Award,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export function ArtisanCard({ artisan, view = "grid" }) {
  const t = useTranslations("search")
  const cardT = useTranslations("artisan_card")
  const locale = useLocale()
  const isRTL = locale === "ar"

  const isAvailable = artisan.disponibilite === "disponible"
  const isVerified = artisan.statutValidation === "valide"
  const hasDiploma = !!artisan.diploma_url

  const handleCall = (e) => {
    e.preventDefault()
    window.location.href = `tel:${artisan.telephone}`
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    const msg = encodeURIComponent(`Bonjour ${artisan.user.nomComplet}, je vous contacte via DzArtisan...`)
    window.open(`https://wa.me/${artisan.telephone}?text=${msg}`, "_blank")
  }

  if (view === "list") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-white dark:bg-slate-900 rounded-[32px] p-4 flex flex-col md:flex-row items-center gap-6 border-2 border-slate-100 dark:border-white/5 transition-all group hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10",
          !isAvailable && "opacity-60 grayscale-[0.5]"
        )}
      >
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[24px] overflow-hidden border-4 border-slate-50 dark:border-white/5 relative">
            <Image 
              src={artisan.photo || "/images/placeholders/artisan.png"} 
              alt={artisan.user.nomComplet}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="128px"
            />
          </div>
          <div className={cn(
            "absolute bottom-2 right-2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900",
            isAvailable ? "bg-emerald-500" : "bg-slate-300"
          )} />
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left rtl:md:text-right w-full">
           <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {artisan.user.nomComplet}
                </h3>
                <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mt-1">
                   <Badge className="bg-blue-600 text-white rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-widest">
                      {artisan.primary_categorie?.nom}
                   </Badge>
                   {isVerified && <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200"><ShieldCheck className="w-3 h-3 mr-1" /> {cardT("verified_profile")}</Badge>}
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                 <div className="text-center md:text-right">
                    <div className="flex items-center gap-1 justify-center md:justify-end text-amber-500">
                       <Star className="w-4 h-4 fill-amber-500" />
                       <span className="font-black text-lg">{artisan.average_rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{artisan.reviews_count} Reviews</span>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center md:justify-start text-xs font-bold text-slate-500 uppercase tracking-wide">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{artisan.primary_wilaya?.nom}</div>
              <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{cardT("exp_years", { count: artisan.anneesExp })}</div>
           </div>
        </div>

        <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
          <Button onClick={handleWhatsApp} className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest gap-2">
            <MessageCircle className="w-4 h-4" /> {t("contact_whatsapp")}
          </Button>
          <Button onClick={handleCall} className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest gap-2">
            <Phone className="w-4 h-4" /> {t("contact_call")}
          </Button>
        </div>
      </motion.div>
    )
  }

  // Grid View (Default)
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-[40px] p-6 border-2 border-slate-100 dark:border-white/5 transition-all group relative overflow-hidden",
        "hover:border-blue-500/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:shadow-blue-500/10",
        !isAvailable && "opacity-60 grayscale-[0.3]"
      )}
    >
      <Link href={`/${locale}/artisans/${artisan.slug}`} className="absolute inset-0 z-10" />

      {/* Photo Container */}
      <div className="relative mb-6">
        <div className="aspect-square rounded-[32px] overflow-hidden border-4 border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-slate-800 relative">
          <Image 
            src={artisan.photo || "/images/placeholders/artisan.png"} 
            alt={artisan.user.nomComplet}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
        
        {/* Availability Badge */}
        <div className={cn(
          "absolute top-4 right-4 h-8 px-3 rounded-full flex items-center gap-1.5 backdrop-blur-md border shadow-lg",
          isAvailable ? "bg-emerald-500/90 border-emerald-400 text-white" : "bg-slate-100/90 dark:bg-slate-800/90 border-slate-200 dark:border-white/10 text-slate-500"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isAvailable ? "bg-white" : "bg-slate-400")} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isAvailable ? "Available" : "Busy"}
          </span>
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-50 dark:border-white/5">
           <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
           <span className="text-sm font-black text-slate-900 dark:text-white">{artisan.average_rating}</span>
           <span className="text-[10px] font-bold text-slate-400">({artisan.reviews_count})</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center pt-2 space-y-4">
        <div>
           <div className="flex items-center justify-center gap-1 mb-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {artisan.user.nomComplet}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 font-bold mb-3">
              {artisan.primary_categorie?.nom}
           </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50 dark:border-white/5 py-4">
           <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{artisan.primary_wilaya?.nom}</div>
           <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{artisan.anneesExp}y</div>
        </div>

        <div className="flex gap-2 relative z-20">
           <button 
             onClick={handleWhatsApp}
             className="flex-1 h-12 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/20"
           >
              <MessageCircle className="w-5 h-5" />
           </button>
           <button 
             onClick={handleCall}
             className="flex-1 h-12 rounded-2xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white transition-all flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20"
           >
              <Phone className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Distance Overlay (Optional) */}
      {artisan.distance && (
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
           {t("km_away", { distance: Math.round(artisan.distance * 10) / 10 })}
        </div>
      )}
    </motion.div>
  )
}
