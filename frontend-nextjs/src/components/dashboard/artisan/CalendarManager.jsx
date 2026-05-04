'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Plus, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios';
import { useToastStore } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CalendarManager() {
  const t = useTranslations('dashboard');
  const { addToast } = useToastStore();
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    fetchUnavailabilities();
  }, []);

  const fetchUnavailabilities = async () => {
    try {
      const res = await api.get('/profile/unavailabilities');
      setUnavailabilities(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date) return;

    setAdding(true);
    try {
      const res = await api.post('/profile/unavailabilities', formData);
      setUnavailabilities([...unavailabilities, res.data.data].sort((a, b) => new Date(a.start_date) - new Date(b.start_date)));
      setFormData({ start_date: '', end_date: '', reason: '' });
      addToast({ title: t('calendar.add_success'), type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || t('calendar.add_error');
      addToast({ title: msg, type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/profile/unavailabilities/${id}`);
      setUnavailabilities(unavailabilities.filter(u => u.id !== id));
      addToast({ title: t('calendar.delete_success'), type: 'success' });
    } catch (err) {
      addToast({ title: t('calendar.delete_error'), type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>;
  }

  // Obtenir la date minimale (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          {t('calendar.title')}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {t('calendar.description')}
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t('calendar.add_unavailability')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">{t('calendar.start_date')}</label>
            <Input 
              type="date" 
              min={today}
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
              className="h-12 bg-white dark:bg-slate-800 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">{t('calendar.end_date')}</label>
            <Input 
              type="date" 
              min={formData.start_date || today}
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              required
              className="h-12 bg-white dark:bg-slate-800 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">{t('calendar.reason_optional')}</label>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder={t('calendar.reason_placeholder')}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="h-12 bg-white dark:bg-slate-800 rounded-xl flex-1"
              />
              <Button type="submit" disabled={adding || !formData.start_date || !formData.end_date} className="h-12 w-12 shrink-0 rounded-xl bg-rose-500 hover:bg-rose-600 text-white">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {unavailabilities.length > 0 ? (
          unavailabilities.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {t('calendar.from_to', { start: new Date(item.start_date).toLocaleDateString(), end: new Date(item.end_date).toLocaleDateString() })}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.reason || t('calendar.blocked_period')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
              >
                {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm font-medium italic">
            {t('calendar.no_unavailability')}
          </div>
        )}
      </div>
    </div>
  );
}
