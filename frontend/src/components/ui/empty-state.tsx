import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
      )}
      {(actionLabel || onAction) && (
        actionHref ? (
          <a href={actionHref}>
            <Button variant="secondary">{actionLabel}</Button>
          </a>
        ) : (
          <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  )
}
