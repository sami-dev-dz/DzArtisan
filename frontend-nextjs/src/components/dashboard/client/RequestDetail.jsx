'use client';

import { Users, Clock, X, MapPin, Calendar, MessageSquare, AlertCircle, Trash2, Phone, MessageCircle, Star, ShieldCheck, ChevronRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { fr, arDZ, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/lib/axios';

export const RequestDetail = ({ request, onBack, onUpdate }) => {
  const t = useTranslations('client.requests');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [cancelling, setCancelling] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const dateLocale = locale === 'fr' ? fr : (locale === 'ar' ? arDZ : enUS);

  const handleCancel = async () => {
    if (!confirm(t('details.cancel_confirm'))) return;
    try {
      setCancelling(true);
      await axios.post(`/api/client/requests/${request.id}/cancel`);
      onUpdate();
      onBack();
    } catch (err) {
      console.error('Cancel error:', err);
    } finally {
      setCancelling(false);
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      setAcceptingId(proposalId);
      await axios.post(`/api/client/requests/${request.id}/proposals/${proposalId}/accept`);
      onUpdate();
    } catch (err) {
      console.error('Accept error:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] min-h-screen pb-20 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 p-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className={isRTL ? 'rotate-180' : ''} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {request.titre}
            </h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {request.categorie?.nom}
            </p>
          </div>
        </div>
        {request.statut === 'en_attente' && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            disabled={cancelling}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('details.cancel_request')}</span>
          </Button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Info Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              {t('details.description')}
            </h3>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {request.description}
            </div>
          </section>

          {/* Photos Section */}
          {request.photos?.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                {t('details.photos')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {request.photos.map((photo, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary-500 transition-all group relative">
                    <img src={photo.url} alt="Request detail" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location & Details Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{t('card.posted_on', { date: '' }).split(' ')[0]}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {format(new Date(request.created_at), 'PPP', { locale: dateLocale })}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{t('details.location')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{request.wilaya?.nom}, {request.commune?.nom}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Propositions ({request.propositions?.length || 0})
            </h3>

            <div className="space-y-4">
              {request.propositions?.length > 0 ? (
                request.propositions.map((proposal, i) => (
                  <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal} 
                    onAccept={() => handleAccept(proposal.id)}
                    isAccepting={acceptingId === proposal.id}
                    isDisabled={request.statut !== 'en_attente'}
                    isAccepted={proposal.statut === 'acceptee'}
                    request={request}
                    onUpdate={onUpdate}
                  />
                ))
              ) : (
                <div className="p-8 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-center space-y-2">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-gray-400 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('details.no_proposals')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalCard = ({ proposal, onAccept, isAccepting, isDisabled, isAccepted, request, onUpdate }) => {
  const t = useTranslations('client.requests');
  const artisan = proposal.artisan;
  const user = artisan.user;
  const [marking, setMarking] = useState(false);

  const logContact = async (type) => {
    try {
      await axios.post(`/api/artisans/${artisan.id}/log-contact`, { type });
    } catch (err) {
      console.error('Log contact error:', err);
    }
  };

  const markAsContacted = async () => {
    try {
      setMarking(true);
      await axios.post(`/api/client/requests/${request.id}/status`, { 
        status: 'artisan_contacte',
        artisan_id: artisan.id 
      });
      onUpdate();
    } catch (err) {
      console.error('Mark as contacted error:', err);
    } finally {
      setMarking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm transition-all relative",
        isAccepted && "border-emerald-500 ring-2 ring-emerald-500/10 shadow-emerald-500/10 shadow-lg"
      )}
    >
      {isAccepted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
          Choisi
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
          {user.photo ? (
            <img src={user.photo} alt={user.nomComplet} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
              {user.nomComplet.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              {user.nomComplet}
            </h4>
            {artisan.statutValidation === 'valide' && <ShieldCheck className="w-4 h-4 text-primary-500" />}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">{artisan.average_rating || 5.0}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              {t('proposal.experience', { years: artisan.anneesExp || 0 })}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-5 text-sm text-gray-600 dark:text-gray-400 italic">
        &quot;{proposal.message || "Bonjour, je suis disponible pour cette intervention. Contactez-moi pour en discuter."}&quot;
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a 
          href={`https://${user.lienWhatsApp || "wa.me/213" + user.telephone?.replace(/\s+/g, '')}`} 
          target="_blank"
          onClick={() => logContact('whatsapp')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white transition-all shadow-md shadow-[#25D366]/20 font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          {t('proposal.contact_whatsapp')}
        </a>
        <a 
          href={`tel:${user.telephone}`}
          onClick={() => logContact('call')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 transition-all font-bold text-sm"
        >
          <Phone className="w-4 h-4" />
          {t('proposal.contact_call')}
        </a>
      </div>

      {request.statut === 'ouvert' && !isAccepted && (
        <Button 
          fullWidth 
          variant="outline" 
          onClick={markAsContacted}
          loading={marking}
          className="mt-4 rounded-xl font-black uppercase tracking-widest text-[10px] h-10 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          {marking ? "Chargement..." : "J'ai contacté cet artisan"}
        </Button>
      )}

      {!isDisabled && !isAccepted && (
        <Button 
          fullWidth 
          variant="primary" 
          onClick={onAccept}
          loading={isAccepting}
          className="mt-2 rounded-xl font-black uppercase tracking-widest text-xs h-11"
        >
          {t('proposal.accept_btn')}
        </Button>
      )}
    </motion.div>
  );
};
