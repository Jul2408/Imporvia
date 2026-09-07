"use client"

import * as React from "react"
import { User, Building2, Lock, Bell, SlidersHorizontal, CreditCard, Users } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"

const sections = [
  { id: "profil", label: "Profil", icon: User },
  { id: "entreprise", label: "Entreprise", icon: Building2 },
  { id: "securite", label: "Sécurité", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Préférences", icon: SlidersHorizontal },
]

function ProfilSection() {
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = React.useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
  })
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState({ type: "", text: "" })

  const handleSubmit = async () => {
    setLoading(true)
    setMessage({ type: "", text: "" })
    try {
      await apiClient.put("/users/me/", formData)
      await refreshUser()
      setMessage({ type: "success", text: "Profil mis à jour avec succès." })
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-base">Informations personnelles</CardTitle>
          <CardDescription>Vos données de profil visibles par votre équipe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {(user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")}
            </div>
            <Button variant="outline" size="sm">Modifier l'avatar</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Prénom</label>
              <Input 
                value={formData.first_name} 
                onChange={e => setFormData({ ...formData, first_name: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Nom</label>
              <Input 
                value={formData.last_name} 
                onChange={e => setFormData({ ...formData, last_name: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <Input value={user?.email || ""} disabled type="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Téléphone</label>
              <Input 
                value={formData.phone_number} 
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })} 
                type="tel" 
              />
            </div>
          </div>
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SecuriteSection() {
  const [formData, setFormData] = React.useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState({ type: "", text: "" })

  const handleSubmit = async () => {
    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." })
      return
    }
    setLoading(true)
    setMessage({ type: "", text: "" })
    try {
      await apiClient.put("/auth/change-password/", {
        old_password: formData.old_password,
        new_password: formData.new_password
      })
      setMessage({ type: "success", text: "Mot de passe modifié avec succès." })
      setFormData({ old_password: "", new_password: "", confirm_password: "" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.old_password?.[0] || "Erreur lors du changement de mot de passe." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-base">Modifier le mot de passe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Mot de passe actuel</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={formData.old_password}
              onChange={e => setFormData({ ...formData, old_password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Nouveau mot de passe</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={formData.new_password}
              onChange={e => setFormData({ ...formData, new_password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Confirmer le nouveau mot de passe</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={formData.confirm_password}
              onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
            />
          </div>
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Chargement..." : "Changer le mot de passe"}
          </Button>
        </CardContent>
      </Card>
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-base">Sessions actives</CardTitle>
          <CardDescription>Vos appareils connectés à ImporVia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">Navigateur actuel</p>
              <p className="text-xs text-text-muted">Session actuelle</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ParametresPage() {
  const [activeSection, setActiveSection] = React.useState("profil")
  const { company } = useAuth()

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Paramètres"
          description="Gérez votre compte et vos préférences."
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar nav */}
          <nav className="w-full md:w-52 shrink-0">
            <ul className="space-y-1">
              {sections.map(section => {
                const Icon = section.icon
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        activeSection === section.id
                          ? "bg-primary-900 text-white"
                          : "text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {section.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeSection === "profil" && <ProfilSection />}
            {activeSection === "securite" && <SecuriteSection />}
            {activeSection === "entreprise" && (
              <Card className="premium-card">
                <CardHeader><CardTitle className="text-base">Informations entreprise</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Raison sociale</label>
                    <Input value={company?.name || ""} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Numéro de contribuable</label>
                    <Input value={company?.tax_id || ""} disabled />
                  </div>
                  <div className="flex justify-end">
                    <p className="text-sm text-text-muted">Ces informations ne peuvent être modifiées que par le support.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {(activeSection === "notifications" || activeSection === "preferences") && (
              <Card className="premium-card">
                <CardContent className="py-16 text-center text-text-muted">
                  Cette section est en cours de configuration.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
