'use client';

import React from 'react';
import { 
  User, MapPin, Calendar, Clock, 
  ChevronRight, Phone, MessageSquare, Play, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { fr, arDZ, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const InterventionCard = ({ intervention, onUpdateStatus, onViewDetails }) => {
  const t = useTranslations('artisan.interventions');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const dateLocale = locale === 'fr' ? fr : (locale === 'ar' ? arDZ : enUS);
  const formattedDate = format(new Date(intervention.created_at), 'PPP', { locale: dateLocale });

  const statusColors = {
    acceptee: "bg-blue-500",
    en_cours: "bg-amber-500",
    terminee: "bg-emerald-500",
    annulee: "bg-red-500"
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      {/* Status Bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1.5",
        statusColors[intervention.statut] || "bg-gray-200"
      )} />

      <div className="flex flex-col gap-5">
        {/* Header: Client & Date */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                <User className="w-6 h-6 text-slate-400" />
             </div>
             <div>
                <h4 className="font-black text-gray-900 dark:text-white leading-tight">
                    {intervention.client?.user?.nomComplet}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {t('card.client', { name: '' }).replace(':', '').trim()}
                </p>
             </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                statusColors[intervention.statut] || "bg-gray-400"
            )}>
                {t(`status.${intervention.statut}`)}
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="space-y-1">
           <h3 className="text-lg font-black text-primary-600 dark:text-primary-400 leading-tight">
             {intervention.titre}
           </h3>
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {intervention.wilaya?.nom}, {intervention.commune?.nom}
           </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-50 dark:bg-slate-800/50 w-full" />

        {/* Actions */}
        <div className="flex items-center gap-3">
           {intervention.statut === 'acceptee' && (
             <Button 
                variant="primary" 
                size="sm" 
                className="flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest h-11"
                onClick={() => onUpdateStatus(intervention.id, 'en_cours')}
             >
                <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                {t('card.start_job')}
             </Button>
           )}
           
           {intervention.statut === 'en_cours' && (
             <Button 
                variant="primary" 
                size="sm" 
                className="flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest h-11 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                onClick={() => onUpdateStatus(intervention.id, 'terminee')}
             >
                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                {t('card.finalize')}
             </Button>
           )}

           <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "rounded-xl font-bold text-[10px] uppercase tracking-widest h-11",
                (intervention.statut === 'terminee' || intervention.statut === 'annulee') ? "w-full" : "w-1/3"
              )}
              onClick={() => onViewDetails(intervention)}
           >
              {t('card.view_details')}
           </Button>
        </div>
      </div>
    </div>
  );
};
