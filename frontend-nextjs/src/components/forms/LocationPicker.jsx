"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export default function LocationPicker({ selectedWilaya, selectedCommune, onWilayaChange, onCommuneChange }) {
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);

  // Mock data for initial UI dev (replace with real API call later)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWilayas([
      { id: 1, nom: "Alger", code: "16" },
      { id: 2, nom: "Oran", code: "31" },
      { id: 3, nom: "Constantine", code: "25" }
    ]);
  }, []);

  useEffect(() => {
    if (selectedWilaya) {
      // Fetch communes based on wilaya_id
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setCommunes([
        { id: 1, nom: "Bab El Oued", wilaya_id: 1 },
        { id: 2, nom: "Casbah", wilaya_id: 1 }
      ]);
    }
  }, [selectedWilaya]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Wilaya</label>
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <select 
            value={selectedWilaya}
            onChange={(e) => onWilayaChange(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer font-medium"
          >
            <option value="">Sélectionner une Wilaya</option>
            {wilayas.map(w => <option key={w.id} value={w.id}>{w.code} - {w.nom}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Commune</label>
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <select 
            value={selectedCommune}
            onChange={(e) => onCommuneChange(e.target.value)}
            disabled={!selectedWilaya}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Sélectionner une Commune</option>
            {communes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
