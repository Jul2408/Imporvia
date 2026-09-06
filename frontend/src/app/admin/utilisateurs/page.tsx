"use client"

import React, { useState } from "react"
import { Search, MoreVertical, UserPlus, Shield, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"

function ActionMenu({ user, onClose }: { user: any; onClose: () => void }) {
  return (
    <div className="absolute right-4 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 min-w-45">
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
        <Eye className="w-4 h-4 text-slate-400" /> Voir le profil
      </button>
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
        <Edit2 className="w-4 h-4 text-slate-400" /> Modifier le rôle
      </button>
      <div className="border-t border-slate-100 my-1" />
      <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
        <Trash2 className="w-4 h-4" /> Désactiver
      </button>
    </div>
  )
}

export default function ImporViaAdminUtilisateurs() {
  const [isInviteOpen, setInviteOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const { company } = useAuth()
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    if (company?.id) {
      apiClient.get(`/companies/${company.id}/members/`)
        .then(res => setUtilisateurs(res.data?.results || res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [company])

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto" onClick={() => setOpenMenu(null)}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Utilisateurs</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les accès, les rôles et les permissions de tous les utilisateurs de la plateforme.</p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Inviter un utilisateur
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative focus-within:ring-2 focus-within:ring-blue-500 rounded-xl flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 w-full focus:outline-none focus:bg-white transition-colors" 
                placeholder="Rechercher par nom ou email..." 
                type="text"
              />
            </div>
            <select className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
              <option value="">Tous les rôles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin Entreprise</option>
              <option value="declarant">Déclarant</option>
              <option value="lecteur">Lecteur</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Utilisateur</th>
                  <th className="py-4 px-6 whitespace-nowrap">Rôle</th>
                  <th className="py-4 px-6 whitespace-nowrap">Entreprise</th>
                  <th className="py-4 px-6 whitespace-nowrap">Dernière connexion</th>
                  <th className="py-4 px-6 whitespace-nowrap">Statut</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">Chargement...</td>
                  </tr>
                ) : utilisateurs.map((user, i) => (
                  <tr key={user.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold border border-slate-200 uppercase">
                          {user.user_full_name ? user.user_full_name.substring(0, 2) : "??"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.user_full_name}</div>
                          <div className="text-xs text-slate-500">{user.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold
                        ${user.role === 'OWNER' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}
                      `}>
                        {user.role === 'OWNER' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">{company?.name}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{user.joined_at ? new Date(user.joined_at).toLocaleDateString("fr-FR") : "-"}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {user.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="relative inline-block">
                        <button
                          className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === i ? null : i) }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openMenu === i && <ActionMenu user={user} onClose={() => setOpenMenu(null)} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage 1 à 5 sur 347 utilisateurs</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">1</button>
              <button className="w-9 h-9 rounded-lg hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">2</button>
              <span className="w-9 h-9 flex items-center justify-center">...</span>
              <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Inviter Utilisateur */}
      <Modal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} title="Inviter un utilisateur" maxWidth="md">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Adresse email *</label>
            <input type="email" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="nom@entreprise.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Rôle assigné</label>
            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
              <option>Déclarant</option>
              <option>Admin Entreprise</option>
              <option>Lecteur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Entreprise</label>
            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
              <option>Global Logistics SA</option>
              <option>Transit Intl</option>
              <option>Aero Export</option>
              <option>Customs Direct</option>
            </select>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 font-medium">
            Un email d'invitation sera envoyé. L'utilisateur devra créer un mot de passe pour finaliser son accès.
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Annuler
            </button>
            <button onClick={() => setInviteOpen(false)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" /> Envoyer l'invitation
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
