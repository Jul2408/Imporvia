"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Calculator, CheckSquare, CreditCard, Users, HelpCircle, MessageSquare, ChevronDown } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  { icon: HelpCircle, label: "Commencer avec ImporVia", desc: "Premiers pas et configuration de votre espace", color: "bg-blue-100 text-blue-600" },
  { icon: Calculator, label: "Créer une simulation", desc: "Guide complet pour calculer vos droits et taxes", color: "bg-orange-100 text-orange-600" },
  { icon: CheckSquare, label: "Comprendre une vérification", desc: "Comment interpréter les résultats et les écarts", color: "bg-emerald-100 text-emerald-600" },
  { icon: CreditCard, label: "Gérer mon abonnement", desc: "Paiements, factures et changement de plan", color: "bg-purple-100 text-purple-600" },
  { icon: Users, label: "Gérer mon équipe", desc: "Invitations, rôles et permissions", color: "bg-pink-100 text-pink-600" },
]

const faqs = [
  {
    q: "Comment calculer la valeur en douane de mes marchandises ?",
    a: "La valeur en douane est généralement calculée selon la méthode CIF (Cost, Insurance, Freight). Elle correspond au prix d'achat de la marchandise (valeur FOB) additionné des frais de transport et d'assurance jusqu'au point d'importation.",
  },
  {
    q: "Mes estimations sont-elles garanties par l'administration douanière ?",
    a: "Non. Les résultats de ImporVia sont des estimations indicatives. Les montants définitifs sont déterminés par l'administration douanière lors du dédouanement officiel. ImporVia vous aide à vous préparer et à vérifier les montants communiqués.",
  },
  {
    q: "Que faire si je détecte un écart important ?",
    a: "Un écart important entre votre simulation et les montants communiqués ne signifie pas nécessairement une fraude. Il peut s'expliquer par des erreurs de saisie, des frais additionnels non pris en compte, ou des taux différents. Contactez votre transitaire pour obtenir des éclaircissements.",
  },
  {
    q: "Puis-je inviter des collaborateurs sur mon compte ?",
    a: "Oui. Selon votre plan, vous pouvez inviter jusqu'à 5 collaborateurs. Rendez-vous dans la section Équipe pour envoyer des invitations et attribuer des rôles spécifiques (Administrateur, Employé, Lecteur).",
  },
  {
    q: "Comment télécharger une facture ou un rapport ?",
    a: "Rendez-vous dans la section Rapports pour accéder à vos rapports générés, ou dans la section Abonnement > Historique des paiements pour télécharger vos factures.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-text-primary">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
        </motion.div>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pb-4"
        >
          <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  )
}

export default function AidePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
        {/* Hero */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-text-primary mb-3">Comment pouvons-nous vous aider ?</h1>
          <p className="text-text-secondary mb-6">Recherchez dans notre documentation ou explorez les catégories ci-dessous.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <Input className="pl-10 h-12 text-base" placeholder="Rechercher dans l'aide..." />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="premium-card cursor-pointer hover:shadow-md transition-all group">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary group-hover:text-primary-700 transition-colors">{cat.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{cat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">Questions fréquentes</h2>
          <Card className="premium-card">
            <CardContent className="p-6">
              {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </CardContent>
          </Card>
        </div>

        {/* Contact support */}
        <Card className="premium-card bg-primary-50 border-primary-100">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">Besoin d'une aide personnalisée ?</p>
                <p className="text-sm text-text-secondary">Notre équipe est disponible du lundi au vendredi, 8h–17h</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shrink-0">
              <MessageSquare className="h-4 w-4" /> Contacter le support
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
