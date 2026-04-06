'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import api from '@/lib/api-client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()

  // Recharge l'utilisateur depuis le cookie Sanctum au refresh de page
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const redirectAfterLogin = (u) => {
    if (u.type === "admin")   return router.push("/dashboard/admin");
    if (u.type === "artisan") {
      if (u.statut === "nouveau")     return router.push("/onboarding/artisan/profile");
      if (u.statut === "en_attente")  return router.push("/onboarding/artisan/waiting");
      return router.push("/dashboard/artisan");
    }
    if (u.type === "client") {
      if (u.statut === "nouveau") return router.push("/onboarding/client/setup");
      return router.push("/dashboard/client");
    }
    // Fallback if type is missing
    router.push("/");
  };

  const register = async ({ name, email, password, password_confirmation, role, telephone }) => {
    // Required now that Sanctum is fully installed
    await api.get("/sanctum/csrf-cookie", { baseURL: process.env.NEXT_PUBLIC_API_BASE });
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      password_confirmation,
      type: role || "client",   // La colonne s'appelle "type" dans la DB
      telephone: telephone || null,
    });
    
    const userData = data.data.user;
    setUser(userData);
    redirectAfterLogin(userData);
    return userData;
  };

  const login = async ({ email, password }) => {
    await api.get("/sanctum/csrf-cookie", { baseURL: process.env.NEXT_PUBLIC_API_BASE });
    const { data } = await api.post("/auth/login", { email, password });
    
    const userData = data.data.user;
    setUser(userData);
    redirectAfterLogin(userData);
    return userData;
  };

  const loginWithGoogle = () => {
    // Redirige vers le endpoint Google OAuth de Laravel
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/google/redirect`;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    setUser(null);
    // Au logout, on repart sur la racine qui gérera la locale
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, redirectAfterLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
