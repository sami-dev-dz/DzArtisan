import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,

      // Actions
      login: (userData, role) =>
        set({
          user: userData,
          role: role,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }), // Save these fields to local storage
    }
  )
);
