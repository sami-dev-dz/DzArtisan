"use client";

import * as React from "react"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.type === "admin") {
      router.replace("/dashboard/admin");
    } else if (user.type === "artisan") {
      if (user.status === "en_attente") {
        router.replace("/pending");
      } else {
        router.replace("/dashboard/artisan");
      }
    } else if (user.type === "client") {
      router.replace("/dashboard/client");
    } else {
      router.replace("/");
    }
  }, [user, loading, router]);

  return (
    <div className="flex-1 flex items-center justify-center p-20">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );
}
