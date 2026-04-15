"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Map as MapIcon,
  Search,
  X,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArtisanFilters } from "@/components/search/ArtisanFilters";
import { ArtisanCard } from "@/components/search/ArtisanCard";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/api-client";
import { cn } from "@/lib/utils";

const ArtisanMap = dynamic(
  () => import("@/components/search/ArtisanMap").then((mod) => mod.ArtisanMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-[32px]" />
    ),
  },
);

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function SkeletonCard({ view }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-slate-100 dark:border-white/6 bg-white dark:bg-slate-900",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
        "before:bg-linear-to-r before:from-transparent before:via-white/60 dark:before:via-white/5 before:to-transparent",
        view === "list" ? "h-28 flex gap-5 p-5" : "h-[380px]",
      )}
    >
      {view === "list" ? (
        <>
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-2/3" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3" />
          </div>
        </>
      ) : (
        <>
          <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-t-[28px]" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
            <div className="flex gap-2 mt-4">
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-full w-20" />
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-full w-24" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── View Toggle ─────────────────────────────────────────────────────────────
function ViewToggle({ view, setView, t }) {
  const views = [
    { id: "grid", icon: LayoutGrid, label: t("view_grid") },
    { id: "list", icon: List, label: t("view_list") },
    { id: "map", icon: MapIcon, label: t("view_map") },
  ];
  return (
    <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm">
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => setView(v.id)}
          className={cn(
            "relative flex items-center gap-2 h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200",
            view === v.id
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5",
          )}
        >
          <v.icon className="w-[14px] h-[14px] shrink-0" />
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Sort Select ──────────────────────────────────────────────────────────────
function SortSelect({ value, onChange, t }) {
  const options = [
    { value: "relevance", label: t("sort_relevance") },
    { value: "rating", label: t("sort_rating") },
    { value: "experience", label: t("sort_exp") },
    { value: "name", label: t("sort_name") },
  ];
  return (
    <div className="relative">
      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/6 rounded-xl pl-9 pr-5 text-[11px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Results Meta ─────────────────────────────────────────────────────────────
function ResultsMeta({ total, available, t }) {
  return (
    <div className="flex items-baseline gap-3">
      <h2 className="text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
        {total.toLocaleString()}
        <span className="text-slate-400 dark:text-slate-500 font-medium ml-2 text-base">
          {t("results_found", { count: "" }).replace(total, "").trim()}
        </span>
      </h2>
      {available > 0 && (
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {available} disponibles
        </span>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, last, onPage }) {
  const pages = Array.from({ length: last }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === last || Math.abs(p - current) <= 1,
  );

  const rendered = [];
  let prev = null;
  for (const p of visible) {
    if (prev && p - prev > 1) {
      rendered.push("ellipsis-" + p);
    }
    rendered.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-10">
      <button
        disabled={current === 1}
        onClick={() => onPage(current - 1)}
        className="w-10 h-10 rounded-xl border border-slate-100 dark:border-white/6 bg-white dark:bg-slate-900 text-slate-500 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {rendered.map((item) =>
        typeof item === "string" ? (
          <span
            key={item}
            className="w-10 h-10 flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm"
          >
            ···
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPage(item)}
            className={cn(
              "w-10 h-10 rounded-xl text-[12px] font-bold transition-all",
              current === item
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20"
                : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-white/6 hover:bg-slate-50 dark:hover:bg-white/5",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        disabled={current === last}
        onClick={() => onPage(current + 1)}
        className="w-10 h-10 rounded-xl border border-slate-100 dark:border-white/6 bg-white dark:bg-slate-900 text-slate-500 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onReset, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-28 text-center space-y-5"
    >
      <div className="relative">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-100 dark:border-white/6">
          <AlertCircle className="w-9 h-9 text-slate-300 dark:text-slate-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-black">!</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {t("no_results")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs">
          {t("no_results_hint")}
        </p>
      </div>
      <button
        onClick={onReset}
        className="mt-2 h-11 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl hover:opacity-80 transition-opacity"
      >
        {t("reset_filters")}
      </button>
    </motion.div>
  );
}

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────
function MobileFilterDrawer({ open, onClose, children, t }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[100] w-[340px] max-w-[95vw] bg-white dark:bg-slate-950 shadow-2xl lg:hidden flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-white dark:text-slate-900" />
                </div>
                <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  {t("filters_title")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {/* Drawer Footer */}
            <div className="px-6 py-5 border-t border-slate-100 dark:border-white/6">
              <button
                onClick={onClose}
                className="w-full h-13 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity"
              >
                Appliquer les filtres
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sidebar Shell ────────────────────────────────────────────────────────────
function SidebarShell({ children }) {
  return (
    <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0">
      <div className="sticky top-6">
        <div className="rounded-[24px] border border-slate-100 dark:border-white/6 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/6 flex items-center gap-3">
            <div className="w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white dark:text-slate-900" />
            </div>
            <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
              Filtres
            </span>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </aside>
  );
}

// ─── Main SearchLayout ────────────────────────────────────────────────────────
export function SearchLayout() {
  const t = useTranslations("search");
  const locale = useLocale();

  const [view, setView] = React.useState("grid");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState({
    data: [],
    total: 0,
    current_page: 1,
    last_page: 1,
  });
  const [categories, setCategories] = React.useState([]);
  const [wilayas, setWilayas] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filters, setFilters] = React.useState({
    categories: [],
    wilaya_id: null,
    min_rating: 0,
    experience: null,
    available_only: false,
    lat: null,
    lng: null,
    sort: "relevance",
    geoError: false,
  });

  React.useEffect(() => {
    fetchStaticData();
  }, []);

  React.useEffect(() => {
    fetchArtisans(1);
  }, [debouncedSearch, filters]);

  const fetchStaticData = async () => {
    try {
      const [catRes, wilRes] = await Promise.all([
        api.get("/categories"),
        api.get("/wilayas"),
      ]);
      setCategories(catRes.data);
      setWilayas(wilRes.data);
    } catch (err) {
      console.error("Static data fetch failed", err);
    }
  };

  const fetchArtisans = async (page = 1) => {
    setLoading(true);
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
        page,
      };
      const res = await api.get("/artisans", { params });
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeoActivate = () => {
    if (!navigator.geolocation) {
      setFilters((f) => ({ ...f, geoError: true }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setFilters((f) => ({
          ...f,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          geoError: false,
        })),
      () => setFilters((f) => ({ ...f, geoError: true })),
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({
      categories: [],
      wilaya_id: null,
      min_rating: 0,
      experience: null,
      available_only: false,
      lat: null,
      lng: null,
      sort: "relevance",
      geoError: false,
    });
  };

  const available = results.data.filter(
    (a) => a.disponibilite === "disponible",
  ).length;

  const filterProps = {
    filters,
    setFilters,
    categories,
    wilayas,
    onReset: handleReset,
    onGeoActivate: handleGeoActivate,
  };

  return (
    <>
      {/* Global shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 py-8 min-h-screen">
        {/* ── Top Search Bar ─────────────────────────────────────────── */}
        <div className="mb-8">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h1 className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Trouver un artisan
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("placeholder")}
                className={cn(
                  "w-full h-14 pl-14 pr-12 rounded-2xl bg-white dark:bg-slate-900",
                  "border-2 border-slate-100 dark:border-white/6",
                  "text-slate-900 dark:text-white placeholder:text-slate-400 text-[15px] font-semibold",
                  "shadow-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
                  "transition-all duration-200",
                )}
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* View Toggle + Mobile Filter */}
            <div className="flex items-center gap-2.5 shrink-0">
              <ViewToggle view={view} setView={setView} t={t} />
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm"
              >
                <FilterIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="flex gap-7 xl:gap-9">
          {/* Sidebar */}
          <SidebarShell>
            <ArtisanFilters {...filterProps} />
          </SidebarShell>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Results Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <ResultsMeta total={results.total} available={available} t={t} />

              <div className="flex items-center gap-2.5">
                <SortSelect
                  value={filters.sort}
                  onChange={(val) => setFilters((f) => ({ ...f, sort: val }))}
                  t={t}
                />
              </div>
            </div>

            {/* ─ Content Area ─ */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    view === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                      : "space-y-3",
                  )}
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} view={view} />
                  ))}
                </motion.div>
              ) : results.data.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState onReset={handleReset} t={t} />
                </motion.div>
              ) : view === "map" ? (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[72vh] rounded-[28px] overflow-hidden border border-slate-100 dark:border-white/6 shadow-sm"
                >
                  <ArtisanMap
                    artisans={results.data}
                    userCoords={
                      filters.lat
                        ? { lat: filters.lat, lng: filters.lng }
                        : null
                    }
                  />
                </motion.div>
              ) : view === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {results.data.map((artisan, i) => (
                    <motion.div
                      key={artisan.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <ArtisanCard artisan={artisan} view="grid" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {results.data.map((artisan, i) => (
                    <motion.div
                      key={artisan.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25 }}
                    >
                      <ArtisanCard artisan={artisan} view="list" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {results.last_page > 1 && !loading && view !== "map" && (
              <Pagination
                current={results.current_page}
                last={results.last_page}
                onPage={fetchArtisans}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        t={t}
      >
        <ArtisanFilters {...filterProps} />
      </MobileFilterDrawer>
    </>
  );
}
