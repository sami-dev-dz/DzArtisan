'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import api from '@/lib/api-client';
import { OpportunityCard } from './OpportunityCard';
import { ProposalModal } from './ProposalModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Map as MapIcon,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

export const JobOpportunities = () => {
  const t = useTranslations('artisan.jobs');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [opportunities, setOpportunities] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new'); // new, applied
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection for modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'new') {
        const res = await api.get('/artisan/jobs');
        setOpportunities(res.data.data || res.data);
      } else {
        const res = await api.get('/artisan/jobs/applied');
        setProposals(res.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="relative p-4 md:p-8 space-y-8 min-h-screen bg-slate-50/30 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Premium Ambient Background ────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-linear-to-b from-indigo-600/5 to-transparent dark:from-indigo-600/10 pointer-events-none rounded-t-[3rem] -z-10" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-500" />
            {t('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Stats Summary Tooltip-like cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Nouveaux leads : +5
            </span>
          </div>
          <button className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm relative">
             <Bell className="w-5 h-5 text-gray-500" />
             <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto whitespace-nowrap">
          {['new', 'applied'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-widest",
                activeTab === tab 
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par titre, catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 rounded-2xl text-sm text-gray-900 dark:text-white transition-all shadow-sm outline-none font-medium"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {(activeTab === 'new' ? opportunities : proposals).length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {(activeTab === 'new' ? opportunities : proposals)
                  .filter(item => {
                    const data = activeTab === 'new' ? item : item.demande;
                    return data.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           data.categorie?.nom.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <OpportunityCard 
                        job={activeTab === 'new' ? item : null}
                        appliedProposal={activeTab === 'applied' ? item : null}
                        onApply={handleApplyClick}
                        onViewDetails={(job) => console.log('View details', job)}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapIcon className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3">
                   {activeTab === 'new' ? "En attente de nouvelles offres" : "Aucun dossier en cours"}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 px-8">
                  {activeTab === 'new' ? t('empty.no_jobs') : t('empty.no_applied')}
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Proposal Modal */}
      <ProposalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
        onApplySuccess={() => {
            fetchData();
            setActiveTab('applied');
        }}
      />
    </div>
  );
};

export default JobOpportunities;
