"use client"

import React, { useState } from "react"
import { CreditCard, Search, Download, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const transactions = [
  { id: "PAY-2026-0891", company: "LogisTech SA", plan: "Pro", amount: "150 000", method: "Orange Money", date: "28 Août 2026", status: "success" },
  { id: "PAY-2026-0890", company: "Import Express", plan: "Starter", amount: "50 000", method: "MTN MoMo", date: "27 Août 2026", status: "success" },
  { id: "PAY-2026-0889", company: "Tech Douala SARL", plan: "Entreprise", amount: "Sur devis", method: "Virement", date: "26 Août 2026", status: "pending" },
  { id: "PAY-2026-0888", company: "Global Trade Ltd", plan: "Pro", amount: "150 000", method: "Carte Bancaire", date: "25 Août 2026", status: "failed" },
  { id: "PAY-2026-0887", company: "Brasseries du Cam.", plan: "Pro", amount: "1 500 000", method: "Virement", date: "24 Août 2026", status: "success" },
]

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  success: { label: "Payé", icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending: { label: "En attente", icon: <Clock className="w-3.5 h-3.5" />, className: "bg-amber-50 text-amber-700 border border-amber-200" },
  failed:  { label: "Échoué", icon: <XCircle className="w-3.5 h-3.5" />, className: "bg-red-50 text-red-700 border border-red-200" },
}

export default function ImporViaAdminPaiements() {
  const [search, setSearch] = useState("")
  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Paiements & Facturation</h1>
            <p className="text-slate-500 font-medium mt-1">Historique des transactions et gestion des revenus de la plateforme.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30">
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
        </div>

        {/* KPI Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "MRR (Août 2026)", value: "14 400 000 FCFA", icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Transactions réussies", value: "96 / 98", icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Paiements en attente", value: "3", icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
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
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher une transaction..." />
          </div>
          <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
            <option>Tous les statuts</option>
            <option>Payé</option>
            <option>En attente</option>
            <option>Échoué</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                {filtered.map((t, i) => {
                  const s = statusConfig[t.status]
                  return (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600 text-xs">{t.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{t.company}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold">{t.plan}</span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">{t.amount}</td>
                      <td className="py-4 px-6 text-slate-600">{t.method}</td>
                      <td className="py-4 px-6 text-slate-500">{t.date}</td>
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
            <span>Affichage 1 à {filtered.length} sur 98 transactions</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg opacity-50 cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">1</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white transition-colors flex items-center justify-center">2</button>
              <button className="p-2 rounded-lg hover:bg-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
