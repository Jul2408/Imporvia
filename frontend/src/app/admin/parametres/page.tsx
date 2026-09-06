"use client"

import React from "react"
import { Building2, Globe, Mail, CreditCard, Shield, Bell, Palette, ChevronRight, Check } from "lucide-react"

type Field = { name: string; value: string; type: string; options?: string[] };
type ToggleOption = { name: string; value: boolean };
type Section = { label: string; icon: React.ElementType; fields?: Field[]; toggles?: ToggleOption[] };

const settingsSections: Section[] = [
  {
    label: "Informations générales",
    icon: Building2,
    fields: [
      { name: "Nom de la plateforme", value: "ImporVia", type: "text" },
      { name: "URL de l'application", value: "https://app.imporvia.com", type: "text" },
      { name: "Email de contact", value: "contact@imporvia.com", type: "email" },
    ]
  },
  {
    label: "Localisation & Devise",
    icon: Globe,
    fields: [
      { name: "Langue par défaut", value: "Français (FR)", type: "select", options: ["Français (FR)", "English (EN)"] },
      { name: "Fuseau horaire", value: "Africa/Douala (UTC+1)", type: "select", options: ["Africa/Douala (UTC+1)", "Africa/Lagos (UTC+1)", "Europe/Paris (UTC+2)"] },
      { name: "Devise principale", value: "FCFA (XOF)", type: "select", options: ["FCFA (XOF)", "Euro (EUR)", "Dollar (USD)"] },
    ]
  },
  {
    label: "Notifications Système",
    icon: Bell,
    toggles: [
      { name: "Alertes d'expiration d'abonnement", value: true },
      { name: "Nouvelles inscriptions par email", value: true },
      { name: "Rapports hebdomadaires automatiques", value: false },
      { name: "Alertes de sécurité en temps réel", value: true },
    ]
  },
]

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-7' : 'left-1'}`} />
    </div>
  )
}

export default function ImporViaAdminParametres() {
  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Paramètres</h1>
          <p className="text-slate-500 font-medium mt-1">Configurez les paramètres globaux de la plateforme ImporVia.</p>
        </div>

        {settingsSections.map((section, si) => (
          <div key={si} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{section.label}</h2>
            </div>

            <div className="p-6 space-y-5">
              {section.fields?.map((field, fi) => (
                <div key={fi} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="text-sm font-bold text-slate-700 sm:w-48 shrink-0">{field.name}</label>
                  {field.type === 'select' ? (
                    <select className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    />
                  )}
                </div>
              ))}

              {section.toggles?.map((toggle, ti) => (
                <div key={ti} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm font-medium text-slate-700">{toggle.name}</span>
                  <Toggle enabled={toggle.value} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pb-8">
          <button className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors">
            Annuler
          </button>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </main>
  )
}
