import React from 'react';
import AdminUserManagement from '@/components/admin/users/AdminUserManagement';

export const metadata = {
  title: 'DzArtisan - Gestion des Utilisateurs',
  description: 'Gérez les clients et les artisans de la plateforme DzArtisan.',
};

export default function AdminUsersPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <AdminUserManagement />
    </div>
  );
}
