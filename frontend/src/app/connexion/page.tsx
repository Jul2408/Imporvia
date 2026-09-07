"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Shield, Mail, Lock, ArrowRight, CheckCircle2, Building2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

export default function ImporViaConnexion() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0]
      setError(msg || "Email ou mot de passe incorrect.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-slate-900">
      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-slate-900 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/jad20210219-eco-ci-dossiertransport-port-abidjan_print.avif" 
            alt="Port containers" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
        </div>
        <div className="relative z-10 p-8 lg:p-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img src="/logo.png" alt="ImporVia Logo" className="h-20 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-300 bg-transparent" />
          </Link>
        </div>
        <div className="relative z-10 p-8 lg:p-12 mt-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold mb-6">
              <Building2 className="w-4 h-4" /> Plateforme B2B
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Simplifiez vos opérations douanières.
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-md">
              Connectez-vous pour simuler, vérifier et sécuriser vos déclarations avec précision et rapidité.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <div className="flex -space-x-3">
              {["SK", "MT"].map((initials, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 shadow-xl flex items-center justify-center text-xs font-bold text-white ${["bg-blue-500", "bg-emerald-500"][i]}`}>
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 font-medium">Rejoint par +500 transitaires.</p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative">
        <div className="md:hidden flex justify-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/logo.png" alt="ImporVia Logo" className="h-16 w-auto object-contain shrink-0 bg-transparent" />
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Bon retour ! 👋</h2>
            <p className="text-slate-600 font-medium">Saisissez vos identifiants pour accéder à votre espace.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Adresse Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="professionnel@entreprise.com"
                  className="block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-600 sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium hover:border-slate-300"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">Mot de passe</label>
                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Oublié ?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password" name="password" type="password" autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-600 sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium hover:border-slate-300"
                />
              </div>
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all hover:-translate-y-1 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <>Se connecter <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 py-3 rounded-xl border border-slate-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>Connexion sécurisée et cryptée (SSL 256-bit)</span>
          </div>
          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <p className="text-sm text-slate-600 font-medium">
              Nouveau sur ImporVia ?{" "}
              <Link href="/inscription" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Créer un compte</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
