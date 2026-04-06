"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react"
import { useToastStore } from "@/store/toastStore"
import { cn } from "@/lib/utils"

const toastIcons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />
}

export function Toaster() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed z-50 flex flex-col gap-2 p-4 bottom-0 sm:bottom-auto sm:top-0 sm:right-0 w-full sm:w-auto overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto w-full sm:w-96 rounded-lg border bg-white p-4 shadow-lg dark:bg-slate-950 flex items-start gap-3",
              toast.type === "error" && "border-red-200 dark:border-red-900/50",
              toast.type === "success" && "border-green-200 dark:border-green-900/50",
              toast.type === "warning" && "border-amber-200 dark:border-amber-900/50",
              (!toast.type || toast.type === "info") && "border-slate-200 dark:border-slate-800"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toastIcons[toast.type || "info"]}
            </div>
            
            <div className="flex-1 space-y-1">
              {toast.title && (
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {toast.title}
                </h3>
              )}
              {toast.message && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {toast.message}
                </p>
              )}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
