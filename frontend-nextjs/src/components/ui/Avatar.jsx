import * as React from "react"
import NextImage from "next/image"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt = "Avatar", 
  initials, 
  size = "md",
  isOnline = false,
  showIndicator = false,
  ...props 
}, ref) => {
  const [imageError, setImageError] = React.useState(false)

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  }

  const indicatorSizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-4 w-4"
  }

  // Generate background color based on initials
  const getAvatarBg = (initials) => {
    if (!initials) return "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
    
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
    ];
    
    // Simple hash function for consistent color
    const hash = initials.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  const showImage = src && !imageError;
  const avatarBg = !showImage ? getAvatarBg(initials) : "";

  return (
    <div className="relative inline-block" ref={ref} {...props}>
      <div 
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full font-medium items-center justify-center select-none",
          sizeClasses[size] || sizeClasses.md,
          avatarBg,
          className
        )}
      >
        {showImage ? (
          <NextImage
            src={src}
            alt={alt}
            fill
            unoptimized
            onError={() => setImageError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span className="uppercase tracking-wide">{initials?.substring(0, 2) || "?"}</span>
        )}
      </div>
      
      {showIndicator && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-950",
            indicatorSizeClasses[size] || indicatorSizeClasses.md,
            isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
          )} 
          title={isOnline ? "En ligne" : "Hors ligne"}
        />
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

export { Avatar }
