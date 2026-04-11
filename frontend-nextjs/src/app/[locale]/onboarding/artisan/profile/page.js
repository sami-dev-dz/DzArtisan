"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
   Camera, Pencil, Phone, MessageCircle, Briefcase, MapPin,
   Check, Upload, X, AlertCircle, Clock, ChevronRight,
   ShieldCheck, ExternalLink, Plus, Zap, Droplets, Paintbrush,
   Hammer, Snowflake, Wrench, Sparkles, Truck, MoreHorizontal,
   ArrowRight, FileText, Star, Award, TrendingUp, Users, BadgeCheck,
   HardHat, ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { useToastStore } from "@/store/toastStore"
import { wilayas, experience_levels } from "@/data/algeria"
import { uploadToCloudinary } from "@/lib/cloudinary"
import api from "@/lib/api-client"

const TRADE_OPTIONS = [
   { key: "electricien", label: "Électricien", icon: Zap, gradient: "from-amber-400 to-orange-500" },
   { key: "plombier", label: "Plombier", icon: Droplets, gradient: "from-blue-400 to-cyan-500" },
   { key: "peintre", label: "Peintre", icon: Paintbrush, gradient: "from-pink-400 to-rose-500" },
   { key: "macon", label: "Maçon", icon: HardHat, gradient: "from-stone-400 to-stone-600" },
   { key: "menuisier", label: "Menuisier", icon: Hammer, gradient: "from-orange-400 to-amber-600" },
   { key: "climatisation", label: "Climatisation", icon: Snowflake, gradient: "from-sky-400 to-blue-500" },
   { key: "mecanicien", label: "Mécanicien", icon: Wrench, gradient: "from-zinc-400 to-slate-600" },
   { key: "nettoyage", label: "Nettoyage", icon: Sparkles, gradient: "from-teal-400 to-emerald-500" },
   { key: "demenagement", label: "Déménagement", icon: Truck, gradient: "from-violet-400 to-purple-600" },
   { key: "autre", label: "Autre", icon: MoreHorizontal, gradient: "from-slate-400 to-slate-600" },
]

const STEPS = [
   { id: 1, key: "identityTitle" },
   { id: 2, key: "expertiseTitle" },
   { id: 3, key: "finalizeTitle" },
]

