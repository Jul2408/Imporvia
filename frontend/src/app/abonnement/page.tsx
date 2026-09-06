"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, CreditCard, Download, Zap, Users, BarChart3, Shield } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"

const features = [
  { label: "Simulations illimitées", icon: Zap },
  { label: "Vérifications illimitées", icon: CheckCircle2 },
  { label: "Jusqu'à 5 collaborateurs", icon: Users },
  { label: "Rapports exportables", icon: BarChart3 },
  { label: "Support prioritaire", icon: Shield },
]

const invoices = [
  { id: "FAC-2026-08", date: "1 août 2026", amount: "150 000 FCFA", status: "Payée" },
  { id: "FAC-2026-07", date: "1 juillet 2026", amount: "150 000 FCFA", status: "Payée" },
  { id: "FAC-2026-06", date: "1 juin 2026", amount: "150 000 FCFA", status: "Payée" },
]

export default function AbonnementPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <PageHeader
          title="Abonnement"
          description="Gérez votre plan et votre facturation."
        />

        {/* Current Plan Hero */}
        <Card className="bg-primary-950 text-white border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs font-semibold">
                    PLAN ACTIF
                  </Badge>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-1">PRO</h2>
                <p className="text-2xl font-bold text-white/80">
                  150 000 <span className="text-base font-normal text-white/50">FCFA / mois</span>
                </p>
                <p className="text-sm text-white/50 mt-3">
                  Prochaine échéance : <strong className="text-white/70">1 septembre 2026</strong>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white gap-2">
                  <CreditCard className="h-4 w-4" /> Gérer l'abonnement
                </Button>
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 text-sm">
                  Changer de plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Features */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-base">Ce qui est inclus dans votre plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-text-primary">{f.label}</span>
                    <CheckCircle2 className="h-4 w-4 text-success ml-auto shrink-0" />
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>

          {/* Usage */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-base">Utilisation ce mois</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Simulations", used: 24, max: "∞" },
                { label: "Vérifications", used: 17, max: "∞" },
                { label: "Collaborateurs", used: 3, max: 5 },
                { label: "Rapports générés", used: 8, max: "∞" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-text-secondary">{stat.label}</span>
                    <span className="font-semibold text-text-primary">
                      {stat.used}{typeof stat.max === "number" ? ` / ${stat.max}` : ""}
                    </span>
                  </div>
                  {typeof stat.max === "number" && (
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.used / stat.max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full bg-primary-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Invoices */}
        <Card className="premium-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Historique des paiements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {invoices.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between py-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{inv.id}</p>
                    <p className="text-xs text-text-muted">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-text-primary">{inv.amount}</span>
                    <Badge variant="success">{inv.status}</Badge>
                    <Button variant="ghost" size="sm" className="gap-1 text-text-muted">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
