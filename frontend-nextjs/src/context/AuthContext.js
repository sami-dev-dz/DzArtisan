"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Recharge l'utilisateur depuis le cookie Sanctum au refresh de page
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Redirige après login selon rôle + statut
  const redirectAfterLogin = (u) => {
    if (u.role === "admin") return router.push("/dashboard/admin");
    if (u.role === "artisan") {
      if (u.statut === "nouveau")
        return router.push("/onboarding/artisan/profile");
      if (u.statut === "en_attente")
        return router.push("/onboarding/artisan/waiting");
      return router.push("/dashboard/artisan");
    }

    if (u.role === "client") {
      if (u.statut === "nouveau")
        return router.push("/onboarding/client/setup");
      return router.push("/dashboard/client");
    }
  };

  const login = async ({ email, password }) => {
    //récupère le cookie CSRF
    await api.get("/sanctum/csrf-cookie", {
      baseURL: process.env.NEXT_PUBLIC_API_BASE,
    });
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    redirectAfterLogin(data.user);
    return data.user;
  };

  const loginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/google/redirect`;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        redirectAfterLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
};
