"use client"

import React, { useState } from "react"
import { Search, Filter, MoreVertical, FileCheck, CheckCircle2, XCircle, Clock, Eye } from "lucide-react"

const verifications = [
  { id: "VER-2026-0891", type: "Valeur en douane", soumetteur: "LogisTech SA", declarant: "Aminata Kone", date: "Aujourd'hui, 09:30", statut: "En attente", risque: "Moyen" },
  { id: "VER-2026-0890", type: "Classification SH", soumetteur: "Transports Nord", declarant: "Moussa Barry", date: "Hier, 14:15", statut: "Validé", risque: "Faible" },
  { id: "VER-2026-0889", type: "Règle d'origine", soumetteur: "Global Trade", declarant: "Jean Dupont", date: "27 Août 2026", statut: "Rejeté", risque: "Élevé" },
  { id: "VER-2026-0888", type: "Conformité documentaire", soumetteur: "Import-Export CI", declarant: "Sophie Traore", date: "25 Août 2026", statut: "Validé", risque: "Faible" },
]

export default function ImporViaAdminVerifications() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vérifications</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les demandes de vérification et les contrôles douaniers.</p>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Nouveau Contrôle
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative focus-within:ring-2 focus-within:ring-blue-500 rounded-xl flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 w-full focus:outline-none focus:bg-white transition-colors" 
                placeholder="Rechercher par ID ou déclarant..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
              <option value="">Tous les statuts</option>
              <option value="en-attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">ID / Type</th>
                  <th className="py-4 px-6 whitespace-nowrap">Soumetteur</th>
                  <th className="py-4 px-6 whitespace-nowrap">Niveau de Risque</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {verifications.map((verif, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-blue-600">{verif.id}</div>
                      <div className="text-xs font-medium text-slate-500">{verif.type}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{verif.soumetteur}</div>
                      <div className="text-xs text-slate-500">{verif.declarant}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${verif.risque === 'Faible' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${verif.risque === 'Moyen' ? 'bg-amber-100 text-amber-700' : ''}
                        ${verif.risque === 'Élevé' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {verif.risque}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{verif.date}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {verif.statut === 'Validé' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {verif.statut === 'En attente' && <Clock className="w-4 h-4 text-amber-500" />}
                        {verif.statut === 'Rejeté' && <XCircle className="w-4 h-4 text-red-500" />}
                        <span className={`font-bold text-xs uppercase tracking-wide
                          ${verif.statut === 'Validé' ? 'text-emerald-700' : ''}
                          ${verif.statut === 'En attente' ? 'text-amber-700' : ''}
                          ${verif.statut === 'Rejeté' ? 'text-red-700' : ''}
                        `}>
                          {verif.statut}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  )
}
