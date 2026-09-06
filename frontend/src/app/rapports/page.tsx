"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Download, FileText, BarChart3, Plus } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"

const reports = [
  {
    id: "RAP-2026-08",
    title: "Synthèse mensuelle — Août 2026",
    type: "Mensuel",
    createdAt: "27 août 2026",
    createdBy: "Laurent A.",
    operations: 31,
    status: "Disponible",
  },
  {
    id: "RAP-2026-07",
    title: "Synthèse mensuelle — Juillet 2026",
    type: "Mensuel",
    createdAt: "1 août 2026",
    createdBy: "Laurent A.",
    operations: 28,
    status: "Disponible",
  },
  {
    id: "RAP-2026-Q2",
    title: "Rapport trimestriel — Q2 2026",
    type: "Trimestriel",
    createdAt: "15 juillet 2026",
    createdBy: "Marie D.",
    operations: 87,
    status: "Disponible",
  },
  {
    id: "RAP-2026-06",
    title: "Synthèse mensuelle — Juin 2026",
    type: "Mensuel",
    createdAt: "1 juillet 2026",
    createdBy: "Laurent A.",
    operations: 22,
    status: "Disponible",
  },
]

const typeColor: Record<string, string> = {
  Mensuel: "info",
  Trimestriel: "secondary",
  Annuel: "default",
}

export default function RapportsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Rapports"
          description="Consultez et téléchargez vos rapports d'activité."
          actions={
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" /> Générer un rapport
            </Button>
          }
        />

        {reports.length === 0 ? (
          <Card className="premium-card">
            <EmptyState
              icon={<BarChart3 className="h-8 w-8" />}
              title="Aucun rapport disponible"
              description="Générez votre premier rapport à partir des données de vos opérations."
              actionLabel="Générer un rapport"
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="premium-card group hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <Badge variant={typeColor[report.type] as "info" | "secondary" | "default"}>
                        {report.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1">{report.title}</h3>
                    <p className="text-xs text-text-muted mb-4">
                      Créé le {report.createdAt} · {report.createdBy} · {report.operations} opérations
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        ● {report.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="h-3.5 w-3.5" /> Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
