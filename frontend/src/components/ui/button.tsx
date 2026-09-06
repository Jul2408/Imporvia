import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Manual mapping for variants (premium SaaS look)
    const variantClasses = {
      default: "bg-primary-900 text-white shadow-sm hover:bg-primary-800 active:scale-[0.98]",
      destructive: "bg-error text-white shadow-sm hover:bg-red-600 active:scale-[0.98]",
      outline: "border border-border bg-transparent shadow-sm hover:bg-surface-hover hover:text-primary-900 active:scale-[0.98]",
      secondary: "bg-primary-100 text-primary-900 shadow-sm hover:bg-primary-200 active:scale-[0.98]",
      ghost: "hover:bg-surface-hover hover:text-primary-900 active:scale-[0.98]",
      link: "text-primary-600 underline-offset-4 hover:underline",
    }
    
    const sizeClasses = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
