"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { 
  MapPin, Search, ChevronDown,
  RotateCcw, Star, Briefcase, Check, Zap
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

function FilterSection({ label, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
          {label}
        </label>
      </div>
      {children}
    </div>
  )
}

export function ArtisanFilters({ filters, setFilters, categories, wilayas, onReset, onGeoActivate }) {
  const t = useTranslations("search")
  const common = useTranslations("common")

  const [wilayaSearch, setWilayaSearch] = React.useState("")
  const [isWilayaOpen, setIsWilayaOpen] = React.useState(false)
  const wilayaRef = React.useRef(null)

  const filteredWilayas = wilayas.filter(w =>
    w.nom.toLowerCase().includes(wilayaSearch.toLowerCase())
  )

  const toggleCategory = (id) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id]
    setFilters({ ...filters, categories: next })
  }

  const expLevels = [
    { id: 'all', label: 'Tous' },
    { id: 'beginner', label: 'Débutant' },
    { id: '1-3', label: '1–3 ans' },
    { id: '3-5', label: '3–5 ans' },
    { id: '5-10', label: '5–10 ans' },
    { id: '10+', label: '10+ ans' },
  ]
  const ratingOptions = [0, 3, 4, 5]

  // Close wilaya dropdown on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (wilayaRef.current && !wilayaRef.current.contains(e.target)) {
        setIsWilayaOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="space-y-7 pb-4">

      {/* Geolocation */}
      <div>
        <button
          onClick={onGeoActivate}
          className={cn(
            "w-full h-11 rounded-2xl flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-widest border-2 transition-all active:scale-95",
            filters.lat
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600"
          )}
        >
          <MapPin className={cn("w-4 h-4", filters.lat && "animate-pulse")} />
          {filters.lat ? "📍 Localisation active" : t("geo_btn")}
        </button>
        {filters.geoError && (
          <p className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl leading-relaxed">
            {t("geo_denied")}
          </p>
        )}
      </div>

      <div className="h-px bg-slate-100 dark:bg-white/5" />

      {/* Wilaya */}
      <FilterSection label={t("wilaya_label")} icon={MapPin}>
        <div className="relative" ref={wilayaRef}>
          <button
            onClick={() => setIsWilayaOpen(!isWilayaOpen)}
            className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 hover:border-blue-400 transition-all flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white"
          >
            <span className={cn(!filters.wilaya_id && "text-slate-400")}>
              {filters.wilaya_id ? wilayas.find(w => w.id === filters.wilaya_id)?.nom : common("all")}
            </span>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isWilayaOpen && "rotate-180")} />
          </button>

          {isWilayaOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-2 border-b border-slate-50 dark:border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    autoFocus
                    placeholder="Alger, Oran..."
                    className="w-full h-9 bg-slate-50 dark:bg-white/5 rounded-xl pl-8 pr-3 text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                    value={wilayaSearch}
                    onChange={(e) => setWilayaSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto">
                <button
                  onClick={() => { setFilters({ ...filters, wilaya_id: null }); setIsWilayaOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 transition-colors"
                >
                  {common("all")}
                </button>
                {filteredWilayas.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => { setFilters({ ...filters, wilaya_id: w.id }); setIsWilayaOpen(false) }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                      filters.wilaya_id === w.id && "text-blue-600 bg-blue-50/50 dark:bg-blue-600/10"
                    )}
                  >
                    {w.nom}
                    {filters.wilaya_id === w.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection label={t("categories_label")}>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {categories.slice(0, 12).map((cat) => (
            <label
              key={cat.id}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border",
                filters.categories.includes(cat.id)
                  ? "bg-blue-50 dark:bg-blue-600/10 border-blue-200 dark:border-blue-500/20 text-blue-700"
                  : "border-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                  filters.categories.includes(cat.id)
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-300 dark:border-white/20"
                )}>
                  {filters.categories.includes(cat.id) && <Check className="w-2.5 h-2.5 text-white stroke-3" />}
                </div>
                <input type="checkbox" className="hidden" checked={filters.categories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                <span className="text-[11px] font-bold">{cat.nom}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                {cat.artisans_count || 0}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection label={t("rating_label")} icon={Star}>
        <div className="flex gap-2">
          {ratingOptions.map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, min_rating: r })}
              className={cn(
                "flex-1 h-9 rounded-xl border flex items-center justify-center gap-1 transition-all text-xs font-black",
                filters.min_rating === r
                  ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-amber-400"
              )}
            >
              {r === 0 ? "Tous" : <><span>{r}</span><Star className="w-2.5 h-2.5 fill-current" /></>}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Experience */}
      <FilterSection label={t("exp_label")} icon={Briefcase}>
        <div className="grid grid-cols-3 gap-1.5">
          {expLevels.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setFilters({ ...filters, experience: exp.id === 'all' ? null : exp.id })}
              className={cn(
                "h-9 rounded-xl border text-[10px] font-black uppercase tracking-tight px-1 transition-all",
                (filters.experience === exp.id || (exp.id === 'all' && !filters.experience))
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-400"
              )}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <div className="h-px bg-slate-100 dark:bg-white/5" />

      {/* Availability */}
      <div
        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 cursor-pointer hover:border-emerald-300 transition-all"
        onClick={() => setFilters({ ...filters, available_only: !filters.available_only })}
      >
        <div className="space-y-0.5">
          <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wide block">
            {t("availability_label")}
          </span>
          <p className="text-[10px] font-semibold text-slate-400">
            Artisans disponibles uniquement
          </p>
        </div>
        <div className={cn(
          "w-12 h-6 rounded-full p-1 transition-all duration-500 shrink-0",
          filters.available_only ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
        )}>
          <div className={cn(
            "w-4 h-4 bg-white rounded-full shadow transition-transform duration-500",
            filters.available_only ? "translate-x-6" : "translate-x-0"
          )} />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full h-10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-red-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {t("reset_filters")}
      </button>
    </div>
  )
}
