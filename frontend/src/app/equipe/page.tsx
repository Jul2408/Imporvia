"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UserPlus, Mail, Shield, Eye, Briefcase, Users } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"

const members = [
  {
    id: "1",
    name: "Laurent Abanda",
    email: "l.abanda@entreprise.cm",
    role: "admin",
    lastSeen: "Il y a 5 minutes",
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
    name: "Paul Tchombet",
    email: "p.tchombet@entreprise.cm",
    role: "lecteur",
    lastSeen: "Il y a 3 jours",
    avatar: "PT",
    avatarColor: "bg-orange-600",
    status: "inactive",
  },
]

const roleConfig = {
  admin: { label: "Administrateur", icon: Shield, variant: "default" as const, color: "bg-blue-100 text-blue-700" },
  employe: { label: "Employé", icon: Briefcase, variant: "secondary" as const, color: "bg-slate-100 text-slate-700" },
  lecteur: { label: "Lecteur", icon: Eye, variant: "outline" as const, color: "bg-slate-50 text-slate-600" },
}

function InviteModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Inviter un collaborateur</h2>
            <p className="text-xs text-text-muted">Un e-mail d'invitation lui sera envoyé</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Adresse e-mail</label>
            <Input placeholder="collaborateur@entreprise.cm" type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Rôle</label>
            <select className="w-full h-10 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="employe">Employé — Simulation, Vérification, Opérations</option>
              <option value="lecteur">Lecteur — Consultation uniquement</option>
              <option value="admin">Administrateur — Accès complet</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
            <Mail className="h-4 w-4" /> Envoyer l'invitation
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function EquipePage() {
  const [showInvite, setShowInvite] = React.useState(false)

  return (
    <AppLayout>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      
      <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Votre équipe"
          description="Gérez les accès et les rôles de vos collaborateurs."
          actions={
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setShowInvite(true)}>
              <UserPlus className="h-4 w-4" /> Inviter un collaborateur
            </Button>
          }
        />

        <div className="space-y-3">
          {members.map((member, i) => {
            const role = roleConfig[member.role as keyof typeof roleConfig]
            const RoleIcon = role.icon
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="premium-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary">{member.name}</p>
                        {member.status === "active" && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted">{member.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <RoleIcon className="h-4 w-4 text-text-muted" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${role.color}`}>
                        {role.label}
                      </span>
                    </div>
                    <p className="hidden md:block text-xs text-text-muted whitespace-nowrap">{member.lastSeen}</p>
                    <Button variant="ghost" size="sm" className="text-text-muted hover:text-error">
                      Gérer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {members.length === 0 && (
          <Card className="premium-card">
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title="Vous travaillez seul pour l'instant"
              description="Invitez des collaborateurs pour accéder à la plateforme et collaborer sur vos opérations."
              actionLabel="Inviter un collaborateur"
              onAction={() => setShowInvite(true)}
            />
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
