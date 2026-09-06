"use client"

import React, { useState } from "react"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { Mail, Phone, MapPin, Send, ShieldCheck, Globe2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ImporViaContact() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="grow max-w-7xl mx-auto px-6 py-24 w-full relative z-10">
        <div className="absolute top-0 right-1/4 w-125 h-125 bg-blue-200/50 rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-sm font-bold uppercase tracking-widest mb-6">
            Nous sommes à votre écoute
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Contactez nos experts douaniers
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-medium">
            Que ce soit pour une démonstration logicielle, un partenariat, ou un besoin d'assistance technique, notre équipe basée en Afrique est là pour vous répondre.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
                <p className="text-slate-600 font-medium max-w-sm">Nous avons bien reçu votre demande. Un expert prendra contact avec vous dans les plus brefs délais.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:text-blue-700 transition-colors">Envoyer un autre message</button>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="nom">Nom complet</label>
                  <input className="block w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium" id="nom" name="nom" placeholder="Ex: Koffi Konan" required type="text" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="entreprise">Entreprise</label>
                  <input className="block w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium" id="entreprise" name="entreprise" placeholder="Votre Société" type="text" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Adresse Email Pro</label>
                  <input className="block w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium" id="email" name="email" placeholder="contact@entreprise.com" required type="email" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="telephone">Téléphone</label>
                  <input className="block w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium" id="telephone" name="telephone" placeholder="+225 00 00 00 00 00" type="tel" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="sujet">Sujet de votre demande</label>
                <div className="relative">
                  <select className="block w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-slate-50 focus:bg-white transition-all appearance-none font-medium cursor-pointer" id="sujet" name="sujet" required defaultValue="">
                    <option disabled value="">Sélectionnez un sujet...</option>
                    <option value="sales">Demande de Démonstration / Tarifs</option>
                    <option value="support">Support Technique ou Facturation</option>
                    <option value="compliance">Question Réglementaire / Douanière</option>
                    <option value="partnership">Proposition de Partenariat (API/ERP)</option>
                    <option value="other">Autre demande</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="message">Message</label>
                <textarea className="block w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-slate-50 focus:bg-white transition-all resize-none placeholder:text-slate-400 font-medium" id="message" name="message" placeholder="Détaillez votre besoin ici..." required rows={5}></textarea>
              </div>
              
              <div className="pt-4">
                <button disabled={isLoading} className="w-full md:w-auto bg-blue-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 disabled:opacity-50" type="submit">
                  {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                  {!isLoading && <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
            )}
          </motion.div>

          {/* Sidebar / Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Globe2 className="w-6 h-6 text-blue-400" />
                </div>
                Contact Direct
              </h2>
              
              <div className="space-y-8 relative z-10">
                <div className="flex gap-4">
                  <div className="mt-1"><MapPin className="w-6 h-6 text-blue-400" /></div>
                  <div>
                    <p className="font-bold text-lg mb-1">Siège Social (Douala)</p>
                    <p className="text-slate-400 leading-relaxed font-medium">Akwa, Avenue du Général Leclerc<br/>Immeuble Bonanjo Trade, 4e Étage<br/>Douala, Cameroun</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1"><Phone className="w-6 h-6 text-emerald-400" /></div>
                  <div>
                    <p className="font-bold text-lg mb-1">Ligne Commerciale</p>
                    <p className="text-slate-400 font-medium">+225 27 20 00 00 00</p>
                    <p className="text-sm text-slate-500 mt-1">Lun-Ven, 08h00 - 18h00 (GMT)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1"><Mail className="w-6 h-6 text-indigo-400" /></div>
                  <div>
                    <p className="font-bold text-lg mb-1">Email Support</p>
                    <a className="text-blue-400 font-medium hover:text-blue-300 transition-colors" href="mailto:support@imporvia.com">support@imporvia.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 text-lg mb-2">Confidentialité Absolue</h3>
                <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                  Les informations soumises via ce formulaire sont chiffrées de bout en bout. Nous respectons strictement la confidentialité de vos données d'entreprise et ne les communiquons à aucune autorité tiers sans injonction légale.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
