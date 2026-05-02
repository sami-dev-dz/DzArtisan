'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Bell, Check, X, Inbox, Clock, Calendar, 
    Filter, LayoutGrid, CheckCircle2, 
    AlertTriangle, Briefcase, Mail
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { fr, arDZ, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { NotificationsSkeleton } from '@/components/ui/SkeletonLayouts';

const iconMap = {
    'artisan_status': CheckCircle2,
    'new_job': Briefcase,
    'subscription_alert': Mail,
    'complaint_alert': AlertTriangle
};

const colorMap = {
    'artisan_status': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    'new_job': 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    'subscription_alert': 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    'complaint_alert': 'text-red-500 bg-red-50 dark:bg-red-900/20'
};

export default function NotificationsPage() {
    const t = useTranslations('common.notifications');
    const { user } = useAuth();
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const dateLocale = locale === 'fr' ? fr : (locale === 'ar' ? arDZ : enUS);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/notifications?paginated=true');
            setNotifications(res.data.notifications.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await axios.post(`/api/v1/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/v1/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const filteredNotifications = notifications.filter(n => 
        filter === 'all' ? true : !n.read_at
    );

    // Group Notifications by Date
    const groupedNotifications = filteredNotifications.reduce((acc, n) => {
        const date = new Date(n.created_at);
        let groupLabel;
        if (isToday(date)) groupLabel = locale === 'fr' ? "Aujourd'hui" : (locale === 'ar' ? "اليوم" : "Today");
        else if (isYesterday(date)) groupLabel = locale === 'fr' ? "Hier" : (locale === 'ar' ? "أمس" : "Yesterday");
        else groupLabel = format(date, 'd MMMM yyyy', { locale: dateLocale });

        if (!acc[groupLabel]) acc[groupLabel] = [];
        acc[groupLabel].push(n);
        return acc;
    }, {});

    if (!user) return null;

    if (loading) return <NotificationsSkeleton />;
    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen bg-slate-50/20 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary-500" />
                            {t('title')}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={markAllAsRead}
                            className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 dark:text-slate-400 hover:border-primary-500/30 transition-all shadow-sm"
                        >
                            {t('mark_all_read')}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit">
                    {(['all', 'unread']).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-2",
                                filter === f 
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg" 
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            {f === 'all' ? <LayoutGrid className="w-3.5 h-3.5" /> : <Inbox className="w-3.5 h-3.5" />}
                            {f === 'all' ? 'Toutes' : 'Non lues'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {Object.keys(groupedNotifications).length > 0 ? (
                    <div className="space-y-12 pb-20">
                        {Object.entries(groupedNotifications).map(([group, items]) => (
                            <div key={group} className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-2">
                                    {group}
                                </h4>
                                <div className="space-y-3">
                                    {items.map((notif) => {
                                        const Icon = iconMap[notif.data.type] || Clock;
                                        const colors = colorMap[notif.data.type] || "text-slate-400 bg-slate-50";

                                        return (
                                            <motion.div 
                                                key={notif.id}
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={cn(
                                                    "p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex gap-6 items-start shadow-sm transition-all relative group overflow-hidden",
                                                    !notif.read_at && "ring-1 ring-primary-500/20"
                                                )}
                                            >
                                                {!notif.read_at && (
                                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary-500" />
                                                )}
                                                
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", colors)}>
                                                    <Icon className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            {t(`types.${notif.data.type}`)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-300">
                                                            {format(new Date(notif.created_at), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-lg leading-snug",
                                                        notif.read_at ? "text-slate-500 dark:text-slate-400 font-medium" : "text-gray-900 dark:text-white font-black"
                                                    )}>
                                                        {notif.data.text}
                                                    </p>
                                                    <div className="flex items-center gap-4 pt-2">
                                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: dateLocale })}
                                                        </span>
                                                        {!notif.read_at && (
                                                            <button 
                                                                onClick={() => markAsRead(notif.id)}
                                                                className="text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest flex items-center gap-1.5"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                Marquer comme lu
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm max-w-lg mx-auto mt-20">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Inbox className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3 px-6 uppercase tracking-wider">
                            {t('empty')}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}
