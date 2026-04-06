import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ 
  className, 
  label, 
  error, 
  helperText, 
  id,
  maxLength,
  value,
  onChange,
  ...props 
}, ref) => {
  const generatedId = React.useId()
  const textareaId = id || generatedId
  
  // Use uncontrolled internal state if value is undefined (but we mostly expect controlled for character counter)
  const [internalValue, setInternalValue] = React.useState(props.defaultValue || "")
  
  const displayValue = value !== undefined ? value : internalValue
  const currentLength = String(displayValue).length

  const handleChange = (e) => {
    if (value === undefined) {
      setInternalValue(e.target.value)
    }
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-end mb-1.5">
          <label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
          
          {maxLength && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-description` : undefined}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" id={`${textareaId}-error`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" id={`${textareaId}-description`}>
          {helperText}
        </p>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
