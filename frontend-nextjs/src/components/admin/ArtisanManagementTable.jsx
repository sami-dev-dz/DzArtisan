"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { 
  MoreHorizontal, Eye, CheckCircle, XCircle, 
  Slash, Star, ShieldCheck, MapPin, Tag, 
  Calendar, Phone, Mail, FileText, AlertTriangle, User
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { cn } from "@/lib/utils"
import Image from "next/image"

import { TableSkeleton } from "@/components/ui/SkeletonLayouts"

export function ArtisanManagementTable({ 
  artisans, 
  onAction, 
  onPromote, 
  onViewDetails,
  loading = false 
}) {
  const t = useTranslations("admin.artisan_management")
  const commonT = useTranslations("common")

  if (loading) return <TableSkeleton rows={8} cols={6} />

  if (!artisans?.length) {
    return (
      <div className="py-20 text-center bg-slate-50 dark:bg-[#0A0A0A] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl">
        <p className="text-slate-500 font-semibold text-sm">
          {t("table.no_data")}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 dark:border-white/5">
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("table.artisan")}
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("table.category")}
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("table.location")}
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
              {t("table.docs")}
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("table.date")}
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {artisans.map((artisan, index) => (
            <motion.tr 
              key={artisan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors"
            >
              {/* Artisan Info */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black text-lg overflow-hidden border border-indigo-100 dark:border-indigo-500/20">
                    {artisan.photo && artisan.photo !== '0' && artisan.photo !== 0 ? (
                      <Image src={artisan.photo} alt={artisan.user?.nomComplet || 'Artisan'} fill unoptimized className="object-cover" />
                    ) : (
                      <User size={24} className="text-indigo-400" />
                    )}
                    {Boolean(artisan.is_featured) && (
                        <div className="absolute top-0 right-0 p-1 bg-amber-400 text-white rounded-bl-[10px]">
                            <Star size={10} fill="currentColor" />
                        </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-slate-900 dark:text-white truncate flex items-center gap-2">
                      {artisan.user?.nomComplet}
                      {artisan.complaints_count >= 3 && (
                        <Badge className="bg-red-500 text-white border-none h-5 px-1.5 animate-pulse">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          3+
                        </Badge>
                      )}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-1">
                      <Mail size={10} /> {artisan.user?.email}
                    </span>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Tag size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {artisan.primary_categorie?.nom}
                  </span>
                </div>
              </td>

              {/* Location */}
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    <MapPin size={12} className="text-rose-500" />
                    {artisan.primary_wilaya?.nom}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-4">
                     {artisan.commune?.nom}
                  </div>
                </div>
              </td>

              {/* Docs Count */}
              <td className="px-6 py-4 text-center">
                 <Badge variant={artisan.documents_count >= 2 ? "success" : "warning"} className="h-6 rounded-lg px-2">
                    <FileText size={10} className="mr-1" />
                    {artisan.documents_count}
                 </Badge>
              </td>

              {/* Date */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    {new Date(artisan.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                    {new Date(artisan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    onClick={() => onViewDetails(artisan)}
                    variant="ghost" 
                    className="h-10 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold text-xs"
                  >
                    <Eye size={16} className="mr-1.5" />
                    Détails
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-2xl">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                        Actions de gestion
                      </DropdownMenuLabel>
                      
                      {(artisan.statut_validation === 'en_attente' || artisan.statutValidation === 'en_attente') && (
                        <>
                          <DropdownMenuItem onClick={() => onAction(artisan.id, 'approve')} className="rounded-xl focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-600 cursor-pointer gap-3 p-3">
                            <CheckCircle size={16} /> <span className="text-sm font-bold">{t("actions.approve")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAction(artisan.id, 'reject')} className="rounded-xl focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 cursor-pointer gap-3 p-3">
                            <XCircle size={16} /> <span className="text-sm font-bold">{t("actions.reject")}</span>
                          </DropdownMenuItem>
                        </>
                      )}

                      {(artisan.statut_validation === 'valide' || artisan.statutValidation === 'valide') && artisan.user?.statut === 'actif' && (
                        <DropdownMenuItem onClick={() => onAction(artisan.id, 'suspend')} className="rounded-xl focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 cursor-pointer gap-3 p-3">
                          <Slash size={16} /> <span className="text-sm font-bold">{t("actions.suspend")}</span>
                        </DropdownMenuItem>
                      )}

                      {artisan.user?.statut === 'suspendu' && (
                        <DropdownMenuItem onClick={() => onAction(artisan.id, 'unsuspend')} className="rounded-xl focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-600 cursor-pointer gap-3 p-3">
                          <CheckCircle size={16} /> <span className="text-sm font-bold">{t("actions.unsuspend")}</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator className="bg-slate-50 dark:bg-white/5 my-2" />
                      
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                        Promotion
                      </DropdownMenuLabel>
                      
                      <DropdownMenuItem onClick={() => onPromote(artisan.id, 'featured', !artisan.is_featured)} className="rounded-xl cursor-pointer gap-3 p-3">
                        <Star size={16} className={artisan.is_featured ? "text-amber-500 fill-amber-500" : ""} /> 
                        <span className="text-sm font-bold">{t("actions.feature")}</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => onPromote(artisan.id, 'recommended', !artisan.is_recommended)} className="rounded-xl cursor-pointer gap-3 p-3">
                        <ShieldCheck size={16} className={artisan.is_recommended ? "text-indigo-500 fill-indigo-500" : ""} /> 
                        <span className="text-sm font-bold">{t("actions.recommend")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
