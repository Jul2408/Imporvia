"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, Building2, Users, CreditCard, 
  Banknote, Activity, FileCheck, Search, Bell, Settings, 
  Menu, Shield, Plus, X, ListTree, Calculator, 
  ShieldCheck, History, LifeBuoy, FileText, BadgePercent,
  ChevronLeft, LogOut
} from "lucide-react"

const sidebarSections = [
  {
    label: null,
    links: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    ]
  },
  {
    label: "Clients",
    links: [
      { icon: Building2, label: "Entreprises", href: "/admin/entreprises" },
      { icon: Users, label: "Utilisateurs", href: "/admin/utilisateurs" },
      { icon: CreditCard, label: "Abonnements", href: "/admin/abonnements" },
      { icon: Banknote, label: "Paiements", href: "/admin/paiements" },
    ]
  },
  {
    label: "Opérations",
    links: [
      { icon: Activity, label: "Simulations", href: "/admin/simulations" },
      { icon: FileCheck, label: "Vérifications", href: "/admin/verifications" },
    ]
  },
  {
    label: "Moteur",
    links: [
      { icon: ListTree, label: "Codes SH", href: "/admin/codes-sh" },
      { icon: BadgePercent, label: "Taxes & taux", href: "/admin/taxes" },
      { icon: Calculator, label: "Règles de calcul", href: "/admin/regles" },
      { icon: Settings, label: "Moteur", href: "/admin/moteur" },
    ]
  },
  {
    label: "Système",
    links: [
      { icon: FileText, label: "Rapports", href: "/admin/rapports" },
      { icon: Bell, label: "Notifications", href: "/admin/notifications" },
      { icon: LifeBuoy, label: "Support", href: "/admin/support" },
      { icon: ShieldCheck, label: "Sécurité", href: "/admin/securite" },
      { icon: History, label: "Historique", href: "/admin/historique" },
      { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
    ]
  },
]

// Flat list for header title lookup
const allLinks = sidebarSections.flatMap(s => s.links)

const quickActions = [
  { label: "Nouvelle Entreprise", href: "/admin/entreprises", icon: Building2 },
  { label: "Inviter un Utilisateur", href: "/admin/utilisateurs", icon: Users },
  { label: "Nouvelle Notification", href: "/admin/notifications", icon: Bell },
  { label: "Nouveau Code SH", href: "/admin/codes-sh", icon: ListTree },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isQuickMenuOpen, setQuickMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const quickMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setQuickMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="min-h-dvh bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav 
        className={`fixed md:sticky top-0 left-0 h-screen bg-white text-slate-900 z-50 border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'} ${collapsed ? 'md:w-20' : 'md:w-72'} shadow-sm shrink-0`}
      >
        <div className={`h-20 flex items-center border-b border-slate-200 px-5 shrink-0 overflow-hidden ${!collapsed ? 'justify-between' : 'justify-center'}`}>
          <Link href="/admin" className="flex items-center gap-3 min-w-0 group">
            <img src="/logo.png" alt="ImporVia Logo" className="h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-300" />
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            <button className="md:hidden text-slate-400 hover:text-slate-900 p-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            {/* Desktop collapse button */}
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:flex text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-100 shrink-0"
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>

        {/* Quick action button */}
        <div className={`px-3 mb-4 mt-5 ${collapsed ? 'flex justify-center' : ''}`} ref={quickMenuRef}>
          <div className="relative w-full">
            <button
              onClick={() => setQuickMenuOpen(!isQuickMenuOpen)}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group ${collapsed ? 'px-0 h-10 w-10 mx-auto' : 'px-4'}`}
              title={collapsed ? "Nouvelle action" : undefined}
            >
              <Plus className={`w-5 h-5 transition-transform duration-200 shrink-0 ${isQuickMenuOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} />
              {!collapsed && <span className="truncate">Nouvelle action</span>}
            </button>
            <AnimatePresence>
              {isQuickMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1 overflow-hidden ${collapsed ? 'left-4 w-56' : 'left-0 right-0'}`}
                >
                  {quickActions.map((action, i) => (
                    <Link
                      key={i}
                      href={action.href}
                      onClick={() => { setQuickMenuOpen(false); setSidebarOpen(false) }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <action.icon className="w-4 h-4 text-blue-500" />
                      {action.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 pb-6 scrollbar-hide space-y-1">
          {sidebarSections.map((section, si) => (
            <div key={si} className="mb-2">
              {section.label && !collapsed && (
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest px-3 pt-3 pb-2 truncate">
                  {section.label}
                </p>
              )}
              {section.label && collapsed && (
                <div className="h-4 border-b border-slate-100 mb-2 mx-2" />
              )}
              
              {section.links.map((link, i) => {
                const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                return (
                  <Link 
                    key={i} 
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    title={collapsed ? link.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm group relative ${
                      isActive
                        ? 'text-blue-700' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-sidebar-active"
                        className="absolute inset-0 rounded-xl bg-blue-50 border border-blue-100"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <link.icon className={`shrink-0 relative z-10 transition-transform duration-200 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} ${collapsed ? 'w-5 h-5 mx-auto' : 'w-4 h-4'}`} />
                    {!collapsed && <span className="truncate relative z-10">{link.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
        
        {/* User Profile Footer */}
        <div className="px-3 pb-4 border-t border-slate-200 pt-4 shrink-0 bg-white">
          {collapsed && (
            <div className="flex justify-center mb-3">
              <button
                onClick={() => setCollapsed(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
              >
                <ChevronLeft className="w-5 h-5 rotate-180 transition-transform duration-300" />
              </button>
            </div>
          )}
          
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 border-2 border-white shadow-sm shrink-0">
              AD
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">Admin Principal</div>
                <div className="text-xs text-slate-500 truncate">admin@imporvia.com</div>
              </div>
            )}
            {!collapsed && (
              <button className="text-slate-400 hover:text-red-500 transition-colors shrink-0" title="Déconnexion">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-dvh">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">
              {allLinks.find(l => l.href === pathname)?.label || "Administration"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
              />
            </div>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}

      </div>
    </div>
  )
}
