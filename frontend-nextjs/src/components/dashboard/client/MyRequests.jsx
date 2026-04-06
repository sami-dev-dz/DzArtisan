'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from '@/lib/axios';
import { RequestCard } from './RequestCard';
import { RequestDetail } from './RequestDetail';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Filter, Search, Loader2, PlusCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export const MyRequests = () => {
  const t = useTranslations('client.requests');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active, archived, all
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/client/requests', {
        params: { status: activeTab }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchRequestDetail = async (id) => {
    try {
      const res = await axios.get(`/api/client/requests/${id}`);
      setSelectedRequest(res.data);
    } catch (err) {
      console.error('Error fetching request detail:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter(r => 
    r.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.categorie?.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedRequest) {
    return (
      <RequestDetail 
        request={selectedRequest} 
        onBack={() => setSelectedRequest(null)}
        onUpdate={() => {
          fetchRequests();
          fetchRequestDetail(selectedRequest.id);
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-slate-50/30 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary-500" />
            {t('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <Link href="/requests/new">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-lg shadow-primary-500/20 transition-all font-bold group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Nouveau projet</span>
          </button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center">
        {/* Tabs */}
        <div className="flex p-1.5 bg-gray-50 dark:bg-slate-800 rounded-2xl w-full md:w-auto overflow-x-auto whitespace-nowrap">
          {['active', 'archived', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === tab 
                  ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par titre ou métier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-0 ring-1 ring-gray-100 dark:ring-gray-800 focus:ring-2 focus:ring-primary-500 rounded-2xl text-sm text-gray-900 dark:text-white transition-all outline-none"
          />
        </div>
      </div>

      {/* Status Legend or Stats (Optional visual) */}
      
      {/* Content Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : filteredRequests.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((request) => (
                <motion.div 
                  key={request.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <RequestCard 
                    request={request} 
                    onClick={() => fetchRequestDetail(request.id)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200 dark:border-slate-800">
              <ClipboardList className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold max-w-xs mx-auto">
              {t('card.no_requests')}
            </p>
            <Link href="/requests/new">
              <span className="text-primary-600 font-black text-sm uppercase tracking-widest hover:underline cursor-pointer">
                Publier ma première demande
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
