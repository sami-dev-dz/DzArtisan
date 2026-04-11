"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  Check, MapPin, FileText, ChevronLeft, ChevronDown, AlertCircle,
  Navigation, Search, ArrowRight, Info, Phone, MessageCircle,
  Calendar, Loader2, Zap, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { cn } from "@/lib/utils"
import { useRouter } from "@/i18n/routing"
import dynamic from "next/dynamic"
import api from "@/lib/api-client"
import wilayasJson from "@/data/wilayas.json"
import communesJson from "@/data/communes.json"
import { useParams } from 'next/navigation'

// Dynamically import Map to avoid SSR issues
const WizardMap = dynamic(() => import("@/components/map/WizardMap"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-white/5 rounded-3xl animate-pulse" />
})

const STEPS = ["details", "location", "summary"]

export default function EditInterventionWizard() {
  const t = useTranslations("wizard")
  const locale = useLocale()
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const isRTL = locale === "ar"
  const [currentStep, setCurrentStep] = useState(0)
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const validateField = (field, value) => {
    let msg = null
    if (field === 'titre' && (!value || value.length < 5)) msg = "Titre trop court (minimum 5 caractères)"
    if (field === 'categorie_id' && !value) msg = "Veuillez choisir une catégorie"
    if (field === 'description' && (!value || value.length < 20)) msg = "La description doit faire au moins 20 caractères"
    if (field === 'telephone' && (!value || value.length < 9)) msg = "Veuillez saisir un numéro de téléphone valide"
    if (field === 'wilaya_id' && !value) msg = "Veuillez sélectionner une wilaya"
    if (field === 'commune_id' && !value) msg = "Veuillez sélectionner une commune"
    
    setFieldErrors(prev => ({ ...prev, [field]: msg }))
    return msg === null
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const generateWhatsApp = () => {
    if (!formData.telephone) return
    let ph = formData.telephone.replace(/\s/g, "").replace("+", "")
    if (ph.startsWith("0")) ph = "213" + ph.substring(1)
    setFormData(prev => ({ ...prev, whatsapp: `wa.me/${ph}` }))
  }

  const [filteredCommunes, setFilteredCommunes] = useState([])

  const [formData, setFormData] = useState({
    titre: "",
    categorie_id: "",
    description: "",
    telephone: "",
    whatsapp: "",
    date_souhaitee: "",
    location_method: "auto",
    wilaya_id: "",
    commune_id: "",
    latitude: 36.7538,
    longitude: 3.0588,
    adresse: "",
  })

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data?.data || res.data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (id) {
      api.get(`/client/requests/${id}`).then(res => {
        const req = res.data;
        if (req.statut !== 'en_attente') {
           router.push("/dashboard/client/requests");
           return;
        }
        setFormData({
          titre: req.titre || "",
          categorie_id: req.categorie_id || "",
          description: req.description || "",
          telephone: req.telephone || "",
          whatsapp: req.whatsapp || "",
          date_souhaitee: req.date_souhaitee ? req.date_souhaitee.split('T')[0] : "",
          location_method: req.latitude && req.longitude ? "auto" : "manual",
          wilaya_id: req.wilaya_id || "",
          commune_id: req.commune_id || "",
          latitude: req.latitude || 36.7538,
          longitude: req.longitude || 3.0588,
          adresse: req.adresse || "",
        });
        setIsLoading(false);
      }).catch(err => {
        setError("Erreur lors du chargement de la demande");
        setIsLoading(false);
      });
    }
  }, [id, router]);

  useEffect(() => {
    if (formData.wilaya_id) {
      const communes = communesJson.filter(c => String(c.wilaya_id) === String(formData.wilaya_id))
      setFilteredCommunes(communes)
    } else {
      setFilteredCommunes([])
    }
  }, [formData.wilaya_id])

  useEffect(() => {
    if (formData.wilaya_id && !isLoading) {
      const wilaya = wilayasJson.find(w => String(w.id) === String(formData.wilaya_id))
      if (wilaya && formData.location_method === 'manual') {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(wilaya.longitude),
          longitude: parseFloat(wilaya.latitude),
        }))
      }
    }
  }, [formData.wilaya_id, formData.location_method, isLoading])

  useEffect(() => {
    if (formData.commune_id && !isLoading) {
      const commune = communesJson.find(c => String(c.id) === String(formData.commune_id))
      if (commune && formData.location_method === 'manual') {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(commune.longitude),
          longitude: parseFloat(commune.latitude),
        }))
      }
    }
  }, [formData.commune_id, formData.location_method, isLoading])

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
    let isValid = true
    const newErrors = {}

    if (currentStep === 0) {
      if (!formData.titre || formData.titre.length < 5) { newErrors.titre = "Titre trop court (minimum 5 caractères)"; isValid = false }
      if (!formData.categorie_id) { newErrors.categorie_id = "Veuillez choisir une catégorie"; isValid = false }
      if (!formData.description || formData.description.length < 20) { newErrors.description = "La description doit faire au moins 20 caractères"; isValid = false }
      if (!formData.telephone || formData.telephone.length < 9) { newErrors.telephone = "Veuillez saisir un numéro de téléphone valide"; isValid = false }
    }
    if (currentStep === 1) {
      if (!formData.wilaya_id) { newErrors.wilaya_id = "Veuillez sélectionner une wilaya"; isValid = false }
      if (!formData.commune_id) { newErrors.commune_id = "Veuillez sélectionner une commune"; isValid = false }
    }
    
    setFieldErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const payload = {
        titre: formData.titre,
        categorie_id: formData.categorie_id,
        description: formData.description,
        wilaya_id: formData.wilaya_id || null,
        commune_id: formData.commune_id || null,
        adresse: formData.adresse || "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        telephone: formData.telephone,
        whatsapp: formData.whatsapp || null,
        date_souhaitee: formData.date_souhaitee || null,
      }
      await api.put(`/client/requests/${id}`, payload)
      router.push("/dashboard/client/requests")
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Une erreur est survenue lors de la modification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMapPositionChange = useCallback((lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, location_method: 'auto' }))
  }, [])

  const getSelectedWilayaName = () => {
    const w = wilayasJson.find(w => String(w.id) === String(formData.wilaya_id))
    return w ? `${w.code} - ${w.name}` : ""
  }

  const getSelectedCommuneName = () => {
    const c = communesJson.find(c => String(c.id) === String(formData.commune_id))
    return c ? c.name : ""
  }

  const getSelectedCategoryName = () => {
    const cat = categories.find(c => c.id == formData.categorie_id)
    return cat ? cat.nom : ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-transparent">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent pb-20">
      
      {/* Header & Progress Indicator */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
             {/* Progress Bar Background */}
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-white/10 -translate-y-1/2 z-0" />
             
             {STEPS.map((step, index) => {
               const isActive = index === currentStep
               const isCompleted = index < currentStep
               const labels = {
                 details: "Détails",
                 location: "Localisation", 
                 summary: "Validation"
               }
               return (
                 <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 text-sm font-black",
                      isActive ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20" : 
                      isCompleted ? "bg-emerald-500 text-white" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-white/10"
                    )}>
                       {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isActive ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400"
                    )}>
                       {labels[step]}
                    </span>
                 </div>
               )
             })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-2xl shadow-blue-500/5 overflow-hidden">
          
          {error && (
            <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
               <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          {/* ═══════════ STEP 1 — DETAILS ═══════════ */}
          {currentStep === 0 && (
            <div className="p-6 md:p-10 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     Modifier votre demande
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                     Mettez à jour les détails de votre intervention pour recevoir de meilleures propositions.
                  </p>
               </div>

               <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre de la demande *</label>
                     <Input 
                       value={formData.titre}
                       onChange={(e) => handleChange('titre', e.target.value)}
                       onBlur={(e) => validateField('titre', e.target.value)}
                       placeholder="Ex: Réparation fuite d'eau sous évier"
                       className={cn("h-14 rounded-2xl px-5 text-base font-bold border-2 transition-all", fieldErrors.titre ? "border-red-500 bg-red-50/30" : "border-slate-100 dark:border-white/10 focus:border-blue-600")}
                       maxLength={100}
                     />
                     <div className="flex justify-between items-start mt-1">
                        {fieldErrors.titre ? <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{fieldErrors.titre}</p> : <div/>}
                        <div className="text-[10px] font-bold text-slate-400">{formData.titre.length} / 100</div>
                     </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie de service *</label>
                     <div className="relative">
                        <select 
                          value={formData.categorie_id}
                          onChange={(e) => handleChange('categorie_id', e.target.value)}
                          onBlur={(e) => validateField('categorie_id', e.target.value)}
                          className={cn("w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 px-5 font-bold focus:border-blue-600 transition-all outline-none appearance-none text-slate-900 dark:text-white", fieldErrors.categorie_id ? "border-red-500 bg-red-50/30 text-red-900" : "border-slate-100 dark:border-white/10")}
                        >
                           <option value="">Sélectionnez une catégorie professionnelle...</option>
                           {categories.map((cat) => (
                             <option key={cat.id} value={cat.id}>{cat.nom}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                     </div>
                     {fieldErrors.categorie_id && <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">{fieldErrors.categorie_id}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description du problème *</label>
                     <Textarea 
                       value={formData.description}
                       onChange={(e) => handleChange('description', e.target.value)}
                       onBlur={(e) => validateField('description', e.target.value)}
                       placeholder="Expliquez précisément votre besoin (matériel nécessaire, urgence, symptômes...)"
                       className={cn("min-h-[120px] rounded-2xl p-5 text-base font-medium border-2 transition-all", fieldErrors.description ? "border-red-500 bg-red-50/30" : "border-slate-100 dark:border-white/10 focus:border-blue-600")}
                       maxLength={1000}
                     />
                     <div className="flex justify-between items-start mt-1">
                        {fieldErrors.description ? <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{fieldErrors.description}</p> : <div/>}
                        <div className="text-[10px] font-bold text-slate-400">{formData.description.length} / 1000</div>
                     </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Numéro de téléphone *
                        </label>
                        <Input 
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => handleChange('telephone', e.target.value)}
                          onBlur={(e) => validateField('telephone', e.target.value)}
                          placeholder="05XXXXXXXX"
                          className={cn("h-14 rounded-2xl px-5 text-base font-bold border-2 transition-all", fieldErrors.telephone ? "border-red-500 bg-red-50/30" : "border-slate-100 dark:border-white/10 focus:border-blue-600")}
                        />
                        {fieldErrors.telephone && <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{fieldErrors.telephone}</p>}
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-[#25D366]" /> WhatsApp
                          <span className="text-slate-300 ml-1">(optionnel)</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                             </div>
                             <Input
                                value={formData.whatsapp || ""}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                placeholder="wa.me/213…"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-[#25D366] transition-all"
                             />
                          </div>
                          <button
                             type="button"
                             onClick={generateWhatsApp}
                             className="shrink-0 h-14 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1fb855] text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#25D366]/20"
                          >
                             <Zap className="w-4 h-4" />
                             <span className="hidden sm:inline">Générer</span>
                          </button>
                        </div>
                        {formData.whatsapp && formData.whatsapp.includes("wa.me") && (
                           <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                                 <Check className="w-3.5 h-3.5 text-emerald-600" />
                                 <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Lien généré</span>
                              </div>
                              <a
                                 href={`https://${formData.whatsapp}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl"
                              >
                                 <ExternalLink className="w-3 h-3" />
                                 Tester
                              </a>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Preferred Date */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                       <Calendar className="w-3 h-3" /> Date souhaitée
                       <span className="text-slate-300 ml-1">(optionnel)</span>
                     </label>
                     <Input 
                       type="date"
                       min={new Date().toISOString().split('T')[0]}
                       value={formData.date_souhaitee}
                       onChange={(e) => setFormData({ ...formData, date_souhaitee: e.target.value })}
                       className="h-14 rounded-2xl px-5 text-base font-bold border-2 border-slate-100 dark:border-white/10"
                     />
                     <p className="mt-1 text-[10px] flex items-center gap-1 font-bold text-slate-400 uppercase tracking-widest">
                        <Info className="w-3 h-3" /> Laissez vide si vous êtes flexible
                     </p>
                  </div>
               </div>

               <div className="pt-4">
                  <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-500/20">
                     Étape suivante <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
          )}

          {/* ═══════════ STEP 2 — LOCATION ═══════════ */}
          {currentStep === 1 && (
            <div className="p-6 md:p-10 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     Localisation
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                     Indiquez l&apos;emplacement de l&apos;intervention pour trouver les artisans proches.
                  </p>
               </div>

               {/* Location Fields */}
               <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wilaya *</label>
                           <div className="relative">
                              <select 
                                className={cn("w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 px-5 font-bold focus:border-blue-600 transition-all outline-none appearance-none text-slate-900 dark:text-white", fieldErrors.wilaya_id ? "border-red-500 bg-red-50/30 text-red-900" : "border-slate-100 dark:border-white/10")}
                                value={formData.wilaya_id}
                                onChange={(e) => {
                                  handleChange('wilaya_id', e.target.value)
                                  handleChange('commune_id', '')
                                  setFormData(prev => ({ ...prev, location_method: 'manual' }))
                                }}
                                onBlur={(e) => validateField('wilaya_id', e.target.value)}
                              >
                                 <option value="">Sélectionnez une wilaya...</option>
                                 {wilayasJson.map(w => (
                                   <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                                 ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                           </div>
                           {fieldErrors.wilaya_id && <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">{fieldErrors.wilaya_id}</p>}
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Commune *</label>
                           <div className="relative">
                              <select 
                                className={cn("w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 px-5 font-bold focus:border-blue-600 transition-all outline-none appearance-none text-slate-900 dark:text-white disabled:opacity-50", fieldErrors.commune_id ? "border-red-500 bg-red-50/30 text-red-900" : "border-slate-100 dark:border-white/10")}
                                value={formData.commune_id}
                                onChange={(e) => {
                                  handleChange('commune_id', e.target.value)
                                  setFormData(prev => ({ ...prev, location_method: 'manual' }))
                                }}
                                onBlur={(e) => validateField('commune_id', e.target.value)}
                                disabled={!formData.wilaya_id}
                              >
                                 <option value="">Sélectionnez une commune...</option>
                                 {filteredCommunes.map(c => (
                                   <option key={c.id} value={c.id}>{c.name}</option>
                                 ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                           </div>
                           {fieldErrors.commune_id && <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">{fieldErrors.commune_id}</p>}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Complément d&apos;adresse (Cité, N°, Étage...)</label>
                        <Input 
                          placeholder="Ex: Cité 500 logements, Bâtiment B, 3ème étage"
                          value={formData.adresse}
                          onChange={(e) => handleChange('adresse', e.target.value)}
                          className="h-14 rounded-2xl px-5 text-base font-bold border-2 border-slate-100 dark:border-white/10 transition-all focus:border-blue-600"
                        />
                     </div>
                  </div>

               {/* Map */}
               <div className="space-y-3">
                  <div className="h-[300px] rounded-[24px] overflow-hidden border-2 border-slate-100 dark:border-white/5 shadow-inner bg-slate-100">
                     <WizardMap 
                       lat={formData.latitude} 
                       lng={formData.longitude} 
                       onPositionChange={handleMapPositionChange}
                     />
                  </div>
                  <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center justify-center gap-2">
                     <Info className="w-3 h-3 text-blue-600" /> Cliquez sur la carte ou déplacez le marqueur pour plus de précision
                  </p>
               </div>

               {/* Navigation Buttons */}
               <div className="flex gap-4 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={prevStep}
                    className="flex-1 h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest gap-2"
                  >
                     <ChevronLeft className="w-4 h-4" /> Précédent
                  </Button>
                  <Button onClick={nextStep} className="flex-[2] h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-500/20">
                     Valider <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
          )}

          {/* ═══════════ STEP 3 — SUMMARY & VALIDATION ═══════════ */}
          {currentStep === 2 && (
            <div className="p-6 md:p-10 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     Récapitulatif
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                     Vérifiez les informations avant de publier votre demande.
                  </p>
               </div>

               {/* Summary Card */}
               <div className="bg-slate-50 dark:bg-white/5 rounded-[24px] p-6 space-y-6">
                  
                  {/* Details Section */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Détails de la demande
                        </p>
                        <button 
                          type="button"
                          onClick={() => setCurrentStep(0)} 
                          className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          Modifier
                        </button>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">Titre</span>
                           <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.titre}</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">Catégorie</span>
                           <span className="font-bold text-slate-900 dark:text-white text-sm">{getSelectedCategoryName()}</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">Description</span>
                           <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{formData.description}</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">Téléphone</span>
                           <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.telephone}</span>
                        </div>
                        {formData.whatsapp && (
                          <div className="flex items-start gap-3">
                             <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">WhatsApp</span>
                             <span className="font-bold text-[#25D366] text-sm">{formData.whatsapp}</span>
                          </div>
                        )}
                        {formData.date_souhaitee && (
                          <div className="flex items-start gap-3">
                             <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">Date</span>
                             <span className="font-bold text-slate-900 dark:text-white text-sm">
                               {new Date(formData.date_souhaitee).toLocaleDateString("fr-DZ", { day: "2-digit", month: "long", year: "numeric" })}
                             </span>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-white/10" />

                  {/* Location Section */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Localisation
                        </p>
                        <button 
                          type="button"
                          onClick={() => setCurrentStep(1)} 
                          className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          Modifier
                        </button>
                     </div>
                     
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {formData.location_method === 'auto' 
                          ? `Géolocalisation (${formData.latitude?.toFixed(4) || "NA"}, ${formData.longitude?.toFixed(4) || "NA"})`
                          : `${getSelectedWilayaName()} — ${getSelectedCommuneName()}`
                        }
                     </div>
                     {formData.adresse && (
                       <p className="text-xs text-slate-500 pl-6">{formData.adresse}</p>
                     )}
                  </div>
               </div>

               {/* Submit Buttons */}
               <div className="flex gap-4 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={prevStep}
                    className="flex-1 h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest gap-2"
                  >
                     <ChevronLeft className="w-4 h-4" /> Précédent
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex-[2] h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                     {isSubmitting ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Enregistrement...
                       </>
                     ) : (
                       <>
                         Enregistrer les modifications <Check className="w-4 h-4" />
                       </>
                     )}
                  </Button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
