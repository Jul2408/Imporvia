"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calculator, CheckSquare, AlertTriangle, FileBox, Plus } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { AlertBox } from "@/components/dashboard/AlertBox"
import { Timeline } from "@/components/dashboard/Timeline"
import { ChartCard } from "@/components/dashboard/ChartCard"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"

interface Simulation {
  id: string
  reference: string
  status: string
  created_at: string
  cif_value: string
}

export default function DashboardPage() {
  const { user, company } = useAuth()
  const [simulations, setSimulations] = React.useState<Simulation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    apiClient.get("/simulations/")
      .then(res => setSimulations(res.data?.results || res.data || []))
      .catch(() => setSimulations([]))
      .finally(() => setIsLoading(false))
  }, [])

  // Compute KPIs from real data
  const completedSims = simulations.filter(s => s.status === "COMPLETED").length
  const totalSims = simulations.length

  const timelineData = simulations.slice(0, 5).map((s, i) => ({
    id: s.id,
    time: new Date(s.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    title: "Simulation créée",
    description: s.reference,
    type: "simulation" as const,
  }))

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Bonjour {user?.first_name || user?.email?.split("@")[0]} 👋
            </h1>
            <p className="mt-2 text-base text-text-secondary">
              {company ? `Espace de ${company.name}` : "Voici l'état de vos opérations d'importation aujourd'hui."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/verification">
              <Button variant="secondary" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Vérifier
              </Button>
            </Link>
            <Link href="/simulation/nouvelle">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Nouvelle simulation
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs from real data */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard 
            title="Simulations"
            value={isLoading ? "—" : totalSims}
            trend={0}
            trendLabel="au total"
            icon={<Calculator className="h-5 w-5" />}
            delay={0.1}
          />
          <KpiCard 
            title="Terminées"
            value={isLoading ? "—" : completedSims}
            trend={0}
            trendLabel="complétées"
            icon={<CheckSquare className="h-5 w-5" />}
            delay={0.2}
          />
          <KpiCard 
            title="En attente"
            value={isLoading ? "—" : simulations.filter(s => s.status === "DRAFT").length}
            trend={0}
            trendLabel="à traiter"
            icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
            delay={0.3}
          />
          <KpiCard 
            title="Opérations en cours"
            value={isLoading ? "—" : simulations.filter(s => s.status === "PROCESSING").length}
            trend={0}
            trendLabel="en cours"
            icon={<FileBox className="h-5 w-5" />}
            delay={0.4}
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartCard />
          </div>
          <div>
            <Card className="h-full premium-card">
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
                  </div>
                ) : timelineData.length > 0 ? (
                  <Timeline items={timelineData} />
                ) : (
                  <p className="text-sm text-text-muted text-center py-8">Aucune activité récente.<br/>Créez votre première simulation.</p>
                )}
                <Link href="/historique">
                  <Button variant="ghost" className="w-full mt-4 text-primary-600">
                    Voir tout l&apos;historique
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
