"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck,
  Home,
  Wrench
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const Logo = ({ isRTL }) => (
  <Link href="/" className="flex items-center gap-3 group mb-8">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm overflow-hidden transition-transform group-hover:scale-105">
      <Home className="h-5 w-5 absolute -translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
      <Wrench className="h-4 w-4 absolute translate-y-3 group-hover:translate-y-0.5 transition-transform duration-300 rotate-12" />
    </div>
    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
      DzArtisan
    </span>
  </Link>
)

export function Footer() {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const isRTL = locale === "ar"

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#0A0D14] pt-20 pb-10 border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & About (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col rtl:items-start">
            <Logo isRTL={isRTL} />
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              La plateforme de référence en Algérie pour la mise en relation entre clients et artisans qualifiés. Performance, sécurité et proximité garanties.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FacebookIcon, href: "#" },
                { icon: InstagramIcon, href: "#" },
                { icon: LinkedinIcon, href: "#" },
                { icon: TwitterIcon, href: "#" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
               <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
               <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Plateforme vérifiée & sécurisée
               </span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col rtl:items-start">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Explorez</h4>
            <ul className="space-y-3">
              {[
                { label: "Trouver un artisan", href: "/artisans" },
                { label: "Publier une demande", href: "/requests/new" },
                { label: "Tarifs artisans", href: "/pricing" },
                { label: "Villes desservies", href: "/coverage" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-500 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Help */}
          <div className="flex flex-col rtl:items-start">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                { label: "Conditions d'utilisation", href: "/terms" },
                { label: "Confidentialité", href: "/privacy" },
                { label: "Centre d'aide", href: "/help" },
                { label: "Questions fréquentes", href: "/faq" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-500 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Inf */}
          <div className="flex flex-col rtl:items-start">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                 <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                 <span className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                   Siège social: Alger,<br />Algérie 16000
                 </span>
              </li>
              <li className="flex items-center gap-3">
                 <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                 <a href="tel:+213555555555" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    +213 (0) 555 55 55 55
                 </a>
              </li>
              <li className="flex items-center gap-3">
                 <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                 <a href="mailto:contact@dzartisan.dz" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    contact@dzartisan.dz
                 </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {currentYear} DzArtisan. Tous droits réservés. 🇩🇿
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span>Conforme à la loi 18-07</span>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <span className="hidden sm:inline">Hébergé en Algérie</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
