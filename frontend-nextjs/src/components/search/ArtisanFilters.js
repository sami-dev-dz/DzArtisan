"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { 
  MapPin, 
  Search, 
  ChevronDown, 
  Filter, 
  RotateCcw, 
  Star, 
  Briefcase, 
  Zap,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export function ArtisanFilters({ 
  filters, 
  setFilters, 
  categories, 
  wilayas, 
  onReset,
  onGeoActivate 
}) {
  const t = useTranslations("search")
  const common = useTranslations("common")

  const [wilayaSearch, setWilayaSearch] = React.useState("")
  const [isWilayaOpen, setIsWilayaOpen] = React.useState(false)

  const filteredWilayas = wilayas.filter(w => 
    w.nom.toLowerCase().includes(wilayaSearch.toLowerCase())
  )

  const toggleCategory = (id) => {
    const nextCategories = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id]
    setFilters({ ...filters, categories: nextCategories })
  }

  const expLevels = [
    { id: 'all', label: 'common.all' },
    { id: 'beginner', label: 'onboarding.exp_beginner' },
    { id: '1-3', label: 'onboarding.exp_1_3' },
    { id: '3-5', label: 'onboarding.exp_3_5' },
    { id: '5-10', label: 'onboarding.exp_5_10' },
    { id: '10+', label: 'onboarding.exp_10_plus' }
  ]

  const ratingOptions = [5, 4, 3, 0]

  return (
    <div className="space-y-8 pb-10">
      
      {/* Geolocation */}
      <div>
        <Button 
          onClick={onGeoActivate}
          variant={filters.lat ? "success" : "outline"}
          className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm transition-all active:scale-95"
        >
          <MapPin className={cn("w-4 h-4", filters.lat && "animate-pulse")} />
          {t("geo_btn")}
        </Button>
        {filters.geoError && (
          <p className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-xl">
            {t("geo_denied")}
          </p>
        )}
      </div>

      <hr className="border-slate-100 dark:border-white/5" />

      {/* Wilaya Filter */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          {t("wilaya_label")}
        </label>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsWilayaOpen(!isWilayaOpen)}
            className="w-full h-12 rounded-2xl justify-between px-4 font-bold text-xs bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5"
          >
            {filters.wilaya_id 
              ? wilayas.find(w => w.id === filters.wilaya_id)?.nom 
              : common("all")}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>

          {isWilayaOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-2 border-b border-slate-50 dark:border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    autoFocus
                    placeholder="Alger, Oran..."
                    className="w-full h-10 bg-slate-50 dark:bg-slate-950 rounded-xl pl-9 pr-4 text-xs font-bold focus:outline-none"
                    value={wilayaSearch}
                    onChange={(e) => setWilayaSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                <button
                  onClick={() => { setFilters({ ...filters, wilaya_id: null }); setIsWilayaOpen(false); }}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-xs font-black uppercase tracking-tight"
                >
                  {common("all")}
                </button>
                {filteredWilayas.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => { setFilters({ ...filters, wilaya_id: w.id }); setIsWilayaOpen(false); }}
                    className={cn(
                      "w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-xs font-bold flex items-center justify-between",
                      filters.wilaya_id === w.id && "text-blue-600 bg-blue-50 dark:bg-blue-600/10"
                    )}
                  >
                    {w.nom}
                    {filters.wilaya_id === w.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          {t("categories_label")}
        </label>
        <div className="space-y-1">
          {categories.slice(0, 8).map((cat) => (
            <label 
              key={cat.id} 
              className={cn(
                "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border border-transparent",
                filters.categories.includes(cat.id) 
                  ? "bg-blue-50 dark:bg-blue-600/10 border-blue-100 dark:border-blue-600/20 text-blue-600" 
                  : "hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                 <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={filters.categories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                 />
                 <div className={cn(
                    "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                    filters.categories.includes(cat.id) ? "bg-blue-600 border-blue-600" : "border-slate-200 dark:border-white/10"
                 )}>
                    {filters.categories.includes(cat.id) && <Check className="w-3 h-3 text-white stroke-3" />}
                 </div>
                 <span className="text-xs font-black uppercase tracking-tight">{cat.nom}</span>
              </div>
              <Badge variant="outline" className="bg-white dark:bg-slate-900 border-slate-100 dark:border-white/10 text-[10px] font-bold opacity-60">
                 {cat.artisans_count || 0}
              </Badge>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          {t("rating_label")}
        </label>
        <div className="flex flex-wrap gap-2">
           {ratingOptions.map((rating) => (
              <button
                key={rating}
                onClick={() => setFilters({ ...filters, min_rating: rating })}
                className={cn(
                  "flex-1 min-w-[70px] h-10 rounded-2xl border flex items-center justify-center gap-1.5 transition-all",
                  filters.min_rating === rating 
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" 
                    : "bg-white dark:bg-slate-950 border-slate-100 dark:border-white/5 hover:border-amber-400"
                )}
              >
                 <span className="text-xs font-black">{rating === 0 ? "All" : rating}</span>
                 {rating > 0 && <Star className={cn("w-3 h-3", filters.min_rating === rating ? "fill-white" : "fill-amber-400 text-amber-400")} />}
              </button>
           ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          {t("exp_label")}
        </label>
        <div className="grid grid-cols-2 gap-2">
           {expLevels.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setFilters({ ...filters, experience: exp.id === 'all' ? null : exp.id })}
                className={cn(
                  "h-10 rounded-2xl border text-[10px] font-black uppercase tracking-tighter px-2 transition-all",
                  (filters.experience === exp.id || (exp.id === 'all' && !filters.experience))
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl" 
                    : "bg-white dark:bg-slate-950 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                 {exp.id === 'all' ? common("all") : exp.id}
              </button>
           ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-white/5" />

      {/* Availability Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-[30px] border border-slate-100 dark:border-white/10 group cursor-pointer" onClick={() => setFilters({ ...filters, available_only: !filters.available_only })}>
        <div className="space-y-0.5">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{t("availability_label")}</span>
           <p className="text-[10px] font-bold text-slate-500 opacity-70 group-hover:opacity-100 transition-opacity">Show only available</p>
        </div>
        <div className={cn(
           "w-12 h-6 rounded-full p-1 transition-colors duration-500",
           filters.available_only ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
        )}>
           <div className={cn(
              "w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-500",
              filters.available_only ? "translate-x-6" : "translate-x-0"
           )} />
        </div>
      </div>

      {/* Reset */}
      <Button 
        onClick={onReset}
        variant="ghost"
        className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        {t("reset_filters")}
      </Button>

    </div>
  )
}
