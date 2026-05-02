'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTranslations, useLocale } from 'next-intl';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Loader2, X, AlertCircle, CalendarOff } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export const ArtisanCalendar = () => {
    const t = useTranslations('dashboard.artisan.calendar');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState(null);
    const [formData, setFormData] = useState({ reason: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [unavailRes, interventionsRes] = await Promise.all([
                api.get('/profile/unavailabilities'),
                api.get('/artisan/interventions?status=active')
            ]);

            const unavailabilities = unavailRes.data.data || [];
            const interventions = interventionsRes.data.data || [];

            const formattedEvents = [
                ...unavailabilities.map(u => ({
                    id: `unavail_${u.id}`,
                    title: u.reason || (locale === 'fr' ? 'Indisponible' : 'Unavailable'),
                    start: u.start_date,
                    end: u.end_date,
                    allDay: true,
                    backgroundColor: '#ef4444', // red-500
                    borderColor: '#ef4444',
                    extendedProps: { type: 'unavailability', rawId: u.id }
                })),
                ...interventions.map(i => ({
                    id: `job_${i.id}`,
                    title: i.titre,
                    start: i.date_souhaitee || i.created_at, // Fallback
                    allDay: true,
                    backgroundColor: '#3b82f6', // blue-500
                    borderColor: '#3b82f6',
                    extendedProps: { type: 'job', data: i }
                }))
            ];

            setEvents(formattedEvents);
        } catch (err) {
            console.error('Error fetching calendar data:', err);
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDateSelect = (selectInfo) => {
        setSelectedDateRange({
            start: selectInfo.startStr,
            end: selectInfo.endStr
        });
        setFormData({ reason: '' });
        setError(null);
        setShowAddModal(true);
    };

    const handleEventClick = async (clickInfo) => {
        const { type, rawId } = clickInfo.event.extendedProps;
        if (type === 'unavailability') {
            if (confirm(locale === 'fr' ? 'Voulez-vous supprimer cette indisponibilité ?' : 'Do you want to delete this unavailability?')) {
                try {
                    await api.delete(`/profile/unavailabilities/${rawId}`);
                    clickInfo.event.remove();
                } catch (err) {
                    alert('Erreur de suppression');
                }
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await api.post('/profile/unavailabilities', {
                start_date: selectedDateRange.start,
                end_date: selectedDateRange.end,
                reason: formData.reason
            });

            if (res.data.success) {
                setShowAddModal(false);
                fetchData(); // Refresh events
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mon Planning</h2>
                        <p className="text-sm text-gray-500">Gérez vos disponibilités et interventions</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-600 dark:text-gray-300">Interventions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-gray-600 dark:text-gray-300">Indisponible</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                {loading ? (
                    <div className="h-[600px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            locale={locale === 'fr' ? 'fr' : (locale === 'ar' ? 'ar-dz' : 'en')}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            select={handleDateSelect}
                            eventClick={handleEventClick}
                            height={700}
                            buttonText={{
                                today: locale === 'fr' ? "Aujourd'hui" : "Today",
                                month: locale === 'fr' ? "Mois" : "Month",
                                week: locale === 'fr' ? "Semaine" : "Week",
                                day: locale === 'fr' ? "Jour" : "Day"
                            }}
                        />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ajouter une indisponibilité</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Période</label>
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Du {format(parseISO(selectedDateRange.start), 'dd/MM/yyyy')} 
                                        {selectedDateRange.end !== selectedDateRange.start && ` au ${format(new Date(new Date(selectedDateRange.end).getTime() - 86400000), 'dd/MM/yyyy')}`}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Raison (Optionnel)</label>
                                    <input 
                                        type="text" 
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ reason: e.target.value })}
                                        placeholder="Ex: Vacances, Maladie..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 mt-6"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CalendarOff className="w-5 h-5" />}
                                    Confirmer l'indisponibilité
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
