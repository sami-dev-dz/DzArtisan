"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, LogOut, LayoutDashboard, User, ShieldCheck } from "lucide-react"
import { useUIStore } from "@/store/uiStore"
import { useAuthStore } from "@/store/authStore"
import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { ThemeToggle } from "./ThemeToggle"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Button } from "./Button"
import { Avatar } from "./Avatar"
import { cn } from "@/lib/utils"

export function MobileDrawer({ isOpen, onClose, links = [] }) {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const { user, isAuthenticated, logout, role } = useAuthStore()
  const isRTL = locale === "ar"

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const drawerVariants = {
    closed: {
      x: isRTL ? "-100%" : "100%",
      transition: { type: "spring", damping: 30, stiffness: 300 }
    },
    open: {
      x: 0,
      transition: { type: "spring", damping: 30, stiffness: 300 }
    }
  }

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          {/* Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className={cn(
              "fixed inset-y-0 z-70 flex w-4/5 max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-950",
              isRTL ? "left-0 border-r border-slate-200 dark:border-slate-800" : "right-0 border-l border-slate-200 dark:border-slate-800"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="DzArtisan" width={24} height={24} className="w-auto h-auto object-contain" />
                </div>
                <span className="text-lg font-bold text-blue-600">DzArtisan</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Profile info if authenticated */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50">
                <Avatar initials={user.name?.[0]} />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tight font-medium">{role}</span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-all"
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Footer / Controls */}
            <div className="mt-auto border-t border-slate-100 p-4 dark:border-slate-800/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Thème</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Langue</span>
                <LanguageSwitcher />
              </div>

              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/login" onClick={onClose} className="w-full">
                    <Button variant="secondary" className="w-full justify-center">{t('login')}</Button>
                  </Link>
                  <Link href="/register" onClick={onClose} className="w-full">
                    <Button variant="primary" className="w-full justify-center">{t('register')}</Button>
                  </Link>
                </div>
              ) : (
                <Button 
                  variant="danger" 
                  className="w-full justify-center mt-2 group" 
                  onClick={() => { logout(); onClose(); }}
                >
                  <LogOut className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  {t('logout')}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
