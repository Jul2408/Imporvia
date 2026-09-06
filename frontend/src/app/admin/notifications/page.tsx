"use client"

import React, { useState } from "react"
import { Bell, Plus, Send, Users, Building2, AlertTriangle, CheckCircle2, Info, Megaphone, Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/Modal"

const notifications = [
  { id: 1, titre: "Maintenance programmée le 30/09", type: "Système", cible: "Tous les utilisateurs", envoyee: "28 Août 2026", statut: "Envoyée", icone: "system" },
  { id: 2, titre: "Votre abonnement expire dans 7 jours", type: "Abonnement", cible: "3 entreprises", envoyee: "27 Août 2026", statut: "Envoyée", icone: "warning" },
  { id: 3, titre: "Bienvenue sur ImporVia !", type: "Onboarding", cible: "Nouveaux inscrits", envoyee: "—", statut: "Brouillon", icone: "info" },
  { id: 4, titre: "MAJ Taux douaniers CEMAC (T3 2026)", type: "Mise à jour", cible: "Plan Pro & Enterprise", envoyee: "15 Août 2026", statut: "Envoyée", icone: "success" },
]

const typeIconMap: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  system: <Bell className="w-4 h-4 text-blue-500" />,
  info: <Info className="w-4 h-4 text-violet-500" />,
}

export default function ImporViaAdminNotifications() {
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-slate-500 font-medium mt-1">Créez et gérez les alertes et messages envoyés aux utilisateurs.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nouvelle Notification
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Notifications envoyées", value: "38", icon: <Send className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Utilisateurs touchés", value: "1 247", icon: <Users className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Brouillons en attente", value: "2", icon: <Megaphone className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
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
            <h3 className="font-bold text-slate-900">Toutes les notifications</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {typeIconMap[notif.icone]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{notif.titre}</h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{notif.type}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {notif.cible}</span>
                      {notif.envoyee !== "—" && <span>Envoyée le {notif.envoyee}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold
                    ${notif.statut === 'Envoyée' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}
                  `}>
                    {notif.statut}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Nouvelle Notification */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Nouvelle Notification" maxWidth="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Titre de la notification</label>
            <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="Ex: Maintenance programmée le..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contenu du message</label>
            <textarea rows={4} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none" placeholder="Rédigez votre message..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                <option>Système</option>
                <option>Abonnement</option>
                <option>Mise à jour</option>
                <option>Onboarding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Destinataires</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                <option>Tous les utilisateurs</option>
                <option>Plan Pro uniquement</option>
                <option>Plan Enterprise uniquement</option>
                <option>Admins entreprise</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Sauvegarder en brouillon
            </button>
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Envoyer maintenant
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
