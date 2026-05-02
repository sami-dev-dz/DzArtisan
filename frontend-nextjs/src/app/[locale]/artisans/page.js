"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutGrid, 
  List, 
  Map as MapIcon, 
  Search, 
  X, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Zap,
  AlertCircle
} from "lucide-react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArtisanFilters } from "@/components/search/ArtisanFilters"
import { ArtisanCard } from "@/components/search/ArtisanCard"
import { useDebounce } from "@/hooks/useDebounce"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

const ArtisanMap = dynamic(
  () => import('@/components/search/ArtisanMap').then(mod => mod.ArtisanMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[40px]" /> }
)

const VIEWS = [
  { id: 'grid', icon: LayoutGrid },
  { id: 'list', icon: List },
  { id: 'map', icon: MapIcon },
]

export default function SearchPage() {
  const t = useTranslations("search")
  const common = useTranslations("common")
  const locale = useLocale()
  
  const [view, setView] = React.useState("grid")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [results, setResults] = React.useState({ data: [], total: 0, current_page: 1, last_page: 1 })
  const [categories, setCategories] = React.useState([])
  const [wilayas, setWilayas] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 350)
  const [filters, setFilters] = React.useState({
    categories: [],
    wilaya_id: null,
    min_rating: 0,
    experience: null,
    available_only: false,
    lat: null,
    lng: null,
    sort: "relevance",
    geoError: false
  })

  React.useEffect(() => { fetchStaticData() }, [])
  React.useEffect(() => { fetchArtisans(1) }, [debouncedSearch, filters])

  const fetchStaticData = async () => {
    try {
      const [catRes, wilRes] = await Promise.all([api.get("/categories"), api.get("/wilayas")])
      setCategories(catRes.data)
      setWilayas(wilRes.data)
    } catch (err) { console.error("Static data fetch failed", err) }
  }

  const fetchArtisans = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get("/artisans", { params: {
        q: debouncedSearch,
        categories: filters.categories,
        wilaya_id: filters.wilaya_id,
        min_rating: filters.min_rating,
        experience: filters.experience,
        available_only: filters.available_only ? 1 : 0,
        lat: filters.lat,
        lng: filters.lng,
        sort: filters.sort,
        page
      }})
      setResults(res.data)
    } catch (err) { console.error("Search failed", err) }
    finally { setLoading(false) }
  }

  const handleGeoActivate = () => {
    if (!navigator.geolocation) { setFilters({ ...filters, geoError: true }); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => setFilters({ ...filters, lat: pos.coords.latitude, lng: pos.coords.longitude, geoError: false }),
      () => setFilters({ ...filters, geoError: true })
    )
  }

  const handleReset = () => {
    setSearchTerm("")
    setFilters({ categories: [], wilaya_id: null, min_rating: 0, experience: null, available_only: false, lat: null, lng: null, sort: "relevance", geoError: false })
  }

  const availableCount = results.data.filter(a => a.disponibilite === 'disponible').length
  const activeFilterCount = [
    filters.categories.length > 0,
    filters.wilaya_id !== null,
    filters.min_rating > 0,
    filters.experience !== null,
    filters.available_only,
    filters.lat !== null
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      
      {/* ── Hero Search Header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
        {/* Ambient glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-14">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
                DzArtisan — Trouver un Expert
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Trouvez l&apos;Artisan{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Parfait
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-3 max-w-lg mx-auto">
              Des milliers d&apos;artisans vérifiés à votre service partout en Algérie.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative flex items-center gap-3">
              <div className="relative flex-1 group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Search className="w-full h-full" />
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("placeholder")}
                  className="w-full h-16 pl-14 pr-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200/70 dark:border-white/8 font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all text-base shadow-sm focus:shadow-blue-500/10 focus:shadow-xl"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 hover:bg-red-100 hover:text-red-500 text-slate-400 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 gap-1">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      view === v.id
                        ? "bg-white dark:bg-slate-700 text-blue-600 shadow-md"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    )}
                  >
                    <v.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden relative w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 shrink-0"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex items-center justify-center gap-6 mt-5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                <Users className="w-4 h-4 text-blue-600" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-black">{results.total}</strong> artisans
                </span>
              </div>
              <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  <strong className="text-emerald-600 font-black">{availableCount}</strong> disponibles
                </span>
              </div>
              {activeFilterCount > 0 && (
                <>
                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-sm font-black text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex gap-8">

        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
          <div className="sticky top-6">
            <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
              {/* Sidebar Header */}
              <div className="px-6 py-5 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {t("filters_title")}
                  </span>
                </div>
                {activeFilterCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="p-5">
                <ArtisanFilters
                  filters={filters}
                  setFilters={setFilters}
                  categories={categories}
                  wilayas={wilayas}
                  onReset={handleReset}
                  onGeoActivate={handleGeoActivate}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile view toggle */}
              <div className="flex md:hidden items-center bg-white dark:bg-slate-900 rounded-xl p-1 gap-1 border border-slate-100 dark:border-white/5">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                      view === v.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <v.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 hidden sm:block">
                Trier par
              </span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="h-10 min-w-[160px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 text-[11px] font-black uppercase tracking-wide outline-none focus:border-blue-500 text-slate-700 dark:text-white shadow-sm cursor-pointer"
              >
                <option value="relevance">{t("sort_relevance")}</option>
                <option value="rating">{t("sort_rating")}</option>
                <option value="experience">{t("sort_exp")}</option>
                <option value="name">{t("sort_name")}</option>
              </select>
            </div>
          </div>

          {/* Grid / List / Map */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "gap-5",
                  view === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid grid-cols-1"
                )}
              >
                {[...Array(view === 'grid' ? 6 : 4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 animate-pulse",
                      view === 'grid' ? "h-[380px]" : "h-[120px]"
                    )}
                  />
                ))}
              </motion.div>
            ) : results.data.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-28 text-center space-y-6"
              >
                <div className="w-32 h-32 rounded-[40px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-6xl shadow-inner">
                  🔍
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t("no_results")}</h3>
                  <p className="text-sm font-semibold text-slate-400 max-w-sm">{t("no_results_hint")}</p>
                </div>
                <Button
                  onClick={handleReset}
                  className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest px-8 shadow-xl shadow-blue-600/25"
                >
                  {t("reset_filters")}
                </Button>
              </motion.div>
            ) : view === 'map' ? (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[75vh] rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl"
              >
                <ArtisanMap artisans={results.data} userCoords={filters.lat ? { lat: filters.lat, lng: filters.lng } : null} />
              </motion.div>
            ) : (
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "gap-5",
                  view === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid grid-cols-1"
                )}
              >
                {results.data.map((artisan, i) => (
                  <motion.div
                    key={artisan.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <ArtisanCard artisan={artisan} view={view} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {results.last_page > 1 && !loading && view !== 'map' && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={results.current_page === 1}
                onClick={() => fetchArtisans(results.current_page - 1)}
                className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(results.last_page)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchArtisans(i + 1)}
                  className={cn(
                    "w-11 h-11 rounded-2xl text-xs font-black transition-all",
                    results.current_page === i + 1
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                      : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-400 hover:border-blue-300 hover:text-blue-600 shadow-sm"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={results.current_page === results.last_page}
                onClick={() => fetchArtisans(results.current_page + 1)}
                className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile Filter Drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[320px] bg-white dark:bg-slate-900 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">
                    {t("filters_title")}
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <ArtisanFilters
                  filters={filters}
                  setFilters={setFilters}
                  categories={categories}
                  wilayas={wilayas}
                  onReset={handleReset}
                  onGeoActivate={handleGeoActivate}
                />
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-white/5">
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-600/30"
                >
                  Voir {results.total} résultat{results.total !== 1 ? 's' : ''}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
