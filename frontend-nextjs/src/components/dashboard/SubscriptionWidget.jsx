"use client";

import { motion } from "framer-motion";
import { CreditCard, Star, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function SubscriptionWidget({ status }) {
  const isTrial = status?.is_on_trial || true; // Mocked for UI
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
         <CreditCard className="w-20 h-20 text-blue-500 rotate-12" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
          <Star className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h4 className="text-white font-bold">Abonnement</h4>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
            {isTrial ? "Période d'essai" : status?.plan || "Gratuit"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Statut</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
             Actif
          </span>
        </div>

        {isTrial && (
           <div className="p-3 bg-blue-600/5 border border-blue-500/10 rounded-xl">
             <div className="flex items-center gap-2 text-xs text-blue-400 font-bold mb-1">
               <Calendar className="w-3 h-3" /> 
               EXPIRE DANS 84 JOURS
             </div>
             <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "70%" }}
                 className="h-full bg-blue-600" 
               />
             </div>
           </div>
        )}

        <Link href="/pricing" className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all group/btn">
          Mettre à niveau <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
