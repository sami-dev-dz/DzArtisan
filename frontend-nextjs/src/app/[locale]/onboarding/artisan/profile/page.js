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
  Plus
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

const TRADE_OPTIONS = [
  { key: "electricien", label: "Électricien", icon: "⚡" },
  { key: "plombier", label: "Plombier", icon: "🔧" },
  { key: "peintre", label: "Peintre", icon: "🎨" },
  { key: "macon", label: "Maçon", icon: "🧱" },
  { key: "menuisier", label: "Menuisier", icon: "🪚" },
  { key: "climatisation", label: "Climatisation", icon: "❄️" },
  { key: "mecanicien", label: "Mécanicien", icon: "🛠️" },
  { key: "nettoyage", label: "Nettoyage", icon: "🧼" },
  { key: "demenagement", label: "Déménagement", icon: "📦" },
  { key: "autre", label: "Autre", icon: "✨" },
]

export default function ArtisanProfileSetupPage() {
  const t = useTranslations("onboarding")
  const common = useTranslations("common")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const router = useRouter()
  const { user } = useAuth()
  const { addToast } = useToastStore()

  // Form State
  const [formData, setFormData] = React.useState({
    photo: null,
    nomComplet: user?.nomComplet || "",
    telephone: user?.telephone || "",
    phone_visible_to_clients: true,
    whatsapp: "",
    category_id: null,
    wilayas: [],
    experience_level: "beginner",
    about: "",
    disponibilite: "disponible",
    doc_diploma: null,
    doc_card: null,
  })

  // UI State
  const [loading, setLoading] = React.useState(false)
  const [isNameModalOpen, setIsNameModalOpen] = React.useState(false)
  const [newName, setNewName] = React.useState(user?.nomComplet || "")
  const [categories, setCategories] = React.useState([])
  const [searchWilaya, setSearchWilaya] = React.useState("")
  const [uploadProgress, setUploadProgress] = React.useState({
    photo: 0,
    doc_diploma: 0,
    doc_card: 0,
  })
  const [currentStep, setCurrentStep] = React.useState(1)

  // Fetch categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories")
        setCategories(data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }
    fetchCategories()
  }, [])

  // Profile completion calculation (for progress bar)
  const completion = React.useMemo(() => {
    const required = [
      formData.nomComplet,
      formData.telephone,
      !!formData.category_id,
      formData.wilayas.length > 0,
      formData.experience_level,
      formData.about.length >= 20,
    ]
    const completed = required.filter(Boolean).length
    return Math.round((completed / required.length) * 100)
  }, [formData])

  // --- Handlers ---

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      addToast({ title: t("invalid_image_format"), type: "error" })
      return
    }

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

  const handleDocumentUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      addToast({ title: t("invalid_doc_format"), type: "error" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({ title: t("doc_size_limit"), type: "error" })
      return
    }

    try {
      const url = await uploadToCloudinary(file, (p) => setUploadProgress(prev => ({ ...prev, [type]: p })))
      setFormData(prev => ({ ...prev, [type]: url }))
      addToast({ title: t("upload_success"), type: "success" })
    } catch (err) {
      addToast({ title: common("error"), type: "error" })
    } finally {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
    }
  }

  const handleDroppedFile = async (file, type) => {
    const fakeEvent = { target: { files: [file] } }
    await handleDocumentUpload(fakeEvent, type)
  }

  const generateWhatsApp = () => {
    if (!formData.telephone) return
    let ph = formData.telephone.replace(/\s/g, '').replace('+', '')
    if (ph.startsWith('0')) ph = '213' + ph.substring(1)
    const link = `wa.me/${ph}`
    setFormData(prev => ({ ...prev, whatsapp: link }))
  }

  const selectCategory = (id) => setFormData(prev => ({ ...prev, category_id: id }))

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

    if (!formData.telephone.match(/^0(5|6|7)\d{8}$/)) {
      addToast({ title: t("invalid_phone"), type: "error" })
      return
    }
    if (!formData.whatsapp.match(/^wa\.me\/213[567][0-9]{8}$/)) {
      addToast({ title: t("invalid_whatsapp"), type: "error" })
      return
    }

    if (completion < 100) {
      addToast({ title: t("error_required_fields"), type: "error" })
      return
    }

    setLoading(true)
    try {
      await api.post("/profile", {
         ...formData,
         lienWhatsApp: formData.whatsapp,
         categorie_ids: [formData.category_id],
         wilaya_ids: formData.wilayas,
         statutValidation: "en_attente"
      })
      addToast({ title: common("success"), type: "success" })
      router.push("/onboarding/artisan/waiting")
    } catch (err) {
       addToast({ title: common("error"), type: "error" })
    } finally {
       setLoading(false)
    }
  }

  // --- Render Helpers ---

  const filteredWilayas = wilayas.filter(w => 
    w.name.toLowerCase().includes(searchWilaya.toLowerCase()) || 
    w.code.includes(searchWilaya)
  ).slice(0, 10)

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.nomComplet || !formData.telephone.match(/^0(5|6|7)\d{8}$/)) {
        addToast({ title: t("error_required_fields"), type: "error" })
        return false
      }
      return true
    }

    if (currentStep === 2) {
      if (!formData.category_id || formData.wilayas.length === 0 || formData.about.length < 20) {
        addToast({ title: t("error_required_fields"), type: "error" })
        return false
      }
      return true
    }

    return true
  }

  const goToNextStep = () => {
    if (!validateCurrentStep()) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      
      {/* Header & Progress */}
      <header className="mb-12 text-center">
        <div className="flex justify-between items-end mb-4">
           <div className="text-left rtl:text-right">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t("title")}</h1>
              <p className="text-slate-500 dark:text-slate-400">{t("subtitle")}</p>
           </div>
           <div className="hidden sm:block text-right rtl:text-left">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                 {t("step_info", { current: currentStep, total: 3 })}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{completion}%</div>
           </div>
        </div>
        
        {/* Real Progress Bar */}
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${completion}%` }}
             className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 relative"
           >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)25%,transparent 25%,transparent 50%,rgba(255,255,255,0.2)50%,rgba(255,255,255,0.2)75%,transparent 75%)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
           </motion.div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {currentStep === 1 && (
        <section className="bg-white dark:bg-slate-900 shadow-xl rounded-3xl p-8 border border-slate-100 dark:border-white/5">
           <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
              
              {/* Photo Upload Area */}
              <div className="relative group shrink-0">
                 <div className="w-40 h-40 rounded-full border-4 border-slate-100 dark:border-slate-800 relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    {formData.photo ? (
                       <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <Camera className="w-12 h-12 text-slate-300" />
                    )}
                    
                    {/* Upload Progress Ring */}
                    {uploadProgress.photo > 0 && (
                       <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-2 border-blue-600/20 border-t-blue-600 animate-spin" />
                          <span className="absolute text-[10px] font-bold text-blue-600">{uploadProgress.photo}%</span>
                       </div>
                    )}

                    {/* Hover Overlay */}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                       <Upload className="w-6 h-6" />
                       {t("photo_upload")}
                       <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                 </div>
                 {formData.photo && (
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900"
                    >
                       <X className="w-4 h-4" />
                    </button>
                 )}
              </div>

              {/* Bio Data */}
              <div className="flex-1 space-y-6 w-full">
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                       <ShieldCheck className="w-5 h-5 text-blue-600" />
                       {t("identity_title")}
                    </h3>
                    
                    {/* Read-only Name with Modal Edit */}
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("name_label")}</label>
                       <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                         {t("name_locked_hint")}
                       </div>
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

                    {/* Phone Number */}
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("phone_label")}</label>
                       <div className="relative group">
                          <Phone className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                          <Input 
                            value={formData.telephone}
                            onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                            className="px-12"
                            placeholder="05xx xx xx xx"
                          />
                          {formData.telephone.match(/^0(5|6|7)\d{8}$/) && (
                             <Check className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500", isRTL ? "left-4" : "right-4")} />
                          )}
                       </div>
                       <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5">
                         <span className="text-xs font-semibold text-slate-500">{t("phone_visibility_label")}</span>
                         <button
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, phone_visible_to_clients: !prev.phone_visible_to_clients }))}
                           className={cn(
                             "w-11 h-6 rounded-full relative transition-colors",
                             formData.phone_visible_to_clients ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                           )}
                         >
                           <span
                             className={cn(
                               "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all",
                               formData.phone_visible_to_clients ? "left-[22px]" : "left-0.5"
                             )}
                           />
                         </button>
                       </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("whatsapp_label")}</label>
                       <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative group flex-1">
                             <MessageCircle className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors", isRTL ? "right-4" : "left-4")} />
                             <Input 
                               value={formData.whatsapp}
                               onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                               className="px-12"
                               placeholder="https://wa.me/213..."
                             />
                          </div>
                          <Button 
                            type="button" 
                            onClick={generateWhatsApp}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-[54px] px-6 font-bold flex items-center gap-2 shrink-0"
                          >
                             <Zap className="w-5 h-5" />
                             {t("whatsapp_btn")}
                          </Button>
                       </div>
                       {formData.whatsapp && (
                          <a href={formData.whatsapp} target="_blank" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 hover:underline ml-1">
                             <Check className="w-3 h-3" /> {t("whatsapp_test")} <ExternalLink className="w-3 h-3" />
                          </a>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </section>
        )}

        {currentStep === 2 && (
        <>
        {/* 2. Expertise & Categories */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 text-white">
                 <Briefcase className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{t("categories_title")}</h2>
                 <p className="text-slate-500 text-sm font-medium">{t("categories_desc")}</p>
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => {
                 const catalog = TRADE_OPTIONS.find(option => cat.nom.toLowerCase().includes(option.key)) || TRADE_OPTIONS[TRADE_OPTIONS.length - 1]
                 const isSelected = formData.category_id === cat.id
                 return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCategory(cat.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 gap-3 group",
                        isSelected 
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10 shadow-xl shadow-blue-600/10" 
                          : "border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-600/30"
                      )}
                    >
                       <div className={cn(
                          "w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                       )}>
                          {catalog.icon}
                       </div>
                       <span className={cn(
                          "font-bold text-sm text-center line-clamp-1",
                          isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                       )}>
                          {cat.nom}
                       </span>
                       
                       <AnimatePresence>
                          {isSelected && (
                             <motion.div 
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-950 shadow-lg"
                             >
                                <Check className="w-3 h-3 stroke-[3]" />
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </button>
                 )
              })}
           </div>
        </section>

        {/* 3. Coverage & Exp */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Wilayas Multi-select */}
           <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                 <MapPin className="w-6 h-6 text-blue-600" />
                 <h3 className="text-xl font-bold dark:text-white">{t("wilayas_title")}</h3>
              </div>
              
              <div className="relative">
                 <div className="relative group">
                    <Input 
                      placeholder={t("wilayas_placeholder")}
                      value={searchWilaya}
                      onChange={(e) => setSearchWilaya(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950/50 border-none h-14 pl-12"
                    />
                    <Plus className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 </div>

                 {/* Results Popover */}
                 <AnimatePresence>
                    {searchWilaya && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden max-h-60 overflow-y-auto"
                       >
                          {filteredWilayas.map(w => (
                             <button
                               key={w.id}
                               type="button"
                               onClick={() => toggleWilaya(w.id)}
                               disabled={formData.wilayas.includes(w.id)}
                               className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                             >
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                   <span className="text-blue-600 mr-2">{w.code}</span> {w.name}
                                </span>
                                {formData.wilayas.includes(w.id) ? (
                                   <Check className="w-5 h-5 text-blue-600" />
                                ) : (
                                   <ChevronRight className="w-4 h-4 text-slate-300" />
                                )}
                             </button>
                          ))}
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Pills Area */}
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                 {formData.wilayas.map(id => {
                    const w = wilayas.find(x => x.id === id)
                    return (
                       <motion.div 
                         layout
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         key={id}
                         className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20"
                       >
                          <span>{w.code} - {w.name}</span>
                          <button type="button" onClick={() => toggleWilaya(id)} className="p-0.5 hover:bg-white/20 rounded-md transition-colors">
                             <X className="w-4 h-4" />
                          </button>
                       </motion.div>
                    )
                 })}
                 {formData.wilayas.length === 0 && (
                    <p className="text-slate-400 text-sm font-medium italic pt-2">{t("wilayas_desc")}</p>
                 )}
              </div>
           </section>

           {/* Experience Levels */}
           <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                 <Clock className="w-6 h-6 text-blue-600" />
                 <h3 className="text-xl font-bold dark:text-white">{t("exp_title")}</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                 {experience_levels.map(level => {
                    const isSelected = formData.experience_level === level.id
                    return (
                       <button
                         key={level.id}
                         type="button"
                         onClick={() => setFormData(prev => ({ ...prev, experience_level: level.id }))}
                         className={cn(
                           "flex-1 px-4 py-4 rounded-2xl font-bold border-2 transition-all duration-300 text-sm whitespace-nowrap",
                           isSelected 
                             ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
                             : "bg-slate-50 dark:bg-slate-950 border-slate-50 dark:border-white/5 text-slate-500 hover:border-slate-200"
                         )}
                       >
                          {t(level.label_key)}
                       </button>
                    )
                 })}
              </div>

              {/* Bio Area */}
              <div className="space-y-4 pt-4">
                 <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("about_title")}</label>
                    <span className={cn("text-[10px] font-black uppercase tracking-tighter", formData.about.length < 20 ? "text-red-500" : "text-emerald-500")}>
                       {formData.about.length} / 300
                    </span>
                 </div>
                 <Textarea 
                   value={formData.about}
                   onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value.slice(0, 300) }))}
                   className="min-h-[150px] rounded-2xl bg-slate-50 dark:bg-slate-950/50 border-none p-6 text-base leading-relaxed"
                   placeholder={t("about_placeholder")}
                 />
                 {formData.about.length < 20 && (
                    <p className="flex items-center gap-2 text-xs font-bold text-red-500 ml-1">
                       <AlertCircle className="w-3 h-3" /> {t("about_min_chars", { count: 20 })}
                    </p>
                 )}
              </div>
           </section>
        </div>
        </>
        )}

        {currentStep === 3 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Availability */}
           <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-2">{t("availability_title")}</h3>
                 <p className="text-blue-100 text-sm font-medium mb-8">{t("availability_desc")}</p>
                 
                 <div className="flex items-center gap-4">
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, disponibilite: prev.disponibilite === "disponible" ? "indisponible" : "disponible" }))}
                      className={cn(
                        "w-16 h-9 rounded-full relative transition-colors duration-300 border-2",
                        formData.disponibilite === "disponible" ? "bg-emerald-500 border-emerald-400" : "bg-slate-400/50 border-white/20"
                      )}
                    >
                       <motion.div 
                         layout
                         className="w-7 h-7 bg-white rounded-full absolute top-1.5 left-1.5 shadow-md flex items-center justify-center"
                         animate={{ x: formData.disponibilite === "disponible" ? 28 : 0 }}
                       >
                          <div className={cn("w-1.5 h-1.5 rounded-full", formData.disponibilite === "disponible" ? "bg-emerald-500" : "bg-slate-400")} />
                       </motion.div>
                    </button>
                    <span className="font-black uppercase tracking-widest text-xs">
                       {formData.disponibilite === "disponible" ? t("availability_on") : t("availability_off")}
                    </span>
                 </div>
              </div>
           </div>

           {/* Documents (2 slots) */}
           <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold dark:text-white">{t("docs_title")}</h3>
                 </div>
                 <Badge variant="outline" className="text-blue-600 border-blue-100 uppercase tracking-widest">{t("section_optional")}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                    { id: 'doc_diploma', label: t("doc_diploma") },
                    { id: 'doc_card', label: t("doc_card") }
                 ].map(doc => (
                    <div key={doc.id} className="relative">
                       <label
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={(e) => {
                           e.preventDefault()
                           const dropped = e.dataTransfer.files?.[0]
                           if (dropped) handleDroppedFile(dropped, doc.id)
                         }}
                         className={cn(
                          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-300 bg-slate-50/50 dark:bg-slate-950/20 cursor-pointer group h-full min-h-[140px]",
                          formData[doc.id] ? "border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-600/5" : "border-slate-200 dark:border-slate-800 hover:border-blue-400"
                       )}>
                          <input type="file" className="hidden" onChange={(e) => handleDocumentUpload(e, doc.id)} accept=".jpg,.png,.pdf,.webp" />
                          
                          {formData[doc.id] ? (
                             <div className="text-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600">
                                   <Check className="w-5 h-5 stroke-[3]" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 block line-clamp-1">{t("doc_uploaded", { label: doc.label })}</span>
                             </div>
                          ) : uploadProgress[doc.id] > 0 ? (
                             <div className="text-center space-y-2">
                                <div className="w-10 h-10 rounded-full border-2 border-blue-600/20 border-t-blue-600 animate-spin mx-auto" />
                                <span className="text-[10px] font-bold text-blue-600">{uploadProgress[doc.id]}%</span>
                             </div>
                          ) : (
                             <>
                                <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors mb-2" />
                                <span className="text-[11px] font-bold text-slate-500 text-center">{doc.label}</span>
                                <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">{t("doc_upload_hint")}</span>
                             </>
                          )}
                       </label>
                       {formData[doc.id] && (
                          <button 
                             type="button" 
                             onClick={() => setFormData(prev => ({ ...prev, [doc.id]: null }))}
                             className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-100 dark:border-slate-700 hover:text-red-500 transition-colors"
                          >
                             <X className="w-3 h-3" />
                          </button>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </section>
        )}

        {/* Navigation / Submit */}
        <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-4">
           <div className="w-full max-w-xl flex items-center gap-3">
             {currentStep > 1 && (
               <Button
                 type="button"
                 variant="outline"
                 className="h-14 rounded-2xl px-6 font-bold"
                 onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
               >
                 {common("back")}
               </Button>
             )}

             {currentStep < 3 ? (
               <Button
                 type="button"
                 className="h-14 rounded-2xl px-8 font-black ml-auto"
                 onClick={goToNextStep}
               >
                 {common("next")}
               </Button>
             ) : (
               <Button
                 type="submit"
                 disabled={loading}
                 className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl shadow-blue-600/20 group overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 group-hover:scale-105 transition-transform" />
                 <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? t("btn_submitting") : t("btn_finish")}
                    <ArrowRight className={cn("w-6 h-6 transition-transform group-hover:translate-x-2", isRTL && "-rotate-180 group-hover:-translate-x-2")} />
                 </span>
               </Button>
             )}
           </div>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
              {t("trusted_network_note")}
           </p>
        </div>

      </form>

      {/* Name Edit Modal */}
      <Modal 
        isOpen={isNameModalOpen} 
        onClose={() => setIsNameModalOpen(false)}
        title={t("name_edit_title")}
      >
        <div className="space-y-6 pt-2">
           <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">{t("name_edit_desc")}</p>
           </div>
           
           <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("name_label")}</label>
              <Input 
                 value={newName} 
                 onChange={(e) => setNewName(e.target.value)} 
                 className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-900 border-none font-bold"
              />
           </div>

           <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" className="rounded-2xl h-14 font-bold" onClick={() => setIsNameModalOpen(false)}>
                 {common("cancel")}
              </Button>
              <Button 
                className="rounded-2xl h-14 font-black" 
                onClick={() => {
                   setFormData(prev => ({ ...prev, nomComplet: newName }))
                   setIsNameModalOpen(false)
                }}
              >
                 {common("save")}
              </Button>
           </div>
        </div>
      </Modal>

    </div>
  )
}

function ArrowRight({ className }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
   )
}

function Zap({ className }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5 14 3v8h6L10 20.2V13H4Z"/></svg>
   )
}
