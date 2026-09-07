"use client"

import React, { useState, useEffect } from "react"
import { History, Search, Filter, User, Building2, Settings, Trash2, Edit2, LogIn, ChevronLeft, ChevronRight, Download } from "lucide-react"
import apiClient from "@/lib/api"
import { toast } from "react-hot-toast"

const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  edit: { color: "bg-blue-100 text-blue-700", icon: <Edit2 className="w-3.5 h-3.5" /> },
  delete: { color: "bg-red-100 text-red-700", icon: <Trash2 className="w-3.5 h-3.5" /> },
  create: { color: "bg-emerald-100 text-emerald-700", icon: <Building2 className="w-3.5 h-3.5" /> },
  login: { color: "bg-slate-100 text-slate-600", icon: <LogIn className="w-3.5 h-3.5" /> },
  simulation: { color: "bg-violet-100 text-violet-700", icon: <Settings className="w-3.5 h-3.5" /> },
}

export default function ImporViaAdminHistorique() {
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [moduleFilter, setModuleFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("")

  const [stats, setStats] = useState({ 
    logs_today: 0, 
    logs_this_month: 0, 
    active_users: 0 
  })

  const fetchLogs = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (search) params.append('search', search)
    if (moduleFilter) params.append('resource_type', moduleFilter)
    if (actionFilter) params.append('action', actionFilter)

    apiClient.get(`/admin/audit-logs/?${params.toString()}`)
      .then(res => {
        setAuditLogs(res.data.results || [])
        setCount(res.data.count || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const fetchStats = () => {
    apiClient.get(`/admin/analytics/`)
      .then(res => {
        setStats({
          logs_today: res.data.logs_today || 0,
          logs_this_month: res.data.logs_this_month || 0,
          active_users: res.data.active_users || 0,
        })
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchLogs()
  }, [page, search, moduleFilter, actionFilter])

  useEffect(() => {
    fetchStats()
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const totalPages = Math.max(1, Math.ceil(count / 20))

  const handleExportCSV = async () => {
    try {
      toast.loading("Génération du CSV...", { id: "export" })
      const res = await apiClient.get('/admin/audit-logs/?page_size=1000') // fetch up to 1000 logs for export
      const logs = res.data.results || []
      
      const csvHeader = "\uFEFFActeur,Action,Ressource,ID,IP,Date\n"
      const csvRows = logs.map((log: any) => 
        `"${log.user_email}","${log.action}","${log.resource_type}","${log.resource_id}","${log.ip_address || ''}","${new Date(log.created_at).toLocaleString('fr-FR')}"`
      ).join("\n")
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `imporvia_audit_logs_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Export réussi", { id: "export" })
    } catch (error) {
      console.error(error)
      toast.error("Échec de l'export", { id: "export" })
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('SUSPEND') || action.includes('DEMOTE')) return 'delete'
    if (action.includes('CREATE') || action.includes('ACTIVATED') || action.includes('PROMOTE')) return 'create'
    if (action.includes('SIMULATION')) return 'simulation'
    if (action.includes('LOGIN')) return 'login'
    return 'edit'
  }

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Journal d'Audit</h1>
            <p className="text-slate-500 font-medium mt-1">Consultez l'historique complet de toutes les actions sur la plateforme.</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" /> Exporter les logs
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Actions aujourd'hui", value: stats.logs_today.toLocaleString("fr-FR"), icon: <History className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" },
            { label: "Utilisateurs actifs", value: stats.active_users.toLocaleString("fr-FR"), icon: <User className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50" },
            { label: "Actions (30 jours)", value: stats.logs_this_month.toLocaleString("fr-FR"), icon: <History className="w-5 h-5 text-violet-500" />, bg: "bg-violet-50" },
            { label: "Modules surveillés", value: "6", icon: <Settings className="w-5 h-5 text-slate-500" />, bg: "bg-slate-200" },
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
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher par acteur ou ressource..."
            />
          </div>
          <select 
            value={moduleFilter}
            onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
          >
            <option value="">Tous les modules</option>
            <option value="User">Utilisateurs</option>
            <option value="Company">Entreprises</option>
            <option value="Simulation">Simulations</option>
          </select>
          <select 
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
          >
            <option value="">Toutes les actions</option>
            <option value="CREATED">Création</option>
            <option value="SUSPENDED">Suspension</option>
            <option value="DELETED">Suppression</option>
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
                  <th className="py-4 px-6 w-1/3">Ressource</th>
                  <th className="py-4 px-6 whitespace-nowrap">Adresse IP</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucun log trouvé.</td></tr>
                ) : auditLogs.map((log, i) => {
                  const t = typeConfig[getActionColor(log.action)] || typeConfig.edit
                  return (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                            {log.user_email ? log.user_email.charAt(0).toUpperCase() : "S"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{log.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${t.color}`}>
                          {t.icon} {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-700 font-medium">[{log.resource_type}] {log.resource_id}</div>
                        {log.details && (
                          <div className="text-xs text-slate-500 font-mono mt-1 max-w-xs truncate" title={JSON.stringify(log.details)}>
                            {JSON.stringify(log.details)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold font-mono">
                          {log.ip_address || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                        {new Date(log.created_at).toLocaleString("fr-FR")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage de {(page - 1) * 20 + 1} à {Math.min(page * 20, count)} sur {count} événements</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
                {page}
              </button>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
