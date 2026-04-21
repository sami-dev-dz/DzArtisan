'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Map as MapIcon, 
  TrendingUp, 
  Users, 
  Download, 
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import axios from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { WilayaActivityMap } from './WilayaActivityMap';
import { StatsCharts } from './StatsCharts';
import { DashboardAdminSkeleton } from "@/components/ui/SkeletonLayouts"

export const AdminStatistics = () => {
  const t = useTranslations('admin.statistics');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [rankingPage, setRankingPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/stats/overview');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRankings = useCallback(async (page = 1) => {
    try {
      const res = await axios.get(`/admin/stats/rankings?page=${page}`);
      setRankings(res.data.data);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRankings();
  }, [fetchStats, fetchRankings]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await axios.get('/admin/stats/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dzartisan_stats_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading || !stats) {
    return <DashboardAdminSkeleton />;
  }

  return (
    <div className="space-y-8 min-h-screen bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats}
            className="p-2.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all font-bold"
          >
            {exporting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            <span>{t('ranking.export_btn')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title={t('charts.view_to_contact')}
          value={`${stats.conversion_metrics.view_to_contact}%`}
          icon={<Zap className="w-6 h-6 text-primary-500" />}
          trend="+2.4%"
          trendUp={true}
          color="blue"
        />
        <KPICard 
          title={t('charts.request_to_response')}
          value={`${stats.conversion_metrics.request_to_response}%`}
          icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
          trend="-0.8%"
          trendUp={false}
          color="emerald"
        />
        <KPICard 
          title={t('ranking.views')}
          value={stats.wilaya_activity.reduce((acc, curr) => acc + curr.artisans_count, 0)}
          icon={<Users className="w-6 h-6 text-amber-500" />}
          trend="+12%"
          trendUp={true}
          color="amber"
        />
        <KPICard 
          title={t('ranking.requests_responded')}
          value={stats.wilaya_activity.reduce((acc, curr) => acc + curr.requests_count, 0)}
          icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
          trend="+5.2%"
          trendUp={true}
          color="purple"
        />
      </div>

      {/* Map Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
          <MapIcon className="w-6 h-6 text-primary-500" />
          {t('map_title')}
        </h2>
        <WilayaActivityMap data={stats.wilaya_activity} />
      </section>

      {/* Charts Section */}
      <StatsCharts 
        topWilayas={stats.top_wilayas} 
        categoryDistribution={stats.category_distribution}
        satisfactionTrends={stats.satisfaction_trends}
      />

      {/* Rankings Table */}
      <section className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#141414]">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {t('ranking.title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t('ranking.subtitle')}
            </p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('ranking.artisan')}</th>
                <th className="px-6 py-4 text-center">{t('ranking.category')}</th>
                <th className="px-6 py-4 text-center">{t('ranking.views')}</th>
                <th className="px-6 py-4 text-center">{t('ranking.contacts')}</th>
                <th className="px-6 py-4 text-center font-bold text-primary-600">{t('ranking.conv_rate')}</th>
                <th className="px-6 py-4 text-center">{t('ranking.response_time')}</th>
                <th className="px-6 py-4 text-center">{t('ranking.requests_responded')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              <AnimatePresence mode="popLayout">
                {rankings.map((artisan, idx) => (
                  <motion.tr 
                    key={artisan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[14px] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-black border border-blue-100 dark:border-blue-800/50">
                          {artisan.user?.nomComplet ? String(artisan.user.nomComplet).charAt(0) : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {artisan.user?.nomComplet}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">ID: {artisan.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-[#141414] rounded-full text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                        {artisan.primaryCategorie?.nom || artisan.primary_categorie?.nom || 'Inconnu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700 dark:text-gray-300">
                      {artisan.profile_views_count}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700 dark:text-gray-300">
                      {artisan.contacts_count}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-primary-600 dark:text-primary-400">
                          {artisan.profile_views_count > 0 
                            ? ((artisan.contacts_count / artisan.profile_views_count) * 100).toFixed(1) 
                            : '0'}%
                        </span>
                        <div className="w-16 h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500" 
                            style={{ width: `${Math.min(100, (artisan.contacts_count / (artisan.profile_views_count || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <span className="font-mono">{artisan.avg_response_time_minutes.toFixed(1)}</span>
                        <span className="text-xs text-gray-500 underline decoration-dotted">min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-amber-600">
                      {artisan.requests_responded_count}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const KPICard = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity rounded-bl-full`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trendUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'}`}>
        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

export default AdminStatistics;
