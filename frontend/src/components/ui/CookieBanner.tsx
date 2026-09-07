"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X, CheckCircle, Settings } from "lucide-react"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "imporvia_cookie_consent"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after 800ms if no consent saved yet
    const existing = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ analytics: true, preferences: true, accepted_at: new Date().toISOString() }))
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ analytics: false, preferences: false, accepted_at: new Date().toISOString() }))
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-9999 p-4 md:p-6"
          role="dialog"
          aria-label="Bannière de consentement aux cookies"
        >
          <div className="max-w-5xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.4)] p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              {/* Icon + text */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">
                    Nous utilisons des cookies 🍪
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Pour améliorer votre expérience et analyser notre trafic. Vos données restent anonymes.{" "}
                    <Link href="/cookies" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-medium transition-colors">
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  id="cookie-decline-btn"
                  onClick={handleDecline}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Refuser
                </button>
                <Link
                  href="/cookies"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  Personnaliser
                </Link>
                <button
                  id="cookie-accept-btn"
                  onClick={handleAccept}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accepter tout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
