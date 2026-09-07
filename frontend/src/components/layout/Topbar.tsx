"use client"

import * as React from "react"
import { Bell, Search, Menu, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Topbar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const [showNotifPanel, setShowNotifPanel] = React.useState(false)

  const notifications = [
    { id: 1, text: "Écart détecté sur DC-2026-0045", time: "Il y a 5 min", dot: "bg-red-500" },
    { id: 2, text: "Simulation DC-2026-0044 finalisée", time: "Il y a 1h",  dot: "bg-emerald-500" },
    { id: 3, text: "Votre abonnement Pro est actif", time: "Hier",          dot: "bg-blue-500" },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm">
      
      {/* Left: Mobile hamburger + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:flex items-center w-full max-w-xs lg:max-w-sm">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Rechercher une opération..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {showNotifPanel && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifPanel(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {notifications.length} nouvelles
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-slate-100 text-center">
                    <button className="text-xs font-bold text-blue-600 hover:underline">Voir toutes les notifications</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px bg-slate-200 mx-1" />

        {/* User avatar */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors group">
          <div className="h-8 w-8 rounded-full bg-blue-600 border-2 border-blue-200 flex items-center justify-center text-xs font-bold text-white shrink-0">
            LA
          </div>
          <span className="hidden lg:block text-sm font-bold text-slate-800">Laurent A.</span>
          <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </header>
  )
}
