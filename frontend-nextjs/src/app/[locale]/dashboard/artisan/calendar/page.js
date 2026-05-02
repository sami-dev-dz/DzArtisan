import React from 'react';
import { ArtisanCalendar } from '@/components/dashboard/artisan/ArtisanCalendar';

export const metadata = {
  title: 'DzArtisan - Planning et Disponibilités',
  description: 'Gérez votre emploi du temps, vos interventions et vos périodes d\'indisponibilité.',
};

export default function ArtisanCalendarPage() {
  return (
    <main className="w-full">
      <ArtisanCalendar />
    </main>
  );
}
