"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Lun", simulations: 12, verifications: 8 },
  { name: "Mar", simulations: 18, verifications: 10 },
  { name: "Mer", simulations: 14, verifications: 15 },
  { name: "Jeu", simulations: 25, verifications: 12 },
  { name: "Ven", simulations: 22, verifications: 18 },
  { name: "Sam", simulations: 10, verifications: 5 },
  { name: "Dim", simulations: 8, verifications: 4 },
]

export function ChartCard() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="h-75 w-full bg-slate-100 animate-pulse rounded-xl" />

  return (
    <Card className="premium-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Activité des opérations</CardTitle>
            <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
          </div>
          <select className="text-sm border border-border rounded-md px-2 py-1 bg-surface text-text-secondary outline-none focus:ring-1 focus:ring-primary-500">
            <option>7 jours</option>
            <option>30 jours</option>
            <option>3 mois</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSimulations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="varprimary-500" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="varprimary-500" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVerifs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="varsuccess" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="varsuccess" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="varborder" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'vartext-muted' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'vartext-muted' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid varborder', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              />
              <Area 
                type="monotone" 
                dataKey="simulations" 
                stroke="varprimary-500" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSimulations)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="verifications" 
                stroke="varsuccess" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorVerifs)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
