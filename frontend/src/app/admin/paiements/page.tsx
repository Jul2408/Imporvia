"use client"

import React, { useState, useEffect, useCallback } from "react"
import { CreditCard, Search, Download, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, TrendingUp, Loader2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import apiClient from "@/lib/api"

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  SUCCESS: { label: "Payé", icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PENDING: { label: "En attente", icon: <Clock className="w-3.5 h-3.5" />, className: "bg-amber-50 text-amber-700 border border-amber-200" },
  FAILED:  { label: "Échoué", icon: <XCircle className="w-3.5 h-3.5" />, className: "bg-red-50 text-red-700 border border-red-200" },
}

export default function ImporViaAdminPaiements() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [transactions, setTransactions] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = { page, page_size: pageSize }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await apiClient.get("/admin/payments/", { params })
      setTransactions(res.data?.results || res.data || [])
      setCount(res.data?.count || 0)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur de chargement des paiements")
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    const t = setTimeout(() => fetchPayments(), 300)
    return () => clearTimeout(t)
  }, [fetchPayments])

  const totalPages = Math.max(1, Math.ceil(count / pageSize))

  const successfulTotal = transactions.filter(t => t.status === 'SUCCESS').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
  const successfulCount = transactions.filter(t => t.status === 'SUCCESS').length
  const pendingCount = transactions.filter(t => t.status === 'PENDING').length

  const handleExportCSV = () => {
    const header = ["ID Transaction", "Entreprise", "Plan", "Montant (FCFA)", "Méthode", "Date", "Statut"]
    const rows = transactions.map(t => [
      t.transaction_id || t.id,
      t.company_name || "",
      t.plan_name || "",
      t.amount || "",
      t.payment_method || "",
      new Date(t.created_at).toLocaleDateString('fr-FR'),
      t.status || ""
    ])
    const csvContent = [header, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `paiements_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Paiements & Facturation</h1>
            <p className="text-slate-500 font-medium mt-1">Historique des transactions et gestion des revenus de la plateforme.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchPayments} className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30">
              <Download className="w-4 h-4" /> Exporter CSV
            </button>
          </div>
        </div>

        {/* KPI Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Revenu Total (page)", value: loading ? "..." : `${successfulTotal.toLocaleString('fr-FR')} FCFA`, icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Transactions réussies", value: loading ? "..." : `${successfulCount} / ${transactions.length}`, icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Paiements en attente", value: loading ? "..." : `${pendingCount}`, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>{kpi.icon}</div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">{kpi.value}</div>
                <div className="text-sm text-slate-500 font-medium">{kpi.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher une transaction, entreprise..." />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option value="">Tous les statuts</option>
            <option value="SUCCESS">Payé</option>
            <option value="PENDING">En attente</option>
            <option value="FAILED">Échoué</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-96">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Chargement des paiements...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchPayments} className="mt-4 text-blue-600 hover:underline">Réessayer</button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <CreditCard className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Aucun paiement trouvé.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6 whitespace-nowrap">ID Transaction</th>
                      <th className="py-4 px-6 whitespace-nowrap">Entreprise</th>
                      <th className="py-4 px-6 whitespace-nowrap">Plan</th>
                      <th className="py-4 px-6 whitespace-nowrap">Montant (FCFA)</th>
                      <th className="py-4 px-6 whitespace-nowrap">Méthode</th>
                      <th className="py-4 px-6 whitespace-nowrap">Date</th>
                      <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {transactions.map((t, i) => {
                      const s = statusConfig[t.status] || { label: t.status, icon: null, className: "bg-slate-100 text-slate-700" }
                      return (
                        <tr key={t.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-blue-600 text-xs">{t.transaction_id || String(t.id || "").split('-')[0]}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">{t.company_name || "—"}</td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold">{t.plan_name || "—"}</span>
                          </td>
                          <td className="py-4 px-6 font-extrabold text-slate-900">{parseFloat(t.amount || 0).toLocaleString('fr-FR')}</td>
                          <td className="py-4 px-6 text-slate-600">{t.payment_method || "N/A"}</td>
                          <td className="py-4 px-6 text-slate-500">{new Date(t.created_at).toLocaleDateString('fr-FR')}</td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${s.className}`}>
                              {s.icon} {s.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
                <span>Page {page} / {totalPages} — {count} transactions au total</span>
                <div className="flex gap-1">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg font-bold flex items-center justify-center transition-colors ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-600'}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
