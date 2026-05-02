import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store Zustand qui gère l'état d'authentification global de l'application
// Les données sont persistées dans le localStorage pour survivre aux rechargements de page
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,

      // Enregistre les données de l'utilisateur après connexion réussie
      login: (userData, role) =>
        set({
          user: userData,
          role: role,
          isAuthenticated: true,
        }),

      // Réinitialise l'état lors de la déconnexion
      logout: () =>
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        }),

      // Met à jour partiellement les infos de l'utilisateur (ex: après modification du profil)
      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),
    }),
    {
      // Clé utilisée pour stocker les données dans localStorage
      name: "auth-storage",
      // On ne stocke que les champs essentiels pour éviter de surcharger le localStorage
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
