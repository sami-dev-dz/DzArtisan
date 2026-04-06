import React from 'react';
import AdminUserManagement from '@/components/admin/users/AdminUserManagement';

export const metadata = {
  title: 'DzArtisan - Gestion des Utilisateurs',
  description: 'Gérez les clients et les artisans de la plateforme DzArtisan.',
};

export default function AdminUsersPage() {
  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <AdminUserManagement />
    </div>
  );
}
