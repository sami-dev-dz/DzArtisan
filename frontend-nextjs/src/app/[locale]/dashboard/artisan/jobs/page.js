import React from 'react';
import { JobOpportunities } from '@/components/dashboard/artisan/JobOpportunities';

export const metadata = {
  title: 'DzArtisan - Dossier de Demandes',
  description: 'Trouvez de nouvelles opportunités d\'intervention et gérez vos propositions.',
};

export default function ArtisanJobsPage() {
  return (
    <main className="w-full">
      <JobOpportunities />
    </main>
  );
}
