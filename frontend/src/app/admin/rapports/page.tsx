"use client"

import React from "react"
import { FileText, Download, TrendingUp, Calendar, Filter, BarChart3, PieChart } from "lucide-react"

export default function ImporViaAdminRapports() {
  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rapports & Analytique</h1>
            <p className="text-slate-500 font-medium mt-1">Générez des rapports détaillés sur l'activité de la plateforme.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Ce mois-ci
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter (PDF)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Volume de Simulations par Pays
              </h3>
              <button className="text-slate-400 hover:text-slate-900"><Filter className="w-5 h-5" /></button>
            </div>
            
            {/* Fake Chart representation */}
            <div className="flex-1 flex items-end justify-between gap-4 mt-8 pb-4 border-b border-slate-100 px-4">
              {[
                { label: 'CI', val: 85, color: 'bg-blue-500' },
                { label: 'SN', val: 65, color: 'bg-blue-400' },
                { label: 'ML', val: 40, color: 'bg-blue-300' },
                { label: 'TG', val: 55, color: 'bg-blue-400' },
                { label: 'BF', val: 30, color: 'bg-blue-200' },
                { label: 'BJ', val: 45, color: 'bg-blue-300' },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-full group">
                  <div className="text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}k</div>
                  <div className={`w-full rounded-t-xl ${bar.color} hover:opacity-80 transition-opacity cursor-pointer`} style={{ height: `${bar.val}%` }}></div>
                  <div className="text-sm font-bold text-slate-600">{bar.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Chiffre d'Affaires
              </h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-2">24.5M <span className="text-lg text-slate-500 font-medium">FCFA</span></div>
              <div className="text-sm font-bold text-emerald-600 bg-emerald-50 inline-flex px-2 py-1 rounded-lg">+12.5% vs mois dernier</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-purple-600" />
                Répartition Abonnements
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>Pro</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>Starter</span>
                    <span>25%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[25%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>Enterprise</span>
                    <span>10%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[10%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reports List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Rapports Disponibles</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { titre: "Bilan mensuel des abonnements (Août 2026)", type: "Financier", taille: "1.2 MB", date: "01 Sept 2026" },
              { titre: "Top 100 des codes SH les plus simulés", type: "Analytique", taille: "856 KB", date: "28 Août 2026" },
              { titre: "Audit des connexions et sécurité (T3 2026)", type: "Système", taille: "3.4 MB", date: "15 Août 2026" },
            ].map((rapport, i) => (
              <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{rapport.titre}</h4>
                    <div className="flex gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-medium">{rapport.type}</span> • 
                      <span>{rapport.taille}</span> • 
                      <span>Généré le {rapport.date}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-xl font-bold text-sm text-slate-700 transition-colors">
                  Télécharger
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
