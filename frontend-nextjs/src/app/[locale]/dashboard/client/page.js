"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Wrench, Clock, Star, ArrowRight, ClipboardList, Plus, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ClientDashboardSkeleton } from "@/components/ui/SkeletonLayouts";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export default function ClientDashboardPage() {
  const t = useTranslations("dashboard_client");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ active: 0, pending: 0, completed: 0, reviews: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ne pas faire de requête si l'auth est en cours ou si l'utilisateur n'est pas connecté
    if (authLoading || !user) {
      if (!authLoading && !user) setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await api.get("/client/requests");
        const requests = res.data || [];
        setRecentRequests(requests.slice(0, 3));
        setStats({
          active: requests.filter(r => r.statut === "en_attente" || r.statut === "acceptee").length,
          pending: requests.filter(r => r.statut === "en_attente").length,
          completed: requests.filter(r => r.statut === "terminee").length,
          reviews: requests.filter(r => r.statut === "terminee").length,
        });
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.error("Dashboard data fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading]);

  const statCards = [
    { label: t("active_requests"), value: stats.active, icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20" },
    { label: t("pending"), value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20" },
    { label: t("completed"), value: stats.completed, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
  ];
  if (loading) return <ClientDashboardSkeleton />;

  return (
    <div className="space-y-8 relative z-10 w-full h-full">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-white/5 p-8 rounded-3xl shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            {t("greeting", { name: user?.nomComplet || "Client" })}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {t("subtitle")}
          </p>
        </div>
        <Link href="/dashboard/client/interventions/new">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            {t("new_request")}
            <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
          </button>
        </Link>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-100 dark:border-white/5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ring-1 ${stat.ring}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                {loading ? "—" : stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Requests */}
      {!loading && recentRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-100 dark:border-white/5 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              {t("recent_requests")}
            </h2>
            <Link href="/dashboard/client/requests">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline cursor-pointer">
                {t("view_all")}
              </span>
            </Link>
          </div>

          <div className="space-y-3">
            {recentRequests.map((req) => {
              const statusColors = {
                en_attente: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
                acceptee: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
                terminee: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
                annulee: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
              };
              return (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 text-sm shrink-0">
                      🔧
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{req.titre}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {req.categorie?.nom} • {t("propositions", { count: req.propositions_count || 0 })}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[req.statut] || statusColors.en_attente}`}>
                    {t(`status.${req.statut}`) || req.statut}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Link href="/dashboard/client/reviews">
          <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{t("my_reviews")}</p>
              <p className="text-xs text-slate-400">{t("reviews_subtitle")}</p>
            </div>
            <ArrowRight className={cn("w-4 h-4 text-slate-300 transition-transform", isRTL ? "mr-auto group-hover:-translate-x-1 rotate-180" : "ml-auto group-hover:translate-x-1")} />
          </div>
        </Link>
        <Link href="/dashboard/client/complaints">
          <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{t("my_complaints")}</p>
              <p className="text-xs text-slate-400">{t("complaints_subtitle")}</p>
            </div>
            <ArrowRight className={cn("w-4 h-4 text-slate-300 transition-transform", isRTL ? "mr-auto group-hover:-translate-x-1 rotate-180" : "ml-auto group-hover:translate-x-1")} />
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
