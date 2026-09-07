"use client"

import React, { useState, useEffect } from "react"
import { Bell, Plus, Send, Users, AlertTriangle, CheckCircle2, Info, Megaphone, Trash2, Loader2, RefreshCw, X, AlertCircle } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import apiClient from "@/lib/api"

const typeIconMap: Record<string, React.ReactNode> = {
  warning:  <AlertTriangle className="w-4 h-4 text-amber-500" />,
  success:  <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  system:   <Bell className="w-4 h-4 text-blue-500" />,
  info:     <Info className="w-4 h-4 text-violet-500" />,
}

export default function ImporViaAdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  // Form state
  const [titre, setTitre] = useState("")
  const [contenu, setContenu] = useState("")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.get("/admin/notifications/", { params: { page_size: 50 } })
      setNotifications(res.data?.results || res.data || [])
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur de chargement des notifications")
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!titre.trim()) return
    try {
      setSending(true)
      // Broadcast à tous les utilisateurs (pas de user_id = broadcast)
      await apiClient.post("/admin/notifications/", {
        title: titre,
        message: contenu,
      })
      setTitre("")
      setContenu("")
      setModalOpen(false)
      fetchNotifications()
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur lors de l'envoi de la notification")
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette notification ?")) return
    try {
      await apiClient.delete(`/admin/notifications/${id}/`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch {
      alert("Impossible de supprimer cette notification.")
    }
  }

  const sentCount = notifications.filter(n => n.is_read !== undefined ? !n.is_read : true).length

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notifications système</h1>
            <p className="text-slate-500 font-medium mt-1">Créez et gérez les alertes et messages envoyés aux utilisateurs.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchNotifications} className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 bg-white transition-colors text-slate-600">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Nouvelle Notification
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Notifications créées", value: loading ? "..." : notifications.length.toString(), icon: <Send className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Utilisateurs cibles", value: "Tous", icon: <Users className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Non lues (approx.)", value: loading ? "..." : sentCount.toString(), icon: <Megaphone className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>{kpi.icon}</div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
                <div className="text-sm text-slate-500 font-medium">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Toutes les notifications ({loading ? "..." : notifications.length})</h3>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Chargement des notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchNotifications} className="mt-4 text-blue-600 hover:underline">Réessayer</button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Bell className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Aucune notification envoyée.</p>
              <button onClick={() => setModalOpen(true)} className="mt-4 text-blue-600 hover:underline font-bold">Envoyer la première notification</button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {typeIconMap['system']}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{notif.title}</h4>
                      {notif.message && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.message}</p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                        {notif.user_email && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {notif.user_email}</span>}
                        {notif.created_at && <span>{new Date(notif.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${notif.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                      {notif.is_read ? "Lue" : "Non lue"}
                    </span>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouvelle Notification */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Nouvelle Notification de Diffusion" maxWidth="lg">
        <div className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 font-medium flex items-start gap-2">
            <Bell className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>Cette notification sera envoyée à <strong>tous les utilisateurs actifs</strong> de la plateforme.</span>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Titre de la notification *</label>
            <input
              type="text"
              value={titre}
              onChange={e => setTitre(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors font-medium"
              placeholder="Ex: Maintenance programmée le..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contenu du message</label>
            <textarea
              rows={4}
              value={contenu}
              onChange={e => setContenu(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none font-medium"
              placeholder="Rédigez votre message..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={!titre.trim() || sending}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Envoi en cours..." : "Envoyer à tous"}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
