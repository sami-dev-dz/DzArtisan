"use client";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
  const hasSynced = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-mount in dev
    if (hasSynced.current) return;
    hasSynced.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      window.location.href = "/en/login";
      return;
    }

    // Store token in localStorage for the AuthContext to pick up on next page load
    localStorage.setItem('google_auth_token', token);
    
    // Navigate to the client dashboard — AuthContext.restoreSession will 
    // detect the stored token, authenticate via /auth/me, and redirect properly
    window.location.href = "/en/dashboard/client";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1e]">
      <div className="relative flex flex-col items-center gap-4">
        <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white relative z-10">
          Connexion avec Google...
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">
          Finalisation de votre profil en cours
        </p>
      </div>
    </div>
  );
}

