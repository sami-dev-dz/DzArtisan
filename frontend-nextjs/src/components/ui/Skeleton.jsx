import { cn } from "@/lib/utils"

/**
 * Skeleton — Composant de chargement standard (style YouTube / Udemy).
 * Utilise une animation de shimmer douce et des couleurs neutres.
 *
 * @param {string} className - Classes Tailwind pour la forme et la taille.
 * @param {object} props - Props div standard.
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
