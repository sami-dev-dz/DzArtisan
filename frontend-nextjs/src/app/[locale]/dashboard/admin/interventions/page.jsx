import InterventionManagement from "@/components/admin/interventions/InterventionManagement";

export const metadata = {
  title: "DzArtisan | Gestion des Demandes",
  description: "Espace d'administration des interventions et demandes de services.",
};

export default function AdminInterventionsPage() {
  return <InterventionManagement />;
}
