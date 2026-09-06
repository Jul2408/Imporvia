"use client"

import * as React from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon: React.ReactNode
  delay?: number
}

function Counter({ from, to }: { from: number; to: number }) {
  const [count, setCount] = React.useState(from)
  
  React.useEffect(() => {
    let startTime: number
    const duration = 1000 // 1s animation
    
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(from + (to - from) * easeOut))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [from, to])
  
  return <span>{count}</span>
}

export function KpiCard({ title, value, trend, trendLabel, icon, delay = 0 }: KpiCardProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="premium-card overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              {icon}
            </div>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                trend >= 0 ? "text-success" : "text-error"
              )}>
                {trend >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold tracking-tight text-text-primary">
                {typeof value === 'number' && isInView ? <Counter from={0} to={value} /> : value}
              </h3>
              {trendLabel && (
                <span className="text-xs text-text-muted">{trendLabel}</span>
              )}
            </div>
          </div>
        </CardContent>
        {/* Subtle decorative background gradient */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-50 pointer-events-none" />
      </Card>
    </motion.div>
  )
}
