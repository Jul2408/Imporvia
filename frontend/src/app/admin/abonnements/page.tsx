"use client"

import React, { useState } from "react"
import { CreditCard, Check, Plus, Edit2, Zap, Building2, Globe, X } from "lucide-react"
import { Modal } from "@/components/ui/Modal"

const plans = [
  { 
    nom: "Starter", 
    prix: "50 000 FCFA", 
    periode: "/mois", 
    desc: "Idéal pour les petits transitaires et importateurs occasionnels.", 
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-100",
    features: ["50 simulations / mois", "1 utilisateur", "Support par email", "Mises à jour mensuelles"]
  },
  { 
    nom: "Pro", 
    prix: "150 000 FCFA", 
    periode: "/mois", 
    desc: "Pour les agences en douane régulières nécessitant plus de volume.", 
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-100",
    popular: true,
    features: ["500 simulations / mois", "5 utilisateurs", "Support prioritaire", "Mises à jour hebdomadaires", "API Rest"]
  },
  { 
    nom: "Enterprise", 
    prix: "Sur mesure", 
    periode: "", 
    desc: "Solutions dédiées pour les grandes multinationales de la logistique.", 
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    features: ["Simulations illimitées", "Utilisateurs illimités", "Account manager dédié", "Mises à jour en temps réel", "Intégration ERP"]
  }
]

type Plan = typeof plans[0]

export default function ImporViaAdminAbonnements() {
  const [isNewPlanOpen, setNewPlanOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Abonnements</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les plans tarifaires proposés aux clients de la plateforme.</p>
          </div>
          <button
            onClick={() => setNewPlanOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Créer un plan
          </button>
        </div>

        {/* Pricing Cards in Admin View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:-translate-y-1 hover:shadow-xl
              ${plan.popular ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-200'}
            `}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Le plus populaire
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl ${plan.bg} ${plan.color} flex items-center justify-center mb-6`}>
                <plan.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.nom}</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">{plan.prix}</span>
                <span className="text-slate-500 font-medium">{plan.periode}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                    <Check className={`w-5 h-5 ${plan.color}`} />
                    {feat}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => setEditingPlan(plan)}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                  ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}
                `}
              >
                <Edit2 className="w-4 h-4" /> Modifier le plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nouveau Plan */}
      <Modal isOpen={isNewPlanOpen} onClose={() => setNewPlanOpen(false)} title="Créer un nouveau plan" maxWidth="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom du plan *</label>
              <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Ex: Business" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Prix (FCFA/mois) *</label>
              <input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="100000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none" placeholder="Description courte du plan..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de simulations / mois</label>
            <input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="250" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre d'utilisateurs max</label>
            <input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="3" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setNewPlanOpen(false)} className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Annuler
            </button>
            <button onClick={() => setNewPlanOpen(false)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Créer le plan
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Modifier Plan */}
      <Modal isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} title={`Modifier le plan "${editingPlan?.nom}"`} maxWidth="lg">
        {editingPlan && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom du plan</label>
                <input type="text" defaultValue={editingPlan.nom} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prix affiché</label>
                <input type="text" defaultValue={editingPlan.prix} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea rows={2} defaultValue={editingPlan.desc} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Fonctionnalités incluses</label>
              <div className="space-y-2">
                {editingPlan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" defaultValue={feat} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Ajouter une fonctionnalité
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingPlan(null)} className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
                Annuler
              </button>
              <button onClick={() => setEditingPlan(null)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Enregistrer les modifications
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
