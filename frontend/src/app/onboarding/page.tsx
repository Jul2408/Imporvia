"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Package, CheckSquare, Users, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"

const steps = [
  {
    id: 1,
    title: "Bienvenue sur ImporVia.",
    subtitle: "Quelques étapes pour configurer votre espace.",
    icon: "👋",
  },
  {
    id: 2,
    title: "Votre entreprise",
    subtitle: "Ces informations permettent de personnaliser vos simulations.",
    icon: <Building2 className="h-6 w-6 text-blue-600" />,
  },
  {
    id: 3,
    title: "Votre activité principale",
    subtitle: "Pour adapter nos recommandations à votre secteur.",
    icon: <Package className="h-6 w-6 text-orange-600" />,
  },
  {
    id: 4,
    title: "Inviter des collaborateurs",
    subtitle: "Travaillez en équipe sur vos opérations d'importation.",
    icon: <Users className="h-6 w-6 text-emerald-600" />,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    company: "",
    sector: "",
    tax_id: "",
    inviteEmail: "",
  })

  const update = (k: string, v: string) => setFormData(prev => ({ ...prev, [k]: v }))

  const handleComplete = async () => {
    setLoading(true)
    try {
      if (formData.company) {
        await apiClient.post("/companies/", {
          name: formData.company,
          tax_id: formData.tax_id || null,
        })
      }
      await refreshUser()
      router.push("/dashboard")
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const stepContent = {
    1: (
      <div className="text-center py-8">
        <div className="text-7xl mb-6">👋</div>
        <h2 className="text-2xl font-bold text-text-primary mb-3">Bienvenue sur ImporVia.</h2>
        <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
          En quelques étapes, nous allons configurer votre espace pour que la plateforme soit adaptée à votre activité.
        </p>
      </div>
    ),
    2: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Votre entreprise</h2>
            <p className="text-xs text-text-muted">Ces informations personnalisent vos simulations</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Raison sociale *</label>
          <Input value={formData.company} onChange={e => update("company", e.target.value)} placeholder="Ex : ABANDA IMPORT SARL" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Pays d'établissement</label>
          <Input placeholder="Ex : Cameroun" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Numéro de contribuable (optionnel)</label>
          <Input value={formData.tax_id} onChange={e => update("tax_id", e.target.value)} placeholder="M000000000000X" />
        </div>
      </div>
    ),
    3: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Package className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Votre activité</h2>
            <p className="text-xs text-text-muted">Pour adapter nos recommandations</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Secteur d'activité *</label>
          <div className="grid grid-cols-2 gap-2">
            {["Commerce général", "Import-Export", "Distribution", "Industrie", "Technologie", "Autre"].map(s => (
              <button
                key={s}
                onClick={() => update("sector", s)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.sector === s
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-border bg-white text-text-secondary hover:border-border-hover"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Types de marchandises importées</label>
          <Input placeholder="Ex : Électronique, Textile, Machines..." />
        </div>
      </div>
    ),
    4: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Votre équipe</h2>
            <p className="text-xs text-text-muted">Invitez vos collaborateurs (optionnel)</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Adresse e-mail d'un collaborateur</label>
          <div className="flex gap-2">
            <Input
              type="email"
              value={formData.inviteEmail}
              onChange={e => update("inviteEmail", e.target.value)}
              placeholder="collaborateur@entreprise.cm"
              className="flex-1"
            />
            <Button variant="secondary" size="default">Ajouter</Button>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-success-light/50 border border-emerald-200">
          <p className="text-sm text-emerald-800 font-medium">✓ Vous pouvez aussi inviter votre équipe plus tard</p>
          <p className="text-xs text-emerald-700 mt-1">Rendez-vous dans la section Équipe depuis votre dashboard.</p>
        </div>
      </div>
    ),
  }

  const isLast = currentStep === steps.length

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-xl text-text-primary">
            <div className="h-7 w-7 rounded-lg bg-blue-600" />
            ImporVia
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 px-2">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                s.id <= currentStep ? "bg-blue-600" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {stepContent[currentStep as keyof typeof stepContent]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-8 py-4 border-t border-border flex items-center justify-between bg-background">
            {currentStep > 1 ? (
              <Button variant="ghost" className="gap-2 text-text-secondary" onClick={() => setCurrentStep(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" /> Précédent
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-text-muted">Passer</Button>
              </Link>
            )}

            {isLast ? (
              <Button onClick={handleComplete} disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700">
                {loading ? "Création en cours..." : "Commencer"} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentStep(p => p + 1)}>
                Continuer <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Étape {currentStep} sur {steps.length}
        </p>
      </div>
    </div>
  )
}
