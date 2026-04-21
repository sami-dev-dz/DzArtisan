'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { cn } from '@/lib/utils';

export const ProposalModal = ({ isOpen, onClose, job, onApplySuccess }) => {
  const t = useTranslations('artisan.jobs');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await axios.post('/api/artisan/jobs/proposal', {
        demande_id: job.id,
        message: message
      });
      setSuccess(true);
      setTimeout(() => {
        onApplySuccess();
        onClose();
        // Reset state
        setSuccess(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Proposal error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {success ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100 dark:border-emerald-800 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  {t('modal.success')}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Nous avons notifié le client. Bonne chance !
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {t('modal.title')}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Job Brief */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 font-bold text-xl">
                    ⚡
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">
                      {job?.categorie?.nom}
                    </p>
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {job?.titre}
                    </h4>
                  </div>
                </div>

                {/* Tips for Artisan */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Profil vérifié</span>
                   </div>
                   <div className="p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 flex items-center gap-2">
                     <Clock className="w-4 h-4 text-blue-500" />
                     <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Réponse rapide</span>
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest pl-1">
                    Votre message personnalisé
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('modal.placeholder')}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 rounded-2xl p-4 text-sm resize-none outline-none transition-all dark:text-white"
                  />
                </div>

                <Button 
                  fullWidth 
                  variant="primary" 
                  size="lg"
                  onClick={handleSubmit}
                  loading={submitting}
                  className="rounded-2xl font-black uppercase tracking-widest h-14 shadow-xl shadow-primary-500/20"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t('modal.send')}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
