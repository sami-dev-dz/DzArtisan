import { cn } from "@/lib/utils";

/**
 * Card – a versatile container used across the admin and dashboard sections.
 * Supports composable sub-components: Card.Header, Card.Title, Card.Content, Card.Footer.
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        "text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
