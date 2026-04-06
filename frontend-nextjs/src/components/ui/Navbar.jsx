"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Wrench, 
  Home, 
  Briefcase,
  Star,
  ShieldCheck,
  CreditCard,
  AlertOctagon
} from "lucide-react"

import { useAuthStore } from "@/store/authStore"
import { useUIStore } from "@/store/uiStore"
import { Button } from "./Button"
import { Avatar } from "./Avatar"
import { Badge } from "./Badge"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { ThemeToggle } from "./ThemeToggle"
import { MobileDrawer } from "./MobileDrawer"
import { NotificationBell } from "../layout/NotificationBell"
import { cn } from "@/lib/utils"

// Logo Component
const Logo = ({ isRTL }) => (
  <Link 
    href="/" 
    className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]"
  >
    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 overflow-hidden">
      <Home className="h-5 w-5 absolute -translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
      <Wrench className="h-4 w-4 absolute translate-y-3 group-hover:translate-y-0.5 transition-transform duration-300 rotate-12" />
    </div>
    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:block">
      DzArtisan
    </span>
  </Link>
)

export function Navbar() {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const pathname = usePathname()
  const { user, role, token, isAuthenticated, logout } = useAuthStore()
  const { theme } = useUIStore()
  
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  
  const isRTL = locale === "ar"
  const userMenuRef = React.useRef(null)

  // Handle scroll detection for glass effect
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus on click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Define links based on auth state and role
  const navLinks = React.useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: t("home"), href: "/", icon: Home },
        { label: t("services"), href: "/#services", icon: Briefcase },
        { label: t("how_it_works"), href: "/#how-it-works", icon: HelpCircle },
      ]
    }

    switch (role) {
      case "client":
        return [
          { label: t("browse_artisans"), href: "/artisans", icon: Search },
          { label: t("my_requests"), href: "/dashboard/requests", icon: Briefcase },
          { label: t("my_reviews"), href: "/dashboard/reviews", icon: Star },
        ]
      case "artisan":
        return [
          { label: t("profile"), href: "/dashboard/profile", icon: User },
          { label: t("my_subscription"), href: "/dashboard/subscription", icon: CreditCard },
          { label: t("my_complaints"), href: "/dashboard/complaints", icon: AlertOctagon },
        ]
      case "admin":
        return [
          { label: t("admin_dashboard"), href: "/dashboard/admin", icon: ShieldCheck },
        ]
      default:
        return [{ label: t("dashboard"), href: "/dashboard", icon: LayoutDashboard }]
    }
  }, [isAuthenticated, role, t])

  const dashboardPath = isAuthenticated ? "/dashboard" : "/"

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 py-2" 
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Logo isRTL={isRTL} />
            </div>

            {/* Center: Desktop Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                      isActive 
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10" 
                        : "text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute bottom-1 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right: Controls & User */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>

              {/* Auth Controls */}
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">{t("login")}</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="shadow-blue-500/20 shadow-lg">
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <NotificationBell />
                  
                  <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full transition-all hover:ring-2 hover:ring-blue-100 dark:hover:ring-blue-900/40 focus:outline-none"
                    aria-label="Menu utilisateur"
                  >
                    <Avatar 
                      initials={user?.name?.[0]} 
                      size="sm" 
                      showIndicator 
                      isOnline={true} 
                    />
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-sm font-semibold max-w-[120px] truncate">{user?.name || "Utilisateur"}</span>
                      <Badge variant="secondary" className="px-1 py-0 text-[10px] uppercase font-bold tracking-wider">
                        {role}
                      </Badge>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-950",
                          isRTL ? "left-0" : "right-0"
                        )}
                      >
                        <div className="px-3 py-2.5 mb-1 border-b border-slate-100 dark:border-slate-800 lg:hidden">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
                        </div>
                        
                        <Link href={dashboardPath} onClick={() => setIsUserMenuOpen(false)}>
                          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
                            <LayoutDashboard className="h-4 w-4 text-blue-500" />
                            <span className="font-medium group-hover:text-blue-600 transition-colors">{t("dashboard")}</span>
                          </div>
                        </Link>
                        
                        <Link href="/dashboard/profile" onClick={() => setIsUserMenuOpen(false)}>
                          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
                            <User className="h-4 w-4 text-blue-500" />
                            <span className="font-medium group-hover:text-blue-600 transition-colors">{t("profile")}</span>
                          </div>
                        </Link>

                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                        
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer group"
                        >
                          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                          <span className="font-medium">{t("logout")}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

              {/* Mobile Menu Icon */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={navLinks}
      />
    </>
  )
}
