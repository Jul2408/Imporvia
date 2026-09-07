"use client"

import React, { useState, useEffect } from "react"
import { Search, MoreVertical, UserPlus, Shield, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, CheckCircle2, ShieldOff, Power } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"
import { toast } from "react-hot-toast"

function ActionMenu({ user, onClose, onRefresh }: { user: any; onClose: () => void; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (actionPath: string, successMessage: string) => {
    if (loading) return
    setLoading(true)
    try {
      await apiClient.post(`/admin/users/${user.id}/${actionPath}/`)
      toast.success(successMessage)
      onRefresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de l'exécution de l'action.")
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleDelete = async () => {
    if (loading) return
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${user.email} ?`)) return
    
    setLoading(true)
    try {
      await apiClient.delete(`/admin/users/${user.id}/`)
      toast.success("Utilisateur supprimé avec succès.")
      onRefresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de la suppression.")
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div className="absolute right-4 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 min-w-48">
      {user.is_active ? (
        <button onClick={() => handleAction('suspend', 'Utilisateur suspendu.')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-2">
          <Power className="w-4 h-4" /> Suspendre
        </button>
      ) : (
        <button onClick={() => handleAction('activate', 'Utilisateur réactivé.')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Réactiver
        </button>
      )}

      {user.is_staff ? (
        <button onClick={() => handleAction('demote_admin', 'Droits admin retirés.')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
          <ShieldOff className="w-4 h-4 text-slate-400" /> Retirer droits Admin
        </button>
      ) : (
        <button onClick={() => handleAction('promote_admin', 'Droits admin accordés.')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Promouvoir Admin
        </button>
      )}
      
      <div className="border-t border-slate-100 my-1" />
      <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
        <Trash2 className="w-4 h-4" /> Supprimer
      </button>
    </div>
  )
}

export default function ImporViaAdminUtilisateurs() {
  const [isInviteOpen, setInviteOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const { user: currentUser } = useAuth()
  
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const fetchUsers = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (search) params.append('search', search)
    if (statusFilter) params.append('is_active', statusFilter === 'active' ? 'true' : 'false')
    if (roleFilter) params.append('is_staff', roleFilter === 'admin' ? 'true' : 'false')

    apiClient.get(`/admin/users/?${params.toString()}`)
      .then(res => {
        setUtilisateurs(res.data.results || [])
        setCount(res.data.count || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search, statusFilter, roleFilter])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const totalPages = Math.max(1, Math.ceil(count / 20))

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto" onClick={() => setOpenMenu(null)}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Utilisateurs</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les accès, les rôles et les permissions de tous les utilisateurs de la plateforme.</p>
          </div>
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateur Système</option>
              <option value="user">Utilisateur Standard</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Suspendus</option>
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
                  <th className="py-4 px-6 whitespace-nowrap">Rôle Système</th>
                  <th className="py-4 px-6 whitespace-nowrap">Entreprises Liées</th>
                  <th className="py-4 px-6 whitespace-nowrap">Date d'inscription</th>
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
                ) : utilisateurs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-medium">Aucun utilisateur trouvé.</td>
                  </tr>
                ) : utilisateurs.map((user, i) => (
                  <tr key={user.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${!user.is_active ? 'opacity-75 bg-slate-50' : ''}`}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase text-sm ${user.is_staff ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                          {user.first_name ? user.first_name.substring(0, 2) : user.email.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.full_name || "Nom non défini"}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold
                        ${user.is_staff ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}
                      `}>
                        {user.is_staff && <Shield className="w-3 h-3" />}
                        {user.is_staff ? "Admin" : "Standard"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {user.company_count}
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                        ${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {user.is_active ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {currentUser?.id !== user.id && (
                        <div className="relative inline-block">
                          <button
                            className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === i ? null : i) }}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenu === i && <ActionMenu user={user} onClose={() => setOpenMenu(null)} onRefresh={fetchUsers} />}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Affichage de {(page - 1) * 20 + 1} à {Math.min(page * 20, count)} sur {count} utilisateurs</span>
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
    </main>
  )
}
