"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "@/store/uiStore"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useUIStore()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className={cn("p-2 h-9 w-9 rounded-md bg-slate-100 dark:bg-slate-800", className)} />
  )

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden h-9 w-9",
        className
      )}
      aria-label="Changer de thème"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: 45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: -45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
