'use client';

import { Users, Clock, X, MapPin, Calendar, MessageSquare, AlertCircle, Trash2, Phone, MessageCircle, Star, ShieldCheck, ChevronRight, ArrowLeft, Image as ImageIcon, Unlock, Lock, ExternalLink, Pencil, Download } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/routing';

export const RequestDetail = ({ request, onBack, onUpdate }) => {
  const router = useRouter();
  const t = useTranslations('client.requests');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [cancelling, setCancelling] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const handleCancel = async () => {
    if (!confirm(t('details.cancel_confirm'))) return;
    try {
      setCancelling(true);
      await api.post(`/client/requests/${request.id}/cancel`);
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
      await api.post(`/client/requests/${request.id}/proposals/${proposalId}/accept`);
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-3">
              {request.titre}
              {request.statut === 'en_attente' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest shadow-sm">
                   <Unlock className="w-3 h-3" /> {t('details.modifiable')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest shadow-sm">
                   <Lock className="w-3 h-3" /> {t('details.locked')}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
              {request.categorie?.nom}
            </p>
          </div>
        </div>
        {request.statut === 'en_attente' && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(`/dashboard/client/interventions/edit/${request.id}`)}
              className="text-blue-500 border-blue-200 hover:text-blue-600 hover:bg-blue-50 font-bold gap-2"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">{t('details.edit')}</span>
            </Button>
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
          </div>
        )}
        {['acceptee', 'en_cours', 'terminee'].includes(request.statut) && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={async () => {
                try {
                  const res = await api.get(`/interventions/${request.id}/quote`, { responseType: 'blob' });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `devis-INT${request.id}.pdf`);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (err) {
                  console.error(err);
                }
              }}
              className="text-emerald-600 border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50 font-bold gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('details.download_quote')}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Info Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
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
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border-2 border-transparent hover:border-blue-500 transition-all group relative">
                    <Image src={photo.url} alt="Request detail" fill unoptimized className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Detailed Summary (Date, Location, Phone, WhatsApp) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">Date</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {new Date(request.created_at).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{t('details.location')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{request.wilaya?.nom}, {request.commune?.nom}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                <Phone className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{t('details.phone')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white tracking-widest font-mono truncate">{request.telephone}</p>
              </div>
            </div>

            {request.whatsapp ? (
               <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-sm">
                 <div className="p-2.5 bg-[#25D366]/10 rounded-lg shrink-0">
                   <MessageCircle className="w-5 h-5 text-[#25D366]" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/50 font-bold uppercase truncate">WhatsApp</p>
                   <a href={`https://${request.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#25D366] hover:underline flex items-center gap-1 truncate w-full">
                     wa.me/... <ExternalLink className="w-3 h-3 shrink-0" />
                   </a>
                 </div>
               </div>
            ) : (
               <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm opacity-60 grayscale">
                 <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                   <MessageCircle className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-[10px] text-gray-500 font-bold uppercase truncate">WhatsApp</p>
                   <p className="text-sm font-bold text-gray-500 truncate">{t('details.not_provided')}</p>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Proposals Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              {t('details.proposals', { count: request.propositions?.length || 0 })}
            </h3>

            <div className="space-y-4">
              {request.propositions?.length > 0 ? (
                request.propositions.map((proposal) => (
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
  const user = artisan?.user;
  const [marking, setMarking] = useState(false);

  if (!user) return null;

  const logContact = async (type) => {
    try {
      await api.post(`/artisans/${artisan.id}/log-contact`, { type });
    } catch (err) {
      console.error('Log contact error:', err);
    }
  };

  const markAsContacted = async () => {
    try {
      setMarking(true);
      await api.post(`/client/requests/${request.id}/status`, { 
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
          {t('details.chosen')}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
          {user.photo ? (
            <Image src={user.photo} alt={user.nomComplet} fill unoptimized className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
              {user.nomComplet?.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              {user.nomComplet}
            </h4>
            {artisan.statutValidation === 'valide' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
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
        &quot;{proposal.message || t('details.default_proposal_message')}&quot;
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
          {marking ? "..." : t('details.contacted_btn')}
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
