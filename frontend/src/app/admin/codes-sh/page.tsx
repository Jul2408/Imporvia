"use client"

import React, { useState } from "react"
import { Search, Plus, Edit2, Trash2, FolderTree, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"

const codesSH = [
  { code: "0101.21.00.00", description: "Chevaux reproducteurs de race pure", categorie: "Animaux vivants", taxes: "0%", status: "Actif" },
  { code: "1006.10.10.00", description: "Riz en paille (riz paddy) pour semences", categorie: "Céréales", taxes: "5%", status: "Actif" },
  { code: "2709.00.00.00", description: "Huiles brutes de pétrole ou de minéraux bitumineux", categorie: "Combustibles", taxes: "10%", status: "Actif" },
  { code: "3004.90.99.00", description: "Autres médicaments (à l'exclusion des produits du n° 30.02, 30.05 ou 30.06)", categorie: "Produits pharmaceutiques", taxes: "0%", status: "En révision" },
  { code: "8703.23.19.00", description: "Véhicules de tourisme de cylindrée > 1500 cm³ mais <= 3000 cm³", categorie: "Véhicules", taxes: "45%", status: "Actif" },
]

export default function ImporViaAdminCodesSH() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nomenclature Tarifaire (Codes SH)</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez et mettez à jour la base de données des codes SH de la CEDEAO/CEMAC.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" /> Export
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4" /> Import CSV
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouveau Code
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative focus-within:ring-2 focus-within:ring-blue-500 rounded-xl flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 w-full focus:outline-none focus:bg-white transition-colors" 
                placeholder="Rechercher par code (ex: 8703) ou description..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
              <option value="">Toutes les catégories (Chapitres)</option>
              <option value="01">Chapitre 01 : Animaux vivants</option>
              <option value="10">Chapitre 10 : Céréales</option>
              <option value="27">Chapitre 27 : Combustibles</option>
              <option value="30">Chapitre 30 : Pharmaceutique</option>
              <option value="87">Chapitre 87 : Véhicules</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Code SH</th>
                  <th className="py-4 px-6 w-1/3">Description</th>
                  <th className="py-4 px-6 whitespace-nowrap">Catégorie</th>
                  <th className="py-4 px-6 whitespace-nowrap">Taxes (Base)</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {codesSH.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-blue-600 font-mono">{item.code}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-slate-900 font-medium line-clamp-2" title={item.description}>{item.description}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.categorie}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{item.taxes}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${item.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
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
