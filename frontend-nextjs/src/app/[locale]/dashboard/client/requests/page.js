import React from 'react';
import { MyRequests } from '@/components/dashboard/client/MyRequests';

export const metadata = {
  title: 'DzArtisan - Mes Demandes',
  description: 'Gérez vos demandes d\'intervention et consultez les propositions des artisans.',
};

export default function ClientRequestsPage() {
  return (
    <main className="w-full">
      <MyRequests />
    </main>
  );
}
