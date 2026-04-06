"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, CreditCard, Rocket, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("annual");

  const plans = [
    {
      name: "Mensuel",
      price: 1000,
      description: "Solution flexible pour débuter.",
      features: ["3 mois d'essai offerts", "Badge Artisan Vérifié", "10 interventions / mois", "Support standard"],
      icon: Zap,
      id: "monthly",
      popular: false
    },
    {
      name: "Trimestriel",
      price: 3000,
      description: "Plus de tranquillité, moins de frais.",
      features: ["3 mois d'essai offerts", "Badge Artisan Vérifié", "Interventions illimitées", "Support Prioritaire", "Visibilité locale accrue"],
      icon: Rocket,
      id: "quarterly",
      popular: true
    },
    {
      name: "Annuel",
      price: 10000,
      description: "L'excellence pour votre activité.",
      features: ["3 mois d'essai offerts", "Badge Expert Or", "Interventions illimitées", "Support Dédié", "Visibilité Max (Top 3)", "Analytics d'activité"],
      icon: Shield,
      id: "yearly",
      popular: false,
      saving: "20% d'économie"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-hidden relative py-20 px-6">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
            Offre Exceptionnelle de Lancement
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-6">
             <span className="text-blue-500 italic uppercase">3 MOIS GRATUITS</span> <br />
             sur tous nos plans d&apos;abonnement
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Rejoignez la plus grande communauté d&apos;artisans d&apos;Algérie. Testez gratuitement pendant 90 jours, sans engagement.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 group overflow-hidden ${plan.popular ? "bg-blue-600/5 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.15)]" : "bg-slate-900/50 border-white/5 hover:border-white/10 shadow-2xl"}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 py-1.5 px-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl">
                 Populaire
              </div>
            )}
            {plan.saving && (
              <div className="absolute top-6 left-6 py-1 px-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20">
                 {plan.saving}
              </div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? "bg-blue-600 text-white" : "bg-slate-800 text-blue-500"}`}>
               <plan.icon className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{plan.price.toLocaleString('fr-DZ')}</span>
              <span className="text-slate-500 text-lg font-medium">DA</span>
              {plan.id === "monthly" ? <span className="text-slate-500 text-sm">/mois</span> : plan.id === "quarterly" ? <span className="text-slate-500 text-sm">/trim</span> : <span className="text-slate-500 text-sm">/an</span>}
            </div>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed">{plan.description}</p>

            <ul className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30" : "bg-white text-slate-900 hover:bg-slate-100"}`}>
               Commencer l&apos;essai
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-20 text-center relative z-10">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-6">Paiement sécurisé avec</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 hover:opacity-70 transition-opacity">
           <span className="text-xl font-bold text-white tracking-tighter italic">Chargily</span>
           <span className="text-xl font-bold text-white tracking-tighter italic">CIB</span>
           <span className="text-xl font-bold text-white tracking-tighter italic">EDAHABIA</span>
        </div>
      </div>
    </div>
  );
}
