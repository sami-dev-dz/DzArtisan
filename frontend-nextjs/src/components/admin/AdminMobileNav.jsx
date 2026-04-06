"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Briefcase, CreditCard,
  ClipboardList, BarChart3, Settings, Menu, X,
  ShieldCheck, LogOut, MessageSquareWarning
} from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { useAuth } from "@/context/AuthContext"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard/admin",               label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/admin/users",          label: "Clients",        icon: Users },
  { href: "/dashboard/admin/artisans/validation", label: "Artisans",       icon: Briefcase, badge: "pending_artisans" },
  { href: "/dashboard/admin/subscriptions",  label: "Abonnements",    icon: CreditCard },
  { href: "/dashboard/admin/interventions",  label: "Demandes",       icon: ClipboardList,           badge: "interventions" },
  { href: "/dashboard/admin/complaints",     label: "Plaintes",       icon: MessageSquareWarning,    badge: "unread_complaints" },
  { href: "/dashboard/admin/statistics",     label: "Statistiques",   icon: BarChart3 },
  { href: "/dashboard/admin/settings",       label: "Réglages",       icon: Settings },
]

export function AdminMobileNav({ pendingCounts = {} }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const locale = useLocale()

  return (
    <>
      {/* Top Bar */}
      <header className="lg:hidden h-16 bg-white dark:bg-[#0a0f1e] border-b border-slate-100 dark:border-white/5 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm text-slate-900 dark:text-white">Admin Panel</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="h-9 w-9 rounded-xl">
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-[100] w-72 bg-white dark:bg-[#0a0f1e] border-r border-slate-100 dark:border-white/5 flex flex-col lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">Admin Panel</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8 rounded-xl">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const badgeCount = item.badge ? (pendingCounts[item.badge] ?? 0) : 0
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}>
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="font-bold text-sm flex-1">{item.label}</span>
                        {badgeCount > 0 && (
                          <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black text-white bg-red-500 flex items-center justify-center">
                            {badgeCount}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="p-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600 text-sm">
                    {user?.nomComplet?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{user?.nomComplet}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Admin</p>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full h-10 justify-start gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
