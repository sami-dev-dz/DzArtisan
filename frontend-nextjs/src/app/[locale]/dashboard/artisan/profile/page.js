"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Camera, Pencil, Phone, MessageCircle, Briefcase, MapPin,
  Check, Upload, X, Clock, ShieldCheck, Save,
  Loader2, ChevronDown, Plus,
  ToggleLeft, ToggleRight, Star, Award
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { useAuth } from "@/context/AuthContext"
import { useToastStore } from "@/store/toastStore"
import { wilayas, experience_levels } from "@/data/algeria"
import { uploadToCloudinary } from "@/lib/cloudinary"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"

// ─── Section Wrapper ──────────────────────────────────────────────────────
function Section({ children, className }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        "relative overflow-hidden group bg-white dark:bg-slate-900/40 rounded-[32px] p-8 md:p-10",
        "border border-slate-200/60 dark:border-white/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 backdrop-blur-xl",
        className
      )}
    >
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />
      {children}
    </motion.section>
  )
}

// ─── Section Header ────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, iconColor = "bg-blue-600", title, subtitle }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Field Label ───────────────────────────────────────────────────────────
function FieldLabel({ children, required }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ArtisanProfileEditPage() {
  const t = useTranslations("onboarding")
  const dash = useTranslations("dashboard")
  const common = useTranslations("common")
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { user, setUser } = useAuth()
  const { addToast } = useToastStore()

  const [formData, setFormData] = React.useState({
    photo: "",
    nomComplet: "",
    telephone: "",
    whatsapp: "",
    categories: [],
    wilayas: [],
    experience_level: "beginner",
    anneesExp: "",
    about: "",
    disponibilite: "disponible",
    phone_visible_to_clients: true,
  })

  const [fetching, setFetching] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [isNameModalOpen, setIsNameModalOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [categories, setCategories] = React.useState([])
  const [searchWilaya, setSearchWilaya] = React.useState("")
  const [photoUploading, setPhotoUploading] = React.useState(false)

  React.useEffect(() => {
    const init = async () => {
      try {
        const [catRes, profRes] = await Promise.all([
          api.get("/categories"),
          api.get("/profile")
        ])
        setCategories(catRes.data)

        // Backend returns { success, data: user }
        const p = profRes.data?.data ?? profRes.data
        const art = p?.artisan || {}

        setFormData({
          photo: art.photo || "",
          nomComplet: p.nomComplet || "",
          telephone: p.telephone || "",
          whatsapp: art.lienWhatsApp || "",
          categories: art.categories?.map(c => c.id) || [],
          wilayas: art.wilayas?.map(w => w.id) || [],
          experience_level: art.experience_level || "beginner",
          anneesExp: art.anneesExp ?? "",
          about: art.description || "",
          disponibilite: art.disponibilite || "disponible",
          phone_visible_to_clients: art.phone_visible_to_clients ?? true,
        })
        setNewName(p.nomComplet || "")
      } catch {
        addToast({ title: common("error"), type: "error" })
      } finally {
        setFetching(false)
      }
    }
    init()
  }, [])

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      addToast({ title: "Fichier trop volumineux (max 5 Mo)", type: "error" })
      return
    }
    setPhotoUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, photo: url }))
      addToast({ title: t("upload_success"), type: "success" })
    } catch {
      addToast({ title: common("error"), type: "error" })
    } finally {
      setPhotoUploading(false)
    }
  }

  const generateWhatsApp = () => {
    if (!formData.telephone) return
    let ph = formData.telephone.replace(/\s/g, '').replace('+', '')
    if (ph.startsWith('0')) ph = '213' + ph.substring(1)
    setFormData(prev => ({ ...prev, whatsapp: `wa.me/${ph}` }))
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
        nomComplet: formData.nomComplet,
        telephone: formData.telephone,
        lienWhatsApp: formData.whatsapp,
        description: formData.about,
        experience_level: formData.experience_level,
        anneesExp: formData.anneesExp !== "" ? parseInt(formData.anneesExp) : null,
        disponibilite: formData.disponibilite,
        phone_visible_to_clients: formData.phone_visible_to_clients,
        photo: formData.photo,
        categorie_ids: formData.categories,
        wilaya_ids: formData.wilayas,
      })

      const updatedUser = data?.data?.user ?? data?.user ?? null
      if (updatedUser) setUser(updatedUser)
      addToast({ title: "Profil mis à jour avec succès !", type: "success" })
    } catch (err) {
      const msg = err?.response?.data?.message || common("error")
      addToast({ title: msg, type: "error" })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 animate-spin" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Chargement du profil...</p>
      </div>
    )
  }

  const filteredWilayas = wilayas.filter(w =>
    w.name.toLowerCase().includes(searchWilaya.toLowerCase()) ||
    w.code.includes(searchWilaya)
  ).slice(0, 8)

  const completenessItems = [
    { label: "Photo de profil", done: !!formData.photo },
    { label: "WhatsApp", done: !!formData.whatsapp },
    { label: "Description (+150 car.)", done: formData.about.length >= 150 },
    { label: "Années d'expérience", done: formData.anneesExp !== "" && Number(formData.anneesExp) > 0 },
    { label: "Wilayas d'intervention", done: formData.wilayas.length > 1 },
  ]
  const completenessScore = Math.round((completenessItems.filter(i => i.done).length / completenessItems.length) * 100)

  return (
    <div className="relative max-w-4xl mx-auto space-y-8 pb-12">
      {/* ── Premium Ambient Background ────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-linear-to-b from-blue-600/5 to-transparent dark:from-blue-600/10 pointer-events-none rounded-t-[3rem] -z-10" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Profil Professionnel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {dash("profile")}
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">Mettez à jour vos informations pour rester attractif aux yeux des clients.</p>
        </div>

        {/* Completeness badge */}
        <div className="shrink-0 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/5 rounded-3xl p-5 min-w-[160px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Complétude</p>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{completenessScore}<span className="text-lg text-slate-400">%</span></div>
          <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completenessScore}%`,
                background: completenessScore >= 80
                  ? "linear-gradient(to right, #10b981, #059669)"
                  : completenessScore >= 50
                  ? "linear-gradient(to right, #f59e0b, #d97706)"
                  : "linear-gradient(to right, #3b82f6, #6366f1)"
              }}
            />
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── 1. Photo & Identité ───────────────────────────────── */}
        <Section>
          <SectionHeader icon={Camera} iconColor="bg-blue-600 shadow-blue-600/30" title="Identité & Contact" subtitle="Votre visage public sur la plateforme" />

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Photo */}
            <div className="relative group shrink-0 mx-auto md:mx-0">
              <div className="w-40 h-40 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-slate-300" />
                )}
                {photoUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white text-xs font-black gap-1">
                  <Upload className="w-5 h-5" />
                  Changer
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              {formData.photo && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="flex-1 w-full space-y-5">
              {/* Nom */}
              <div>
                <FieldLabel>Nom complet</FieldLabel>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/8 rounded-2xl py-4 px-5 font-bold text-slate-900 dark:text-white text-sm">
                    {formData.nomComplet}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNameModalOpen(true)}
                    className="h-[56px] w-[56px] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shrink-0"
                  >
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Téléphone */}
                <div>
                  <FieldLabel>Téléphone</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={formData.telephone}
                      onChange={e => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                      className="pl-11 h-14 rounded-2xl bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/8"
                      placeholder="05xx xx xx xx"
                    />
                  </div>
                  {/* Toggle visibilité */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, phone_visible_to_clients: !prev.phone_visible_to_clients }))}
                    className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {formData.phone_visible_to_clients
                      ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                      : <ToggleLeft className="w-5 h-5 text-slate-400" />
                    }
                    {formData.phone_visible_to_clients ? "Visible par les clients" : "Masqué aux clients"}
                  </button>
                </div>

                {/* WhatsApp */}
                <div>
                  <FieldLabel>Lien WhatsApp</FieldLabel>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <Input
                        value={formData.whatsapp}
                        onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className="pl-11 h-14 rounded-2xl bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/8"
                        placeholder="wa.me/213..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateWhatsApp}
                      className="h-14 w-14 shrink-0 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                      title="Générer depuis le téléphone"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. Expertise & Zones ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Catégorie */}
          <Section>
            <SectionHeader icon={Briefcase} iconColor="bg-indigo-600 shadow-indigo-600/30" title="Métier principal" subtitle="Votre domaine d'expertise" />
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={formData.categories[0] || ""}
                onChange={e => setFormData(prev => ({ ...prev, categories: [parseInt(e.target.value)] }))}
                className="w-full h-14 pl-11 pr-10 rounded-2xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/8 text-sm font-semibold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              >
                <option value="" disabled>Sélectionnez votre métier...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
            </div>
          </Section>

          {/* Wilayas */}
          <Section>
            <SectionHeader icon={MapPin} iconColor="bg-rose-500 shadow-rose-500/30" title="Zones d'intervention" subtitle="Les wilayas où vous travaillez" />
            <div className="relative">
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher une wilaya..."
                value={searchWilaya}
                onChange={e => setSearchWilaya(e.target.value)}
                className="pl-11 h-14 rounded-2xl bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/8"
              />

              <AnimatePresence>
                {searchWilaya && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden max-h-52 overflow-y-auto"
                  >
                    {filteredWilayas.map(w => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => toggleWilaya(w.id)}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                      >
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          <span className="text-blue-600 mr-2 font-black">{w.code}</span>{w.name}
                        </span>
                        {formData.wilayas.includes(w.id) && <Check className="w-4 h-4 text-emerald-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {formData.wilayas.map(id => {
                const w = wilayas.find(x => x.id === id)
                return w ? (
                  <Badge key={id} className="bg-blue-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/20">
                    {w.name}
                    <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => toggleWilaya(id)} />
                  </Badge>
                ) : null
              })}
              {formData.wilayas.length === 0 && (
                <p className="text-xs text-slate-400 italic">Aucune wilaya sélectionnée</p>
              )}
            </div>
          </Section>
        </div>

        {/* ── 3. Expérience & Description ──────────────────────── */}
        <Section>
          <SectionHeader icon={Star} iconColor="bg-amber-500 shadow-amber-500/30" title="Expérience & Présentation" subtitle="Décrivez votre parcours professionnel" />

          {/* Années & Disponibilité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Années d'expérience */}
            <div>
              <FieldLabel>Années d'expérience</FieldLabel>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.anneesExp}
                  onChange={e => setFormData(prev => ({ ...prev, anneesExp: e.target.value }))}
                  className="pl-11 h-14 rounded-2xl bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/8 text-lg font-black"
                  placeholder="Ex: 7"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 ml-1">Affiché sur votre profil public</p>
            </div>

            {/* Disponibilité */}
            <div>
              <FieldLabel>Disponibilité</FieldLabel>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  disponibilite: prev.disponibilite === 'disponible' ? 'indisponible' : 'disponible'
                }))}
                className={cn(
                  "w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-sm transition-all border-2",
                  formData.disponibilite === 'disponible'
                    ? "bg-emerald-50 border-emerald-400/40 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-500/30 dark:text-emerald-400"
                    : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/3 dark:border-white/8 dark:text-slate-400"
                )}
              >
                {formData.disponibilite === 'disponible'
                  ? <><ToggleRight className="w-6 h-6" /> Disponible — Prêt à recevoir des missions</>
                  : <><ToggleLeft className="w-6 h-6" /> Indisponible actuellement</>
                }
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <FieldLabel>Description professionnelle</FieldLabel>
            <Textarea
              value={formData.about}
              onChange={e => setFormData(prev => ({ ...prev, about: e.target.value.slice(0, 500) }))}
              className="min-h-[180px] rounded-3xl bg-slate-50 dark:bg-white/2 border-slate-200 dark:border-white/8 p-6 text-sm leading-relaxed resize-none"
              placeholder="Décrivez votre expérience, vos spécialités, votre approche du travail..."
            />
            <div className="flex justify-between items-center mt-2 px-1">
              <p className={cn(
                "text-xs font-bold",
                formData.about.length >= 150 ? "text-emerald-500" : "text-amber-500"
              )}>
                {formData.about.length >= 150 ? "✓ Excellente longueur" : `${formData.about.length}/150 minimum requis`}
              </p>
              <p className="text-xs text-slate-400">{formData.about.length}/500</p>
            </div>
          </div>
        </Section>

        {/* ── Completeness Checklist ────────────────────────────── */}
        <Section>
          <SectionHeader icon={ShieldCheck} iconColor="bg-emerald-600 shadow-emerald-600/30" title="Checklist du profil" subtitle="Complétez chaque point pour maximiser votre visibilité" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completenessItems.map((item, i) => (
              <div key={i} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl border",
                item.done
                  ? "bg-emerald-50 border-emerald-200/50 dark:bg-emerald-900/10 dark:border-emerald-500/20"
                  : "bg-slate-50 border-slate-200 dark:bg-white/2 dark:border-white/8"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center shrink-0",
                  item.done ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-white/10"
                )}>
                  {item.done ? <Check className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  item.done ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                )}>{item.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Save Button ───────────────────────────────────────── */}
        <div className="sticky bottom-6 z-20 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm uppercase tracking-widest gap-3 shadow-2xl shadow-blue-600/40 transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Enregistrement..." : "Sauvegarder les modifications"}
          </Button>
        </div>
      </form>

      {/* ── Name Modal ────────────────────────────────────────── */}
      <Modal isOpen={isNameModalOpen} onClose={() => setIsNameModalOpen(false)} title="Modifier votre nom">
        <div className="p-8 space-y-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 text-xs font-bold text-amber-700 dark:text-amber-400">
            ⚠️ Votre nom doit correspondre à votre identité réelle. Des modifications fréquentes peuvent impacter votre badge de vérification.
          </div>
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold"
            placeholder="Votre nom complet"
          />
          <Button
            className="w-full h-14 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setFormData(prev => ({ ...prev, nomComplet: newName }))
              setIsNameModalOpen(false)
            }}
          >
            Confirmer le changement
          </Button>
        </div>
      </Modal>
    </div>
  )
}

// Local SVG icon for Zap (WhatsApp button)
function Zap({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.5 14 3v8h6L10 20.2V13H4Z"/>
    </svg>
  )
}
