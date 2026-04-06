import React from 'react';
import { MyInterventions } from '@/components/dashboard/artisan/MyInterventions';

export const metadata = {
  title: 'DzArtisan - Gestion des Interventions',
  description: 'Suivez vos projets en cours, gérez vos photos d\'intervention et contactez vos clients.',
};

export default function ArtisanInterventionsPage() {
  return (
    <main className="w-full">
      <MyInterventions />
    </main>
  );
}
