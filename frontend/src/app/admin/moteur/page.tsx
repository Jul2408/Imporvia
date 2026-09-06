"use client"

import React from "react"
import { Settings, Play, RefreshCw, Server, AlertCircle, Save, CheckCircle2 } from "lucide-react"

export default function ImporViaAdminMoteur() {
  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Configuration du Moteur</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez le cœur du système de calcul douanier : versions, cache, et algorithmes.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <Save className="w-5 h-5" />
            Enregistrer
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center animate-pulse">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Moteur Actif (v2.4.1)</h3>
              <p className="text-sm text-slate-500">Dernier redémarrage: Il y a 3 jours</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4" /> Vider le cache
            </button>
            <button className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 text-sm border border-red-200">
              <Play className="w-4 h-4" /> Redémarrer
            </button>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-6">
          
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Algorithmes de Calcul</h3>
              <p className="text-sm text-slate-500 mt-1">Définissez la méthode de calcul de la valeur en douane et des taxes.</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Méthode de calcul par défaut</label>
                <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  <option>Méthode standard (Valeur Transactionnelle - CAF)</option>
                  <option>Méthode alternative (Valeurs de Référence)</option>
                  <option>Méthode hybride (Automatique selon pays)</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Calcul parallèle activé</div>
                    <div className="text-sm text-slate-600 mt-0.5">Le moteur utilise le multi-threading pour traiter les simulations complexes (ex: {'>'} 100 articles).</div>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600 cursor-pointer transition-colors">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-6"></span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Bases de données & API Douanes</h3>
              <p className="text-sm text-slate-500 mt-1">Connexion aux systèmes d'information douaniers nationaux (SYDAM, GAINDE, etc.).</p>
            </div>
            <div className="p-6 space-y-4">
              {[
                { nom: "SYDAM World (Côte d'Ivoire)", status: "Connecté", ping: "45ms" },
                { nom: "GAINDE (Sénégal)", status: "Connecté", ping: "62ms" },
                { nom: "ASYCUDA (Mali)", status: "Erreur Sync", ping: "-" },
              ].map((api, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {api.status === 'Connecté' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-bold text-slate-700">{api.nom}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className={api.status === 'Connecté' ? 'text-emerald-600' : 'text-red-600'}>{api.status}</span>
                    <span className="text-slate-400 w-12 text-right">{api.ping}</span>
                    <button className="text-blue-600 hover:underline">Configurer</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
