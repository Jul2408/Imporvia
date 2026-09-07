"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UserPlus, Mail, Shield, Eye, Briefcase, Users, Check, Trash2, X, Download } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"

interface Member {
  id: string
  name: string
  email: string
  role: string
  lastSeen: string
  avatar: string
  avatarColor: string
  status: string
}

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Laurent Abanda",
    email: "l.abanda@entreprise.cm",
    role: "admin",
    lastSeen: "En ligne",
    avatar: "LA",
    avatarColor: "bg-blue-600",
    status: "active",
  },
  {
    id: "2",
    name: "Marie Dibango",
    email: "m.dibango@entreprise.cm",
    role: "employe",
    lastSeen: "Il y a 2 heures",
    avatar: "MD",
    avatarColor: "bg-emerald-600",
    status: "active",
  },
  {
    id: "3",
    name: "Paul Tchombet (Transitaire Agence)",
    email: "p.tchombet@transit.cm",
    role: "lecteur",
    lastSeen: "Il y a 3 jours",
    avatar: "PT",
    avatarColor: "bg-orange-600",
    status: "inactive",
  },
]

const roleConfig = {
  admin: { label: "Administrateur", icon: Shield, color: "bg-blue-100 text-blue-700" },
  employe: { label: "Employé / Déclarant", icon: Briefcase, color: "bg-emerald-100 text-emerald-700" },
  lecteur: { label: "Transitaire / Lecteur", icon: Eye, color: "bg-slate-100 text-slate-700" },
}

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (email: string, role: string) => void }) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("employe")
  const [sending, setSending] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSending(true)
    setTimeout(() => {
      onInvite(email, role)
      setSending(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Inviter un collaborateur</h2>
              <p className="text-xs text-slate-500">Accès équipe ou transitaire agréé</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Adresse e-mail professionnelle</label>
            <Input
              placeholder="transitaire@agence.cm"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Rôle &amp; Permissions</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="employe">Employé — Simulation, Vérification, Opérations</option>
              <option value="lecteur">Transitaire — Consultation &amp; Validation</option>
              <option value="admin">Administrateur — Accès complet</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={sending || !email} className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold gap-2">
              <Mail className="h-4 w-4" /> {sending ? "Envoi..." : "Envoyer l'invitation"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function EquipePage() {
  const [membersList, setMembersList] = React.useState<Member[]>(initialMembers)
  const [showInvite, setShowInvite] = React.useState(false)

  const handleInvite = (email: string, role: string) => {
    const initials = email.substring(0, 2).toUpperCase()
    const newMember: Member = {
      id: Date.now().toString(),
      name: email.split("@")[0].replace(".", " "),
      email: email,
      role: role,
      lastSeen: "Invitation envoyée",
      avatar: initials,
      avatarColor: "bg-indigo-600",
      status: "active",
    }
    setMembersList([...membersList, newMember])
  }

  const handleDelete = (id: string) => {
    setMembersList(membersList.filter(m => m.id !== id))
  }

  return (
    <AppLayout>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
      
      <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <PageHeader
          title="Équipe &amp; Collaborateurs"
          description="Gérez les membres de votre entreprise, vos déclarants et vos transitaires agréés."
          actions={
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <Download className="h-4 w-4" /> Imprimer / PDF
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2 shadow-md" onClick={() => setShowInvite(true)}>
                <UserPlus className="h-4 w-4" /> Inviter un collaborateur
              </Button>
            </div>
          }
        />

        <div className="space-y-3">
          {membersList.map((member, i) => {
            const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.employe
            const RoleIcon = role.icon
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="premium-card hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-sm font-extrabold shrink-0`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 capitalize">{member.name}</p>
                        {member.status === "active" && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted">{member.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <RoleIcon className="h-4 w-4 text-slate-400" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${role.color}`}>
                        {role.label}
                      </span>
                    </div>
                    <p className="hidden md:block text-xs text-text-muted whitespace-nowrap font-medium">{member.lastSeen}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {membersList.length === 0 && (
          <Card className="premium-card">
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title="Vous n'avez pas encore de collaborateurs"
              description="Invitez des collaborateurs pour accéder à la plateforme et gérer vos déclarations en équipe."
              actionLabel="Inviter un collaborateur"
              onAction={() => setShowInvite(true)}
            />
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
