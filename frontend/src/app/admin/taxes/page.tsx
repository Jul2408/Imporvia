"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, BadgePercent, Percent, Hash, Loader2 } from "lucide-react"

export default function ImporViaAdminTaxes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [taxes, setTaxes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTaxes()
  }, [])

  const fetchTaxes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch("http://localhost:8000/api/v1/customs/rules/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Erreur de chargement des taxes")
      const data = await res.json()
      setTaxes(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette taxe ?")) return;
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8000/api/v1/customs/rules/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Erreur de suppression")
      setTaxes(taxes.filter(t => t.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filteredTaxes = taxes.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.tax_component?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Taxes & Taux</h1>
            <p className="text-slate-500 font-medium mt-1">Configurez les droits de douane, TVA et taxes spécifiques par pays.</p>
          </div>
          <button onClick={() => alert("L'ajout de taxe requiert un formulaire complexe. En cours de développement.")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-100">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Chargement des taxes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-100">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchTaxes} className="mt-4 text-blue-600 hover:underline">Réessayer</button>
            </div>
          ) : filteredTaxes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-100">
              <p className="text-slate-500 font-medium">Aucune taxe trouvée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 whitespace-nowrap">Nom de la Taxe</th>
                    <th className="py-4 px-6 whitespace-nowrap">Composante</th>
                    <th className="py-4 px-6 whitespace-nowrap">Formule de base</th>
                    <th className="py-4 px-6 whitespace-nowrap">Priorité</th>
                    <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredTaxes.map((item, i) => {
                    const latestVersion = item.versions?.[0] || {};
                    return (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <BadgePercent className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-bold text-slate-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{item.tax_component?.name || '-'}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-flex items-center gap-1">
                            {latestVersion.base_formula || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{item.priority}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                            ${latestVersion.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                          `}>
                            {latestVersion.status || 'DRAFT'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => alert("Edition en cours de développement")} className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
