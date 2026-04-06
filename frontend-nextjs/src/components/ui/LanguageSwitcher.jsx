"use client"

import * as React from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Globe, Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇩🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
]

export function LanguageSwitcher({ className, showLabel = true }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = React.useRef(null)

  const searchParams = useSearchParams()

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  const handleLanguageChange = (newLocale) => {
    setIsOpen(false)
    const currentParams = searchParams.toString()
    const url = currentParams ? `${pathname}?${currentParams}` : pathname
    router.replace(url, { locale: newLocale })
  }

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
        aria-label="Changer de langue"
        aria-expanded={isOpen}
      >
        <span className="text-lg leading-none">{currentLanguage.flag}</span>
        {showLabel && (
          <span className="text-sm font-medium uppercase text-slate-700 dark:text-slate-300">
            {locale}
          </span>
        )}
        <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-800 dark:bg-slate-950 z-50 overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm py-2 px-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                  locale === lang.code ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 font-medium" : "text-slate-700 dark:text-slate-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {locale === lang.code && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
