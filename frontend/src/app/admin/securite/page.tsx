"use client"

import React, { useState } from "react"
import { ShieldCheck, AlertTriangle, Eye, Lock, Shield, Activity, Globe, Clock, XCircle } from "lucide-react"
import { Modal } from "@/components/ui/Modal"

const events = [
  { ip: "192.168.45.21", utilisateur: "Unknown", action: "Tentative de connexion échouée (×5)", pays: "🇳🇬 Nigeria", date: "Aujourd'hui, 02:14", risque: "Élevé" },
  { ip: "41.203.77.4", utilisateur: "j.dupont@globaltrade.fr", action: "Connexion depuis un nouvel appareil", pays: "🇫🇷 France", date: "Hier, 23:58", risque: "Moyen" },
  { ip: "197.214.3.89", utilisateur: "admin@imporvia.com", action: "Modification des paramètres de sécurité", pays: "🇨🇮 Côte d'Ivoire", date: "27 Août 2026, 11:30", risque: "Faible" },
  { ip: "10.0.0.1", utilisateur: "Système (Auto)", action: "Scan de vulnérabilités automatisé", pays: "🌐 Interne", date: "27 Août 2026, 00:00", risque: "Faible" },
]

const risqueConfig: Record<string, string> = {
  Élevé: "bg-red-100 text-red-700",
  Moyen: "bg-amber-100 text-amber-700",
  Faible: "bg-emerald-100 text-emerald-700",
}

export default function ImporViaAdminSecurite() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sécurité</h1>
            <p className="text-slate-500 font-medium mt-1">Surveillez les activités suspectes et gérez les politiques de sécurité.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 1 alerte critique
            </span>
          </div>
        </div>

        {/* Alertes critiques */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Tentatives de connexion multiples détectées</h3>
            <p className="text-sm text-red-700 mt-1">IP 192.168.45.21 a effectué 5 tentatives de connexion échouées en 2 minutes. Bloquer cette IP ?</p>
            <div className="flex gap-3 mt-3">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
                Bloquer l'IP
              </button>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
                Ignorer
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Tentatives bloquées", value: "14", icon: <XCircle className="w-5 h-5 text-red-500" />, bg: "bg-red-50" },
            { label: "Sessions actives", value: "283", icon: <Activity className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" },
            { label: "IP bloquées", value: "7", icon: <Globe className="w-5 h-5 text-slate-500" />, bg: "bg-slate-100" },
            { label: "Uptime sécurité", value: "99.98%", icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Policies */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Politiques de Sécurité</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Authentification à deux facteurs (2FA)", desc: "Obligatoire pour tous les Super Admins", actif: true },
              { label: "Longueur minimale des mots de passe", desc: "12 caractères avec majuscule, chiffre et symbole", actif: true },
              { label: "Expiration automatique des sessions", desc: "Déconnexion après 2h d'inactivité", actif: true },
              { label: "Blocage automatique après 5 échecs", desc: "Blocage temporaire de 30 minutes", actif: false },
            ].map((policy, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{policy.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{policy.desc}</div>
                </div>
                <div className={`relative inline-flex w-12 h-6 rounded-full cursor-pointer transition-colors ${policy.actif ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${policy.actif ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Journal de Sécurité Récent</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Adresse IP</th>
                  <th className="py-4 px-6 whitespace-nowrap">Utilisateur</th>
                  <th className="py-4 px-6 w-1/3">Action</th>
                  <th className="py-4 px-6 whitespace-nowrap">Pays</th>
                  <th className="py-4 px-6 whitespace-nowrap">Risque</th>
                  <th className="py-4 px-6 whitespace-nowrap">Heure</th>
                  <th className="py-4 px-6 text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {events.map((evt, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-700 text-xs">{evt.ip}</td>
                    <td className="py-4 px-6 text-slate-600 text-xs">{evt.utilisateur}</td>
                    <td className="py-4 px-6 font-medium text-slate-700">{evt.action}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{evt.pays}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${risqueConfig[evt.risque]}`}>
                        {evt.risque}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {evt.date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => setSelectedEvent(evt)} className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Détail de l'événement" maxWidth="lg">
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Adresse IP", value: selectedEvent.ip },
                { label: "Utilisateur", value: selectedEvent.utilisateur },
                { label: "Pays", value: selectedEvent.pays },
                { label: "Niveau de risque", value: selectedEvent.risque },
                { label: "Heure", value: selectedEvent.date },
                { label: "Action détectée", value: selectedEvent.action },
              ].map((field, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{field.label}</div>
                  <div className="font-bold text-slate-900 text-sm">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedEvent(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
                Ignorer
              </button>
              <button onClick={() => setSelectedEvent(null)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Bloquer l'IP
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
