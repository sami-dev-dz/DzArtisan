"use client";

import { motion } from "framer-motion";
import { Plus, Search, Filter, Grid, List as ListIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { InterventionCard } from "@/components/interventions/InterventionCard";
import Link from "next/link";

export default function InterventionsPage() {
  const [role, setRole] = useState("client"); // To be fetched from user state
  const [interventions, setInterventions] = useState([
    { id: 1, statut: "pending", description: "Réparation fuite d'eau dans la cuisine", categorie: { nom: "Plomberie" }, wilaya: { nom: "Alger" }, commune: { nom: "Bab El Oued" }, date_prevue: "2024-04-15" },
    { id: 2, statut: "accepted", description: "Installation climatisation chambre", categorie: { nom: "Climatisation" }, wilaya: { nom: "Alger" }, commune: { nom: "Hydra" }, date_prevue: "2024-04-12" },
    { id: 3, statut: "completed", description: "Peinture salon et couloir", categorie: { nom: "Peinture" }, wilaya: { nom: "Alger" }, commune: { nom: "El Biar" }, date_prevue: "2024-04-01" },
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white font-display mb-2">Interventions</h1>
          <p className="text-slate-400">Suivez et gérez l&apos;avancement de vos missions.</p>
        </div>
        
        {role === "client" && (
          <Link href="/dashboard/interventions/new" className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Nouvelle demande
          </Link>
        )}
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg">Toutes</button>
          <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium rounded-xl">En cours</button>
          <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium rounded-xl">Terminées</button>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
             <input className="bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64" placeholder="Rechercher une mission..." />
           </div>
        </div>
      </div>

      {/* Interventions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interventions.map((intervention) => (
          <InterventionCard key={intervention.id} intervention={intervention} role={role} />
        ))}
      </div>

      {/* Empty State (Optional) */}
      {interventions.length === 0 && (
         <div className="text-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem]">
           <p className="text-slate-500 font-medium">Aucune intervention trouvée.</p>
         </div>
      )}
    </div>
  );
}