const FORM_I18N = {
   fr: {
      artisanPro: "Artisan Pro",
      step: "Étape",
      completed: "complété",
      identityTitle: "Votre identité",
      identityDesc: "Ces informations seront affichées sur votre profil public.",
      verified: "Vérifié",
      photoMax: "Photo · Max 5 Mo",
      editName: "Modifier le nom",
      phone: "Téléphone",
      phonePlaceholder: "05xx xx xx xx",
      optional: "optionnel",
      generate: "Générer",
      generatedLink: "Lien généré",
      test: "Tester",
      expertiseTitle: "Votre expertise",
      expertiseDesc: "Précisez votre spécialité, zones d'intervention et niveau d'expérience.",
      trade: "Votre métier",
      experience: "Niveau d'expérience",
      beginner: "Débutant",
      confirmed: "Confirmé",
      expert: "Expert",
      wilayas: "Wilayas d'intervention",
      wilayaSearch: "Rechercher (ex: Be → Béjaïa)",
      noWilaya: "Aucune wilaya trouvée",
      wilayaHint: "Saisissez une wilaya pour la sélectionner…",
      about: "Présentation",
      aboutPlaceholder: "Décrivez votre expérience, vos spécialités et ce qui vous distingue des autres artisans…",
      minChars: "Minimum 20 caractères requis",
      finalizeTitle: "Finaliser le profil",
      finalizeDesc: "Définissez votre disponibilité et joignez vos justificatifs pour accélérer la validation.",
      availability: "Disponibilité",
      available: "Disponible",
      unavailable: "Indisponible",
      docs: "Justificatifs",
      docsHint: "JPG, PNG, PDF · Max 5 Mo",
      optionalCaps: "Facultatif",
      dragOrClick: "Glisser ou cliquer",
      imported: "Importé",
      verifiedBadge: "Badge Artisan Vérifié",
      verifiedBadgeDesc: "Les profils vérifiés affichent +2× plus de visites et obtiennent en moyenne 68% de demandes supplémentaires. Joignez vos documents pour activer votre compte vérifié.",
      back: "← Retour",
      continue: "Continuer",
      sending: "Envoi…",
      submit: "Soumettre le profil",
      editNameTitle: "Modifier le nom",
      editNameDesc: "Ce nom sera affiché publiquement sur votre profil. Utilisez votre vrai nom pour renforcer la confiance.",
      fullName: "Nom complet",
      cancel: "Annuler",
      save: "Enregistrer",
   },
   en: {
      artisanPro: "Artisan Pro",
      step: "Step",
      completed: "completed",
      identityTitle: "Your identity",
      identityDesc: "This information will be displayed on your public profile.",
      verified: "Verified",
      photoMax: "Photo · Max 5 MB",
      editName: "Edit name",
      phone: "Phone",
      phonePlaceholder: "05xx xx xx xx",
      optional: "optional",
      generate: "Generate",
      generatedLink: "Link generated",
      test: "Test",
      expertiseTitle: "Your expertise",
      expertiseDesc: "Specify your specialty, service areas, and experience level.",
      trade: "Your trade",
      experience: "Experience level",
      beginner: "Beginner",
      confirmed: "Intermediate",
      expert: "Expert",
      wilayas: "Service wilayas",
      wilayaSearch: "Search (e.g. Be → Béjaïa)",
      noWilaya: "No wilaya found",
      wilayaHint: "Type a wilaya to select it…",
      about: "Presentation",
      aboutPlaceholder: "Describe your experience, specialties, and what makes you different from other artisans…",
      minChars: "Minimum 20 characters required",
      finalizeTitle: "Finalize profile",
      finalizeDesc: "Set your availability and upload documents to speed up validation.",
      availability: "Availability",
      available: "Available",
      unavailable: "Unavailable",
      docs: "Supporting documents",
      docsHint: "JPG, PNG, PDF · Max 5 MB",
      optionalCaps: "Optional",
      dragOrClick: "Drag or click",
      imported: "Uploaded",
      verifiedBadge: "Verified Artisan Badge",
      verifiedBadgeDesc: "Verified profiles get +2× more views and on average 68% more requests. Upload your documents to activate your verified status.",
      back: "← Back",
      continue: "Continue",
      sending: "Sending…",
      submit: "Submit profile",
      editNameTitle: "Edit name",
      editNameDesc: "This name appears publicly on your profile. Use your real name to increase trust.",
      fullName: "Full name",
      cancel: "Cancel",
      save: "Save",
   },
   ar: {
      artisanPro: "حرفي محترف",
      step: "الخطوة",
      completed: "مكتمل",
      identityTitle: "هويتك",
      identityDesc: "سيتم عرض هذه المعلومات في ملفك الشخصي العام.",
      verified: "موثّق",
      photoMax: "الصورة · الحد الأقصى 5MB",
      editName: "تعديل الاسم",
      phone: "الهاتف",
      phonePlaceholder: "05xx xx xx xx",
      optional: "اختياري",
      generate: "توليد",
      generatedLink: "تم توليد الرابط",
      test: "اختبار",
      expertiseTitle: "خبرتك",
      expertiseDesc: "حدد تخصصك ومناطق العمل ومستوى الخبرة.",
      trade: "مهنتك",
      experience: "مستوى الخبرة",
      beginner: "مبتدئ",
      confirmed: "متوسط",
      expert: "خبير",
      wilayas: "ولايات التدخل",
      wilayaSearch: "ابحث (مثال: Be → Béjaïa)",
      noWilaya: "لم يتم العثور على ولاية",
      wilayaHint: "اكتب اسم ولاية لاختيارها…",
      about: "نبذة",
      aboutPlaceholder: "صف خبرتك وتخصصاتك وما يميزك عن باقي الحرفيين…",
      minChars: "الحد الأدنى 20 حرفاً",
      finalizeTitle: "إنهاء الملف",
      finalizeDesc: "حدد التوفر وأرفق الوثائق لتسريع المراجعة.",
      availability: "التوفر",
      available: "متاح",
      unavailable: "غير متاح",
      docs: "الوثائق",
      docsHint: "JPG, PNG, PDF · الحد الأقصى 5MB",
      optionalCaps: "اختياري",
      dragOrClick: "اسحب أو انقر",
      imported: "تم الرفع",
      verifiedBadge: "شارة الحرفي الموثق",
      verifiedBadgeDesc: "الملفات الموثقة تحصل على +2× زيارات وأكثر بنسبة 68% من الطلبات. أرفق وثائقك لتفعيل حالة التوثيق.",
      back: "← رجوع",
      continue: "متابعة",
      sending: "جارٍ الإرسال…",
      submit: "إرسال الملف",
      editNameTitle: "تعديل الاسم",
      editNameDesc: "سيظهر هذا الاسم علنياً في ملفك الشخصي. استخدم اسمك الحقيقي لزيادة الثقة.",
      fullName: "الاسم الكامل",
      cancel: "إلغاء",
      save: "حفظ",
   },
}

