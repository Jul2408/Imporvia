"use client"

import React, { useState } from "react"
import { Search, Plus, Edit2, Trash2, BadgePercent, Percent, Hash } from "lucide-react"

const taxes = [
  { nom: "Droits de Douane (DD)", type: "Ad Valorem", taux: "5% - 20%", appli: "Valeur CAF", pays: "CEMAC/CEDEAO", status: "Actif" },
  { nom: "TVA", type: "Ad Valorem", taux: "18%", appli: "Valeur CAF + Droits", pays: "Côte d'Ivoire", status: "Actif" },
  { nom: "Taxe Statistique (RSI)", type: "Spécifique", taux: "1%", appli: "Valeur CAF", pays: "Mali", status: "Actif" },
  { nom: "Prélèvement Communautaire de Solidarité (PCS)", type: "Ad Valorem", taux: "0.8%", appli: "Valeur CAF", pays: "UEMOA", status: "Actif" },
  { nom: "Taxe sur les Produits Pétroliers", type: "Volume", taux: "150 FCFA / L", appli: "Quantité", pays: "Sénégal", status: "Actif" },
]

export default function ImporViaAdminTaxes() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Taxes & Taux</h1>
            <p className="text-slate-500 font-medium mt-1">Configurez les droits de douane, TVA et taxes spécifiques par pays.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouvelle Taxe
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative focus-within:ring-2 focus-within:ring-blue-500 rounded-xl flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 w-full focus:outline-none focus:bg-white transition-colors" 
                placeholder="Rechercher une taxe..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
              <option value="">Tous les pays</option>
              <option value="ci">Côte d'Ivoire</option>
              <option value="sn">Sénégal</option>
              <option value="ml">Mali</option>
              <option value="cemac">CEMAC (Général)</option>
              <option value="cedeao">CEDEAO (Général)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Nom de la Taxe</th>
                  <th className="py-4 px-6 whitespace-nowrap">Type</th>
                  <th className="py-4 px-6 whitespace-nowrap">Taux</th>
                  <th className="py-4 px-6 whitespace-nowrap">Base d'application</th>
                  <th className="py-4 px-6 whitespace-nowrap">Pays / Zone</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {taxes.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BadgePercent className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-900">{item.nom}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.type}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-flex items-center gap-1">
                        {item.type === 'Ad Valorem' ? <Percent className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                        {item.taux}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{item.appli}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                        {item.pays}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${item.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
