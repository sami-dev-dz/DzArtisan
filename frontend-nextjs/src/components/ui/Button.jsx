import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variants: {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent",
  },
  sizes: {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 py-2 text-base rounded-md",
    lg: "h-12 px-8 text-lg rounded-lg",
  }
}

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  isLoading = false,
  fullWidth = false,
  asChild = false, 
  children,
  disabled,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
  const variantStyles = buttonVariants.variants[variant] || buttonVariants.variants.primary
  const sizeStyles = buttonVariants.sizes[size] || buttonVariants.sizes.md
  const widthStyles = fullWidth ? "w-full" : ""

  return (
    <Comp
      className={cn(baseStyles, variantStyles, sizeStyles, widthStyles, className)}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
