import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: "light", // 'light' or 'dark'
      language: "fr", // 'fr', 'en', 'ar'
      sidebarOpen: false,

      // Actions
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
      
      toggleTheme: () => {
        const current = get().theme;
        const nextTheme = current === "light" ? "dark" : "light";
        get().setTheme(nextTheme);
      },

      setLanguage: (language) => set({ language }),

      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "ui-state", // Used by layout.js script to prevent hydration mismatch flash
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }), // only persist theme and language
    }
  )
);
