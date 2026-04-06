"use client";

import React from "react";
import { CheckCircle2, Circle, ArrowRight, Camera, MessageSquare, FileText, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function CompletenessWidget({ percentage = 0, artisan = {} }) {
  const t = useTranslations("dashboard");

  const steps = [
    { id: "photo", label: "Photo de profil", icon: Camera, done: !!artisan.photo },
    { id: "whatsapp", label: "Lien WhatsApp", icon: MessageSquare, done: !!artisan.lienWhatsApp },
    { id: "description", label: "Description (150+ chars)", icon: FileText, done: artisan.description?.length >= 150 },
    { id: "documents", label: "Documents (Diplôme/Carte)", icon: CheckCircle2, done: !!(artisan.diploma_url || artisan.artisan_card_url) },
    { id: "wilayas", label: "Multiple Wilayas", icon: MapPin, done: artisan.wilayas_count > 1 },
    { id: "experience", label: "Niveau d'expérience", icon: Briefcase, done: !!artisan.experience_level },
  ];

  const pendingSteps = steps.filter(s => !s.done);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 shadow-glow" /> 
            {t("completeness_title")}
          </h3>
          <span className="text-2xl font-black text-blue-500">{percentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/5 rounded-full mb-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />
        </div>

        {pendingSteps.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t("suggested_actions")}</p>
            <div className="grid grid-cols-1 gap-3">
              {pendingSteps.slice(0, 3).map((step) => (
                <div key={step.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 hover:bg-white/5 transition-all text-left">
                  <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white leading-tight">{step.label}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2 bg-emerald-500 rounded-xl text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Profil 100% complet !</p>
          </div>
        )}
        
        <p className="text-[10px] text-slate-500 italic mt-6 flex items-center gap-2">
          <Circle className="w-2 h-2 fill-blue-500 animate-pulse text-blue-500" />
          {t("completeness_tip")}
        </p>
      </div>
    </div>
  );
}
