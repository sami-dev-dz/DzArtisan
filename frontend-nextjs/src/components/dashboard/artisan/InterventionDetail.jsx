'use client';

import React, { useState } from 'react';
import { 
  X, Phone, MessageSquare, MapPin, 
  Trash2, Plus, CheckCircle2, ShieldCheck, 
  Map as MapIcon, Image as ImageIcon,
  Loader2, Download,
  Trash
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const InterventionDetail = ({ isOpen, onClose, intervention, onPhotoUpdate }) => {
  const t = useTranslations('artisan.interventions');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);

    try {
      setUploading(true);
      const res = await api.post(`/artisan/interventions/${intervention.id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onPhotoUpdate(res.data);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      setDeleting(photoId);
      await api.delete(`/artisan/interventions/${intervention.id}/photo/${photoId}`);
      onPhotoUpdate({ id: photoId, deleted: true });
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownloadQuote = async () => {
    try {
      const response = await api.get(`/interventions/${intervention.id}/quote`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `devis-INT${intervention.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erreur lors du téléchargement du devis", err);
    }
  };

  if (!isOpen) return null;

  const photosBefore = intervention.photos?.filter(p => p.type === 'avant') || [];
  const photosAfter = intervention.photos?.filter(p => p.type === 'apres') || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-110 flex items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full h-full md:h-auto md:max-w-4xl bg-white dark:bg-[#0a0f1e] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header (Mobile Close) */}
          <div className="flex md:hidden items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800">
             <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('details.title')}</h3>
             <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
               <X className="w-5 h-5 text-gray-500" />
             </button>
          </div>

          {/* Sidebar: Info & Actions (L/R based on RTL) */}
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900/50 p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col gap-8">
             {/* Client Card */}
             <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('details.client_info')}</label>
               <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center font-black text-primary-600">
                      {intervention.client?.user?.nomComplet?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white leading-tight">
                        {intervention.client?.user?.nomComplet}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {intervention.client?.user?.telephone || '+213 6 XX XX XX XX'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl h-10 border-emerald-100 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/30">
                       <MessageSquare className="w-4 h-4 mr-2 fill-current" /> WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 border-blue-100 text-blue-600 hover:bg-blue-50 dark:border-blue-900/30">
                       <Phone className="w-4 h-4 mr-2" /> {t('details.contact_client').split(' ')[0]}
                    </Button>
                  </div>
               </div>
             </div>

             {/* Location Brief */}
             <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('card.location').split(':')[0]}</label>
                <div className="flex items-start gap-3 px-1">
                   <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <MapPin className="w-5 h-5 text-blue-600" />
                   </div>
                   <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {intervention.adresse || `${intervention.wilaya?.nom}, ${intervention.commune?.nom}`}
                   </p>
                </div>
             </div>

             {/* Progress Info */}
             <div className="space-y-4 mt-auto">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('details.progress')}</label>
                <div className="bg-primary-500 text-white p-5 rounded-3xl shadow-lg shadow-primary-500/20 flex items-center gap-4">
                   <ShieldCheck className="w-8 h-8 opacity-50" />
                   <div>
                     <h4 className="font-black text-sm uppercase tracking-widest">{t(`status.${intervention.statut}`)}</h4>
                     <p className="text-[10px] font-bold opacity-80">Projet en gestion sécurisée</p>
                   </div>
                </div>

                {['acceptee', 'en_cours', 'terminee'].includes(intervention.statut) && (
                  <Button 
                    onClick={handleDownloadQuote}
                    className="w-full h-12 bg-white text-primary-600 border border-primary-100 hover:bg-primary-50 rounded-2xl shadow-sm font-black uppercase tracking-widest text-[10px]"
                  >
                    <Download className="w-4 h-4 mr-2" /> Télécharger Devis
                  </Button>
                )}
             </div>
          </div>

          {/* Main Area: Photos & Gallery */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-12">
             <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  {intervention.titre}
                </h2>
                <button onClick={onClose} className="hidden md:block p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
             </div>

             {/* Description Card */}
             <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {intervention.description}
                </p>
             </div>

             {/* Photos Section */}
             <div className="space-y-8">
               <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-widest uppercase flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-primary-500" />
                    {t('details.photos_title')}
                  </h3>
                  {uploading && <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />}
               </div>

               {/* Before Photos */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('details.photo_before')}</span>
                     <label className="cursor-pointer">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avant')} />
                        <div className="flex items-center gap-1 text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl transition-all">
                           <Plus className="w-3.5 h-3.5" />
                           {t('details.add_photo')}
                        </div>
                     </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {photosBefore.map(photo => (
                        <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden relative group border border-gray-100 dark:border-gray-800 shadow-sm">
                           <Image src={photo.url} alt="Before" fill unoptimized className="object-cover transition-transform group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                              >
                                {deleting === photo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>
                     ))}
                     {photosBefore.length === 0 && (
                        <div className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-[10px] font-bold text-gray-400">
                           <ImageIcon className="w-6 h-6 mb-2 opacity-20" />
                           Aucune photo
                        </div>
                     )}
                  </div>
               </div>

               {/* After Photos */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('details.photo_after')}</span>
                     <label className="cursor-pointer">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'apres')} />
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl transition-all">
                           <Plus className="w-3.5 h-3.5" />
                           {t('details.add_photo')}
                        </div>
                     </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {photosAfter.map(photo => (
                        <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden relative group border border-gray-100 dark:border-gray-800 shadow-sm">
                           <Image src={photo.url} alt="After" fill unoptimized className="object-cover transition-transform group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                              >
                                {deleting === photo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>
                     ))}
                     {photosAfter.length === 0 && (
                        <div className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-[10px] font-bold text-gray-400">
                           <ImageIcon className="w-6 h-6 mb-2 opacity-20" />
                           Aucune photo
                        </div>
                     )}
                  </div>
               </div>
             </div>

             {/* Map Placeholder for now */}
             <div className="h-48 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-md">
                   <MapIcon className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('card.location').split(':')[0]} Map</span>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
