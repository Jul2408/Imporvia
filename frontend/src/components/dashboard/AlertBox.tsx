import * as React from "react"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AlertBoxProps {
  title: string
  reference: string
  description: string
  actionLabel: string
  onAction?: () => void
}

export function AlertBox({ title, reference, description, actionLabel, onAction }: AlertBoxProps) {
  return (
    <Card className="border-warning-light bg-warning-light/30 shadow-none overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4">
        <div className="flex gap-4">
          <div className="shrink-0 mt-0.5">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold text-orange-900">{title}</h4>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
              <span className="font-medium text-orange-800">{reference}</span>
              <span className="hidden sm:inline text-orange-300">•</span>
              <span className="text-orange-700">{description}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 sm:ml-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto bg-white border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 group-hover:border-orange-300"
            onClick={onAction}
          >
            {actionLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
