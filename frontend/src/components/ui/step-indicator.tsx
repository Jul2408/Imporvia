"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Step {
  id: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              stepIdx !== steps.length - 1 ? "flex-1" : "",
              "relative flex items-center"
            )}
          >
            {step.id < currentStep ? (
              // Completed
              <div className="group flex flex-col items-center">
                <span className="flex h-9 items-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600"
                  >
                    <Check className="h-4 w-4 text-white" aria-hidden="true" />
                  </motion.span>
                </span>
                <span className="mt-2 hidden sm:block text-xs font-medium text-primary-700">{step.label}</span>
              </div>
            ) : step.id === currentStep ? (
              // Current
              <div className="flex flex-col items-center" aria-current="step">
                <span className="flex h-9 items-center" aria-hidden="true">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                  </span>
                </span>
                <span className="mt-2 hidden sm:block text-xs font-semibold text-primary-700">{step.label}</span>
              </div>
            ) : (
              // Upcoming
              <div className="flex flex-col items-center">
                <span className="flex h-9 items-center" aria-hidden="true">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </span>
                </span>
                <span className="mt-2 hidden sm:block text-xs font-medium text-text-muted">{step.label}</span>
              </div>
            )}

            {/* Connector */}
            {stepIdx !== steps.length - 1 && (
              <div className="absolute left-0 top-4 flex w-full items-center" aria-hidden="true">
                <div className="h-0.5 w-full">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      step.id < currentStep ? "bg-primary-600" : "bg-border"
                    )}
                  />
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
