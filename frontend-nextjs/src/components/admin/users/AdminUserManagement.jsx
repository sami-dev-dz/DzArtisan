'use client';

import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Ban, 
  Download, 
  Plus, 
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserTable } from './UserTable';
import { ComposeEmailModal, SuspendUserModal, DeleteUserModal } from './UserActionModals';
import api from '@/lib/axios';
import { useToastStore } from '@/store/toastStore';

const AdminUserManagement = () => {
  const t = useTranslations('admin.user_management');
  const commonT = useTranslations('common');
  const addToast = useToastStore((state) => state.addToast);
  const showToast = (msg, type = 'success') => addToast({ title: msg, type });
  
  const [activeTab, setActiveTab] = useState('clients');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [wilayaId, setWilayaId] = useState('');
  
  // Selection
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Modals state
  const [modalType, setModalType] = useState(null); // 'email', 'suspend', 'delete', 'bulk_email', 'bulk_suspend'
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'clients' ? '/admin/users/clients' : '/admin/users/artisans';
      const response = await api.get(endpoint, {
        params: {
          page,
          search,
          status: status || undefined,
          wilaya_id: wilayaId || undefined,
        }
      });
      
      setUsers(response.data.data || []);
      setPagination({
        current: response.data.current_page,
        total: response.data.last_page
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast(commonT('error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, status, wilayaId, commonT]);

  useEffect(() => {
    fetchUsers(1);
    setSelectedUsers([]);
  }, [fetchUsers]);

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.user?.id || u.id));
    }
  };

  const handleAction = (type, user) => {
    setCurrentUser(user);
    setModalType(type);
  };

  const executeAction = async (data) => {
    try {
      const userId = currentUser.user?.id || currentUser.id;
      let response;

      switch (modalType) {
        case 'email':
          response = await api.post('/admin/users/email', {
            user_id: userId,
            subject: data.subject,
            message: data.message
          });
          showToast(t('notifications.email_sent'));
          break;
        
        case 'suspend':
          // We can use the existing updateArtisanStatus for artisans or a new general one
          // For now let's use our new controller endpoint if we have it or a generic one
          response = await api.post(`/admin/artisans/${userId}/status`, {
            statut: currentUser.user?.statut === 'actif' ? 'suspendu' : 'actif',
            reason: data
          });
          showToast(currentUser.user?.statut === 'actif' ? t('notifications.user_suspended') : t('notifications.user_unsuspended'));
          fetchUsers(pagination.current);
          break;

        case 'delete':
          response = await api.post(`/admin/users/${userId}/delete`, {
            reason: data
          });
          showToast(t('notifications.user_deleted'));
          fetchUsers(pagination.current);
          break;

        case 'bulk_email':
          response = await api.post('/admin/users/bulk', {
            user_ids: selectedUsers,
            type: 'email',
            subject: data.subject,
            message: data.message
          });
          showToast(t('notifications.bulk_success'));
          setSelectedUsers([]);
          break;

        case 'bulk_suspend':
          response = await api.post('/admin/users/bulk', {
            user_ids: selectedUsers,
            type: 'suspend',
            message: data
          });
          showToast(t('notifications.bulk_success'));
          setSelectedUsers([]);
          fetchUsers(pagination.current);
          break;
      }
    } catch (error) {
      showToast(error.response?.data?.message || commonT('error'), 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="text-blue-600" size={28} />
            {t('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 dark:border-slate-700 font-bold text-sm">
            <Download size={18} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 gap-4">
          {/* Tabs */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
                activeTab === 'clients' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <Users size={18} />
              {t('tabs.clients')}
            </button>
            <button
              onClick={() => setActiveTab('artisans')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
                activeTab === 'artisans' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <ShieldCheck size={18} />
              {t('tabs.artisans')}
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={t('filters.search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
            
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">{t('filters.all_statuses')}</option>
              <option value="actif">{t('filters.status_active')}</option>
              <option value="suspendu">{t('filters.status_suspended')}</option>
            </select>

            <button 
              onClick={() => fetchUsers(1)}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-900/30"
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="px-6 py-3 bg-blue-600 text-white flex items-center justify-between"
          >
            <div className="flex items-center gap-3 font-bold text-sm">
              <CheckCircle2 size={18} />
              {selectedUsers.length} utilisateurs sélectionnés
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleAction('bulk_email')}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-bold"
              >
                <Mail size={16} /> {t('actions.bulk_email')}
              </button>
              <button 
                onClick={() => handleAction('bulk_suspend')}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-bold"
              >
                <Ban size={16} /> {t('actions.bulk_suspend')}
              </button>
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button 
                onClick={() => setSelectedUsers([])}
                className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        )}

        {/* Table Content */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
          
          <UserTable 
            users={users} 
            type={activeTab === 'clients' ? 'client' : 'artisan'}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onAction={handleAction}
          />
        </div>

        {/* Pagination Placeholder */}
        {pagination.total > 1 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-2">
            {[...Array(pagination.total)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchUsers(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  pagination.current === i + 1 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ComposeEmailModal 
        isOpen={modalType === 'email' || modalType === 'bulk_email'}
        onClose={() => setModalType(null)}
        onConfirm={executeAction}
        userName={currentUser?.user?.nomComplet}
        isBulk={modalType === 'bulk_email'}
      />

      <SuspendUserModal 
        isOpen={modalType === 'suspend' || modalType === 'bulk_suspend'}
        onClose={() => setModalType(null)}
        onConfirm={executeAction}
        userName={currentUser?.user?.nomComplet}
        isBulk={modalType === 'bulk_suspend'}
      />

      <DeleteUserModal 
        isOpen={modalType === 'delete'}
        onClose={() => setModalType(null)}
        onConfirm={executeAction}
        userName={currentUser?.user?.nomComplet}
      />
    </div>
  );
};

export default AdminUserManagement;
