import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  label, 
  error, 
  helperText, 
  id, 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  
  const generatedId = React.useId()
  const inputId = id || generatedId
  const isPassword = type === "password"
  const actualType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={actualType}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            isPassword && "pr-10", // make room for the eye icon
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" id={`${inputId}-description`}>
          {helperText}
        </p>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
