'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import api from '@/lib/api-client';
import { InterventionCard } from './InterventionCard';
import { InterventionDetail } from './InterventionDetail';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Loader2, 
  Briefcase,
  CheckCircle2,
  Calendar,
  History,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

export const MyInterventions = () => {
  const t = useTranslations('artisan.interventions');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active, history
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection for detail view
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/artisan/interventions', {
        params: { status: activeTab }
      });
      setInterventions(res.data);
    } catch (err) {
      console.error('Error fetching interventions:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.post(`/artisan/interventions/${id}/progress`, { statut: newStatus });
      fetchData();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handlePhotoUpdate = (data) => {
     // Local update if needed, but easier to just refresh if in detail
     // For now, let's update the selectedIntervention state
     if (data.deleted) {
        setSelectedIntervention(prev => ({
          ...prev,
          photos: prev.photos.filter(p => p.id !== data.id)
        }));
     } else {
        setSelectedIntervention(prev => ({
          ...prev,
          photos: [...(prev.photos || []), data]
        }));
     }
     // Also refresh main list to sync
     fetchData();
  };

  const handleViewDetails = (item) => {
    setSelectedIntervention(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="relative p-4 md:p-8 space-y-8 min-h-screen bg-slate-50/20 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Premium Ambient Background ────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-linear-to-b from-indigo-600/5 to-transparent dark:from-indigo-600/10 pointer-events-none rounded-t-[3rem] -z-10" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary-500" />
            {t('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-500" />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Actives</p>
                <p className="text-sm font-black text-gray-900 dark:text-white leading-none">
                  {interventions.filter(i => i.statut !== 'terminee').length}
                </p>
             </div>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
             </div>
             <div>
                <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest leading-none mb-1">Terminées</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 leading-none">
                  {interventions.filter(i => i.statut === 'terminee').length}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          {(['active', 'history']).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-2",
                activeTab === tab 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {tab === 'active' ? <LayoutGrid className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un client, un titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 rounded-2xl text-sm text-gray-900 dark:text-white transition-all shadow-sm outline-none font-bold placeholder:font-medium"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-4xl border border-gray-50 dark:border-gray-800 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {interventions.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {interventions
                  .filter(item => 
                    item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.client?.user?.nomComplet?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <InterventionCard 
                        intervention={item}
                        onUpdateStatus={handleUpdateStatus}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  {activeTab === 'active' ? (
                    <Briefcase className="w-12 h-12 text-blue-200" />
                  ) : (
                    <History className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3 px-6">
                   {activeTab === 'active' ? t('empty.no_active') : t('empty.no_history')}
                </h3>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Detail View */}
      <InterventionDetail 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        intervention={selectedIntervention}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </div>
  );
};
