"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Wrench, Calendar, Clock, Star, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export default function ClientDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 relative z-10 w-full h-full text-slate-100">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Bonjour, {user?.nomComplet || "Client"} !
          </h1>
          <p className="text-slate-400">
            Trouvez les meilleurs artisans pour vos travaux.
          </p>
        </div>
        <Link href="/dashboard/interventions/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20">
          Nouvelle demande
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Interventions actives", value: "0", icon: Wrench, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "En attente de devis", value: "0", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Artisans favoris", value: "0", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
