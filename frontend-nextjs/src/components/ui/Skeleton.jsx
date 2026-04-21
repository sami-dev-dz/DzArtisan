import { cn } from "@/lib/utils"

/**
 * Skeleton — Composant de chargement standard (style YouTube / Udemy).
 * Utilise une animation de pulsation douce et des couleurs neutres.
 *
 * @param {string} className - Classes Tailwind pour la forme et la taille.
 * @param {object} props - Props div standard.
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
