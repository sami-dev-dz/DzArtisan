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
        const searchParams = new URLSearchParams(window.location.search);
        const urlToken = searchParams.get('token');
        const storedToken = localStorage.getItem('google_auth_token');
        let token = urlToken || storedToken;

        if (token) {
          // On force le token dans les entêtes pour cette session
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          if (urlToken) localStorage.setItem('google_auth_token', token);
        }

        const { data } = await api.get('/auth/me');
        const userData = data?.data?.user;

        if (userData) {
          setUser(userData);
          
          // Si on a utilisé un token Google, on nettoie et on redirige DIRECTEMENT
          if (token) {
            localStorage.removeItem('google_auth_token');
            // Nettoyage URL
            if (urlToken) {
              const cleanUrl = window.location.pathname.split('?')[0];
              window.history.replaceState({}, '', cleanUrl);
            }
            redirectAfterLogin(userData);
          }
        }
      } catch (err) {
        localStorage.removeItem('google_auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const redirectAfterLogin = (u) => {
    if (u.type === "admin")   return router.push("/dashboard/admin");
    if (u.type === "artisan") {
      if (u.needs_artisan_onboarding) return router.push("/onboarding/artisan/profile");
      if (u.artisan?.statutValidation === "en_attente") return router.push("/onboarding/artisan/waiting");
      return router.push("/dashboard/artisan");
    }
    if (u.type === "client") {
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

  const login = async ({ email, password, role }) => {
    await api.get("/sanctum/csrf-cookie", { baseURL: process.env.NEXT_PUBLIC_API_BASE });
    const { data } = await api.post("/auth/login", { email, password, role });
    
    const userData = data.data.user;
    setUser(userData);
    redirectAfterLogin(userData);
    return userData;
  };

  const loginWithGoogle = () => {
    // Redirige vers le endpoint Google OAuth de Laravel
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
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
