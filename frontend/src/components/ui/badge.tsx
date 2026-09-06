import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-primary-900 text-white hover:bg-primary-800",
    secondary: "bg-primary-100 text-primary-900 hover:bg-primary-200",
    destructive: "bg-error text-white hover:bg-red-600",
    success: "bg-success-light text-success border border-success",
    warning: "bg-warning-light text-orange-700 border border-orange-300",
    info: "bg-info-light text-info border border-info",
    outline: "text-text-primary border border-border",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
