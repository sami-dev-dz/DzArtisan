"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  Check, 
  MapPin, 
  Camera, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  AlertCircle,
  Navigation,
  Search,
  ArrowRight,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import api from "@/lib/api-client"
import { wilayas as wilayasData } from "@/data/algeria"

// Dynamically import Map to avoid SSR issues
const WizardMap = dynamic(() => import("@/components/interventions/WizardMap"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 rounded-3xl animate-pulse" />
})

const STEPS = ["details", "location", "photos"]

export default function NewInterventionWizard() {
  const t = useTranslations("wizard")
  const locale = useLocale()
  const router = useRouter()
  const isRTL = locale === "ar"
  const [currentStep, setCurrentStep] = useState(0)
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    titre: "",
    categorie_id: "",
    description: "",
    date_souhaitee: "",
    location_method: "auto", // 'auto' or 'manual'
    wilaya_id: "",
    commune_id: "",
    latitude: 36.7538, // Algiers default
    longitude: 3.0588,
    adresse: "",
    photos: [] // Array of Cloudinary URLs
  })

  // Photo Previews (local blobs)
  const [photoPreviews, setPhotoPreviews] = useState([])

  useEffect(() => {
    // Fetch categories for Step 1
    api.get("/metiers").then(res => setCategories(res.data))
  }, [])

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const validateStep = () => {
    setError(null)
    if (currentStep === 0) {
      if (!formData.titre || formData.titre.length < 5) {
        setError("Titre trop court (min 5 caractères)")
        return false
      }
      if (!formData.categorie_id) {
        setError("Veuillez choisir une catégorie")
        return false
      }
      if (!formData.description || formData.description.length < 20) {
        setError("La description doit faire au moins 20 caractères")
        return false
      }
    }
    if (currentStep === 1) {
      if (!formData.latitude || !formData.longitude) {
        setError("Veuillez sélectionner un emplacement sur la carte")
        return false
      }
      if (formData.location_method === 'manual' && (!formData.wilaya_id || !formData.commune_id)) {
        setError("Veuillez sélectionner votre wilaya et commune")
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await api.post("/interventions", formData)
      router.push(`/${locale}/dashboard/client/interventions/new/success`)
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de la publication")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (formData.photos.length + files.length > 5) {
      setError("Maximum 5 photos autorisées")
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 2 * 1024 * 1024 // 2 MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError("Format non supporté. Utilisez JPG, PNG ou WEBP.")
        return
      }
      if (file.size > maxSize) {
        setError(`L'image ${file.name} dépasse la taille maximale de 2 Mo.`)
        return
      }
    }

    // Modern Mock implementation (would use Cloudinary in real prod)
    // For now we'll simulate upload and use local URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result])
        // In real app, we'd upload to Cloudinary and get URL:
        setFormData(prev => ({ ...prev, photos: [...prev.photos, reader.result] }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Header & Progress Indicator */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
             {/* Progress Bar Background */}
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-white/10 -translate-y-1/2 z-0" />
             
             {STEPS.map((step, index) => {
               const isActive = index === currentStep
               const isCompleted = index < currentStep
               return (
                 <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                      isActive ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20" : 
                      isCompleted ? "bg-emerald-500 text-white" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-white/10"
                    )}>
                       {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isActive ? "text-blue-600" : "text-slate-400"
                    )}>
                       {t(`steps.${step}`)}
                    </span>
                 </div>
               )
             })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-white/5 shadow-2xl shadow-blue-500/5 overflow-hidden">
          
          {error && (
            <div className="m-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-shake">
               <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          {/* STEP 1 - DETAILS */}
          {currentStep === 0 && (
            <div className="p-8 md:p-12 space-y-10">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     {t("step1.headline")}
                  </h2>
                  <p className="text-slate-500 font-medium">
                     {t("step1.title")}
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("step1.request_title")}</label>
                     <Input 
                       value={formData.titre}
                       onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                       placeholder={t("step1.request_title_placeholder")}
                       className="h-16 rounded-[24px] px-6 text-lg font-bold border-2 focus:border-blue-600"
                       maxLength={100}
                     />
                     <div className="flex justify-end text-[10px] font-bold text-slate-400 uppercase">
                        {formData.titre.length} / 100
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("step1.category")}</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setFormData({ ...formData, categorie_id: cat.id })}
                            className={cn(
                              "p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
                              formData.categorie_id === cat.id ? "bg-blue-50 dark:bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-500/10" : "border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10"
                            )}
                          >
                             <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm">
                                <Search className="w-5 h-5" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-tight text-center">{cat.nom}</span>
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("step1.description")}</label>
                     <Textarea 
                       value={formData.description}
                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       placeholder={t("step1.description_placeholder")}
                       className="min-h-[150px] rounded-[32px] p-6 text-lg font-medium border-2 focus:border-blue-600"
                       minLength={20}
                       maxLength={1000}
                     />
                     <div className="flex justify-end text-[10px] font-bold text-slate-400 uppercase">
                        {formData.description.length} / 1000
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("step1.preferred_date")}</label>
                     <div className="relative">
                        <Input 
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date_souhaitee}
                          onChange={(e) => setFormData({ ...formData, date_souhaitee: e.target.value })}
                          className="h-16 rounded-[24px] px-6 text-lg font-bold border-2"
                        />
                        <p className="mt-2 text-[10px] items-center flex gap-1 font-bold text-slate-400 uppercase tracking-widest">
                           <Info className="w-3 h-3" /> {t("step1.date_hint")}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="pt-6">
                  <Button onClick={nextStep} className="w-full h-16 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] gap-3">
                     {t("step1.next")} <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
          )}

          {/* STEP 2 - LOCATION */}
          {currentStep === 1 && (
            <div className="p-8 md:p-12 space-y-10">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     {t("step2.method_title")}
                  </h2>
                  <p className="text-slate-500 font-medium">
                     {t("step2.title")}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFormData({ ...formData, location_method: 'auto' })}
                    className={cn(
                      "p-6 rounded-[32px] border-2 text-left space-y-3 transition-all",
                      formData.location_method === 'auto' ? "bg-blue-50 dark:bg-blue-600/10 border-blue-600" : "border-slate-100 dark:border-white/5"
                    )}
                  >
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-white/5">
                        <Navigation className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="font-black text-sm uppercase">{t("step2.auto_geo")}</p>
                        <p className="text-xs text-slate-500">{t("step2.auto_geo_desc")}</p>
                     </div>
                  </button>

                  <button 
                    onClick={() => setFormData({ ...formData, location_method: 'manual' })}
                    className={cn(
                      "p-6 rounded-[32px] border-2 text-left space-y-3 transition-all",
                      formData.location_method === 'manual' ? "bg-blue-50 dark:bg-blue-600/10 border-blue-600" : "border-slate-100 dark:border-white/5"
                    )}
                  >
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-white/5">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="font-black text-sm uppercase">{t("step2.manual_entry")}</p>
                        <p className="text-xs text-slate-500">{t("step2.manual_entry_desc")}</p>
                     </div>
                  </button>
               </div>

               {formData.location_method === 'manual' && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("step2.wilaya")}</label>
                           <select 
                             className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent px-4 font-bold focus:border-blue-600 transition-all outline-none appearance-none"
                             value={formData.wilaya_id}
                             onChange={(e) => setFormData({ ...formData, wilaya_id: e.target.value })}
                           >
                              <option value="">Sélectionnez...</option>
                              {wilayasData.map(w => (
                                <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("step2.commune")}</label>
                           <select 
                             className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent px-4 font-bold focus:border-blue-600 transition-all outline-none appearance-none"
                             value={formData.commune_id}
                             onChange={(e) => setFormData({ ...formData, commune_id: e.target.value })}
                             disabled={!formData.wilaya_id}
                           >
                              <option value="">Sélectionnez...</option>
                              {formData.wilaya_id && wilayasData.find(w => w.id == formData.wilaya_id)?.communes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("step2.address")}</label>
                        <Input 
                          placeholder={t("step2.address")}
                          value={formData.adresse}
                          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                          className="h-14 rounded-2xl border-2"
                        />
                     </div>
                  </div>
               )}

               <div className="space-y-4">
                  <div className="h-[300px] rounded-[32px] overflow-hidden border-4 border-white dark:border-white/5 shadow-inner bg-slate-100">
                     <WizardMap 
                       lat={formData.latitude} 
                       lng={formData.longitude} 
                       onPositionChange={(lat, lng) => setFormData(p => ({ ...p, latitude: lat, longitude: lng }))}
                     />
                  </div>
                  <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center justify-center gap-2">
                     <Info className="w-3 h-3 text-blue-600" /> {t("step2.map_hint")}
                  </p>
               </div>

               <div className="flex gap-4 pt-6">
                  <Button 
                    variant="ghost" 
                    onClick={prevStep}
                    className="flex-1 h-16 rounded-[24px] border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest gap-2"
                  >
                     <ChevronLeft className="w-4 h-4" /> {t("step2.back")}
                  </Button>
                  <Button onClick={nextStep} className="flex-[2] h-16 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] gap-3">
                     {t("step2.next")} <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
          )}

          {/* STEP 3 - PHOTOS & SUMMARY */}
          {currentStep === 2 && (
            <div className="p-8 md:p-12 space-y-10">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     {t("step3.title")}
                  </h2>
                  <p className="text-slate-500 font-medium">{t("step3.upload_title")}</p>
               </div>

               {/* Photo Upload Area */}
               <div className="space-y-6">
                  <div 
                    className="relative group border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[40px] p-12 text-center hover:border-blue-600 transition-all cursor-pointer"
                    onClick={() => document.getElementById('photo-input').click()}
                  >
                     <input 
                       id="photo-input"
                       type="file" 
                       multiple 
                       accept="image/*" 
                       className="hidden" 
                       onChange={handlePhotoUpload} 
                     />
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600">
                           <Upload className="w-8 h-8" />
                        </div>
                        <div>
                           <p className="text-sm font-black uppercase tracking-widest">{t("step3.upload_hint")}</p>
                           <p className="text-xs text-slate-400 mt-1">{t("step3.upload_formats")}</p>
                        </div>
                     </div>
                  </div>

                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                       {photoPreviews.map((url, index) => (
                         <div key={index} className="aspect-square rounded-3xl overflow-hidden relative group border border-slate-200 dark:border-white/5">
                            <img src={url} className="w-full h-full object-cover" />
                            <button 
                              onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>

               {/* Summary Card */}
               <div className="bg-slate-50 dark:bg-white/5 rounded-[40px] p-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("step3.summary_title")}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="group">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">01. {t("steps.details")}</p>
                              <button onClick={() => setCurrentStep(0)} className="opacity-0 group-hover:opacity-100 transition-all text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1">
                                 <FileText className="w-3 h-3" /> {t("step3.edit_step")}
                              </button>
                           </div>
                           <p className="text-xl font-black uppercase tracking-tight">{formData.titre}</p>
                           <p className="text-sm text-slate-500 line-clamp-2 mt-1">{formData.description}</p>
                        </div>
                     </div>

                     <div className="space-y-4 font-bold">
                        <div className="group">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">02. {t("steps.location")}</p>
                              <button onClick={() => setCurrentStep(1)} className="opacity-0 group-hover:opacity-100 transition-all text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1">
                                 <MapPin className="w-3 h-3" /> {t("step3.edit_step")}
                              </button>
                           </div>
                           <div className="flex items-center gap-2 text-slate-900 dark:text-white uppercase text-sm">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              {formData.location_method === 'auto' ? "Géolocalisation Auto" : 
                                `${wilayasData.find(w => w.id == formData.wilaya_id)?.name}, ${formData.commune_id}`}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 pt-6">
                  <Button 
                    variant="ghost" 
                    onClick={prevStep}
                    className="flex-1 h-16 rounded-[24px] border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest gap-2"
                  >
                     <ChevronLeft className="w-4 h-4" /> {t("step2.back")}
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex-[2] h-16 rounded-[24px] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-emerald-500/20"
                  >
                     {isSubmitting ? t("step3.submitting") : t("step3.submit")} 
                     {!isSubmitting && <Check className="w-4 h-4" />}
                  </Button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
