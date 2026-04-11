'use client';

import React from 'react';
import { Calendar, MessageSquare, MapPin, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

const statusConfig = {
  en_attente: {
    color: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    icon: Clock,
    label: 'En attente'
  },
  acceptee: {
    color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    icon: CheckCircle2,
    label: 'Acceptée'
  },
  terminee: {
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    icon: CheckCircle2,
    label: 'Terminée'
  },
  annulee: {
    color: 'text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    icon: XCircle,
    label: 'Annulée'
  }
};

export const RequestCard = ({ request, onClick }) => {
  const t = useTranslations('client.requests');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const config = statusConfig[request.statut] || statusConfig.en_attente;
  const StatusIcon = config.icon;

  const formattedDate = new Date(request.created_at).toLocaleDateString(
    locale === 'ar' ? 'ar-DZ' : 'fr-DZ',
    { day: '2-digit', month: 'short', year: 'numeric' }
  );

  return (
    <div 
      onClick={() => onClick(request)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Category Icon */}
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
            <span className="text-xl">🛠️</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {request.categorie?.nom}
              </span>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                config.color
              )}>
                <StatusIcon className="w-3 h-3" />
                {t(`status.${request.statut}`)}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
              {request.titre}
            </h3>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </div>
              {request.wilaya && request.commune && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {request.commune.nom}, {request.wilaya.nom}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:pl-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>{t('card.responses', { count: request.propositions_count || 0 })}</span>
          </div>
          
          <button className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">
            {t('card.view_details')}
            <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
          </button>
        </div>
      </div>

      {/* Progress Bar for accepted requests */}
      {request.statut === 'acceptee' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-slate-800">
          <div className="h-full bg-blue-500 w-2/3 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
