"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={cn("w-3.5 h-3.5", i <= Math.round(rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-700")} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function ArtisanCard({ artisan, view = "grid" }) {
  const t = useTranslations("search")
  const cardT = useTranslations("artisan_card")
  const locale = useLocale()

  const isAvailable = artisan.disponibilite === "disponible"
  const isVerified = artisan.statutValidation === "valide"

  const handleWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const msg = encodeURIComponent(`Bonjour ${artisan.user?.nomComplet}, je vous contacte via DzArtisan...`)
    window.open(`https://wa.me/${artisan.telephone}?text=${msg}`, "_blank")
  }

  const handleCall = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `tel:${artisan.telephone}`
  }

  // ── List View ──────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-white/5 p-5 flex flex-col sm:flex-row items-center gap-5 hover:shadow-2xl hover:shadow-blue-500/8 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-px h-full bg-linear-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Photo */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] overflow-hidden border-2 border-slate-100 dark:border-white/10 bg-slate-50 relative shadow-md">
            <Image
              src={artisan.photo || "/images/placeholders/artisan.png"}
              alt={artisan.user?.nomComplet || ""}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="96px"
            />
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow",
            isAvailable ? "bg-emerald-500" : "bg-slate-300"
          )} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors truncate">
                {artisan.user?.nomComplet}
              </h3>
              {isVerified && (
                <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5" /> Vérifié
                </div>
              )}
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600 mt-0.5">
              {artisan.primary_categorie?.nom}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{artisan.primary_wilaya?.nom}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{artisan.anneesExp} ans</span>
            <div className="flex items-center gap-1.5">
              <StarRow rating={artisan.average_rating} />
              <span className="text-amber-500 font-black">{artisan.average_rating}</span>
              <span className="text-slate-300">({artisan.reviews_count})</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <Link href={`/${locale}/artisans/${artisan.slug}`}>
            <Button className="h-10 px-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest gap-1.5 hover:bg-blue-600 hover:dark:bg-blue-600 hover:dark:text-white transition-colors">
              Profil <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <button onClick={handleWhatsApp} className="w-10 h-10 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-all flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button onClick={handleCall} className="w-10 h-10 rounded-2xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white transition-all flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Grid View ──────────────────────────────────────────────────────────────
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-[0_24px_60px_-12px_rgba(0,90,255,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
      <Link href={`/${locale}/artisans/${artisan.slug}`} className="absolute inset-0 z-10" />

      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={artisan.photo || "/images/placeholders/artisan.png"}
          alt={artisan.user?.nomComplet || ""}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {/* Availability */}
        <div className={cn(
          "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[9px] font-black uppercase tracking-widest shadow-lg",
          isAvailable
            ? "bg-emerald-500/90 text-white"
            : "bg-black/40 text-white/70"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", isAvailable ? "bg-white animate-pulse" : "bg-white/50")} />
          {isAvailable ? "Disponible" : "Occupé"}
        </div>

        {/* Rating floating */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-black text-slate-900 dark:text-white">{artisan.average_rating}</span>
          <span className="text-[10px] font-bold text-slate-400">({artisan.reviews_count})</span>
        </div>

        {/* Verified badge */}
        {isVerified && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
            {artisan.user?.nomComplet}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mt-0.5">
            {artisan.primary_categorie?.nom}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-4 py-3 border-y border-slate-50 dark:border-white/5">
          <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{artisan.primary_wilaya?.nom}</span>
          <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" />{artisan.anneesExp} ans d&apos;exp.</span>
        </div>

        {/* Action buttons */}
        <div className="relative z-20 flex gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 h-11 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 font-black text-[10px] uppercase tracking-wider shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
          <button
            onClick={handleCall}
            className="flex-1 h-11 rounded-2xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 font-black text-[10px] uppercase tracking-wider shadow-sm active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Appeler</span>
          </button>
        </div>
      </div>

      {/* Distance */}
      {artisan.distance && (
        <div className="absolute bottom-[72px] left-4 z-20 bg-slate-900/80 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest backdrop-blur-sm">
          ~{Math.round(artisan.distance * 10) / 10} km
        </div>
      )}
    </div>
  )
}
