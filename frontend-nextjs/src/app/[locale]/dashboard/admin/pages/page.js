'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Save, X, ChevronLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import api from '@/lib/axios';
import { useToastStore } from '@/store/toastStore';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = {
  slug: '',
  title_fr: '',
  title_ar: '',
  content_fr: '',
  content_ar: '',
  is_published: false,
};

export default function AdminPagesPage() {
  const { addToast } = useToastStore();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingPage, setEditingPage] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeLang, setActiveLang] = useState('fr');

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pages');
      setPages(res.data);
    } catch {
      addToast({ title: 'Erreur lors du chargement', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPage(null);
    setForm(EMPTY_FORM);
    setView('form');
  };

  const openEdit = async (page) => {
    try {
      const res = await api.get(`/admin/pages/${page.id}`);
      setEditingPage(res.data);
      setForm(res.data);
      setView('form');
    } catch {
      addToast({ title: 'Erreur lors du chargement', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPage) {
        await api.put(`/admin/pages/${editingPage.id}`, form);
        addToast({ title: 'Page mise à jour', type: 'success' });
      } else {
        await api.post('/admin/pages', form);
        addToast({ title: 'Page créée', type: 'success' });
      }
      setView('list');
      fetchPages();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la sauvegarde';
      addToast({ title: msg, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette page ?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/pages/${id}`);
      setPages(pages.filter(p => p.id !== id));
      addToast({ title: 'Page supprimée', type: 'success' });
    } catch {
      addToast({ title: 'Erreur lors de la suppression', type: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (page) => {
    try {
      await api.put(`/admin/pages/${page.id}`, { is_published: !page.is_published });
      setPages(pages.map(p => p.id === page.id ? { ...p, is_published: !p.is_published } : p));
    } catch {
      addToast({ title: 'Erreur', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {editingPage ? 'Modifier la page' : 'Nouvelle page'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {editingPage ? `Édition de: /${editingPage.slug}` : 'Créez une nouvelle page statique'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Slug & Publish */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Informations générales</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">
                Identifiant URL (slug) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">/pages/</span>
                <input
                  id="page-slug"
                  type="text"
                  required
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  className="w-full pl-[68px] pr-4 h-12 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  placeholder="faq, terms, privacy..."
                />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, is_published: !form.is_published })}
                className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${form.is_published ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_published ? 'translate-x-6' : ''}`} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {form.is_published ? 'Page publiée (visible publiquement)' : 'Page masquée (brouillon)'}
              </span>
            </label>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex border-b border-slate-100 dark:border-white/10">
              {['fr', 'ar'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                    activeLang === lang
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {lang === 'fr' ? '🇫🇷 Français' : '🇩🇿 العربية'}
                </button>
              ))}
            </div>
            <div className="p-6 space-y-5" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Titre *</label>
                <Input
                  required
                  value={activeLang === 'fr' ? form.title_fr : form.title_ar}
                  onChange={e => setForm({ ...form, [`title_${activeLang}`]: e.target.value })}
                  className="h-12 rounded-2xl"
                  placeholder={activeLang === 'fr' ? 'Titre de la page' : 'عنوان الصفحة'}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Contenu (Markdown supporté)</label>
                <Textarea
                  value={activeLang === 'fr' ? form.content_fr : form.content_ar}
                  onChange={e => setForm({ ...form, [`content_${activeLang}`]: e.target.value })}
                  className="min-h-[400px] rounded-3xl text-sm font-mono leading-relaxed resize-y"
                  placeholder={activeLang === 'fr' ? '## Titre\n\nContenu de la page...' : '## عنوان\n\nمحتوى الصفحة...'}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end sticky bottom-4">
            <Button type="button" variant="ghost" onClick={() => setView('list')} className="rounded-2xl font-bold">
              <X className="w-4 h-4 mr-2" /> Annuler
            </Button>
            <Button type="submit" disabled={saving} className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/30">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span className="ml-2">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-500" />
            Gestion des Pages
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gérez le contenu des pages statiques (FAQ, CGU, Confidentialité…)
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nouvelle page
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Aucune page créée</h3>
          <p className="text-sm text-slate-400 mb-6">Commencez par créer la page FAQ, Conditions d'utilisation...</p>
          <Button onClick={openCreate} className="bg-blue-600 text-white rounded-2xl font-bold px-6 py-3 mx-auto">
            Créer la première page
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <motion.div
              key={page.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${page.is_published ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">{page.title_fr}</p>
                <p className="text-xs font-mono text-slate-400">/pages/{page.slug}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                page.is_published
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {page.is_published ? 'Publié' : 'Brouillon'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(page)}
                  title={page.is_published ? 'Masquer' : 'Publier'}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-blue-600"
                >
                  {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(page)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-blue-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  disabled={deleting === page.id}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-slate-500 hover:text-red-500"
                >
                  {deleting === page.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
