'use client';

import React from 'react';
import { 
  MapPin, Calendar, MessageSquare, Clock, 
  ChevronRight, Send, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatDistanceToNow, format } from 'date-fns';
import { fr, arDZ, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const OpportunityCard = ({ job, appliedProposal, onApply, onViewDetails }) => {
  const t = useTranslations('artisan.jobs');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const dateLocale = locale === 'fr' ? fr : (locale === 'ar' ? arDZ : enUS);
  
  // If it's a job (new opportunity)
  const isJob = !!job;
  const data = job || appliedProposal.demande;
  
  const timeAgo = formatDistanceToNow(new Date(data.created_at), { 
    addSuffix: true, 
    locale: dateLocale 
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      {/* Status Badge for Applied proposals */}
      {!isJob && appliedProposal && (
        <div className={cn(
          "absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl",
          appliedProposal.statut === 'acceptee' ? "bg-emerald-500 text-white" : 
          appliedProposal.statut === 'rejetee' ? "bg-red-500 text-white" : 
          "bg-amber-500 text-white"
        )}>
          {t(`status.${appliedProposal.statut}`)}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Category & Date */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50">
            {data.categorie?.nom}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary-600 transition-colors">
            {data.titre}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Info Rows */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 border-y border-gray-50 dark:border-gray-800/50">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            {data.wilaya?.nom}, {data.commune?.nom}
          </div>
          {/* Distance would go here if we had user coordinates */}
          {/* <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            {t('card.distance', { km: 5 })}
          </div> */}
        </div>

        {/* Action / Applied info */}
        <div className="flex items-center justify-between mt-1">
          {!isJob && appliedProposal ? (
            <div className="text-[10px] font-bold text-gray-400 mt-1 italic">
              {t('card.applied_on', { date: format(new Date(appliedProposal.created_at), 'dd/MM/yyyy', { locale: dateLocale }) })}
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(data)}
                className="font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('card.view_request')}
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onApply(data)}
                className="font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-primary-500/20"
              >
                <Send className="w-3 h-3 mr-2" />
                {t('card.apply_now')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
