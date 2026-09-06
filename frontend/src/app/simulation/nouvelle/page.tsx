"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Package, Globe, DollarSign, Info, ShieldCheck, Sparkles, Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/AppLayout"
import { StepIndicator } from "@/components/ui/step-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import apiClient from "@/lib/api"
import { PdfReport } from "@/components/simulation/PdfReport"

const steps = [
  { id: 1, label: "Marchandise" },
  { id: 2, label: "Origine" },
  { id: 3, label: "Valeur" },
  { id: 4, label: "Informations" },
  { id: 5, label: "Vérification" },
  { id: 6, label: "Résultat" },
]

const calculationSteps = [
  { label: "Données analysées", delay: 0.2 },
  { label: "Informations vérifiées", delay: 0.9 },
  { label: "Calcul en cours", delay: 1.6 },
  { label: "Génération du résultat", delay: 2.3 },
]

function CalculatingScreen({ onComplete }: { onComplete: () => void }) {
  const [completed, setCompleted] = React.useState<number[]>([])
  React.useEffect(() => {
    calculationSteps.forEach((step, i) => {
      setTimeout(() => {
        setCompleted(prev => [...prev, i])
        if (i === calculationSteps.length - 1) setTimeout(onComplete, 600)
      }, step.delay * 1000)
    })
  }, [onComplete])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-16 w-16 rounded-full border-4 border-primary-100 border-t-primary-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Analyse de votre opération...</h2>
      <p className="text-sm text-text-muted mb-8">Nous calculons votre estimation en toute précision</p>
      <div className="space-y-3 w-full max-w-xs">
        {calculationSteps.map((step, i) => (
          <motion.div key={step.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: step.delay }} className="flex items-center gap-3">
            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500", completed.includes(i) ? "bg-success text-white" : "bg-border")}>
              {completed.includes(i) ? <Check className="h-3 w-3" /> : <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
            <span className={cn("text-sm transition-colors duration-300", completed.includes(i) ? "text-text-primary font-medium" : "text-text-muted")}>{step.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function NewSimulationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isCalculating, setIsCalculating] = React.useState(false)
  const [showPdfModal, setShowPdfModal] = React.useState(false)
  const [error, setError] = React.useState("")

  const [simulationId, setSimulationId] = React.useState<string | null>(null)
  const [resultData, setResultData] = React.useState<any>(null)
  const [hsCodes, setHsCodes] = React.useState<any[]>([])
  const [hsSearch, setHsSearch] = React.useState("")

  const [formData, setFormData] = React.useState({
    merchandise: "",
    hsCode: "",
    hsCodeId: "",
    origin: "",
    supplierCountry: "",
    invoiceValue: "",
    currency: "XAF",
    freight: "",
    insurance: "",
    reference: "",
  })

  // Search HS codes from API
  React.useEffect(() => {
    if (hsSearch.length < 2) { setHsCodes([]); return }
    const timer = setTimeout(() => {
      apiClient.get(`/customs/hs-codes/?search=${hsSearch}`)
        .then(res => setHsCodes(res.data?.results || res.data || []))
        .catch(() => setHsCodes([]))
    }, 300)
    return () => clearTimeout(timer)
  }, [hsSearch])

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep === 5) {
      handleCalculate()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => setCurrentStep(prev => prev - 1)

  const handleCalculate = async () => {
    setError("")
    setIsCalculating(true)
    try {
      // 1. Create simulation
      const cifValue = parseFloat(formData.invoiceValue) + parseFloat(formData.freight || "0") + parseFloat(formData.insurance || "0")
      const createRes = await apiClient.post("/simulations/", {
        hs_code: formData.hsCodeId || null,
        fob_value: parseFloat(formData.invoiceValue) || 0,
        freight: parseFloat(formData.freight) || 0,
        insurance: parseFloat(formData.insurance) || 0,
        cif_value: cifValue,
      })
      const simId = createRes.data.id
      setSimulationId(simId)

      // 2. Trigger calculation
      const calcRes = await apiClient.post(`/simulations/${simId}/calculate/`)
      setResultData(calcRes.data)
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors du calcul. Vérifiez que le code SH est bien renseigné.")
      setIsCalculating(false)
      return
    }
  }

  const handleCalculationComplete = () => {
    setIsCalculating(false)
    setCurrentStep(6)
  }

  const stepContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center"><Package className="h-5 w-5 text-blue-600" /></div>
          <div><h2 className="text-lg font-semibold text-text-primary">Description de la marchandise</h2><p className="text-sm text-text-muted">Identifiez précisément le produit importé</p></div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Désignation <span className="text-red-500">*</span></label>
            <Input value={formData.merchandise} onChange={e => updateField("merchandise", e.target.value)} placeholder="Ex : Téléphones mobiles, Machines industrielles..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Code SH / Nomenclature douanière</label>
            <Input
              value={hsSearch || formData.hsCode}
              onChange={e => { setHsSearch(e.target.value); updateField("hsCode", e.target.value) }}
              placeholder="Ex : 8517.12.00 ou tapez pour rechercher..."
            />
            {hsCodes.length > 0 && (
              <div className="mt-1 border border-border rounded-xl overflow-hidden shadow-lg bg-white z-10 relative">
                {hsCodes.map(hs => (
                  <button key={hs.id} className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm transition-colors border-b border-border/50 last:border-0"
                    onClick={() => { updateField("hsCode", hs.code); updateField("hsCodeId", hs.id); setHsSearch(""); setHsCodes([]) }}>
                    <span className="font-mono font-bold text-blue-700">{hs.code}</span>
                    <span className="text-text-muted ml-2">{hs.description?.substring(0, 60)}…</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Cat. {hs.tariff_category}</span>
                  </button>
                ))}
              </div>
            )}
            {formData.hsCodeId && <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Code SH sélectionné: {formData.hsCode}</p>}
            <p className="text-xs text-text-muted mt-1.5">💡 Commencez à taper pour rechercher un code SH dans notre base 2026.</p>
          </div>
        </div>
      </div>
    ),
    2: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Globe className="h-5 w-5 text-emerald-600" /></div>
          <div><h2 className="text-lg font-semibold text-text-primary">Pays d&apos;origine</h2><p className="text-sm text-text-muted">D&apos;où provient votre marchandise ?</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Pays d&apos;origine <span className="text-red-500">*</span></label>
            <Input value={formData.origin} onChange={e => updateField("origin", e.target.value)} placeholder="Ex : Chine, Turquie, Inde..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Pays du fournisseur</label>
            <Input value={formData.supplierCountry} onChange={e => updateField("supplierCountry", e.target.value)} placeholder="Identique au pays d'origine" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">ℹ️ Bon à savoir</p>
          <p className="text-sm text-blue-600 mt-1">Le pays d&apos;origine détermine les règles préférentielles TEC CEMAC applicables.</p>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-orange-600" /></div>
          <div><h2 className="text-lg font-semibold text-text-primary">Valeur de la marchandise</h2><p className="text-sm text-text-muted">Ces informations servent à calculer la valeur en douane (CIF)</p></div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Valeur FOB (prix d&apos;achat) <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <Input type="number" value={formData.invoiceValue} onChange={e => updateField("invoiceValue", e.target.value)} placeholder="Ex : 5000000" className="flex-1" />
              <select className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" value={formData.currency} onChange={e => updateField("currency", e.target.value)}>
                <option value="XAF">XAF (FCFA)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Fret / Transport <span className="text-xs text-text-muted font-normal">(Optionnel)</span></label>
              <Input type="number" value={formData.freight} onChange={e => updateField("freight", e.target.value)} placeholder="Optionnel (Ex : 200 000)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Assurance <span className="text-xs text-text-muted font-normal">(Optionnel)</span></label>
              <Input type="number" value={formData.insurance} onChange={e => updateField("insurance", e.target.value)} placeholder="Optionnel (Ex : 50 000)" />
            </div>
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            💡 <strong>Vous n&apos;avez pas encore le montant du transport ou de l&apos;assurance ?</strong> Laissez ces cases vides ! La simulation fonctionnera directement avec le prix de votre facture.
          </p>

          {formData.invoiceValue && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm">
              <span className="font-medium text-blue-700">Valeur CIF estimée: </span>
              <span className="font-bold text-blue-900">
                {(parseFloat(formData.invoiceValue || "0") + parseFloat(formData.freight || "0") + parseFloat(formData.insurance || "0")).toLocaleString("fr-FR")} {formData.currency}
              </span>
            </div>
          )}
        </div>
      </div>
    ),
    4: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center"><Info className="h-5 w-5 text-purple-600" /></div>
          <div><h2 className="text-lg font-semibold text-text-primary">Informations complémentaires</h2><p className="text-sm text-text-muted">Pour référencer et suivre cette simulation</p></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Référence interne</label>
          <Input value={formData.reference} onChange={e => updateField("reference", e.target.value)} placeholder="Ex : CMD-2026-001 (optionnel)" />
        </div>
      </div>
    ),
    5: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-green-600" /></div>
          <div><h2 className="text-lg font-semibold text-text-primary">Vérification</h2><p className="text-sm text-text-muted">Confirmez les informations avant le calcul</p></div>
        </div>
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />{error}
          </div>
        )}
        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {[
            { label: "Marchandise", value: formData.merchandise || "–" },
            { label: "Code SH", value: formData.hsCode || "Non précisé" },
            { label: "Pays d'origine", value: formData.origin || "–" },
            { label: "Valeur FOB", value: formData.invoiceValue ? `${parseFloat(formData.invoiceValue).toLocaleString("fr-FR")} ${formData.currency}` : "–" },
            { label: "Fret", value: formData.freight ? `${parseFloat(formData.freight).toLocaleString("fr-FR")} ${formData.currency}` : "Non précisé" },
            { label: "Assurance", value: formData.insurance ? `${parseFloat(formData.insurance).toLocaleString("fr-FR")} ${formData.currency}` : "Non précisé" },
            { label: "Valeur CIF", value: formData.invoiceValue ? `${(parseFloat(formData.invoiceValue || "0") + parseFloat(formData.freight || "0") + parseFloat(formData.insurance || "0")).toLocaleString("fr-FR")} ${formData.currency}` : "–" },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center px-4 py-3 bg-white">
              <span className="text-sm text-text-muted">{row.label}</span>
              <span className="text-sm font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    6: null,
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Nouvelle simulation</h1>
          <p className="text-sm text-text-secondary mt-1">Estimez les droits et taxes douaniers (TEC CEMAC 2026) pour votre opération</p>
        </div>

        {!isCalculating && currentStep < 6 && (
          <div className="mb-8"><StepIndicator steps={steps} currentStep={currentStep} /></div>
        )}

        <Card className="premium-card">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <CalculatingScreen key="calculating" onComplete={handleCalculationComplete} />
              ) : currentStep === 6 && resultData ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-text-primary">Estimation calculée ✅</h2>
                    <p className="text-text-muted text-sm mt-1">Basée sur les taux réels TEC CEMAC et LF2026 Cameroun</p>
                  </div>
                  {/* Result breakdown */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-blue-700 font-semibold">Valeur CIF (Assiette)</span><span className="font-bold text-blue-900">{parseFloat(resultData.snapshot?.breakdown_payload?.cif_value || "0").toLocaleString("fr-FR")} FCFA</span></div>
                    {(resultData.snapshot?.breakdown_payload?.breakdown || []).map((item: any) => (
                      <div key={item.tax_code} className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">{item.tax_code} — {item.tax_name} ({item.rate ? `${(parseFloat(item.rate)*100).toFixed(2)}%` : "fixe"})</span>
                        <span className="font-semibold text-slate-800">{parseFloat(item.amount).toLocaleString("fr-FR")} FCFA</span>
                      </div>
                    ))}
                    <div className="border-t border-blue-200 pt-3 flex justify-between font-bold">
                      <span className="text-blue-800">Total Droits &amp; Taxes à payer</span>
                      <span className="text-blue-900 text-lg">{parseFloat(resultData.total_to_pay || "0").toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setShowPdfModal(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                      🖨️ Générer &amp; Télécharger le PDF Pro
                    </Button>
                    <Button variant="secondary" onClick={() => router.push("/historique")} className="flex-1">Voir l&apos;historique</Button>
                    <Button onClick={() => { setCurrentStep(1); setFormData({ merchandise: "", hsCode: "", hsCodeId: "", origin: "", supplierCountry: "", invoiceValue: "", currency: "XAF", freight: "", insurance: "", reference: "" }); setResultData(null) }} variant="outline" className="flex-1">Nouvelle simulation</Button>
                  </div>

                  {/* Document guide notice */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                    <p className="font-bold text-slate-800 text-sm">📋 Documents douaniers nécessaires pour la déclaration :</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                      <li>📄 Facture commerciale définitive (Prix FOB)</li>
                      <li>🚢 Connaissement Maritime (BL) ou LTA Aérien</li>
                      <li>📑 Bordereau Électronique de Suivi (BESC)</li>
                      <li>🌍 Certificat d&apos;Origine (EUR.1 / CEMAC si exonération)</li>
                    </ul>
                  </div>

                  {showPdfModal && (
                    <PdfReport
                      simulationData={{
                        reference: resultData.reference,
                        merchandise: formData.merchandise,
                        hs_code: formData.hsCode,
                        origin: formData.origin,
                        fob_value: formData.invoiceValue,
                        freight: formData.freight,
                        insurance: formData.insurance,
                        cif_value: resultData.snapshot?.breakdown_payload?.cif_value,
                        total_taxes: resultData.snapshot?.breakdown_payload?.total_taxes,
                        total_to_pay: resultData.total_to_pay,
                        breakdown: resultData.snapshot?.breakdown_payload?.breakdown,
                        company_name: "ImporVia SARL",
                        tax_id: "M0123456789A",
                        created_at: resultData.created_at,
                      }}
                      onClose={() => setShowPdfModal(false)}
                    />
                  )}

                </motion.div>
              ) : (
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {stepContent[currentStep as keyof typeof stepContent]}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {!isCalculating && currentStep < 6 && (
            <div className="flex items-center justify-between gap-2 px-4 sm:px-8 py-4 border-t border-border bg-background rounded-b-2xl">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="gap-1 shrink-0 px-3 sm:px-4">
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Précédent</span>
              </Button>
              <span className="text-xs text-text-muted whitespace-nowrap">Étape {currentStep}/{steps.length}</span>
              <Button onClick={handleNext} disabled={currentStep === 3 && !formData.invoiceValue} className="gap-1 bg-blue-600 hover:bg-blue-700 shrink-0 px-3 sm:px-5">
                {currentStep === 5 ? (<><Sparkles className="h-4 w-4 shrink-0" /> <span className="text-xs sm:text-sm whitespace-nowrap">Calculer</span></>) : (<><span className="text-xs sm:text-sm">Suivant</span> <ChevronRight className="h-4 w-4 shrink-0" /></>)}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
