"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRating({ 
  value = 0, 
  onChange, 
  max = 5,
  readOnly = false,
  showCount = false,
  reviewCount = 0,
  className,
  size = "md"
}) {
  const [hoverValue, setHoverValue] = React.useState(0)
  
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const iconClass = sizeClasses[size] || sizeClasses.md

  const handleMouseEnter = (index) => {
    if (!readOnly) {
      setHoverValue(index)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0)
    }
  }

  const handleClick = (index) => {
    if (!readOnly && onChange) {
      onChange(index)
    }
  }

  // Display value takes hover state priority if interactive
  const displayValue = hoverValue > 0 ? hoverValue : value

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div 
        className="flex"
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(max)].map((_, i) => {
          const ratingValue = i + 1;
          const isFilled = ratingValue <= displayValue;
          
          return (
            <button
              key={ratingValue}
              type="button"
              disabled={readOnly}
              className={cn(
                "p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm transition-colors",
                readOnly && "cursor-default"
              )}
              onClick={() => handleClick(ratingValue)}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
              aria-label={readOnly ? `Note globale : ${value} sur ${max}` : `Noter ${ratingValue} sur ${max}`}
            >
              <Star 
                className={cn(
                  iconClass,
                  "transition-all",
                  isFilled 
                    ? "fill-amber-400 text-amber-400" 
                    : "fill-transparent text-slate-300 dark:text-slate-600",
                  !readOnly && "hover:scale-110"
                )} 
              />
            </button>
          )
        })}
      </div>
      
      {showCount && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
          {Number(value).toFixed(1)} 
          <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
            ({reviewCount} avis)
          </span>
        </span>
      )}
    </div>
  )
}
