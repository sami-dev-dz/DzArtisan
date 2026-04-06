'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, X, Inbox, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import axios from '@/lib/axios';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr, arDZ, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const NotificationBell = () => {
    const t = useTranslations('common.notifications');
    const { user, isAuthenticated } = useAuthStore();
    const locale = useLocale();
    const isRTL = locale === 'ar';
    
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const dateLocale = locale === 'fr' ? fr : (locale === 'ar' ? arDZ : enUS);

    const fetchNotifications = React.useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.get('/api/v1/notifications?limit=10');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    }, [isAuthenticated]);

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotifications();
        // Polling every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(`/api/v1/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/v1/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 group"
            >
                <Bell className={cn(
                    "w-5 h-5 text-slate-400 group-hover:text-white transition-colors",
                    unreadCount > 0 && "animate-wiggle"
                )} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0f1e] shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={cn(
                            "absolute top-full mt-4 w-80 md:w-96 bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60]",
                            isRTL ? "left-0 origin-top-left" : "right-0 origin-top-right"
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">
                                    {t('title')}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {t('unread_count', { count: unreadCount })}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl text-primary-600 transition-colors group"
                                    title={t('mark_all_read')}
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            className={cn(
                                                "p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer relative group",
                                                !notif.read_at && "bg-primary-50/30 dark:bg-primary-900/5 border-l-4 border-l-primary-500"
                                            )}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                                                {/* Icon Logic based on Type */}
                                                <Clock className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className={cn(
                                                    "text-sm leading-snug",
                                                    notif.read_at ? "text-slate-500 dark:text-slate-400 font-medium" : "text-gray-900 dark:text-white font-bold"
                                                )}>
                                                    {notif.data.text}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <span>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: dateLocale })}</span>
                                                    {!notif.read_at && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                                                </div>
                                            </div>
                                            {!notif.read_at && (
                                                <button 
                                                    className="opacity-0 group-hover:opacity-100 absolute top-5 right-4 p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 transition-opacity"
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                                >
                                                    <Check className="w-3 h-3 text-primary-500" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <Inbox className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                        {t('empty')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <Link 
                            href="/dashboard/notifications"
                            className="block w-full py-4 text-center text-xs font-black text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all uppercase tracking-[0.2em] border-t border-gray-100 dark:border-gray-800"
                            onClick={() => setIsOpen(false)}
                        >
                            {t('see_all')}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
