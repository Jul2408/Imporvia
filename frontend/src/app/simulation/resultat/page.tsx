"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Download, Save, CheckSquare, Share2, Plus, ChevronDown, ChevronRight,
  Calculator, FileText, Printer 
} from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PdfReport } from "@/components/simulation/PdfReport"

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    let startTime: number
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * easeOut))
      if (progress < 1) requestAnimationFrame(animate)
    }
    setTimeout(() => requestAnimationFrame(animate), 300)
  }, [target, duration])

  return <>{count.toLocaleString("fr-FR")}</>
}

const breakdown = [
  { label: "Valeur en douane (CIF)", value: 32_750_000, color: "bg-blue-100 text-blue-700" },
  { label: "Droits de douane (15%)", value: 4_912_500, color: "bg-orange-100 text-orange-700" },
  { label: "TVA (18%)", value: 6_781_950, color: "bg-purple-100 text-purple-700" },
  { label: "Redevance statistique (1%)", value: 327_500, color: "bg-slate-100 text-slate-700" },
  { label: "PRÉLÈVEMENT COMMUNAUTAIRE (1%)", value: 327_500, color: "bg-slate-100 text-slate-700" },
]

const totalDroits = 4_250_000
const grandTotal = 44_099_450

const calcSteps = [
  {
    title: "Valeur FOB",
    description: "Prix d'achat de la marchandise selon facture",
    value: "30 000 USD = 18 600 000 FCFA",
  },
  {
    title: "Valeur CIF",
    description: "Valeur FOB + Fret (950 000) + Assurance (200 000)",
    value: "19 750 000 FCFA",
  },
  {
    title: "Droits de douane",
    description: "Valeur CIF × Taux douanier (15%)",
    value: "2 962 500 FCFA",
  },
  {
    title: "Assiette TVA",
    description: "Valeur CIF + Droits de douane + Autres prélèvements",
    value: "23 249 500 FCFA",
  },
  {
    title: "TVA (18%)",
    description: "Assiette TVA × 18%",
    value: "4 184 910 FCFA",
  },
]

export default function SimulationResultPage() {
  const [calcExpanded, setCalcExpanded] = React.useState(false)
  const [showPdfModal, setShowPdfModal] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)


  React.useEffect(() => { setMounted(true) }, [])

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success">Simulation enregistrée</Badge>
              <span className="text-xs text-text-muted">DC-2026-0045</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Résultat de la simulation</h1>
            <p className="text-sm text-text-secondary mt-1">
              Téléphones mobiles — Chine — 500 unités
            </p>
          </div>
            <Button onClick={() => setShowPdfModal(true)} variant="outline" className="gap-2" size="sm">
              <Printer className="h-4 w-4" /> Imprimer / PDF
            </Button>
          </div>

        {/* Hero Total */}

        <Card className="bg-primary-950 text-white border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <CardContent className="p-8">
            <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-2">Total estimé à payer</p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold tracking-tight mb-2"
            >
              {mounted ? <AnimatedCounter target={grandTotal} /> : "0"} <span className="text-2xl font-normal text-white/60">FCFA</span>
            </motion.h2>
            <p className="text-sm text-white/50">Estimation calculée le 27 août 2026 · Taux de change : 1 USD = 620 FCFA</p>
          </CardContent>
        </Card>

        {/* Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-base">Détail des montants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {breakdown.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${item.color}`}>
                        {item.label.split(" ")[0]}
                      </span>
                      <span className="text-sm text-text-secondary">{item.label}</span>
                    </div>
                    <span className="font-semibold text-text-primary text-sm">
                      {item.value.toLocaleString("fr-FR")} FCFA
                    </span>
                  </motion.div>
                ))}
                <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-primary-200">
                  <span className="font-bold text-text-primary">TOTAL DROITS ET TAXES</span>
                  <span className="font-extrabold text-primary-900 text-lg">
                    {totalDroits.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Comprendre le calcul */}
            <Card className="premium-card mt-4">
              <button
                onClick={() => setCalcExpanded(!calcExpanded)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-primary-600" />
                  <span className="font-semibold text-text-primary">Comprendre le calcul</span>
                </div>
                <motion.div
                  animate={{ rotate: calcExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-text-muted" />
                </motion.div>
              </button>
              {calcExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="space-y-3">
                    {calcSteps.map((step, i) => (
                      <div key={step.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          {i < calcSteps.length - 1 && <div className="w-0.5 h-full bg-border mt-1" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-semibold text-text-primary">{step.title}</p>
                          <p className="text-xs text-text-muted">{step.description}</p>
                          <p className="text-sm font-medium text-primary-700 mt-1">= {step.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2 justify-center">
                  <CheckSquare className="h-4 w-4" /> Vérifier une déclaration
                </Button>
                <Button onClick={() => setShowPdfModal(true)} variant="outline" className="w-full gap-2 justify-center font-bold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100">
                  <Download className="h-4 w-4" /> Télécharger le rapport PDF
                </Button>
                <Button variant="outline" className="w-full gap-2 justify-center">
                  <Save className="h-4 w-4" /> Enregistrer
                </Button>
                <Button variant="ghost" className="w-full gap-2 justify-center text-text-secondary">
                  <Plus className="h-4 w-4" /> Nouvelle simulation
                </Button>
              </CardContent>
            </Card>

            <Card className="premium-card bg-info-light/30 border-info/20">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-info mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-info">Rappel important</p>
                    <p className="text-xs text-info/80 mt-1">
                      Ces résultats sont des estimations indicatives. Les montants exacts sont déterminés par l'administration douanière lors du dédouanement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showPdfModal && (
        <PdfReport
          simulationData={{
            reference: "SIM-2026-8841",
            merchandise: "Téléphones mobiles — Chine — 500 unités",
            hs_code: "8517.12.00",
            origin: "Chine",
            fob_value: 30000000,
            freight: 2000000,
            insurance: 750000,
            cif_value: 32750000,
            total_taxes: 11349450,
            total_to_pay: 44099450,
            company_name: "ImporVia SARL",
            tax_id: "M0123456789A",
            breakdown: [
              { tax_code: "DD", tax_name: "Droits de douane (15%)", rate: "0.15", amount: 4912500 },
              { tax_code: "CCI", tax_name: "Prélèvement Communautaire (1%)", rate: "0.01", amount: 327500 },
              { tax_code: "RDI", tax_name: "Redevance statistique (1%)", rate: "0.01", amount: 327500 },
              { tax_code: "TVA", tax_name: "Taxe sur la valeur ajoutée (18%)", rate: "0.18", amount: 6781950 },
            ]
          }}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </AppLayout>

  )
}
