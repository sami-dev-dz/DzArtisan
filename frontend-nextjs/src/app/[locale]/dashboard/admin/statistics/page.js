import React from 'react';
import AdminStatistics from '@/components/admin/stats/AdminStatistics';

export const metadata = {
  title: 'DzArtisan - Statistiques & Analyses',
  description: 'Tableau de bord des performances et de l\'activité de la plateforme DzArtisan.',
};

export default function AdminStatisticsPage() {
  return (
    <main className="w-full bg-slate-50/30 dark:bg-transparent min-h-screen">
      <AdminStatistics />
    </main>
  );
}
