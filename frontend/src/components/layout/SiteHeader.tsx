"use client"

import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Fonctionnalités", href: "/fonctionnalites" },
    { label: "Tarifs", href: "/tarifs" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 relative z-50">
          <img src="/logo.png" alt="ImporVia Logo" className="h-16 w-auto object-contain shrink-0" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/connexion"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Commencer
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative z-50 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl md:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 mt-2 border-t border-slate-100 flex flex-col gap-4">
                <Link
                  href="/connexion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors text-center"
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors text-center shadow-sm"
                >
                  Commencer
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
