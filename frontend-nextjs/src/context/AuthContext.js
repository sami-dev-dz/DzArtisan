'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
        // Si on est sur la page callback Google, ne PAS interférer — 
        // la callback page gère le token et la navigation elle-même
        if (window.location.pathname.includes('/google/callback')) {
          setLoading(false);
          return;
        }

        // Vérifier si un token Google est stocké (après redirect depuis callback page)
        const storedToken = localStorage.getItem('google_auth_token');
        let userData = null;

        if (storedToken) {
          // Si on a un token Google, on doit appeler le endpoint specifique pour initialiser la session web
          const { data } = await api.get('/auth/google/sync-session', {
             params: { token: storedToken }
          });
          userData = data?.user;
          
          // Nettoyage après succès
          localStorage.removeItem('google_auth_token');
        } else {
          // Sinon, charger la session habituelle par cookie
          const { data } = await api.get('/auth/me');
          userData = data?.data?.user;
        }

        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        // En cas d'erreur, nettoyer tout
        localStorage.removeItem('google_auth_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const redirectAfterLogin = useCallback((u) => {
    if (u.type === "admin")   return router.push("/dashboard/admin");
    if (u.type === "artisan") {
      if (u.needs_artisan_onboarding) return router.push("/onboarding/artisan/profile");
      if (u.artisan?.statutValidation === "en_attente") return router.push("/onboarding/artisan/waiting");
      
      // Check if artisan lacks an active subscription
      const hasPlan = u.artisan?.abonnement && u.artisan?.abonnement?.plan !== 'none';
      if (!hasPlan) return router.push("/onboarding/artisan/subscription");

      return router.push("/dashboard/artisan");
    }
    if (u.type === "client") {
      return router.push("/dashboard/client");
    }
    // Fallback if type is missing
    router.push("/");
  }, [router]);

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
    <AuthContext.Provider value={{ user, setUser, loading, login, register, loginWithGoogle, logout, redirectAfterLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
