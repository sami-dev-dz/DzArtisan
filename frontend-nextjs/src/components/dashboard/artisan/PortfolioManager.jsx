'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Trash2, Plus, Loader2, Upload, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useToastStore } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export function PortfolioManager() {
  const t = useTranslations('dashboard');
  const { addToast } = useToastStore();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/profile');
      const user = res.data?.data || res.data;
      if (user?.artisan?.portfolio) {
        setPhotos(user.artisan.portfolio);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (photos.length >= 10) {
      addToast({ title: t('portfolio.limit_reached'), type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({ title: t('portfolio.file_too_large'), type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      const res = await api.post('/profile/portfolio', {
        image_url: url,
        caption: file.name
      });
      setPhotos([...photos, res.data.data]);
      addToast({ title: t('portfolio.add_success'), type: 'success' });
    } catch (err) {
      addToast({ title: t('portfolio.add_error'), type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/profile/portfolio/${id}`);
      setPhotos(photos.filter(p => p.id !== id));
      addToast({ title: t('portfolio.delete_success'), type: 'success' });
    } catch (err) {
      addToast({ title: t('portfolio.delete_error'), type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            {t('portfolio.title')}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {t('portfolio.description', { count: photos.length })}
          </p>
        </div>
        
        <label className={`
          flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 
          dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 
          rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors
          ${photos.length >= 10 || uploading ? 'opacity-50 pointer-events-none' : ''}
        `}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {uploading ? t('portfolio.uploading') : t('portfolio.add_photo')}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading || photos.length >= 10} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden relative group border border-slate-200 dark:border-white/10 shadow-sm">
            <Image src={photo.image_url} alt={photo.caption || t('portfolio.item_alt')} fill unoptimized className="object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
              <button 
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className="w-10 h-10 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                {deletingId === photo.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full py-12 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
              <Camera className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">{t('portfolio.empty_title')}</h4>
            <p className="text-xs text-slate-500 max-w-[250px] leading-relaxed">
              {t('portfolio.empty_desc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
