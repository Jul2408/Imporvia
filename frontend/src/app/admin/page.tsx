"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building2, Users, CreditCard, 
  Activity, MoreVertical, ShieldAlert, AlertCircle,
  Power, RefreshCw, Terminal, AlertTriangle, CheckCircle2, X,
  ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, Zap
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api"
import { useRouter } from "next/navigation"

type Toast = { message: string; type: "success" | "error" | "warning"; id: number }

interface AnalyticsData {
  total_companies: number
  active_companies: number
  total_users: number
  total_simulations: number
  simulations_last_30_days: number
  total_taxes_calculated_fcfa: string
}

export default function ImporViaAdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isConsoleOpen, setConsoleOpen] = useState(false)
  const [consoleInput, setConsoleInput] = useState("")
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["[ImporVia API Console v2.4.1]", "Prêt. Tapez une commande et appuyez sur Entrée."])
  
  const [greeting, setGreeting] = useState("Bonjour")
  const [currentTime, setCurrentTime] = useState("")
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Admin check
    if (!isAuthLoading) {
      if (!user) {
        router.push("/connexion")
      } else if (!(user as any).is_staff) {
        router.push("/dashboard") // Redirect non-admins
      }
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir")
    
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const int = setInterval(updateTime, 60000)
    return () => clearInterval(int)
  }, [])

  useEffect(() => {
    if (user && (user as any).is_staff) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [analyticsRes, logsRes] = await Promise.all([
        apiClient.get("/admin/analytics/"),
        apiClient.get("/admin/audit-logs/")
      ])
      setAnalytics(analyticsRes.data)
      setRecentLogs(logsRes.data?.results?.slice(0, 5) || [])
    } catch (err) {
      addToast("Erreur de chargement des données", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const addToast = (message: string, type: Toast["type"]) => {
    const id = Date.now()
    setToasts(prev => [...prev, { message, type, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consoleInput.trim()) return
    
    setConsoleOutput(prev => [...prev, `> ${consoleInput}`])
    if (consoleInput.toLowerCase() === "clear") {
      setConsoleOutput(["[ImporVia API Console v2.4.1]", "Console effacée."])
    } else if (consoleInput.toLowerCase() === "ping") {
      setConsoleOutput(prev => [...prev, "pong (23ms)"])
    } else {
      setConsoleOutput(prev => [...prev, "Commande non reconnue. Tapez 'help'."])
    }
    setConsoleInput("")
  }

  if (isAuthLoading || !user || !(user as any).is_staff) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  const kpis = [
    { title: "Entreprises Actives", value: isLoading ? "..." : analytics?.active_companies || 0, trend: "", up: true, icon: Building2, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Utilisateurs Inscrits", value: isLoading ? "..." : analytics?.total_users || 0, trend: "", up: true, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Taxes Simulées (FCFA)", value: isLoading ? "..." : analytics?.total_taxes_calculated_fcfa ? (parseFloat(analytics.total_taxes_calculated_fcfa)/1000000).toFixed(1) + "M" : "0", trend: "", up: true, icon: Activity, color: "text-violet-600", bg: "bg-violet-100" },
    { title: "Simulations / 30j", value: isLoading ? "..." : analytics?.simulations_last_30_days || 0, trend: "", up: false, icon: Zap, color: "text-amber-600", bg: "bg-amber-100" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* HEADER */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-xl border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
              <span className="font-extrabold text-xl tracking-tight">ImporVia <span className="text-blue-500 font-light text-sm bg-blue-500/10 px-2 py-0.5 rounded-full ml-1">ADMIN</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Clock className="w-4 h-4" /> {currentTime} (UTC+1)
            </div>
            
            <button 
              onClick={() => setConsoleOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group relative"
            >
              <Terminal className="w-5 h-5" />
            </button>
            
            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 border-2 border-slate-700 flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/20">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{greeting}, {user.first_name || 'Admin'}</h1>
            <p className="text-slate-500 mt-1 font-medium">Centre de contrôle principal du système.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDashboardData} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualiser
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                {kpi.trend && (
                  <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${kpi.up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {kpi.trend}
                  </span>
                )}
              </div>
              <h3 className="text-slate-500 text-sm font-medium relative z-10">{kpi.title}</h3>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 relative z-10">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* RECENT ACTIVITY */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Journal d&apos;Audit (Temps Réel)</h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Voir tout</button>
            </div>
            <div className="flex-1 p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-5 py-4 font-semibold">Action</th>
                    <th className="px-5 py-4 font-semibold">Utilisateur</th>
                    <th className="px-5 py-4 font-semibold">Ressource</th>
                    <th className="px-5 py-4 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Chargement...</td></tr>
                  ) : recentLogs.length > 0 ? (
                    recentLogs.map((log: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <Activity className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm text-slate-900">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-600">{log.user_email || 'Système'}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{log.resource_type} ({log.resource_id})</td>
                        <td className="px-5 py-4 text-sm text-right text-slate-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Aucun log trouvé.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl pointer-events-none" />
            <h2 className="font-bold text-lg flex items-center gap-2"><Power className="w-5 h-5 text-emerald-500" /> État du Système</h2>
            
            <div className="space-y-4">
              {[
                { name: "API Principale", status: "Opérationnel", ping: "23ms" },
                { name: "Moteur Douanier", status: "Opérationnel", ping: "14ms" },
                { name: "Base de Données", status: "Opérationnel", ping: "8ms" },
                { name: "Webhooks Paiement", status: "En attente", ping: "--" },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${service.status === 'Opérationnel' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400 animate-pulse'}`} />
                    <span className="text-sm font-semibold text-slate-700">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400">{service.ping}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-auto w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20">
              <Terminal className="w-4 h-4" /> Diagnostiquer
            </button>
          </div>
        </div>
      </main>

      {/* DEV CONSOLE MODAL */}
      <AnimatePresence>
        {isConsoleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0D1117] w-full max-w-2xl rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-125"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                  <Terminal className="w-4 h-4" /> API_CONSOLE
                </div>
                <button onClick={() => setConsoleOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto space-y-1">
                {consoleOutput.map((line, i) => (
                  <div key={i} className={line.startsWith(">") ? "text-blue-300 font-semibold" : ""}>{line}</div>
                ))}
              </div>
              <form onSubmit={handleConsoleSubmit} className="p-4 bg-slate-800/30 border-t border-slate-700 flex gap-2">
                <span className="text-green-400 font-mono font-bold">{">"}</span>
                <input 
                  type="text" 
                  value={consoleInput}
                  onChange={e => setConsoleInput(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-sm focus:ring-0" 
                  placeholder="Tapez 'help'..."
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOASTS */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${
                toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
               toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-500" /> :
               <AlertCircle className="w-5 h-5 text-amber-500" />}
              <span className="font-semibold text-sm">{toast.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-2 text-current opacity-50 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
