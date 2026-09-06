"use client"

import React, { useState } from "react"
import { Building2, Search, Filter, MoreVertical, Plus, ChevronLeft, ChevronRight, Eye, Power, Edit2, X } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"

function ActionMenu({ ent, onClose }: { ent: any; onClose: () => void }) {
  return (
    <div className="absolute right-4 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 min-w-40">
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
        <Eye className="w-4 h-4 text-slate-400" /> Voir le profil
      </button>
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
        <Edit2 className="w-4 h-4 text-slate-400" /> Modifier
      </button>
      <div className="border-t border-slate-100 my-1" />
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
        <Power className="w-4 h-4" /> Suspendre
      </button>
    </div>
  )
}

export default function ImporViaAdminEntreprises() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [entreprises, setEntreprises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    apiClient.get(`/companies/`)
      .then(res => setEntreprises(res.data?.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto" onClick={() => setOpenMenu(null)}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Entreprises</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les entreprises clientes, leurs utilisateurs et leurs abonnements.</p>
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
                placeholder="Rechercher une entreprise..." 
                type="text"
              />
            </div>
            <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
              <option value="expired">Expiré</option>
            </select>
            <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
              <option value="">Tous les plans</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
              <option value="starter">Starter</option>
            </select>
          </div>
          <button className="border border-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Plus de filtres
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Entreprise</th>
                  <th className="py-4 px-6 whitespace-nowrap">Responsable</th>
                  <th className="py-4 px-6 whitespace-nowrap">Email</th>
                  <th className="py-4 px-6 whitespace-nowrap">Plan</th>
                  <th className="py-4 px-6 whitespace-nowrap">Utilisateurs</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">Chargement...</td>
                  </tr>
                ) : entreprises.map((ent, i) => (
                  <tr key={ent.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase">
                          {ent.name ? ent.name.substring(0, 2) : "??"}
                        </div>
                        <span className="font-bold text-slate-900">{ent.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">-</td>
                    <td className="py-4 px-6 text-slate-500">-</td>
                    <td className="py-4 px-6 font-medium text-slate-700">Standard</td>
                    <td className="py-4 px-6 font-medium text-slate-700">-</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${ent.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {ent.is_active ? 'Active' : 'Inactif'}
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
                        {openMenu === i && <ActionMenu ent={ent} onClose={() => setOpenMenu(null)} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage 1 à 4 sur 124 résultats</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">1</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">2</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">3</button>
              <span className="w-9 h-9 flex items-center justify-center">...</span>
              <button className="w-9 h-9 rounded-lg hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">10</button>
              <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nouvelle Entreprise */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Ajouter une Entreprise" maxWidth="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'entreprise *</label>
              <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="Ex: Global Logistics SA" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Secteur d'activité</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                <option>Transitaire / Douane</option>
                <option>Import / Export</option>
                <option>Transport & Logistique</option>
                <option>Commerce général</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom du responsable *</label>
              <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="Jean Dupont" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email du responsable *</label>
              <input type="email" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="contact@entreprise.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Plan d'abonnement</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                <option>Starter (50 000 FCFA/mois)</option>
                <option>Pro (150 000 FCFA/mois)</option>
                <option>Enterprise (Sur mesure)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pays</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                <option>Côte d'Ivoire</option>
                <option>Sénégal</option>
                <option>Mali</option>
                <option>Cameroun</option>
                <option>Burkina Faso</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Annuler
            </button>
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" /> Créer l'entreprise
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
