"use client"

import React, { useState, useEffect } from "react"
import { History, Search, Filter, User, Building2, Settings, Trash2, Edit2, LogIn, ChevronLeft, ChevronRight } from "lucide-react"
import apiClient from "@/lib/api"

const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  edit: { color: "bg-blue-100 text-blue-700", icon: <Edit2 className="w-3.5 h-3.5" /> },
  delete: { color: "bg-red-100 text-red-700", icon: <Trash2 className="w-3.5 h-3.5" /> },
  create: { color: "bg-emerald-100 text-emerald-700", icon: <Building2 className="w-3.5 h-3.5" /> },
  login: { color: "bg-slate-100 text-slate-600", icon: <LogIn className="w-3.5 h-3.5" /> },
  simulation: { color: "bg-violet-100 text-violet-700", icon: <Settings className="w-3.5 h-3.5" /> },
}

export default function ImporViaAdminHistorique() {
  const [search, setSearch] = useState("")
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get("/admin/audit-logs/")
      .then(res => setAuditLogs(res.data?.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = auditLogs.filter(log =>
    log.user_email?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.resource_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Journal d'Audit</h1>
            <p className="text-slate-500 font-medium mt-1">Consultez l'historique complet de toutes les actions sur la plateforme.</p>
          </div>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm">
            Exporter les logs
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Actions aujourd'hui", value: "48", icon: <History className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" },
            { label: "Utilisateurs actifs", value: "17", icon: <User className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50" },
            { label: "Suppressions (mois)", value: "6", icon: <Trash2 className="w-5 h-5 text-red-500" />, bg: "bg-red-50" },
            { label: "Modifications (mois)", value: "134", icon: <Edit2 className="w-5 h-5 text-violet-500" />, bg: "bg-violet-50" },
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher par acteur, cible ou module..."
            />
          </div>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option>Tous les modules</option>
            <option>Taxes</option>
            <option>Règles</option>
            <option>Entreprises</option>
            <option>Simulations</option>
            <option>Auth</option>
            <option>Paramètres</option>
          </select>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option>Toutes les actions</option>
            <option>Création</option>
            <option>Modification</option>
            <option>Suppression</option>
            <option>Connexion</option>
          </select>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Acteur</th>
                  <th className="py-4 px-6 whitespace-nowrap">Action</th>
                  <th className="py-4 px-6 w-1/3">Cible / Détail</th>
                  <th className="py-4 px-6 whitespace-nowrap">Module</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucun log trouvé.</td></tr>
                ) : filtered.map((log, i) => {
                  const t = typeConfig[log.type || "edit"] || typeConfig.edit
                  return (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                            {(log.user_email || log.acteur || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{log.user_email || log.acteur}</div>
                            <div className="text-xs text-slate-400">{log.role || "Utilisateur"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${t.color}`}>
                          {t.icon} {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">{log.cible || `${log.resource_type} (${log.resource_id})`}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{log.module || log.resource_type}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs font-medium">{log.date || (log.created_at ? new Date(log.created_at).toLocaleString("fr-FR") : "-")}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage 1 à {filtered.length} sur 1 842 événements</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg opacity-50 cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">1</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white transition-colors flex items-center justify-center">2</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white transition-colors flex items-center justify-center">3</button>
              <span className="w-9 h-9 flex items-center justify-center">...</span>
              <button className="p-2 rounded-lg hover:bg-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
