"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
  const { setUser, redirectAfterLogin } = useAuth();

  useEffect(() => {
    const sync = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Échange du token contre une session session réelle (en GET pour plus de stabilité)
        const { data } = await api.get(`/auth/google/sync-session?token=${token}`);
        
        if (data.success) {
          setUser(data.user);
          redirectAfterLogin(data.user);
        } else {
          window.location.href = "/login?error=sync_failed";
        }
      } catch (err) {
        console.error("Sync error:", err);
        window.location.href = "/login?error=sync_error";
      }
    };

    sync();
  }, [setUser, redirectAfterLogin]);

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
