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
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Briefcase,
  AlertCircle
} from "lucide-react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { ArtisanFilters } from "@/components/search/ArtisanFilters"
import { ArtisanCard } from "@/components/search/ArtisanCard"
import { useDebounce } from "@/hooks/useDebounce"
import api from "@/lib/api-client"
import { cn } from "@/lib/utils"

// Client-side only components
const ArtisanMap = dynamic(
  () => import('@/components/search/ArtisanMap').then(mod => mod.ArtisanMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-[40px]" /> }
)

export default function SearchPage() {
  const t = useTranslations("search")
  const common = useTranslations("common")
  const locale = useLocale()
  
  // State
  const [view, setView] = React.useState("grid") // grid | list | map
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false) // For mobile
  const [loading, setLoading] = React.useState(true)
  const [results, setResults] = React.useState({ data: [], total: 0, current_page: 1, last_page: 1 })
  const [categories, setCategories] = React.useState([])
  const [wilayas, setWilayas] = React.useState([])

  // Filters State
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)
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

  // Effects
  React.useEffect(() => {
    fetchStaticData()
  }, [])

  React.useEffect(() => {
    fetchArtisans(1)
  }, [debouncedSearch, filters])

  const fetchStaticData = async () => {
    try {
      const [catRes, wilRes] = await Promise.all([
        api.get("/categories"),
        api.get("/wilayas")
      ])
      setCategories(catRes.data)
      setWilayas(wilRes.data)
    } catch (err) {
      console.error("Static data fetch failed", err)
    }
  }

  const fetchArtisans = async (page = 1) => {
    setLoading(true)
    try {
      const params = {
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
      }
      const res = await api.get("/artisans", { params })
      setResults(res.data)
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGeoActivate = () => {
    if (!navigator.geolocation) {
       setFilters({ ...filters, geoError: true })
       return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFilters({ 
          ...filters, 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude,
          geoError: false 
        })
      },
      () => setFilters({ ...filters, geoError: true })
    )
  }

  const handleReset = () => {
    setSearchTerm("")
    setFilters({
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
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 min-h-screen">
      
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-center mb-10">
         <div className="w-full lg:flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("placeholder")}
              className="h-16 pl-16 pr-14 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-bold shadow-xl shadow-slate-100/30 dark:shadow-none focus:border-blue-500 transition-all text-lg"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
         </div>

         <div className="flex p-2 bg-white dark:bg-slate-900 rounded-[30px] border-2 border-slate-100 dark:border-white/5 shadow-lg shrink-0 w-full lg:w-auto">
            {[
              { id: 'grid', icon: LayoutGrid, label: t("view_grid") },
              { id: 'list', icon: List, label: t("view_list") },
              { id: 'map', icon: MapIcon, label: t("view_map") }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  "flex-1 md:flex-none h-12 px-6 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all",
                  view === v.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" : "text-slate-400 opacity-60 hover:opacity-100"
                )}
              >
                <v.icon className="w-4 h-4" />
                <span className="hidden md:inline">{v.label}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-80 shrink-0">
           <ArtisanFilters 
             filters={filters}
             setFilters={setFilters}
             categories={categories}
             wilayas={wilayas}
             onReset={handleReset}
             onGeoActivate={handleGeoActivate}
           />
        </aside>

        {/* Results Area */}
        <main className="flex-1 space-y-8">
           
           {/* Results Meta */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                   {t("results_found", { count: results.total })}
                 </h2>
                 <p className="text-xs font-bold text-slate-500 opacity-80 italic">
                    {t("currently_available", { count: results.data.filter(a => a.disponibilite === 'disponible').length })}
                 </p>
              </div>

              <div className="flex items-center gap-3">
                 <select 
                   value={filters.sort}
                   onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                   className="h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500"
                 >
                    <option value="relevance">{t("sort_relevance")}</option>
                    <option value="rating">{t("sort_rating")}</option>
                    <option value="experience">{t("sort_exp")}</option>
                    <option value="name">{t("sort_name")}</option>
                 </select>
                 
                 <Button 
                   onClick={() => setIsSidebarOpen(true)}
                   variant="outline" 
                   className="lg:hidden h-10 rounded-xl px-3 border-slate-100 dark:border-white/5"
                 >
                    <FilterIcon className="w-4 h-4" />
                 </Button>
              </div>
           </div>

           {/* Mobile Filter Drawer Placeholder logic (using a Simple Panel for now) */}
           <AnimatePresence>
             {isSidebarOpen && (
               <motion.div 
                 initial={{ opacity: 0, x: 300 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 300 }}
                 className="fixed inset-0 z-[100] lg:hidden bg-white dark:bg-slate-950 p-6 overflow-y-auto"
               >
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black uppercase">{t("filters_title")}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                       <X className="w-6 h-6" />
                    </Button>
                 </div>
                 <ArtisanFilters 
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    wilayas={wilayas}
                    onReset={handleReset}
                    onGeoActivate={handleGeoActivate}
                 />
                 <Button className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest" onClick={() => setIsSidebarOpen(false)}>
                    Appliquer
                 </Button>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Views Container */}
           <div className="relative min-h-[600px]">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="h-[400px] bg-slate-50 dark:bg-slate-900 animate-pulse rounded-[40px] border border-slate-100 dark:border-white/5" />
                   ))}
                </div>
              ) : results.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                   <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300">
                      <AlertCircle className="w-12 h-12" />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">{t("no_results")}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">{t("no_results_hint")}</p>
                   </div>
                   <Button onClick={handleReset} className="rounded-full px-8 bg-blue-600 font-black uppercase text-[10px] tracking-widest h-12">
                      {t("reset_filters")}
                   </Button>
                </div>
              ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {results.data.map(artisan => (
                     <ArtisanCard key={artisan.id} artisan={artisan} view="grid" />
                   ))}
                </div>
              ) : view === 'list' ? (
                <div className="space-y-4">
                   {results.data.map(artisan => (
                     <ArtisanCard key={artisan.id} artisan={artisan} view="list" />
                   ))}
                </div>
              ) : (
                <div className="h-[70vh] sticky top-20">
                   <ArtisanMap artisans={results.data} userCoords={filters.lat ? { lat: filters.lat, lng: filters.lng } : null} />
                </div>
              )}
           </div>

           {/* Pagination */}
           {results.last_page > 1 && !loading && view !== 'map' && (
              <div className="flex items-center justify-center gap-4 py-10">
                 <Button 
                   disabled={results.current_page === 1}
                   onClick={() => fetchArtisans(results.current_page - 1)}
                   variant="outline"
                   className="h-12 w-12 rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900"
                 >
                    <ChevronLeft className="w-5 h-5" />
                 </Button>
                 
                 <div className="flex gap-2">
                    {[...Array(results.last_page)].map((_, i) => (
                       <button
                         key={i}
                         onClick={() => fetchArtisans(i + 1)}
                         className={cn(
                           "w-12 h-12 rounded-2xl text-xs font-black transition-all",
                           results.current_page === i + 1 
                             ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                             : "bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                         )}
                       >
                          {i + 1}
                       </button>
                    ))}
                 </div>

                 <Button 
                   disabled={results.current_page === results.last_page}
                   onClick={() => fetchArtisans(results.current_page + 1)}
                   variant="outline"
                   className="h-12 w-12 rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900"
                 >
                    <ChevronRight className="w-5 h-5" />
                 </Button>
              </div>
           )}

        </main>
      </div>
    </div>
  )
}
