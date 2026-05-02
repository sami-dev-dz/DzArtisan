"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Camera, Save, MapPin, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import LocationPicker from "@/components/forms/LocationPicker";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { ProfilePageSkeleton } from "@/components/ui/SkeletonLayouts";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nomComplet: "",
    telephone: "",
    description: "",
    lienWhatsApp: "",
    anneesExp: 0,
    categorie_id: null,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/profile");
        setFormData({
          nomComplet: data.user.nomComplet,
          telephone: data.user.telephone || "",
          description: data.artisan?.description || "",
          lienWhatsApp: data.artisan?.lienWhatsApp || "",
          anneesExp: data.artisan?.anneesExp || 0,
          categorie_id: data.artisan?.categorie_id,
        });
        if (data.artisan?.wilayas) {
          setWilayas(data.artisan.wilayas.map(w => w.id));
        }
      } catch (err) {
        console.error("Fetch profile error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTestWhatsApp = () => {
    const regex = /^wa\.me\/213[567][0-9]{8}$/;
    if (!formData.lienWhatsApp) {
      setError("Le lien WhatsApp est vide.");
      return;
    }
    if (!regex.test(formData.lienWhatsApp)) {
      setError("Format invalide. Utilisez wa.me/213XXXXXXXXX");
      return;
    }
    setError("");
    window.open(`https://${formData.lienWhatsApp}`, "_blank");
  };

  const handleSave = async () => {
     try {
       setSaving(true);
       await api.post("/profile/update", {
         ...formData,
         wilaya_ids: wilayas
       });
       setUser({ ...user, nomComplet: formData.nomComplet });
       alert("Profil mis à jour avec succès !");
     } catch (err) {
       console.error("Save profile error", err);
       alert("Une erreur est survenue lors de la mise à jour.");
     } finally {
       setSaving(false);
     }
  };

  if (loading) return <ProfilePageSkeleton />;

  const tabs = [
    { id: "general", label: "Général", icon: User },
    { id: "location", label: "Zone d'intervention", icon: MapPin },
    { id: "professional", label: "Professionnel", icon: Briefcase },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white font-display mb-2">Mon Profil</h1>
        <p className="text-slate-400">Gérez vos informations personnelles et professionnelles</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {activeTab === "general" && (
              <div className="space-y-8">
                {/* Profile Photo */}
                <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-white/5">
                  <div className="relative group">
                    <div className="relative w-32 h-32 rounded-3xl bg-slate-800 border-2 border-white/10 overflow-hidden shadow-2xl">
                      {user?.photo ? (
                        <Image src={user.photo} alt="Photo de profil" fill unoptimized className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold text-white mb-1">Photo de profil</h3>
                    <p className="text-slate-400 text-sm">JPG, PNG ou WebP. Max 2 Mo.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Nom Complet</label>
                    <input 
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" 
                      value={formData.nomComplet}
                      onChange={(e) => setFormData({...formData, nomComplet: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                    <input type="email" className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 px-6 text-slate-500 font-medium cursor-not-allowed" value={user?.email} readOnly />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Téléphone (Format: 05XXXXXXXX)</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" 
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-8">
                <p className="text-slate-400">Sélectionnez les wilayas où vous pouvez intervenir.</p>
                <div className="bg-slate-950/30 p-6 rounded-3xl border border-white/5 shadow-inner">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     {[1, 16, 31, 23, 25, 19].map(wid => (
                       <button
                         key={wid}
                         onClick={() => {
                           if (wilayas.includes(wid)) setWilayas(wilayas.filter(w => w !== wid));
                           else setWilayas([...wilayas, wid]);
                         }}
                         className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${wilayas.includes(wid) ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/10'}`}
                       >
                         {wid} - Wilaya
                       </button>
                     ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 italic">* Un artisan multicartes est recommandé par 3x plus d&apos;opportunités.</p>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Catégorie de métier</label>
                     <select 
                       className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer font-medium"
                       value={formData.categorie_id || ""}
                       onChange={(e) => setFormData({...formData, categorie_id: e.target.value})}
                     >
                        <option value="" disabled>Choisir une catégorie</option>
                        <option value={1}>Plomberie</option>
                        <option value={2}>Électricité</option>
                        <option value={3}>Peinture</option>
                     </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lien WhatsApp</label>
                      <button 
                        onClick={handleTestWhatsApp}
                        className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Tester le lien
                      </button>
                    </div>
                    <div className="relative">
                      <MessageCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input 
                        className={`w-full bg-slate-950/50 border rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium ${error ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10'}`} 
                        placeholder="wa.me/213XXXXXXXXX"
                        value={formData.lienWhatsApp}
                        onChange={(e) => setFormData({...formData, lienWhatsApp: e.target.value})}
                      />
                    </div>
                    {error && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-bounce">{error}</p>}
                    <p className="text-[10px] text-slate-500 mt-1 ml-1 leading-relaxed">Format requis pour le bouton direct client : <span className="text-slate-400">wa.me/213</span> suivi des 9 chiffres sans le premier 0.</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Description professionnelle (Min 150 chars)</label>
                     <textarea 
                       rows={5} 
                       className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" 
                       placeholder="Parlez-nous de votre expertise..." 
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                     />
                     <div className="flex justify-between items-center text-[10px] font-bold px-1">
                        <span className={formData.description.length >= 150 ? "text-emerald-500" : "text-slate-500"}>
                          {formData.description.length} / 150 caractères
                        </span>
                        {formData.description.length < 150 && <span className="text-amber-500">Profil incomplet</span>}
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Années d&apos;expérience</label>
                     <input 
                       type="number" 
                       className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" 
                       value={formData.anneesExp}
                       onChange={(e) => setFormData({...formData, anneesExp: parseInt(e.target.value) || 0})}
                     />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-12 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-6 transition-transform" />}
                Enregistrer les modifications
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
