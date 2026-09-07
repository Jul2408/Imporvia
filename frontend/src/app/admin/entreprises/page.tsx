"use client"

import React, { useState, useEffect } from "react"
import { Building2, Search, Filter, MoreVertical, Plus, ChevronLeft, ChevronRight, Eye, Power, Edit2, CheckCircle2 } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import apiClient from "@/lib/api"
import { toast } from "react-hot-toast"

function ActionMenu({ ent, onClose, onRefresh }: { ent: any; onClose: () => void; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (actionPath: string, successMessage: string) => {
    if (loading) return
    setLoading(true)
    try {
      await apiClient.post(`/admin/companies/${ent.id}/${actionPath}/`)
      toast.success(successMessage)
      onRefresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de l'exécution de l'action.")
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div className="absolute right-4 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 min-w-40">
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
        <Eye className="w-4 h-4 text-slate-400" /> Voir le profil
      </button>
      
      <div className="border-t border-slate-100 my-1" />
      
      {ent.is_active ? (
        <button onClick={() => handleAction('suspend', 'Entreprise suspendue.')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-2">
          <Power className="w-4 h-4" /> Suspendre
        </button>
      ) : (
        <button onClick={() => handleAction('activate', 'Entreprise réactivée.')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Réactiver
        </button>
      )}
    </div>
  )
}

export default function ImporViaAdminEntreprises() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  
  const [entreprises, setEntreprises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Formulaire Nouvelle Entreprise
  const [formData, setFormData] = useState({ name: "", tax_id: "", address: "" })
  const [submitting, setSubmitting] = useState(false)

  const fetchCompanies = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (search) params.append('search', search)
    if (statusFilter) params.append('is_active', statusFilter === 'active' ? 'true' : 'false')

    apiClient.get(`/admin/companies/?${params.toString()}`)
      .then(res => {
        setEntreprises(res.data.results || [])
        setCount(res.data.count || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCompanies()
  }, [page, search, statusFilter])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleCreateCompany = async () => {
    if (!formData.name.trim()) {
      toast.error("Le nom de l'entreprise est obligatoire.")
      return
    }
    
    setSubmitting(true)
    try {
      await apiClient.post('/admin/companies/', formData)
      toast.success("Entreprise créée avec succès.")
      setModalOpen(false)
      setFormData({ name: "", tax_id: "", address: "" })
      fetchCompanies()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de la création.")
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / 20))

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto" onClick={() => setOpenMenu(null)}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Entreprises</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les entreprises clientes, leurs utilisateurs et leurs simulations.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Entreprise
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative focus-within:ring-2 focus-within:ring-blue-500 rounded-xl flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 w-full focus:outline-none focus:bg-white transition-colors" 
                placeholder="Rechercher par nom ou NIU..." 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="inactive">Suspendue</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Entreprise</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date d'inscription</th>
                  <th className="py-4 px-6 whitespace-nowrap">Membres</th>
                  <th className="py-4 px-6 whitespace-nowrap">Simulations</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </td>
                  </tr>
                ) : entreprises.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-medium">Aucune entreprise trouvée.</td>
                  </tr>
                ) : entreprises.map((ent, i) => (
                  <tr key={ent.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${!ent.is_active ? 'opacity-75 bg-slate-50' : ''}`}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold uppercase ${ent.is_active ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                          {ent.name ? ent.name.substring(0, 2) : "??"}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">{ent.name}</span>
                          {ent.tax_id && <div className="text-xs text-slate-500">NIU: {ent.tax_id}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {new Date(ent.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      <span className="bg-slate-100 text-slate-700 py-1 px-3 rounded-full text-xs font-bold">{ent.member_count}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      <span className="bg-emerald-50 text-emerald-700 py-1 px-3 rounded-full text-xs font-bold">{ent.simulation_count}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${ent.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {ent.is_active ? 'Active' : 'Suspendue'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="relative inline-block">
                        <button
                          className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
                          onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === i ? null : i) }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openMenu === i && <ActionMenu ent={ent} onClose={() => setOpenMenu(null)} onRefresh={fetchCompanies} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage de {(page - 1) * 20 + 1} à {Math.min(page * 20, count)} sur {count} entreprises</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">
                {page}
              </button>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nouvelle Entreprise */}
      <Modal isOpen={isModalOpen} onClose={() => !submitting && setModalOpen(false)} title="Ajouter une Entreprise" maxWidth="md">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'entreprise *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
              placeholder="Ex: Global Logistics SA" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Numéro d'Identification Fiscale (NIU)</label>
            <input 
              type="text" 
              value={formData.tax_id}
              onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
              placeholder="Ex: 0000000X" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
              placeholder="Ex: Abidjan, Plateau" 
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setModalOpen(false)} 
              disabled={submitting}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
            >
              Annuler
            </button>
            <button 
              onClick={handleCreateCompany} 
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Building2 className="w-4 h-4" /> Créer l'entreprise</>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
