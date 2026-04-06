"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, User, Briefcase, FileCheck, History, 
  MapPin, Phone, Mail, Calendar, Star,
  ShieldCheck, ExternalLink, Download, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export function ArtisanDetailDrawer({ isOpen, onClose, artisan }) {
  const t = useTranslations("admin.artisan_management")
  const commonT = useTranslations("common")

  if (!artisan) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                  {artisan.user?.nomComplet?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {artisan.user?.nomComplet}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant={artisan.statut_validation === 'valide' ? "success" : "warning"} className="h-5 text-[10px] uppercase font-black tracking-tighter">
                       {artisan.statut_validation}
                    </Badge>
                    {artisan.is_featured && <Badge className="bg-amber-400 text-white border-none h-5 text-[10px] font-black uppercase tracking-tighter">Featured</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                <X size={20} />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              {/* Personal Info Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                    <User size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {t("details.personal_info")}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <InfoItem icon={<Mail size={14} />} label="Email" value={artisan.user?.email} />
                  <InfoItem icon={<Phone size={14} />} label="Téléphone" value={artisan.user?.telephone} />
                  <InfoItem icon={<MapPin size={14} />} label="Wilaya" value={artisan.primary_wilaya?.nom} />
                  <InfoItem icon={<Calendar size={14} />} label="Inscrit le" value={new Date(artisan.created_at).toLocaleDateString()} />
                </div>
              </section>

              {/* Professional Info Section */}
              <section className="space-y-6 pt-6 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {t("details.professional_info")}
                  </h3>
                </div>

                <div className="space-y-6">
                   <InfoItem label="Bio / Description" value={artisan.remarques || "Aucune description fournie."} fullWidth />
                   
                   <div className="grid grid-cols-2 gap-6">
                      <InfoItem label="Expérience" value={t("details.experience", { years: artisan.anneeExperience || 0 })} />
                      <InfoItem label="Catégorie Principale" value={artisan.primary_categorie?.nom} />
                   </div>

                   <div className="space-y-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Compétences / Catégories</span>
                     <div className="flex flex-wrap gap-2">
                        {artisan.categories?.map(cat => (
                           <Badge key={cat.id} variant="outline" className="rounded-lg font-bold border-slate-100 dark:border-white/10 px-3 py-1 bg-slate-50/50 dark:bg-white/[0.02]">
                              {cat.nom}
                           </Badge>
                        ))}
                     </div>
                   </div>
                </div>
              </section>

              {/* Documents Section */}
              <section className="space-y-6 pt-6 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                    <FileCheck size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {t("details.documents")}
                  </h3>
                </div>

                {artisansDocuments(artisan).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {artisansDocuments(artisan).map((doc, idx) => (
                      <div key={idx} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                             <FileText size={20} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-900 dark:text-white">Document justificatif #{idx + 1}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-emerald-500 font-black">Vérifiable</span>
                           </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-indigo-600 hover:text-white shadow-xl shadow-transparent hover:shadow-indigo-500/20 transition-all" asChild>
                            <a href={doc.path} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={18} />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 rounded-3xl bg-amber-50/50 dark:bg-amber-500/5 border border-dashed border-amber-200 dark:border-amber-500/20 text-center space-y-2">
                    <AlertCircle size={32} className="mx-auto text-amber-500" />
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Aucun document téléchargé par cet artisan.</p>
                  </div>
                )}
              </section>

              {/* Account History */}
              <section className="space-y-6 pt-6 border-t border-slate-50 dark:border-white/5 pb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600">
                    <History size={18} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {t("details.history")}
                  </h3>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raison du rejet (Si applicable)</span>
                         <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                             {artisan.rejection_reason || "N/A"}
                         </p>
                      </div>
                   </div>
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raison de suspension</span>
                         <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {artisan.suspension_reason || "N/A"}
                         </p>
                      </div>
                   </div>
                </div>
              </section>
            </div>
            
            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex gap-4">
                   {artisan.statut_validation === 'en_attente' ? (
                      <>
                        <Button className="flex-1 rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 font-black shadow-lg shadow-emerald-500/20">
                           {t("actions.approve")}
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-2xl h-12 border-red-200 text-red-600 hover:bg-red-50 font-black">
                           {t("actions.reject")}
                        </Button>
                      </>
                   ) : (
                      <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200 dark:border-white/10 font-bold" onClick={onClose}>
                        {commonT("see_more")}
                      </Button>
                   )}
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function InfoItem({ icon, label, value, fullWidth = false }) {
  return (
    <div className={cn("space-y-1", fullWidth ? "col-span-2" : "col-span-1")}>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200 min-h-[1.5rem]">
        {value || "—"}
      </div>
    </div>
  )
}

function FileText(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  );
}

// Helper to extract documents from artisan model
function artisansDocuments(artisan) {
    if (!artisan || !artisan.documents) return [];
    // Assuming documents is a JSON string or array of paths
    try {
        if (typeof artisan.documents === 'string') {
            return JSON.parse(artisan.documents).map(path => ({ path }));
        }
        return artisan.documents.map(path => ({ path }));
    } catch (e) {
        return [];
    }
}
