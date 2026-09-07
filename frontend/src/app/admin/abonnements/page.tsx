"use client"

import React, { useState, useEffect } from "react"
import { CreditCard, Check, Plus, Edit2, Building2, X, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import apiClient from "@/lib/api"

export default function ImporViaAdminAbonnements() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const [isNewPlanOpen, setNewPlanOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    features: [""]
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.get("/billing/plans/")
      setPlans(Array.isArray(res.data) ? res.data : (res.data?.results || []))
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur de chargement des plans")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlan = async () => {
    if (!formData.name || !formData.price) return
    try {
      setSaving(true)
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        features: formData.features.filter(f => f.trim() !== ""),
        is_active: true
      }

      if (editingPlan) {
        await apiClient.put(`/billing/plans/${editingPlan.id}/`, payload)
        setSuccessMsg(`Plan "${formData.name}" modifié avec succès.`)
      } else {
        await apiClient.post("/billing/plans/", payload)
        setSuccessMsg(`Plan "${formData.name}" créé avec succès.`)
      }
      
      setNewPlanOpen(false)
      setEditingPlan(null)
      fetchPlans()
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur de sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const openNewPlan = () => {
    setFormData({ name: "", price: "", description: "", features: [""] })
    setEditingPlan(null)
    setNewPlanOpen(true)
  }

  const openEditPlan = (plan: any) => {
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description || "",
      features: (plan.features || []).length ? plan.features : [""]
    })
    setEditingPlan(plan)
    setNewPlanOpen(true)
  }

  const handleFeatureChange = (index: number, val: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = val
    setFormData({ ...formData, features: newFeatures })
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] })
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [""] })
  }

  const planColors = [
    { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-500" },
    { bg: "bg-violet-100", text: "text-violet-600", border: "border-violet-500" },
    { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-500" },
  ]

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Abonnements & Plans</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les plans tarifaires proposés aux clients de la plateforme.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchPlans} className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openNewPlan}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Créer un plan
            </button>
          </div>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl font-semibold text-sm">
            <Check className="w-5 h-5 text-emerald-500" /> {successMsg}
          </div>
        )}

        {/* Pricing Cards in Admin View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-72">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Chargement des plans...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-72">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={fetchPlans} className="mt-4 text-blue-600 hover:underline">Réessayer</button>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-200 rounded-3xl">
            <CreditCard className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Aucun plan trouvé.</p>
            <button onClick={openNewPlan} className="mt-4 text-blue-600 hover:underline font-bold">Créer le premier plan</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, i) => {
              const color = planColors[i % planColors.length]
              return (
                <div key={plan.id} className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:-translate-y-1 hover:shadow-xl border-slate-200 hover:${color.border}`}>
                  <div className={`w-14 h-14 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center mb-6`}>
                    <Building2 className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 min-h-10">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900">{parseFloat(plan.price).toLocaleString('fr-FR')} FCFA</span>
                    <span className="text-slate-500 font-medium">/mois</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8 min-h-40">
                    {(plan.features || []).map((feat: string, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                        <Check className={`w-5 h-5 ${color.text}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-medium">
                    <span className={`px-2 py-0.5 rounded-full ${plan.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {plan.is_active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => openEditPlan(plan)}
                    className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-900"
                  >
                    <Edit2 className="w-4 h-4" /> Modifier le plan
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Edit/New Plan */}
      <Modal isOpen={isNewPlanOpen} onClose={() => { setNewPlanOpen(false); setEditingPlan(null); }} title={editingPlan ? `Modifier le plan "${editingPlan.name}"` : "Créer un nouveau plan"} maxWidth="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom du plan *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Ex: Business" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Prix (FCFA/mois) *</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="100000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none" placeholder="Description courte du plan..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fonctionnalités incluses</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {formData.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={feat} onChange={e => handleFeatureChange(i, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
                  <button onClick={() => removeFeature(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addFeature} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Ajouter une fonctionnalité
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setNewPlanOpen(false); setEditingPlan(null); }} className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Annuler
            </button>
            <button onClick={handleSavePlan} disabled={saving || !formData.name || !formData.price} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingPlan ? <Check className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />)}
              {saving ? "Enregistrement..." : (editingPlan ? "Enregistrer les modifications" : "Créer le plan")}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