function normalize(str) {
   return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
}

export default function ArtisanProfileSetupPage() {
   const t = useTranslations("onboarding")
   const common = useTranslations("common")
   const locale = useLocale()
   const isRTL = locale === "ar"
   const ft = FORM_I18N[locale] || FORM_I18N.fr
   const router = useRouter()
   const { user } = useAuth()
   const { addToast } = useToastStore()

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

   const [loading, setLoading] = React.useState(false)
   const [isNameModalOpen, setIsNameModalOpen] = React.useState(false)
   const [newName, setNewName] = React.useState(user?.nomComplet || "")
   const [categories, setCategories] = React.useState([])
   const [isHydratingProfile, setIsHydratingProfile] = React.useState(true)
   const [searchWilaya, setSearchWilaya] = React.useState("")
   const [wilayaFocused, setWilayaFocused] = React.useState(false)
   const [uploadProgress, setUploadProgress] = React.useState({ photo: 0, doc_diploma: 0, doc_card: 0 })
   const [currentStep, setCurrentStep] = React.useState(1)
   const searchRef = React.useRef(null)

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

   React.useEffect(() => {
      const fetchExistingProfile = async () => {
         try {
            const { data } = await api.get("/profile")
            const payload = data?.data || {}
            const artisan = payload?.artisan || {}
            const existingCategoryIds = Array.isArray(artisan?.categories)
               ? artisan.categories.map((c) => c.id)
               : []
            const existingWilayas = Array.isArray(artisan?.wilayas)
               ? artisan.wilayas.map((w) => w.id)
               : []

            setFormData((prev) => ({
               ...prev,
               nomComplet: payload?.nomComplet || prev.nomComplet,
               telephone: payload?.telephone || prev.telephone,
               photo: artisan?.photo || prev.photo,
               phone_visible_to_clients: artisan?.phone_visible_to_clients ?? prev.phone_visible_to_clients,
               whatsapp: artisan?.lienWhatsApp || prev.whatsapp,
               category_id: artisan?.categorie_id || existingCategoryIds[0] || prev.category_id,
               wilayas: existingWilayas.length ? existingWilayas : prev.wilayas,
               experience_level: artisan?.experience_level || prev.experience_level,
               about: artisan?.description || prev.about,
               disponibilite: artisan?.disponibilite || prev.disponibilite,
               doc_diploma: artisan?.diploma_url || prev.doc_diploma,
               doc_card: artisan?.artisan_card_url || prev.doc_card,
            }))
         } catch (err) {
            console.error("failed to hydrate artisan profile", err)
         } finally {
            setIsHydratingProfile(false)
         }
      }

      fetchExistingProfile()
   }, [])

   const completion = React.useMemo(() => {
      const fields = [
         formData.nomComplet,
         formData.telephone.match(/^0(5|6|7)\d{8}$/),
         !!formData.category_id,
         formData.wilayas.length > 0,
         formData.experience_level,
         formData.about.length >= 20,
      ]
      return Math.round((fields.filter(Boolean).length / fields.length) * 100)
   }, [formData])

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
         addToast({ title: err?.message || common("error"), type: "error" })
      } finally {
         setUploadProgress(prev => ({ ...prev, photo: 0 }))
      }
   }

   const handleDocumentUpload = async (e, type) => {
      const file = e.target.files[0]
      if (!file) return

      const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
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
         addToast({ title: err?.message || common("error"), type: "error" })
      } finally {
         setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      }
   }

   const handleDroppedFile = async (file, type) => {
      const fakeEvent = { target: { files: [file] } }
      await handleDocumentUpload(fakeEvent, type)
   }

   const filteredWilayas = React.useMemo(() => {
      if (!searchWilaya.trim()) return []
      const q = normalize(searchWilaya.trim())
      return wilayas
         .filter(w =>
            normalize(w.name).includes(q) ||
            w.code.includes(q)
         )
         .slice(0, 8)
   }, [searchWilaya])

   const generateWhatsApp = () => {
      if (!formData.telephone) return
      let ph = formData.telephone.replace(/\s/g, "").replace("+", "")
      if (ph.startsWith("0")) ph = "213" + ph.substring(1)
      setFormData(prev => ({ ...prev, whatsapp: `wa.me/${ph}` }))
   }

   const toggleWilaya = (id) => {
      setFormData(prev => ({
         ...prev,
         wilayas: prev.wilayas.includes(id) ? prev.wilayas.filter(w => w !== id) : [...prev.wilayas, id]
      }))
      setSearchWilaya("")
      searchRef.current?.focus()
   }

   const validateStep = () => {
      if (currentStep === 1 && (!formData.nomComplet || !formData.telephone.match(/^0(5|6|7)\d{8}$/)))
         return addToast({ title: t("error_required_fields"), type: "error" }), false
      if (currentStep === 2 && (!formData.category_id || formData.wilayas.length === 0 || formData.about.length < 20))
         return addToast({ title: t("error_required_fields"), type: "error" }), false
      return true
   }

   const goNext = () => { if (validateStep()) setCurrentStep(p => Math.min(p + 1, 3)) }
   const goBack = () => setCurrentStep(p => Math.max(p - 1, 1))

   const handleSubmit = async () => {
      if (currentStep < 3) {
         goNext()
         return
      }
      if (completion < 100) return addToast({ title: t("error_required_fields"), type: "error" })
      setLoading(true)
      try {
         await api.post("/profile", {
            nomComplet: formData.nomComplet,
            telephone: formData.telephone,
            phone_visible_to_clients: formData.phone_visible_to_clients,
            photo: formData.photo,
            description: formData.about,
            about: formData.about,
            experience_level: formData.experience_level,
            disponibilite: formData.disponibilite,
            lienWhatsApp: formData.whatsapp,
            whatsapp: formData.whatsapp,
            doc_diploma: formData.doc_diploma,
            doc_card: formData.doc_card,
            categorie_ids: [formData.category_id],
            wilaya_ids: formData.wilayas,
         })
         addToast({ title: common("success"), type: "success" })
         router.push("/onboarding/artisan/waiting")
      } catch (err) {
         const apiMessage = err?.response?.data?.message
         const apiErrors = err?.response?.data?.errors
         const firstError = apiErrors ? Object.values(apiErrors)?.flat?.()?.[0] : null
         console.error("onboarding profile submit failed", {
            status: err?.response?.status,
            data: err?.response?.data,
         })
         addToast({ title: firstError || apiMessage || common("error"), type: "error" })
      } finally {
         setLoading(false)
      }
   }

   const phoneValid = formData.telephone.match(/^0(5|6|7)\d{8}$/)

   return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#09090b]">
         {isHydratingProfile && (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
               <div className="h-24 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] animate-pulse" />
            </div>
         )}
         <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-28">

            {/* ── Top Nav ── */}
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-600/30">
                     <Award className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{ft.artisanPro}</span>
               </div>

               {/* Step pills */}
               <div className="flex items-center gap-1.5">
                  {STEPS.map((s, i) => (
                     <React.Fragment key={s.id}>
                        <div className={cn(
                           "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                           currentStep === s.id
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                              : currentStep > s.id
                                 ? "bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400"
                                 : "text-slate-300 dark:text-slate-700"
                        )}>
                           {currentStep > s.id
                              ? <Check className="w-3 h-3 stroke-[3]" />
                              : <span>{s.id}</span>
                           }
                           <span className="hidden sm:block">{ft[s.key]}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                           <div className={cn("w-4 h-px transition-colors duration-300",
                              currentStep > s.id ? "bg-blue-400" : "bg-slate-200 dark:bg-white/10"
                           )} />
                        )}
                     </React.Fragment>
                  ))}
               </div>
            </div>

            {/* ── Progress ── */}
            <div className="mb-10">
               <div className="flex items-baseline justify-between mb-2.5">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                     {ft.step} {currentStep} / 3
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{completion}% {ft.completed}</p>
               </div>
               <div className="h-1 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                     animate={{ width: `${completion}%` }}
                     transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                     className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
               </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
               <AnimatePresence mode="wait">

                  {/* ══════════════════ STEP 1 ══════════════════ */}
                  {currentStep === 1 && (
                     <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                        className="space-y-4"
                     >
                        <div className="mb-8">
                           <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {ft.identityTitle}
                           </h1>
                           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {ft.identityDesc}
                           </p>
                        </div>

                        {/* Profile card */}
                        <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">

                           {/* Avatar row */}
                           <div className="p-6 flex items-center gap-5">
                              <div className="relative shrink-0 group">
                                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/[0.06] dark:to-white/[0.03] overflow-hidden flex items-center justify-center ring-1 ring-slate-200/80 dark:ring-white/10">
                                    {formData.photo
                                       ? <img src={formData.photo} alt="Profil" className="w-full h-full object-cover" />
                                       : <Camera className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                                    }
                                    {uploadProgress.photo > 0 && (
                                       <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                                          <span className="text-white text-xs font-bold">{uploadProgress.photo}%</span>
                                       </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center rounded-2xl">
                                       <Upload className="w-5 h-5 text-white" />
                                       <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                    </label>
                                 </div>
                                 {formData.photo && (
                                    <button type="button" onClick={() => setFormData(p => ({ ...p, photo: null }))}
                                       className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                                       <X className="w-3 h-3 text-white" />
                                    </button>
                                 )}
                              </div>

                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                       {formData.nomComplet || "Votre nom complet"}
                                    </p>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                                       <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                       <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{ft.verified}</span>
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-400 mt-0.5">{ft.photoMax}</p>
                                 {/* FIX #1: no underline, styled as a clean button */}
                                 <button
                                    type="button"
                                    onClick={() => setIsNameModalOpen(true)}
                                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                                 >
                                    <Pencil className="w-3 h-3" />
                                    {ft.editName}
                                 </button>
                              </div>
                           </div>

                           <div className="h-px bg-slate-100 dark:bg-white/[0.05] mx-6" />

                           {/* Fields */}
                           <div className="p-6 space-y-5">
                              {/* Phone — FIX #2: removed "Visible to clients" toggle */}
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {ft.phone}
                                 </label>
                                 <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                       <span className="text-xs font-semibold text-slate-400">🇩🇿</span>
                                       <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
                                    </div>
                                    <input
                                       value={formData.telephone}
                                       onChange={(e) => setFormData(p => ({ ...p, telephone: e.target.value }))}
                                       placeholder={ft.phonePlaceholder}
                                       className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono tracking-wider"
                                    />
                                    {phoneValid && (
                                       <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                       </div>
                                    )}
                                 </div>
                              </div>

                              {/* WhatsApp */}
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    WhatsApp <span className="normal-case font-normal text-slate-400">({ft.optional})</span>
                                 </label>
                                 <div className="flex gap-2">
                                    <div className="relative flex-1">
                                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                       </div>
                                       <input
                                          value={formData.whatsapp}
                                          onChange={(e) => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                                          placeholder="wa.me/213…"
                                          className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366] transition-all"
                                       />
                                    </div>
                                    <button
                                       type="button"
                                       onClick={generateWhatsApp}
                                       className="shrink-0 h-12 px-4 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                                    >
                                       <Zap className="w-3.5 h-3.5" />
                                       {ft.generate}
                                    </button>
                                 </div>
                                 {/* FIX #1: no underline on link — replaced with pill button */}
                                 {formData.whatsapp && (
                                    <div className="flex items-center gap-2">
                                       <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{ft.generatedLink}</span>
                                       </div>
                                       <a
                                          href={`https://${formData.whatsapp}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors no-underline"
                                       >
                                          <ExternalLink className="w-3 h-3" />
                                          {ft.test}
                                       </a>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* ══════════════════ STEP 2 ══════════════════ */}
                  {currentStep === 2 && (
                     <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                        className="space-y-4"
                     >
                        <div className="mb-8">
                           <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {ft.expertiseTitle}
                           </h1>
                           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {ft.expertiseDesc}
                           </p>
                        </div>

                        {/* FIX #3: Category icons — proper grid with large visible icons */}
                        <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm mb-4">
                           <div className="relative">
                              <select
                                 value={formData.category_id || ""}
                                 onChange={(e) => setFormData(p => ({ ...p, category_id: e.target.value }))}
                                 className="w-full h-14 pl-12 pr-10 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm font-semibold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-sans"
                              >
                                 <option value="" disabled>Sélectionnez votre métier principal...</option>
                                 {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                 ))}
                              </select>
                              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                           </div>
                        </div>

                        {/* FIX #4 & #5: Experience redesign + improved Wilaya search */}
                        <div className="grid grid-cols-1 gap-4">

                           {/* FIX #4: Experience — visual card with prominent label */}
                           <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                              <div className="flex items-center gap-2 mb-4">
                                 <TrendingUp className="w-4 h-4 text-blue-600" />
                                 <span className="text-sm font-bold text-slate-900 dark:text-white">{ft.experience}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2.5">
                                 {[
                                    { id: "beginner", label: ft.beginner, sub: "< 2 ans", dot: "bg-slate-400" },
                                    { id: "intermediate", label: ft.confirmed, sub: "2 – 5 ans", dot: "bg-blue-500" },
                                    { id: "expert", label: ft.expert, sub: "> 5 ans", dot: "bg-amber-500" },
                                 ].map(level => {
                                    const isSelected = formData.experience_level === level.id
                                    return (
                                       <button
                                          key={level.id}
                                          type="button"
                                          onClick={() => setFormData(p => ({ ...p, experience_level: level.id }))}
                                          className={cn(
                                             "flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                                             isSelected
                                                ? "border-blue-600 bg-blue-600/5 dark:bg-blue-600/10"
                                                : "border-slate-100 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.14]"
                                          )}
                                       >
                                          <div className={cn(
                                             "w-2.5 h-2.5 rounded-full transition-all",
                                             isSelected ? "scale-125 " + level.dot : level.dot + " opacity-40"
                                          )} />
                                          <span className={cn(
                                             "text-sm font-bold",
                                             isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                                          )}>
                                             {level.label}
                                          </span>
                                          <span className="text-[11px] text-slate-400 font-medium">{level.sub}</span>
                                       </button>
                                    )
                                 })}
                              </div>
                           </div>

                           {/* FIX #5: Wilaya search — accent-insensitive */}
                           <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{ft.wilayas}</span>
                                 </div>
                                 {formData.wilayas.length > 0 && (
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
                                       {formData.wilayas.length} sélectionnée{formData.wilayas.length > 1 ? "s" : ""}
                                    </span>
                                 )}
                              </div>

                              {/* Search input */}
                              <div className="relative">
                                 <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                 <input
                                    ref={searchRef}
                                    placeholder={ft.wilayaSearch}
                                    value={searchWilaya}
                                    onChange={(e) => setSearchWilaya(e.target.value)}
                                    onFocus={() => setWilayaFocused(true)}
                                    onBlur={() => setTimeout(() => setWilayaFocused(false), 150)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                 />
                                 {searchWilaya && (
                                    <button type="button" onClick={() => setSearchWilaya("")}
                                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                                       <X className="w-3.5 h-3.5" />
                                    </button>
                                 )}

                                 {/* Dropdown */}
                                 <AnimatePresence>
                                    {wilayaFocused && filteredWilayas.length > 0 && (
                                       <motion.div
                                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                          transition={{ duration: 0.15 }}
                                          className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl shadow-slate-200/60 dark:shadow-black/50 overflow-hidden"
                                       >
                                          {filteredWilayas.map((w, i) => {
                                             const already = formData.wilayas.includes(w.id)
                                             return (
                                                <button
                                                   key={w.id}
                                                   type="button"
                                                   onMouseDown={() => toggleWilaya(w.id)}
                                                   className={cn(
                                                      "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors",
                                                      already
                                                         ? "bg-blue-50 dark:bg-blue-500/10 cursor-default"
                                                         : "hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer",
                                                      i > 0 && "border-t border-slate-50 dark:border-white/[0.03]"
                                                   )}
                                                >
                                                   <div className="flex items-center gap-3">
                                                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 w-6 tabular-nums">{w.code}</span>
                                                      <span className={cn(
                                                         "font-semibold",
                                                         already ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
                                                      )}>
                                                         {w.name}
                                                      </span>
                                                   </div>
                                                   {already
                                                      ? <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                                                      : <Plus className="w-3.5 h-3.5 text-slate-300" />
                                                   }
                                                </button>
                                             )
                                          })}
                                       </motion.div>
                                    )}
                                    {wilayaFocused && searchWilaya.length > 0 && filteredWilayas.length === 0 && (
                                       <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl overflow-hidden px-4 py-4"
                                       >
                                          <p className="text-sm text-slate-400 font-medium text-center">{ft.noWilaya}</p>
                                       </motion.div>
                                    )}
                                 </AnimatePresence>
                              </div>

                              {/* Selected pills */}
                              <div className="flex flex-wrap gap-1.5 mt-3 min-h-[28px]">
                                 {formData.wilayas.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">{ft.wilayaHint}</p>
                                 ) : (
                                    formData.wilayas.map(id => {
                                       const w = wilayas.find(x => x.id === id)
                                       if (!w) return null
                                       return (
                                          <motion.span
                                             layout
                                             initial={{ scale: 0.8, opacity: 0 }}
                                             animate={{ scale: 1, opacity: 1 }}
                                             exit={{ scale: 0.8, opacity: 0 }}
                                             key={id}
                                             className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-lg"
                                          >
                                             <span className="text-[10px] opacity-60">{w.code}</span>
                                             {w.name}
                                             <button
                                                type="button"
                                                onClick={() => toggleWilaya(id)}
                                                className="hover:opacity-60 transition-opacity ml-0.5"
                                             >
                                                <X className="w-3 h-3" />
                                             </button>
                                          </motion.span>
                                       )
                                    })
                                 )}
                              </div>
                           </div>

                           {/* Bio */}
                           <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{ft.about}</span>
                                 </div>
                                 <span className={cn(
                                    "text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full transition-all",
                                    formData.about.length >= 20
                                       ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                                       : "text-slate-400 bg-slate-100 dark:bg-white/[0.05]"
                                 )}>
                                    {formData.about.length} / 300
                                 </span>
                              </div>
                              <textarea
                                 value={formData.about}
                                 onChange={(e) => setFormData(p => ({ ...p, about: e.target.value.slice(0, 300) }))}
                                 placeholder={ft.aboutPlaceholder}
                                 rows={4}
                                 className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all leading-relaxed font-medium"
                              />
                              {formData.about.length > 0 && formData.about.length < 20 && (
                                 <p className="flex items-center gap-1.5 text-[11px] text-red-500 font-semibold mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {ft.minChars}
                                 </p>
                              )}
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* ══════════════════ STEP 3 ══════════════════ */}
                  {currentStep === 3 && (
                     <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                        className="space-y-4"
                     >
                        <div className="mb-8">
                           <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {ft.finalizeTitle}
                           </h1>
                           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {ft.finalizeDesc}
                           </p>
                        </div>

                        {/* FIX #6: Disponibilité redesigned — prominent, clear toggle card */}
                        <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">
                           <div className="p-5">
                              <div className="flex items-center gap-2 mb-4">
                                 <Clock className="w-4 h-4 text-blue-600" />
                                 <span className="text-sm font-bold text-slate-900 dark:text-white">{ft.availability}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 {[
                                    { value: "disponible", label: ft.available, sub: "Visible dans les recherches", dot: "bg-emerald-500", border: "border-emerald-500", bg: "bg-emerald-500/5 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
                                    { value: "indisponible", label: ft.unavailable, sub: "Masqué des recherches", dot: "bg-slate-400", border: "border-slate-200 dark:border-white/[0.08]", bg: "bg-slate-50 dark:bg-white/[0.03]", text: "text-slate-600 dark:text-slate-400" },
                                 ].map(opt => {
                                    const isActive = formData.disponibilite === opt.value
                                    return (
                                       <button
                                          key={opt.value}
                                          type="button"
                                          onClick={() => setFormData(p => ({ ...p, disponibilite: opt.value }))}
                                          className={cn(
                                             "relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200",
                                             isActive ? opt.border + " " + opt.bg : "border-slate-100 dark:border-white/[0.07] bg-slate-50/50 dark:bg-white/[0.02] hover:border-slate-200"
                                          )}
                                       >
                                          <div className="flex items-center justify-between w-full">
                                             <div className={cn("w-3 h-3 rounded-full transition-all", opt.dot, isActive ? "opacity-100 scale-110" : "opacity-40")} />
                                             {isActive && (
                                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                   <Check className="w-3 h-3 text-white stroke-[3]" />
                                                </div>
                                             )}
                                          </div>
                                          <div>
                                             <p className={cn("text-sm font-bold", isActive ? opt.text : "text-slate-600 dark:text-slate-400")}>
                                                {opt.label}
                                             </p>
                                             <p className="text-[11px] text-slate-400 font-medium mt-0.5">{opt.sub}</p>
                                          </div>
                                       </button>
                                    )
                                 })}
                              </div>
                           </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">
                           <div className="p-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ft.docs}</p>
                                    <p className="text-xs text-slate-400">{ft.docsHint}</p>
                                 </div>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-white/[0.08] rounded-full px-2.5 py-1">
                                 {ft.optionalCaps}
                              </span>
                           </div>

                           <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                 { id: "doc_diploma", label: "Diplôme / Attestation", icon: Award },
                                 { id: "doc_card", label: "Carte professionnelle", icon: ShieldCheck },
                              ].map(doc => {
                                 const isUploaded = !!formData[doc.id]
                                 const progress = uploadProgress[doc.id]
                                 const DocIcon = doc.icon
                                 return (
                                    <div key={doc.id} className="relative">
                                       <label
                                          onDragOver={(e) => e.preventDefault()}
                                          onDrop={(e) => {
                                             e.preventDefault()
                                             const file = e.dataTransfer.files?.[0]
                                             if (file) handleDroppedFile(file, doc.id)
                                          }}
                                          className={cn(
                                             "flex flex-col items-center gap-3 py-7 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
                                             isUploaded
                                                ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5"
                                                : "border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-blue-50/30 dark:hover:bg-blue-500/5"
                                          )}
                                       >
                                          <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleDocumentUpload(e, doc.id)} />
                                          {isUploaded ? (
                                             <>
                                                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                                                   <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-2" />
                                                </div>
                                                <div className="text-center">
                                                   <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{doc.label}</p>
                                                   <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 uppercase tracking-wide">{ft.imported} ✓</p>
                                                </div>
                                             </>
                                          ) : progress > 0 ? (
                                             <>
                                                <div className="w-11 h-11 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                                                <p className="text-xs font-bold text-blue-600">{progress}%</p>
                                             </>
                                          ) : (
                                             <>
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/[0.06] dark:to-white/[0.03] flex items-center justify-center">
                                                   <DocIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <div className="text-center">
                                                   <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{doc.label}</p>
                                                   <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{ft.dragOrClick}</p>
                                                </div>
                                             </>
                                          )}
                                       </label>
                                       {isUploaded && (
                                          <button type="button"
                                             onClick={() => setFormData(p => ({ ...p, [doc.id]: null }))}
                                             className="absolute top-3 right-3 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center hover:text-red-500 transition-colors shadow-sm">
                                             <X className="w-3 h-3" />
                                          </button>
                                       )}
                                    </div>
                                 )
                              })}
                           </div>

                           {/* FIX #7: Professional verified badge CTA */}
                           <div className="mx-5 mb-5 rounded-xl overflow-hidden border border-slate-100 dark:border-white/[0.06]">
                              <div className="flex items-stretch">
                                 {/* Left accent strip */}
                                 <div className="w-1 bg-gradient-to-b from-blue-500 to-indigo-600 shrink-0 rounded-l-xl" />
                                 <div className="flex-1 px-4 py-4 flex items-start gap-3.5 bg-gradient-to-r from-blue-50/60 to-indigo-50/30 dark:from-blue-500/5 dark:to-indigo-500/5">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                                       <BadgeCheck className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                                    </div>
                                    <div>
                                       <p className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
                                          {ft.verifiedBadge}
                                       </p>
                                       <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                          {ft.verifiedBadgeDesc}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Summary strip */}
                        <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                           {formData.photo
                              ? <img src={formData.photo} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                              : <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/[0.06] dark:to-white/[0.03] flex items-center justify-center shrink-0">
                                 <Camera className="w-4 h-4 text-slate-400" />
                              </div>
                           }
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{formData.nomComplet}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                 {categories.find(c => c.id === formData.category_id)?.nom || "—"} · {formData.wilayas.length} wilaya{formData.wilayas.length !== 1 ? "s" : ""}
                              </p>
                           </div>
                           <div className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all",
                              formData.disponibilite === "disponible"
                                 ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                 : "bg-slate-100 dark:bg-white/[0.05] text-slate-500"
                           )}>
                              <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 formData.disponibilite === "disponible" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                              )} />
                              {formData.disponibilite === "disponible" ? "Disponible" : "Indisponible"}
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* ── Bottom Nav Bar ── */}
               <div className="fixed bottom-0 left-0 right-0 z-40">
                  <div className="absolute inset-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/[0.06]" />
                  <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
                     {currentStep > 1 && (
                        <button
                           type="button"
                           onClick={goBack}
                           className="h-11 px-5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                        >
                           {ft.back}
                        </button>
                     )}
                     <div className="flex-1" />
                     {currentStep < 3 ? (
                        <button
                           type="button"
                           onClick={goNext}
                           className="h-11 px-7 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
                        >
                           {ft.continue}
                           <ArrowRight className="w-4 h-4" />
                        </button>
                     ) : (
                        <button
                           type="button"
                           disabled={loading}
                           onClick={handleSubmit}
                           className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25"
                        >
                           {loading ? (
                              <>
                                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                 {ft.sending}
                              </>
                           ) : (
                              <>
                                 {ft.submit}
                                 <ArrowRight className="w-4 h-4" />
                              </>
                           )}
                        </button>
                     )}
                  </div>
               </div>
            </form>
         </div>

         {/* ── Name Modal ── */}
         <AnimatePresence>
            {isNameModalOpen && (
               <>
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                     onClick={() => setIsNameModalOpen(false)}
                  />
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
                     transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                     className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
                  >
                     <div className="bg-white dark:bg-[#111113] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
                           <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{ft.editNameTitle}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                           <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-xl">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                 {ft.editNameDesc}
                              </p>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{ft.fullName}</label>
                              <input
                                 value={newName}
                                 onChange={(e) => setNewName(e.target.value)}
                                 className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                              />
                           </div>
                           <div className="flex gap-3 pt-1">
                              <button type="button" onClick={() => setIsNameModalOpen(false)}
                                 className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-white/[0.08] text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                                 {ft.cancel}
                              </button>
                              <button type="button"
                                 onClick={() => { setFormData(p => ({ ...p, nomComplet: newName })); setIsNameModalOpen(false) }}
                                 className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
                                 {ft.save}
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   )
}