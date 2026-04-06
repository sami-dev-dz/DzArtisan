"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext({})

export function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef(null)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, asChild }) {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext)

  const toggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(!open)
  }

  if (asChild) {
      // eslint-disable-next-line react-hooks/refs
    return React.cloneElement(children, {
      onClick: toggle,
      ref: triggerRef,
      "aria-haspopup": "true",
      "aria-expanded": open,
    })
  }

  return (
    <button
      ref={triggerRef}
      onClick={toggle}
      className="inline-flex items-center justify-center"
      aria-haspopup="true"
      aria-expanded={open}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, align = "end", className }) {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext)
  const menuRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen, triggerRef])

  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-xl shadow-slate-200/50 dark:border-white/5 dark:bg-slate-900 dark:shadow-none",
            alignClasses[align],
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DropdownMenuItem({ children, onClick, className }) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.()
    setOpen(false)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuLabel({ children, className }) {
  return (
    <div className={cn("px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className }) {
  return <div className={cn("my-1 h-px bg-slate-100 dark:bg-white/5", className)} />
}
