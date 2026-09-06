"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import apiClient from "@/lib/api"

type VerificationState = "form" | "coherent" | "ecart" | "ecart_important"

function ResultCard({ state, simTotal, communiqueAmount }: { state: VerificationState; simTotal: number; communiqueAmount: number }) {
  const diff = communiqueAmount - simTotal
  const pct = simTotal > 0 ? ((diff / simTotal) * 100).toFixed(1) : "0"

  const configs = {
    coherent: {
      icon: <CheckCircle2 className="h-8 w-8 text-emerald-600" />,
      bg: "from-emerald-50 to-transparent",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      title: "Aucun écart significatif détecté.",
      subtitle: "Les montants correspondent à votre simulation. Vous pouvez procéder sereinement.",
    },
    ecart: {
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      bg: "from-orange-50 to-transparent",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700",
      title: "Une différence a été détectée.",
      subtitle: "Vérifiez les éléments concernés avant de procéder au paiement.",
    },
    ecart_important: {
      icon: <XCircle className="h-8 w-8 text-red-500" />,
      bg: "from-red-50 to-transparent",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
      title: "Un écart important mérite votre attention.",
      subtitle: "Une vérification approfondie est fortement recommandée avant tout engagement financier.",
    },
  }

  const c = configs[state === "form" ? "coherent" : state]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Status Banner */}
      <Card className={cn("border overflow-hidden", c.border)}>
        <div className={cn("bg-linear-to-r p-6 flex items-center gap-4", c.bg)}>
          {c.icon}
          <div>
            <h2 className="text-lg font-bold text-text-primary">{c.title}</h2>
            <p className="text-sm text-text-secondary mt-0.5">{c.subtitle}</p>
          </div>
        </div>
      </Card>

      {/* Comparison */}
      {state !== "coherent" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <Card className="premium-card">
            <CardContent className="p-5">
              <p className="text-xs uppercase font-semibold text-text-muted tracking-widest mb-1">Votre simulation</p>
              <p className="text-2xl font-bold text-text-primary">{simTotal.toLocaleString("fr-FR")}</p>
              <p className="text-xs text-text-muted mt-1">FCFA</p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-border flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </div>
          </div>

          <Card className={cn("border", c.border)}>
            <CardContent className="p-5">
              <p className="text-xs uppercase font-semibold text-text-muted tracking-widest mb-1">Montant communiqué</p>
              <p className="text-2xl font-bold text-text-primary">{communiqueAmount.toLocaleString("fr-FR")}</p>
              <p className="text-xs text-text-muted mt-1">FCFA</p>
            </CardContent>
          </Card>
        </div>
      )}

      {state !== "coherent" && (
        <Card className={cn("border", c.border)}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Écart détecté</p>
              <p className="text-2xl font-bold mt-1" style={{ color: state === "ecart_important" ? "varerror" : "varwarning" }}>
                {diff > 0 ? "+" : ""}{diff.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div className={cn("text-2xl font-bold px-4 py-2 rounded-xl", c.badge)}>
              {diff > 0 ? "+" : ""}{pct}%
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

export default function VerificationPage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [amount, setAmount] = React.useState("")
  const [result, setResult] = React.useState<VerificationState>("form")
  const [simulations, setSimulations] = React.useState<any[]>([])
  const [selectedSim, setSelectedSim] = React.useState<any>(null)
  const [loadingSims, setLoadingSims] = React.useState(true)

  React.useEffect(() => {
    apiClient.get("/simulations/")
      .then(res => setSimulations(res.data?.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoadingSims(false))
  }, [])

  const handleCompare = () => {
    if (!selectedSim) return
    const val = parseInt(amount.replace(/\s/g, ""), 10)
    if (!val) return
    const total = parseFloat(selectedSim.total_to_pay || selectedSim.cif_value || "0")
    const diff = val - total
    const pct = Math.abs((diff / total) * 100)
    if (pct > 15) setResult("ecart_important")
    else if (pct > 3) setResult("ecart")
    else setResult("coherent")
    setStep(3)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Vérifiez les montants de votre opération.
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Comparez votre simulation avec les montants communiqués par votre transitaire.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Select simulation */}
          <Card className={cn("premium-card transition-all", step >= 1 ? "opacity-100" : "opacity-40")}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-primary-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <CardTitle className="text-base">Sélectionner une simulation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSims ? (
                <div className="py-4 flex justify-center"><div className="animate-spin h-6 w-6 border-4 border-blue-200 border-t-blue-600 rounded-full" /></div>
              ) : simulations.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">Aucune simulation trouvée. Créez une simulation d'abord.</p>
              ) : (
                <div className="space-y-2">
                  {simulations.slice(0, 5).map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => { setSelectedSim(sim); setStep(2) }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border bg-background hover:border-primary-300 hover:bg-primary-50 transition-all text-left group",
                        selectedSim?.id === sim.id ? "border-primary-500 bg-primary-50" : "border-border"
                      )}
                    >
                      <div>
                        <p className="font-semibold text-sm text-text-primary">{sim.reference}</p>
                        <p className="text-xs text-text-muted mt-0.5">{sim.hs_code || "Code SH non renseigné"}</p>
                        <p className="text-xs font-medium text-primary-600 mt-1">
                          {sim.total_to_pay ? parseFloat(sim.total_to_pay).toLocaleString("fr-FR") : sim.cif_value ? parseFloat(sim.cif_value).toLocaleString("fr-FR") : "N/A"} FCFA
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary-600 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Enter communicated amount */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="premium-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-primary-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                      <CardTitle className="text-base">Saisir le montant communiqué</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Montant total communiqué par le transitaire (en FCFA)
                      </label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Ex : 4 480 000"
                        className="text-lg font-semibold"
                      />
                      <p className="text-xs text-text-muted mt-1.5">
                        Saisissez uniquement les droits et taxes douanières, sans les frais de transit.
                      </p>
                    </div>
                    <Button
                      onClick={handleCompare}
                      disabled={!amount}
                      className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                      Comparer les montants <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Result */}
          <AnimatePresence>
            {step === 3 && result !== "form" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
              <ResultCard 
                state={result} 
                simTotal={parseFloat(selectedSim?.total_to_pay || selectedSim?.cif_value || "0")}
                communiqueAmount={parseInt(amount.replace(/\s/g, ""), 10) || 0}
              />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  )
}
