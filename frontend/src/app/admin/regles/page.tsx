"use client"

import React from "react"
import { Search, Filter, Plus, Edit2, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const regles = [
  { nom: "TVA Import Standard", desc: "Application de la TVA de base sur la valeur CIF pour les biens de consommation courante.", priorite: 10, version: "v2.4.1", status: "active", date: "12 Jan 2024" },
  { nom: "Exonération Matériel Médical", desc: "Suspension des droits de douane pour les codes SH classe 9018.", priorite: 5, version: "v1.1.0", status: "active", date: "01 Mar 2024" },
  { nom: "Surtaxe Véhicules Occasion", desc: "Malus environnemental appliqué aux véhicules de plus de 5 ans.", priorite: 25, version: "v3.0.2", status: "inactive", date: "-" },
  { nom: "Redevance Informatique", desc: "Frais fixes de traitement par déclaration.", priorite: 99, version: "v1.0.0", status: "draft", date: "-" },
]

export default function ImporViaAdminRegles() {
  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Règles de Calcul</h1>
            <p className="text-slate-500 font-medium mt-1 max-w-2xl">Gestion du moteur d'évaluation douanière. Configurez les priorités et conditions de déclenchement des taxes.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter une règle
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative focus-within:ring-2 focus-within:ring-blue-500 rounded-xl flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 w-full focus:outline-none focus:bg-white transition-colors" 
              placeholder="Filtrer par nom ou statut..." 
              type="text"
            />
          </div>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 min-w-50">
            <option value="">Toutes les priorités</option>
            <option value="critique">Critique (1-10)</option>
            <option value="haute">Haute (11-50)</option>
            <option value="standard">Standard (51+)</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-1/4">Nom de règle</th>
                  <th className="py-4 px-6 w-1/3">Description</th>
                  <th className="py-4 px-6 text-center">Priorité</th>
                  <th className="py-4 px-6 whitespace-nowrap">Version</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date d'activation</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {regles.map((regle, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900">{regle.nom}</td>
                    <td className="py-4 px-6 font-medium text-slate-600 truncate max-w-xs" title={regle.desc}>
                      {regle.desc}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold text-xs border border-slate-200">
                        {String(regle.priorite).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-slate-600">{regle.version}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${regle.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                        ${regle.status === 'inactive' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                        ${regle.status === 'draft' ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                      `}>
                        {regle.status === 'active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {regle.status === 'inactive' && <AlertCircle className="w-3.5 h-3.5" />}
                        {regle.status === 'draft' && <Clock className="w-3.5 h-3.5" />}
                        {regle.status === 'draft' ? 'Brouillon' : regle.status === 'inactive' ? 'Inactif' : 'Actif'}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 italic">{regle.date}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage 1 à 4 sur 42 résultats</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">1</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">2</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">3</button>
              <span className="w-9 h-9 flex items-center justify-center">...</span>
              <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
