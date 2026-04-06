import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function Select({
  options = [], // Format: [{ label: "Group", options: [{ value: "1", label: "Option 1" }] }] or simple [{ value: "1", label: "Option 1" }]
  value,
  onChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  label,
  error,
  helperText,
  id,
  className,
  disabled = false,
  isSearchable = true,
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const containerRef = React.useRef(null)
  const searchInputRef = React.useRef(null)

  const generatedId = React.useId()
  const selectId = id || generatedId

  // Format options to handle both grouped and flat lists
  const isGrouped = options.length > 0 && 'options' in options[0];
  
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    if (isGrouped) {
      return options.map(group => ({
        ...group,
        options: group.options.filter(opt => 
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(group => group.options.length > 0);
    }
    
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, isGrouped]);

  const selectedLabel = React.useMemo(() => {
    if (!value) return null;
    
    if (isGrouped) {
      for (const group of options) {
        const found = group.options.find(opt => opt.value === value);
        if (found) return found.label;
      }
    } else {
      const found = options.find(opt => opt.value === value);
      if (found) return found.label;
    }
    return null;
  }, [value, options, isGrouped]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus()
    } else if (!isOpen) {
      setSearchTerm("")
    }
  }, [isOpen, isSearchable])

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  const renderOptionList = (opts) => {
    return opts.map((option) => (
      <div
        key={option.value}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-50",
          value === option.value ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50 font-medium" : ""
        )}
        onClick={() => handleSelect(option.value)}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {value === option.value && <Check className="h-4 w-4" />}
        </span>
        <span className="truncate">{option.label}</span>
      </div>
    ))
  }

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            className
          )}
        >
          <span className={cn("truncate", !selectedLabel && "text-slate-500 dark:text-slate-400")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-80 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
            {isSearchable && (
              <div className="flex items-center border-b border-slate-200 px-3 pb-1 pt-2 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={searchInputRef}
                  className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            <div className="pt-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">Aucun résultat trouvé.</div>
              ) : isGrouped ? (
                filteredOptions.map((group, i) => (
                  <div key={i}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {group.label}
                    </div>
                    {renderOptionList(group.options)}
                  </div>
                ))
              ) : (
                renderOptionList(filteredOptions)
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" id={`${selectId}-error`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" id={`${selectId}-description`}>
          {helperText}
        </p>
      )}
    </div>
  )
}
