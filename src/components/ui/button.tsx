import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          "h-9 px-4 py-2",
          variant === 'default' && "bg-[var(--accent-primary)] text-white hover:opacity-90",
          variant === 'outline' && "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
          variant === 'ghost' && "hover:bg-[var(--bg-glass)] text-[var(--text-primary)]",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
