'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Mail, 
  Ban, 
  Trash2, 
  ChevronRight, 
  User as UserIcon,
  ShieldCheck,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const UserTable = ({ 
  users, 
  type = 'client', 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onAction 
}) => {
  const t = useTranslations('admin.user_management.table');
  const commonT = useTranslations('common');

  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <th className="px-6 py-4 w-12">
              <input 
                type="checkbox" 
                checked={allSelected}
                onChange={onSelectAll}
                className="w-4 h-4 rounded border-slate-300 dark:border-white/20 bg-transparent text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
              />
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('user')}</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact')}</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('stats')}</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('status')}</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
          {users.map((user, idx) => {
            const isSelected = selectedUsers.includes(user.user?.id || user.id);
            const userModel = user.user || user;
            
            return (
              <motion.tr 
                key={userModel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`group hover:bg-slate-50/80 dark:hover:bg-white/5 transition-all ${isSelected ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onSelectUser(userModel.id)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-11 h-11 rounded-[16px] overflow-hidden bg-slate-100 dark:bg-white/5 border-2 border-white dark:border-[#0a0f1e] shadow-sm flex items-center justify-center shrink-0">
                      {user.photo ? (
                        <Image src={user.photo} alt={userModel.nomComplet} fill className="object-cover" />
                      ) : (
                        <UserIcon className="text-slate-400" size={20} />
                      )}
                      {type === 'artisan' && user.statutValidation === 'valide' && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                          <ShieldCheck size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {userModel.nomComplet}
                        </span>
                        {type === 'artisan' && user.average_rating > 4.5 && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-[10px] font-bold text-amber-600">
                            <Star size={8} fill="currentColor" /> Premium
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {user.wilaya?.nom || user.primary_wilaya?.nom}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(userModel.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                       <Mail size={14} className="text-slate-400" /> {userModel.email} 
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                       {userModel.telephone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {type === 'client' ? (
                      <>
                        <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-900/30">
                          {t('requests', { count: user.requests_count || 0 })}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-900/30">
                          {t('reviews', { count: user.reviews_left_count || 0 })}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-100 dark:border-amber-900/30 flex items-center gap-1">
                          {user.average_rating || 0} <Star size={10} fill="currentColor" />
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-900/30">
                          {user.abonnement?.plan_id ? user.abonnement.plan_id.toUpperCase() : 'FREE'}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                    userModel.statut === 'actif' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-emerald-600/20' 
                      : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-red-600/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${userModel.statut === 'actif' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                    {userModel.statut === 'actif' ? 'Actif' : 'Suspendu'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onAction('email', user)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all tooltip"
                      title="Envoyer un e-mail"
                    >
                      <Mail size={18} />
                    </button>
                    <button 
                      onClick={() => onAction('suspend', user)}
                      className={`p-2 rounded-lg transition-all ${userModel.statut === 'actif' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      title={userModel.statut === 'actif' ? 'Suspendre' : 'Activer'}
                    >
                      <Ban size={18} />
                    </button>
                    <button 
                      onClick={() => onAction('delete', user)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Supprimer définitivement"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => onAction('view', user)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <UserIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('no_users')}</h3>
          <p className="text-slate-500 dark:text-slate-400">Essayez d&apos;ajuster vos filtres de recherche.</p>
        </div>
      )}
    </div>
  );
};
