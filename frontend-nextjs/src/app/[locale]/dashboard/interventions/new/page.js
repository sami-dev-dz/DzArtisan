"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Send, Wrench, MapPin, Calendar, AlignLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function NouvelleInterventionPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "plomberie",
    wilaya: "",
    commune: "",
    date_souhaitee: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/interventions");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <Link href="/dashboard/interventions" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour aux interventions
        </Link>
        <h1 className="text-4xl font-bold text-white font-display mb-2">Nouvelle demande</h1>
        <p className="text-slate-400">Détaillez votre problème pour trouver le meilleur artisan.</p>
      </header>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-6 shadow-xl"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Titre de la demande</label>
          <div className="relative group">
            <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
            <input
              required
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              placeholder="Ex: Réparation d'une fuite d'eau"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Catégorie</label>
          <div className="relative group">
            <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
            <select
              required
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
            >
              <option value="plomberie">Plomberie</option>
              <option value="electricite">Électricité</option>
              <option value="peinture">Peinture</option>
              <option value="maconnerie">Maçonnerie</option>
              <option value="menuiserie">Menuiserie</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Description détaillée</label>
          <div className="relative group">
            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              placeholder="Décrivez votre besoin en détail..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Wilaya</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
              <input
                required
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                placeholder="Ex: Alger"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Commune</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
              <input
                required
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                placeholder="Ex: Bab El Oued"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Date souhaitée (Optionnel)</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
            <input
              type="date"
              name="date_souhaitee"
              value={formData.date_souhaitee}
              onChange={handleChange}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20 group"
          >
            {loading ? "Création en cours..." : "Publier la demande"}
            {!loading && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
