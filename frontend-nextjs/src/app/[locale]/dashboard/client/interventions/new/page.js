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
import api from "@/lib/axios"
import wilayasJson from "@/data/wilayas.json"
import communesJson from "@/data/communes.json"

// Dynamically import Map to avoid SSR issues
const WizardMap = dynamic(() => import("@/components/map/WizardMap"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-white/5 rounded-3xl animate-pulse" />
})

const STEPS = ["details", "location", "summary"]

export default function NewInterventionWizard() {
  const t = useTranslations("wizard")
  const locale = useLocale()
  const router = useRouter()
  const isRTL = locale === "ar"
  const [currentStep, setCurrentStep] = useState(0)
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [wilayaOpen, setWilayaOpen] = useState(false)
  const [communeOpen, setCommuneOpen] = useState(false)

  useEffect(() => {
    if (!categoryOpen && !wilayaOpen && !communeOpen) return
    const handler = (e) => {
      if (!e.target.closest('[data-category-dropdown]')) setCategoryOpen(false)
      if (!e.target.closest('[data-wilaya-dropdown]')) setWilayaOpen(false)
      if (!e.target.closest('[data-commune-dropdown]')) setCommuneOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [categoryOpen, wilayaOpen, communeOpen])

  const validateField = (field, value) => {
    let msg = null
    if (field === 'titre' && (!value || value.length < 5)) msg = t("step1.errors.title_short")
    if (field === 'categorie_id' && !value) msg = t("step1.errors.category_required")
    if (field === 'description' && (!value || value.length < 20)) msg = t("step1.errors.description_short")
    if (field === 'telephone' && (!value || value.length < 9)) msg = t("step1.errors.phone_invalid")
    if (field === 'wilaya_id' && !value) msg = t("step2.errors.wilaya_required")
    if (field === 'commune_id' && !value) msg = t("step2.errors.commune_required")

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

  // Filtered communes based on selected wilaya
  const [filteredCommunes, setFilteredCommunes] = useState([])

  // Form State
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
      const data = res.data?.data || res.data || []
      console.log("Fetched categories:", data)
      setCategories(data)
    }).catch((err) => {
      console.error("Failed to fetch categories:", err)
    })
  }, [])

  // Filter communes when wilaya changes
  useEffect(() => {
    if (formData.wilaya_id) {
      const communes = communesJson.filter(c => String(c.wilaya_id) === String(formData.wilaya_id))
      setFilteredCommunes(communes)
      // Reset commune selection
      setFormData(prev => ({ ...prev, commune_id: "" }))
    } else {
      setFilteredCommunes([])
    }
  }, [formData.wilaya_id])

  // When wilaya is selected manually, update map coordinates
  useEffect(() => {
    if (formData.wilaya_id) {
      const wilaya = wilayasJson.find(w => String(w.id) === String(formData.wilaya_id))
      if (wilaya) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(wilaya.longitude), // Note: JSON has lat/lng swapped
          longitude: parseFloat(wilaya.latitude),
        }))
      }
    }
  }, [formData.wilaya_id, formData.location_method])

  // When commune is selected, update map to commune coordinates  
  useEffect(() => {
    if (formData.commune_id) {
      const commune = communesJson.find(c => String(c.id) === String(formData.commune_id))
      if (commune) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(commune.longitude), // Note: JSON has lat/lng swapped
          longitude: parseFloat(commune.latitude),
        }))
      }
    }
  }, [formData.commune_id, formData.location_method])

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
      if (!formData.titre || formData.titre.length < 5) { newErrors.titre = t("step1.errors.title_short"); isValid = false }
      if (!formData.categorie_id) { newErrors.categorie_id = t("step1.errors.category_required"); isValid = false }
      if (!formData.description || formData.description.length < 20) { newErrors.description = t("step1.errors.description_short"); isValid = false }
      if (!formData.telephone || formData.telephone.length < 9) { newErrors.telephone = t("step1.errors.phone_invalid"); isValid = false }
    }
    if (currentStep === 1) {
      if (!formData.wilaya_id) { newErrors.wilaya_id = t("step2.errors.wilaya_required"); isValid = false }
      if (!formData.commune_id) { newErrors.commune_id = t("step2.errors.commune_required"); isValid = false }
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
      await api.post("/interventions", payload)
      // Redirect to My Requests page after success
      router.push("/dashboard/client/requests")
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || t("step3.error_general"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMapPositionChange = useCallback((lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
  }, [])

  const getSelectedWilayaName = () => {
    const w = wilayasJson.find(w => String(w.id) === String(formData.wilaya_id))
    if (!w) return ""
    return locale === "ar" ? `${w.code} - ${w.ar_name}` : `${w.code} - ${w.name}`
  }

  const getSelectedCommuneName = () => {
    const c = communesJson.find(c => String(c.id) === String(formData.commune_id))
    if (!c) return ""
    return locale === "ar" ? (c.ar_name || c.name) : c.name
  }

  const getSelectedCategoryName = () => {
    const cat = categories.find(c => c.id == formData.categorie_id)
    if (!cat) return ""
    return locale === "ar" ? (cat.nom_ar || cat.nom) : cat.nom
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent pb-20" dir={isRTL ? "rtl" : "ltr"}>

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
                details: t("steps.details"),
                location: t("steps.location"),
                summary: t("steps.summary")
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
            <div className="w-full p-6 md:p-10 space-y-8 text-start" dir={isRTL ? "rtl" : "ltr"}>
              <style dangerouslySetInnerHTML={{ __html: `
                select option {
                  background-color: white !important;
                  color: #0f172a !important;
                  padding: 12px !important;
                }
                .dark select option {
                  background-color: #0f172a !important;
                  color: white !important;
                }
              `}} />
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {t("step1.title")}
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  {t("step1.subtitle")}
                </p>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("step1.fields.title")}</label>
                  <Input
                    value={formData.titre}
                    onChange={(e) => handleChange('titre', e.target.value)}
                    onBlur={(e) => validateField('titre', e.target.value)}
                    placeholder={t("step1.fields.title_placeholder")}
                    className={cn("h-14 rounded-2xl px-5 text-base font-bold border-2 transition-all", fieldErrors.titre ? "border-red-500 bg-red-50/30" : "border-slate-100 dark:border-white/10 focus:border-blue-600")}
                    maxLength={100}
                  />
                  <div className="flex justify-between items-start mt-1">
                    {fieldErrors.titre ? <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{fieldErrors.titre}</p> : <div />}
                    <div className="text-[10px] font-bold text-slate-400">{formData.titre.length} / 100</div>
                  </div>
                </div>

                  {/* Category */}
                  <div className="space-y-2 w-full flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      {t("step1.fields.category")}
                    </label>
                    <div className="relative w-full" data-category-dropdown>
                      <button
                        type="button"
                        onClick={() => setCategoryOpen(prev => !prev)}
                        className={cn(
                          "w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 font-bold transition-all outline-none flex items-center justify-between px-5",
                          isRTL ? "flex-row-reverse text-right" : "flex-row text-left",
                          categoryOpen ? "border-blue-600" : "",
                          fieldErrors.categorie_id
                            ? "border-red-500 bg-red-50/30 text-red-900"
                            : "border-slate-100 dark:border-white/10 text-slate-900 dark:text-white"
                        )}
                      >
                        <span className={cn("font-bold text-base truncate", !formData.categorie_id && "text-slate-400 font-medium")}>
                          {formData.categorie_id
                            ? (locale === "ar"
                                ? (categories.find(c => String(c.id) === String(formData.categorie_id))?.nom_ar || categories.find(c => String(c.id) === String(formData.categorie_id))?.nom)
                                : categories.find(c => String(c.id) === String(formData.categorie_id))?.nom)
                            : t("step1.fields.category_placeholder")
                          }
                        </span>
                        <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform", categoryOpen && "rotate-180")} />
                      </button>

                      {categoryOpen && (
                        <div className={cn(
                          "absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                        )}>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                handleChange('categorie_id', String(cat.id))
                                setCategoryOpen(false)
                              }}
                              className={cn(
                                "w-full px-5 py-3.5 font-bold text-sm transition-colors flex items-center gap-2",
                                isRTL ? "text-right flex-row-reverse" : "text-left",
                                String(formData.categorie_id) === String(cat.id)
                                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                                  : "text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                              )}
                            >
                              {String(formData.categorie_id) === String(cat.id) && (
                                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                              {locale === "ar" ? (cat.nom_ar || cat.nom) : cat.nom}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {fieldErrors.categorie_id && (
                      <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">
                        {fieldErrors.categorie_id}
                      </p>
                    )}
                  </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("step1.fields.description")}</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    onBlur={(e) => validateField('description', e.target.value)}
                    placeholder={t("step1.fields.description_placeholder")}
                    className={cn("min-h-[120px] rounded-2xl p-5 text-base font-medium border-2 transition-all", fieldErrors.description ? "border-red-500 bg-red-50/30" : "border-slate-100 dark:border-white/10 focus:border-blue-600")}
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-start mt-1">
                    {fieldErrors.description ? <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{fieldErrors.description}</p> : <div />}
                    <div className="text-[10px] font-bold text-slate-400">{formData.description.length} / 1000</div>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {t("step1.fields.phone")}
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
                      <MessageCircle className="w-3 h-3 text-[#25D366]" /> {t("step1.fields.whatsapp")}
                      <span className="text-slate-300 ml-1">{t("step1.fields.whatsapp_optional")}</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        </div>
                        <Input
                          value={formData.whatsapp || ""}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                          placeholder={t("step1.fields.whatsapp_placeholder")}
                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-[#25D366] transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateWhatsApp}
                        className="shrink-0 h-14 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1fb855] text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#25D366]/20"
                      >
                        <Zap className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("step1.fields.generate")}</span>
                      </button>
                    </div>
                    {formData.whatsapp && formData.whatsapp.includes("wa.me") && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{t("step1.fields.link_generated")}</span>
                        </div>
                        <a
                          href={`https://${formData.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {t("step1.fields.test")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {t("step1.fields.date")}
                    <span className="text-slate-300 ml-1">{t("step1.fields.date_optional")}</span>
                  </label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date_souhaitee}
                    onChange={(e) => setFormData({ ...formData, date_souhaitee: e.target.value })}
                    className="h-14 rounded-2xl px-5 text-base font-bold border-2 border-slate-100 dark:border-white/10"
                  />
                  <p className="mt-1 text-[10px] flex items-center gap-1 font-bold text-slate-400 uppercase tracking-widest">
                    <Info className="w-3 h-3" /> {t("step1.fields.date_info")}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-500/20">
                  {t("step1.next")} <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 2 — LOCATION ═══════════ */}
          {currentStep === 1 && (
            <div className="w-full p-6 md:p-10 space-y-8 text-start" dir={isRTL ? "rtl" : "ltr"}>
              <style dangerouslySetInnerHTML={{ __html: `
                select option {
                  background-color: white !important;
                  color: #0f172a !important;
                  padding: 12px !important;
                }
                .dark select option {
                  background-color: #0f172a !important;
                  color: white !important;
                }
              `}} />
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {t("step2.title")}
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  {t("step2.subtitle")}
                </p>
              </div>

              {/* Location Fields */}
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-300 w-full">
                <div className="grid grid-cols-1 gap-4 w-full">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">{t("step2.fields.wilaya")}</label>
                    <div className="relative w-full" data-wilaya-dropdown>
                      <button
                        type="button"
                        onClick={() => setWilayaOpen(prev => !prev)}
                        className={cn(
                          "w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 font-bold transition-all outline-none flex items-center justify-between px-5",
                          isRTL ? "flex-row-reverse text-right" : "flex-row text-left",
                          wilayaOpen ? "border-blue-600" : "",
                          fieldErrors.wilaya_id
                            ? "border-red-500 bg-red-50/30 text-red-900"
                            : "border-slate-100 dark:border-white/10 text-slate-900 dark:text-white"
                        )}
                      >
                        <span className={cn("font-bold text-base truncate", !formData.wilaya_id && "text-slate-400 font-medium")}>
                          {formData.wilaya_id
                            ? (() => {
                                const w = wilayasJson.find(w => String(w.id) === String(formData.wilaya_id))
                                return w ? `${w.code} - ${locale === 'ar' ? w.ar_name : w.name}` : ""
                              })()
                            : t("step2.fields.wilaya_placeholder")
                          }
                        </span>
                        <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform", wilayaOpen && "rotate-180")} />
                      </button>

                      {wilayaOpen && (
                        <div className={cn(
                          "absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                        )}>
                          {wilayasJson.map((w) => (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => {
                                handleChange('wilaya_id', String(w.id))
                                setWilayaOpen(false)
                              }}
                              className={cn(
                                "w-full px-5 py-3.5 font-bold text-sm transition-colors flex items-center gap-2",
                                isRTL ? "text-right flex-row-reverse" : "text-left",
                                String(formData.wilaya_id) === String(w.id)
                                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                                  : "text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                              )}
                            >
                              {String(formData.wilaya_id) === String(w.id) && (
                                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                              {w.code} - {locale === 'ar' ? w.ar_name : w.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {fieldErrors.wilaya_id && <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">{fieldErrors.wilaya_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">{t("step2.fields.commune")}</label>
                    <div className="relative w-full" data-commune-dropdown>
                      <button
                        type="button"
                        disabled={!formData.wilaya_id}
                        onClick={() => setCommuneOpen(prev => !prev)}
                        className={cn(
                          "w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 font-bold transition-all outline-none flex items-center justify-between px-5 disabled:opacity-50",
                          isRTL ? "flex-row-reverse text-right" : "flex-row text-left",
                          communeOpen ? "border-blue-600" : "",
                          fieldErrors.commune_id
                            ? "border-red-500 bg-red-50/30 text-red-900"
                            : "border-slate-100 dark:border-white/10 text-slate-900 dark:text-white"
                        )}
                      >
                        <span className={cn("font-bold text-base truncate", !formData.commune_id && "text-slate-400 font-medium")}>
                          {formData.commune_id
                            ? (() => {
                                const c = filteredCommunes.find(c => String(c.id) === String(formData.commune_id))
                                return c ? (locale === 'ar' ? (c.ar_name || c.name) : c.name) : ""
                              })()
                            : t("step2.fields.commune_placeholder")
                          }
                        </span>
                        <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform", communeOpen && "rotate-180")} />
                      </button>

                      {communeOpen && (
                        <div className={cn(
                          "absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                        )}>
                          {filteredCommunes.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                handleChange('commune_id', String(c.id))
                                setCommuneOpen(false)
                              }}
                              className={cn(
                                "w-full px-5 py-3.5 font-bold text-sm transition-colors flex items-center gap-2",
                                isRTL ? "text-right flex-row-reverse" : "text-left",
                                String(formData.commune_id) === String(c.id)
                                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                                  : "text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                              )}
                            >
                              {String(formData.commune_id) === String(c.id) && (
                                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                              {locale === 'ar' ? (c.ar_name || c.name) : c.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {fieldErrors.commune_id && <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">{fieldErrors.commune_id}</p>}
                  </div>
                </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("step2.fields.address")}</label>
                  <Input
                    placeholder={t("step2.fields.address_placeholder")}
                    value={formData.adresse}
                    onChange={(e) => handleChange('adresse', e.target.value)}
                    className="h-14 rounded-2xl px-5 text-base font-bold border-2 border-slate-100 dark:border-white/10 transition-all focus:border-blue-600"
                  />
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
                  <Info className="w-3 h-3 text-blue-600" /> {t("step2.map_info")}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="flex-1 h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-widest gap-2"
                >
                  <ChevronLeft className={cn("w-4 h-4", isRTL && "rotate-180")} /> {t("step2.back")}
                </Button>
                <Button onClick={nextStep} className="flex-2 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-500/20">
                  {t("step2.next")} <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 3 — SUMMARY & VALIDATION ═══════════ */}
          {currentStep === 2 && (
            <div className="w-full p-6 md:p-10 space-y-8 text-start" dir={isRTL ? "rtl" : "ltr"}>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {t("step3.title")}
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  {t("step3.subtitle")}
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-[24px] p-6 space-y-6">

                {/* Details Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {t("step3.sections.details")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {t("step3.modify")}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">{t("step3.fields.title")}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.titre}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">{t("step3.fields.category")}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{getSelectedCategoryName()}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">{t("step3.fields.description")}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{formData.description}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">{t("step3.fields.phone")}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.telephone}</span>
                    </div>
                    {formData.whatsapp && (
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">{t("step3.fields.whatsapp")}</span>
                        <span className="font-bold text-[#25D366] text-sm">{formData.whatsapp}</span>
                      </div>
                    )}
                    {formData.date_souhaitee && (
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase w-20 shrink-0 pt-0.5">{t("step3.fields.date")}</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {new Date(formData.date_souhaitee).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", { day: "2-digit", month: "long", year: "numeric" })}
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
                      {t("step3.modify")}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {formData.location_method === 'auto'
                      ? t("step3.fields.location_auto", { lat: formData.latitude.toFixed(4), lng: formData.longitude.toFixed(4) })
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
                  <ChevronLeft className="w-4 h-4" /> {t("step3.back")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-2 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("step3.submitting")}
                    </>
                  ) : (
                    <>
                      {t("step3.submit")} <Check className="w-4 h-4" />
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
