"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Camera, 
  Pencil, 
  Phone, 
  MessageCircle, 
  Briefcase, 
  MapPin, 
  Check, 
  Upload, 
  X, 
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Plus,
  Eye,
  Save,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { useToastStore } from "@/store/toastStore"
import { wilayas, experience_levels } from "@/data/algeria"
import { uploadToCloudinary } from "@/lib/cloudinary"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"

export default function ArtisanProfileEditPage() {
  const t = useTranslations("onboarding")
  const dash = useTranslations("dashboard")
  const common = useTranslations("common")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const router = useRouter()
  const { user, setUser } = useAuth()
  const { addToast } = useToastStore()

  // Form State
  const [formData, setFormData] = React.useState({
    photo: "",
    nomComplet: "",
    telephone: "",
    whatsapp: "",
    categories: [],
    wilayas: [],
    experience_level: "beginner",
    about: "",
    disponibilite: "disponible",
  })

  // UI State
  const [fetching, setFetching] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [isNameModalOpen, setIsNameModalOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [categories, setCategories] = React.useState([])
  const [searchWilaya, setSearchWilaya] = React.useState("")
  const [uploadProgress, setUploadProgress] = React.useState({
    photo: 0,
  })

  // Fetch data on mount
  React.useEffect(() => {
    const init = async () => {
      try {
        const [catRes, profRes] = await Promise.all([
          api.get("/categories"),
          api.get("/profile")
        ])
        setCategories(catRes.data)
        
        const p = profRes.data
        const art = p.artisan || {}
        
        setFormData({
          photo: art.photo || "",
          nomComplet: p.nomComplet || "",
          telephone: p.telephone || "",
          whatsapp: art.lienWhatsApp || "",
          categories: art.categories?.map(c => c.id) || [],
          wilayas: art.wilayas?.map(w => w.id) || [],
          experience_level: art.experience_level || "beginner",
          about: art.description || "",
          disponibilite: art.disponibilite || "disponible",
        })
        setNewName(p.nomComplet || "")
      } catch (err) {
        addToast({ title: common("error"), type: "error" })
      } finally {
        setFetching(false)
      }
    }
    init()
  }, [])

  // --- Handlers ---

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      addToast({ title: t("doc_size_limit"), type: "error" })
      return
    }

    try {
      const url = await uploadToCloudinary(file, (p) => setUploadProgress(prev => ({ ...prev, photo: p })))
      setFormData(prev => ({ ...prev, photo: url }))
      addToast({ title: t("upload_success"), type: "success" })
    } catch (err) {
      addToast({ title: common("error"), type: "error" })
    } finally {
      setUploadProgress(prev => ({ ...prev, photo: 0 }))
    }
  }

  const generateWhatsApp = () => {
    if (!formData.telephone) return
    let ph = formData.telephone.replace(/\s/g, '').replace('+', '')
    if (ph.startsWith('0')) ph = '213' + ph.substring(1)
    const link = `https://wa.me/${ph}`
    setFormData(prev => ({ ...prev, whatsapp: link }))
  }

  const toggleCategory = (id) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(id) 
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id]
    }))
  }

  const toggleWilaya = (id) => {
    setFormData(prev => ({
      ...prev,
      wilayas: prev.wilayas.includes(id)
        ? prev.wilayas.filter(w => w !== id)
        : [...prev.wilayas, id]
    }))
    setSearchWilaya("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post("/profile", {
         ...formData,
         categorie_ids: formData.categories,
         wilaya_ids: formData.wilayas,
         lienWhatsApp: formData.whatsapp
      })
      
      // Update auth context
      setUser(data.user)

      addToast({ title: common("success"), type: "success" })
    } catch (err) {
       addToast({ title: common("error"), type: "error" })
    } finally {
       setLoading(false)
    }
  }

  if (fetching) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
           <p className="text-xs font-black uppercase tracking-widest text-slate-400">Chargement du profil...</p>
        </div>
     )
  }

  const filteredWilayas = wilayas.filter(w => 
    w.name.toLowerCase().includes(searchWilaya.toLowerCase()) || 
    w.code.includes(searchWilaya)
  ).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{dash("profile")}</h1>
           <p className="text-slate-500 font-bold mt-1">Mettez à jour vos informations professionnelles pour rester attractif.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button 
             variant="outline" 
             className="rounded-2xl h-14 px-6 border-slate-200 dark:border-white/10 font-bold gap-2"
             onClick={() => window.open(`/artisans/${user?.id}`, '_blank')} // Simplified preview
           >
              <Eye className="w-5 h-5 text-blue-500" />
              Aperçu public
           </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* 1. Photo & Identity Section */}
        <section className="bg-white dark:bg-slate-900 shadow-xl rounded-[40px] p-8 md:p-12 border border-slate-100 dark:border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
           
           <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative z-10">
              {/* Photo Upload Area */}
              <div className="relative group shrink-0">
                 <div className="w-44 h-44 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    {formData.photo ? (
                       <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <Camera className="w-12 h-12 text-slate-300" />
                    )}
                    
                    {uploadProgress.photo > 0 && (
                       <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-2 border-blue-600/20 border-t-blue-600 animate-spin" />
                       </div>
                    )}

                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                       <Upload className="w-6 h-6" />
                       Changer la photo
                       <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                 </div>
              </div>

              {/* Bio Data */}
              <div className="flex-1 space-y-8 w-full">
                 <div className="space-y-6">
                    {/* Read-only Name with Modal Edit */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("name_label")}</label>
                       <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-6 font-bold text-slate-900 dark:text-white">
                             {formData.nomComplet}
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="shrink-0 h-[58px] w-[58px] rounded-2xl border-slate-200 dark:border-slate-800"
                            onClick={() => setIsNameModalOpen(true)}
                          >
                             <Pencil className="w-5 h-5" />
                          </Button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {/* Phone Number */}
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("phone_label")}</label>
                          <div className="relative group">
                             <Phone className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500", isRTL ? "right-4" : "left-4")} />
                             <Input 
                               value={formData.telephone}
                               onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                               className="px-12 h-14 rounded-2xl"
                               placeholder="05xx xx xx xx"
                             />
                          </div>
                       </div>

                       {/* WhatsApp */}
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("whatsapp_label")}</label>
                          <div className="flex gap-2">
                             <div className="relative group flex-1">
                                <MessageCircle className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500", isRTL ? "right-4" : "left-4")} />
                                <Input 
                                  value={formData.whatsapp}
                                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                                  className="px-12 h-14 rounded-2xl"
                                  placeholder="https://wa.me/213..."
                                />
                             </div>
                             <Button 
                               type="button" 
                               size="icon"
                               onClick={generateWhatsApp}
                               className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 w-14 shrink-0 shadow-lg shadow-emerald-600/20"
                             >
                                <Zap className="w-5 h-5" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 2. Expertise & Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           {/* Categories */}
           <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                    <Briefcase className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t("categories_title")}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 {categories.map((cat) => {
                    const isSelected = formData.categories.includes(cat.id)
                    return (
                       <button
                         key={cat.id}
                         type="button"
                         onClick={() => toggleCategory(cat.id)}
                         className={cn(
                           "relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 group",
                           isSelected 
                             ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10" 
                             : "border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-200"
                         )}
                       >
                          <span className="text-xl">{cat.icone || "🛠️"}</span>
                          <span className={cn(
                             "font-bold text-xs uppercase tracking-tight",
                             isSelected ? "text-blue-600" : "text-slate-500"
                          )}>{cat.nom}</span>
                       </button>
                    )
                 })}
              </div>
           </section>

           {/* Wilayas */}
           <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t("wilayas_title")}</h3>
              </div>
              
              <div className="relative">
                 <Input 
                   placeholder={t("wilayas_placeholder")}
                   value={searchWilaya}
                   onChange={(e) => setSearchWilaya(e.target.value)}
                   className="bg-slate-50 dark:bg-slate-950/50 border-none h-14 pl-12 rounded-2xl"
                 />
                 <Plus className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />

                 <AnimatePresence>
                    {searchWilaya && (
                       <motion.div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden max-h-48 overflow-y-auto">
                          {filteredWilayas.map(w => (
                             <button
                               key={w.id}
                               type="button"
                               onClick={() => toggleWilaya(w.id)}
                               className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                             >
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                   <span className="text-blue-600 mr-2">{w.code}</span> {w.name}
                                </span>
                                {formData.wilayas.includes(w.id) && <Check className="w-4 h-4 text-blue-600" />}
                             </button>
                          ))}
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-2">
                 {formData.wilayas.map(id => {
                    const w = wilayas.find(x => x.id === id)
                    return (
                       <Badge key={id} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 flex items-center gap-2">
                          {w.name}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleWilaya(id)} />
                       </Badge>
                    )
                 })}
              </div>
           </section>
        </div>

        {/* 3. Description & Save */}
        <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] border border-slate-100 dark:border-white/5 space-y-8">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Votre Description</h3>
           </div>

           <Textarea 
             value={formData.about}
             onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value.slice(0, 500) }))}
             className="min-h-[200px] rounded-3xl bg-slate-50 dark:bg-slate-950/20 border-none p-8 text-lg"
             placeholder={t("about_placeholder")}
           />

           <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-6">
                 {experience_levels.map(level => {
                    const isSelected = formData.experience_level === level.id
                    return (
                       <button
                         key={level.id}
                         type="button"
                         onClick={() => setFormData(prev => ({ ...prev, experience_level: level.id }))}
                         className={cn(
                           "text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                           isSelected ? "text-blue-600" : "text-slate-400 opacity-50"
                         )}
                       >
                          {t(level.label_key)}
                       </button>
                    )
                 })}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-blue-600/30"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Enregistrer les modifications
              </Button>
           </div>
        </section>

      </form>

      {/* Name Edit Modal (Re-used) */}
      <Modal isOpen={isNameModalOpen} onClose={() => setIsNameModalOpen(false)} title="Changer votre nom">
        <div className="p-8 space-y-6">
           <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-xs font-bold text-amber-700 leading-relaxed italic">
              Attention : Votre nom doit être votre nom réel. Des changements fréquents peuvent impacter votre badge de vérification.
           </div>
           <Input 
             value={newName} 
             onChange={(e) => setNewName(e.target.value)} 
             className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold"
           />
           <Button className="w-full h-14 rounded-2xl font-black" onClick={() => { setFormData(prev => ({ ...prev, nomComplet: newName })); setIsNameModalOpen(false); }}>
              Confirmer
           </Button>
        </div>
      </Modal>

    </div>
  )
}

function Zap({ className }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5 14 3v8h6L10 20.2V13H4Z"/></svg>
   )
}
