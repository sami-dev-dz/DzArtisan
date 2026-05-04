import React from 'react';
import { ArtisanCalendar } from '@/components/dashboard/artisan/ArtisanCalendar';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.artisan_calendar' });
  
  return {
    title: `DzArtisan - ${t('title')}`,
    description: t('subtitle'),
  };
}

export default function ArtisanCalendarPage() {
  return (
    <main className="w-full">
      <ArtisanCalendar />
    </main>
  );
}
