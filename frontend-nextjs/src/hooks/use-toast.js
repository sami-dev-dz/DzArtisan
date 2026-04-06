"use client";

import { useToastStore } from "@/store/toastStore";

/**
 * useToast – drop-in compatibility hook for components expecting the shadcn/ui useToast API.
 * Delegates to our existing Zustand-based toastStore so the app has a single toast system.
 *
 * Usage:
 *   const { toast } = useToast()
 *   toast({ title: "Success", description: "Done!", variant: "default" | "destructive" | "success" })
 */
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  const toast = ({ title, description, variant = "default" }) => {
    const typeMap = {
      destructive: "error",
      success: "success",
      default: "info",
    };

    addToast({
      title,
      message: description,
      type: typeMap[variant] ?? "info",
    });
  };

  return { toast };
}
