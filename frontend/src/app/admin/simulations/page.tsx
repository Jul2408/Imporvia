"use client"

import React, { useState } from "react"
import { Activity, Search, Filter, Eye, ChevronLeft, ChevronRight, TrendingUp, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import apiClient from "@/lib/api"

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  completed: { label: "Complété", icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending:   { label: "En cours", icon: <Clock className="w-3.5 h-3.5 animate-spin" />, className: "bg-amber-50 text-amber-700 border border-amber-200" },
  error:     { label: "Erreur",   icon: <AlertCircle className="w-3.5 h-3.5" />, className: "bg-red-50 text-red-700 border border-red-200" },
}

export default function ImporViaAdminSimulations() {
  const [search, setSearch] = useState("")
  const [simulations, setSimulations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    apiClient.get(`/simulations/`)
      .then(res => setSimulations(res.data?.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = simulations.filter(s =>
    s.reference?.toLowerCase().includes(search.toLowerCase()) ||
    s.hs_code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Journal des Simulations</h1>
            <p className="text-slate-500 font-medium mt-1">Supervisez toutes les simulations de dédouanement en temps réel.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-sm font-bold">
              {simulations.length} simulations
            </span>
          </div>
        </div>

        {/* KPI Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Simulations ce mois", value: simulations.length.toString(), icon: <Activity className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Taux de succès", value: simulations.length ? Math.round((simulations.filter(s => s.status === 'COMPLETED').length / simulations.length) * 100) + "%" : "0%", icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Erreurs détectées", value: simulations.filter(s => s.status === 'FAILED').length.toString(), icon: <AlertCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-50" },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>{kpi.icon}</div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
                <div className="text-sm text-slate-500 font-medium">{kpi.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher par ID, utilisateur ou entreprise..." />
          </div>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option>Tous les statuts</option>
            <option>Complété</option>
            <option>En cours</option>
            <option>Erreur</option>
          </select>
          <button className="border border-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">ID Simulation</th>
                  <th className="py-4 px-6 whitespace-nowrap">Utilisateur</th>
                  <th className="py-4 px-6 whitespace-nowrap">Code SH</th>
                  <th className="py-4 px-6 whitespace-nowrap">Valeur CIF</th>
                  <th className="py-4 px-6 whitespace-nowrap">Taxes Dues</th>
                  <th className="py-4 px-6 whitespace-nowrap">Rotte</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">Chargement...</td>
                  </tr>
                ) : filtered.map((sim, i) => {
                  const s = statusConfig[sim.status === "COMPLETED" ? "completed" : sim.status === "FAILED" ? "error" : "pending"] || statusConfig.pending
                  return (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600 text-xs">{sim.reference}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-slate-900">-</div>
                        <div className="text-slate-500 text-xs">-</div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">{sim.hs_code || "N/A"}</td>
                      <td className="py-4 px-6 font-medium text-slate-700">{sim.cif_value ? parseFloat(sim.cif_value).toLocaleString("fr-FR") : "-"} FCFA</td>
                      <td className="py-4 px-6 font-bold text-emerald-700">{sim.total_to_pay ? parseFloat(sim.total_to_pay).toLocaleString("fr-FR") : "-"} FCFA</td>
                      <td className="py-4 px-6 text-slate-600 text-xs">-</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${s.className}`}>
                          {s.icon} {s.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage 1 à {filtered.length} sur 3 470 résultats</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-white transition-colors opacity-50 cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">1</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white transition-colors flex items-center justify-center">2</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white transition-colors flex items-center justify-center">3</button>
              <button className="p-2 rounded-lg hover:bg-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
