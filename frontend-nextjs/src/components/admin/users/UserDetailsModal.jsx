'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Star, Briefcase, FileText, User as UserIcon
} from 'lucide-react';
import Image from 'next/image';

export const UserDetailsModal = ({ isOpen, onClose, user, type }) => {
  if (!isOpen || !user) return null;

  const userModel = user.user || user;
  const isArtisan = type === 'artisan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#141414] shrink-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Détails de {isArtisan ? "l'artisan" : "le client"}
          </h3>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 shrink-0">
              {userModel.photo && userModel.photo !== '0' && userModel.photo !== 0 ? (
                <Image src={userModel.photo} alt={userModel.nomComplet} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <UserIcon size={40} />
                </div>
              )}
              {isArtisan && user.statutValidation === 'valide' && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center translate-x-1/4 translate-y-1/4">
                  <ShieldCheck size={14} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                {userModel.nomComplet}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1.5"><Mail size={16} /> {userModel.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={16} /> {userModel.telephone || user.telephone}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                  userModel.statut === 'actif' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 border-emerald-200' 
                    : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 border-red-200'
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${userModel.statut === 'actif' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${userModel.statut === 'actif' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  </span>
                  Compte {userModel.statut === 'actif' ? 'Actif' : 'Suspendu'}
                </span>
                
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                  <Calendar size={14} /> 
                  Inscrit le {new Date(userModel.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Details Box */}
            <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-blue-500" />
                Localisation
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Wilaya</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200">
                    {user.wilaya?.nom || user.primary_wilaya?.nom || 'Non spécifié'}
                  </p>
                </div>
                {!isArtisan && user.adresse && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Adresse</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200">{user.adresse}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Role Specific Details */}
            {isArtisan ? (
              <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <Briefcase size={18} className="text-amber-500" />
                  Profil Artisan
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Métier</span>
                    <span className="font-bold text-slate-900 dark:text-white">{user.primary_categorie?.nom || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Note moyenne</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      {user.average_rating || 0} <Star size={14} fill="currentColor" /> ({user.reviews_count || 0} avis)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Expérience</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{user.anneesExp || 0} an(s)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Validation</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200 uppercase text-xs tracking-wider">{user.statutValidation}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-indigo-500" />
                  Statistiques
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{user.requests_count || 0}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Demandes créées</p>
                  </div>
                  <div className="bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">{user.reviews_left_count || 0}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Avis laissés</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {isArtisan && user.description && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 leading-relaxed">
                {user.description}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
