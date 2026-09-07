"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, Calculator, CheckSquare, FileBox, 
  History, BarChart3, Users, CreditCard, Settings,
  HelpCircle, Shield, Menu, X, ChevronLeft, Bell, LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard",    href: "/dashboard",          icon: LayoutDashboard },
  { name: "Simulation",   href: "/simulation/nouvelle", icon: Calculator },
  { name: "Vérification", href: "/verification",        icon: CheckSquare },
  { name: "Opérations",   href: "/operations",          icon: FileBox },
  { name: "Historique",   href: "/historique",          icon: History },
  { name: "Rapports",     href: "/rapports",            icon: BarChart3 },
  { name: "Équipe",       href: "/equipe",              icon: Users },
  { name: "Abonnement",   href: "/abonnement",          icon: CreditCard },
]

const bottomNav = [
  { name: "Paramètres",   href: "/parametres",          icon: Settings },
  { name: "Centre d'aide",href: "/aide",                icon: HelpCircle },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-white text-slate-900">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-20 border-b border-slate-200 px-5 shrink-0",
        !collapsed && !isMobile ? "justify-between" : "justify-center"
      )}>
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          <img src="/logo.png" alt="ImporVia Logo" className="h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-300" />
        </Link>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-100 shrink-0"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", collapsed && "rotate-180")} />
          </button>
        )}
        {isMobile && (
          <button onClick={() => onMobileClose?.()} className="text-slate-400 hover:text-slate-900 transition-colors ml-auto p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => isMobile && onMobileClose?.()}
              title={collapsed && !isMobile ? item.name : undefined}
              className={cn(
                "relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                isActive
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-blue-50 border border-blue-100"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <item.icon className={cn(
                "shrink-0 relative z-10 transition-transform duration-200",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600",
                collapsed && !isMobile ? "w-6 h-6 mx-auto" : "w-5 h-5"
              )} />
              {(!collapsed || isMobile) && (
                <span className="relative z-10 truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 border-t border-slate-200 pt-4 space-y-1 shrink-0">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            title={collapsed && !isMobile ? item.name : undefined}
            onClick={() => isMobile && onMobileClose?.()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
          >
            <item.icon className={cn(
              "shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors",
              collapsed && !isMobile ? "w-6 h-6 mx-auto" : "w-5 h-5"
            )} />
            {(!collapsed || isMobile) && <span className="truncate">{item.name}</span>}
          </Link>
        ))}

        {/* User profile */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-slate-50 border border-slate-200",
          collapsed && !isMobile && "justify-center"
        )}>
          <div
            className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-white shrink-0"
          >
            LA
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Laurent A.</p>
              <p className="text-xs text-slate-500 truncate">Importateur B2B</p>
            </div>
          )}
          {(!collapsed || isMobile) && (
            <button className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onMobileClose?.()}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed left-0 top-0 h-screen w-72 bg-white z-50 md:hidden border-r border-slate-200"
          >
            <SidebarContent isMobile />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white h-screen transition-all duration-300 z-40 sticky top-0 shrink-0 border-r border-slate-200 shadow-sm",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
