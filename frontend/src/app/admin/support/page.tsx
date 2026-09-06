"use client"

import React, { useState } from "react"
import { LifeBuoy, Search, MessageSquare, CheckCircle2, Clock, XCircle, ChevronDown, User } from "lucide-react"
import { Modal } from "@/components/ui/Modal"

const tickets = [
  { id: "TKT-0124", sujet: "Erreur de calcul sur code SH 8703", utilisateur: "Aminata Koné", entreprise: "LogisTech SA", priorite: "Haute", statut: "Ouvert", date: "Aujourd'hui, 09:15" },
  { id: "TKT-0123", sujet: "Impossible de télécharger la facture PAY-2026-0887", utilisateur: "Paul Ngassa", entreprise: "Brasseries du Cam.", priorite: "Normale", statut: "En cours", date: "Hier, 14:30" },
  { id: "TKT-0122", sujet: "Comment ajouter un 2ème utilisateur ?", utilisateur: "Sophie Mbarga", entreprise: "Tech Douala SARL", priorite: "Faible", statut: "Résolu", date: "26 Août 2026" },
  { id: "TKT-0121", sujet: "L'API REST renvoie une erreur 502", utilisateur: "Jean Etoundi", entreprise: "Import Express", priorite: "Critique", statut: "Ouvert", date: "25 Août 2026" },
]

const prioriteConfig: Record<string, string> = {
  Critique: "bg-red-100 text-red-700",
  Haute: "bg-orange-100 text-orange-700",
  Normale: "bg-blue-100 text-blue-700",
  Faible: "bg-slate-100 text-slate-600",
}

export default function ImporViaAdminSupport() {
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null)

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support Client</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les tickets d'assistance et répondez aux utilisateurs.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-sm font-bold">
              2 tickets critiques
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Ouverts", value: "8", color: "text-red-600", bg: "bg-red-50", icon: <XCircle className="w-5 h-5 text-red-500" /> },
            { label: "En cours", value: "12", color: "text-amber-600", bg: "bg-amber-50", icon: <Clock className="w-5 h-5 text-amber-500" /> },
            { label: "Résolus (mois)", value: "47", color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
            { label: "Délai moy.", value: "4.2h", color: "text-blue-600", bg: "bg-blue-50", icon: <LifeBuoy className="w-5 h-5 text-blue-500" /> },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
              <div>
                <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rechercher par ID ou sujet..." />
          </div>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option>Tous les statuts</option>
            <option>Ouvert</option>
            <option>En cours</option>
            <option>Résolu</option>
          </select>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option>Toutes priorités</option>
            <option>Critique</option>
            <option>Haute</option>
            <option>Normale</option>
          </select>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Ticket</th>
                  <th className="py-4 px-6 whitespace-nowrap">Utilisateur</th>
                  <th className="py-4 px-6 whitespace-nowrap">Priorité</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.map((ticket, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-blue-600 text-xs mb-0.5">{ticket.id}</div>
                      <div className="font-medium text-slate-900 line-clamp-1">{ticket.sujet}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{ticket.utilisateur}</div>
                      <div className="text-xs text-slate-500">{ticket.entreprise}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${prioriteConfig[ticket.priorite]}`}>
                        {ticket.priorite}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {ticket.statut === 'Résolu' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {ticket.statut === 'En cours' && <Clock className="w-4 h-4 text-amber-500" />}
                        {ticket.statut === 'Ouvert' && <XCircle className="w-4 h-4 text-red-500" />}
                        <span className={`font-bold text-xs
                          ${ticket.statut === 'Résolu' ? 'text-emerald-700' : ''}
                          ${ticket.statut === 'En cours' ? 'text-amber-700' : ''}
                          ${ticket.statut === 'Ouvert' ? 'text-red-700' : ''}
                        `}>{ticket.statut}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{ticket.date}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={selectedTicket?.id || ""} maxWidth="2xl">
        {selectedTicket && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedTicket.sujet}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedTicket.utilisateur} · {selectedTicket.entreprise} · {selectedTicket.date}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Bonjour, j'ai constaté un problème lors de ma dernière simulation. Le système a retourné un montant de taxes différent de ce que j'attendais pour ce code SH. Pouvez-vous vérifier la configuration ?
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Votre réponse</label>
              <textarea rows={4} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none" placeholder="Rédigez votre réponse..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedTicket(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
                Marquer comme résolu
              </button>
              <button onClick={() => setSelectedTicket(null)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Envoyer la réponse
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
