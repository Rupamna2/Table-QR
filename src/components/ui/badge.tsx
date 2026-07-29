import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'success' | 'gold'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variant === 'default' && "border-transparent bg-[var(--bg-glass)] text-[var(--text-primary)]",
        variant === 'outline' && "border-[var(--border-default)] text-[var(--text-muted)]",
        variant === 'success' && "border-transparent bg-[var(--state-success)]/10 text-[var(--state-success)]",
        variant === 'gold' && "border-transparent bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
