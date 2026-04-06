import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  primary: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
  outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800"
}

function Badge({ className, variant = "primary", ...props }) {
  const variantStyles = badgeVariants[variant] || badgeVariants.primary

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 w-fit",
        variantStyles,
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
