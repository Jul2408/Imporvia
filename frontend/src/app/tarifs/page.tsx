"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { CheckCircle2, ArrowRight, X, Building2, Zap, Rocket, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const pricingTiers = [
  {
    name: "Starter",
    badge: "",
    desc: "Pour les courtiers indépendants et petits volumes.",
    priceMonthly: "50 000",
    priceAnnual: "500 000",
    icon: Rocket,
    features: [
      { name: "50 simulations / mois", included: true },
      { name: "1 utilisateur", included: true },
      { name: "Codes SH & nomenclatures", included: true },
      { name: "Calcul multi-zones (CEMAC)", included: true },
      { name: "Support email", included: true },
      { name: "Tableaux de bord BI", included: false },
      { name: "Accès API REST", included: false },
    ],
    highlight: false,
  },
  {
    name: "Pro",
    badge: "Le plus populaire",
    desc: "Pour les cabinets de transit et commissionnaires en douane.",
    priceMonthly: "150 000",
    priceAnnual: "1 500 000",
    icon: Zap,
    features: [
      { name: "500 simulations / mois", included: true },
      { name: "5 utilisateurs inclus", included: true },
      { name: "Codes SH & nomenclatures", included: true },
      { name: "Calcul multi-zones (CEMAC, CEDEAO)", included: true },
      { name: "Support prioritaire 5j/7", included: true },
      { name: "Tableaux de bord BI", included: true },
      { name: "Accès API REST", included: true },
    ],
    highlight: true,
  },
  {
    name: "Entreprise",
    badge: "Sur-mesure",
    desc: "Pour les centrales d'achat et grandes structures logistiques.",
    priceMonthly: "Sur devis",
    priceAnnual: "Sur devis",
    icon: Building2,
    features: [
      { name: "Simulations illimitées", included: true },
      { name: "Utilisateurs illimités", included: true },
      { name: "Détection accords ZLECAf/APE", included: true },
      { name: "Intégration ERP (SAP, Odoo)", included: true },
      { name: "Account manager dédié", included: true },
      { name: "Tableaux de bord BI avancés", included: true },
      { name: "SLA garanti 99.99%", included: true },
    ],
    highlight: false,
  }
]

export default function ImporViaTarifs() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="grow max-w-7xl mx-auto px-6 py-24 w-full relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-blue-100/50 rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 relative z-10"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-sm font-bold uppercase tracking-widest mb-6">
            Investissement rentable
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Une tarification claire et adaptée
          </h1>
          <p className="text-xl text-slate-600">
            Des outils de pointe pour les professionnels de la douane camerounaise et de la zone CEMAC.
          </p>
        </motion.section>

        {/* Pricing Toggle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex justify-center mb-16"
        >
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm inline-flex items-center gap-2 relative">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 ${!isAnnual ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Annuel
              <span className={`text-xs px-2 py-0.5 rounded-full ${isAnnual ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'}`}>-2 Mois</span>
            </button>
            
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-0.25rem)] bg-blue-600 rounded-xl transition-transform duration-300 ease-in-out shadow-md`}
              style={{ transform: isAnnual ? 'translateX(100%)' : 'translateX(0)' }}
            />
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className={`rounded-[2.5rem] relative overflow-hidden transition-all duration-500 flex flex-col ${
                tier.highlight 
                  ? 'bg-blue-600 text-white shadow-2xl scale-105 md:z-20 border-2 border-blue-400' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2'
              }`}
            >
              {tier.badge && (
                <div className={`absolute top-0 inset-x-0 text-center text-xs font-bold py-1.5 uppercase tracking-widest ${tier.highlight ? 'bg-blue-400 text-blue-950' : 'bg-slate-100 text-slate-500'}`}>
                  {tier.badge}
                </div>
              )}
              <div className="p-8 pt-12 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.highlight ? 'bg-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                    <tier.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>
                <p className={`text-sm mb-6 h-10 ${tier.highlight ? 'text-blue-100' : 'text-slate-500'}`}>
                  {tier.desc}
                </p>
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {tier.priceMonthly === 'Sur devis' ? tier.priceMonthly : (isAnnual ? tier.priceAnnual : tier.priceMonthly)}
                    </span>
                    {tier.priceMonthly !== 'Sur devis' && (
                      <span className={`text-lg font-bold mb-1 ${tier.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                        FCFA
                      </span>
                    )}
                  </div>
                  {tier.priceMonthly !== 'Sur devis' && (
                    <p className={`text-sm mt-1 font-medium ${tier.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                      {isAnnual ? 'facturé annuellement' : 'par mois'}
                    </p>
                  )}
                </div>
                <Link 
                  href={tier.priceMonthly === 'Sur devis' ? '/contact' : '/inscription'} 
                  className={`w-full py-4 rounded-xl font-bold flex justify-center items-center transition-all ${
                    tier.highlight 
                      ? 'bg-white text-blue-700 hover:bg-slate-50 shadow-lg' 
                      : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tier.priceMonthly === 'Sur devis' ? 'Contacter les ventes' : 'Démarrer gratuitement'}
                </Link>
              </div>
              <div className={`p-8 border-t ${tier.highlight ? 'border-blue-500 bg-blue-700/50' : 'border-slate-100 bg-slate-50'} flex-1`}>
                <ul className="space-y-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.highlight ? 'text-blue-300' : 'text-emerald-500'}`} />
                      ) : (
                        <X className="w-5 h-5 shrink-0 text-slate-300" />
                      )}
                      <span className={`text-sm font-medium ${!feature.included && !tier.highlight ? 'text-slate-400' : (tier.highlight ? 'text-blue-50' : 'text-slate-700')}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </section>

        {/* NEW SECTION: ROI */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Rentabilisé dès la 1ère simulation</h3>
            <p className="text-slate-600 leading-relaxed">
              Une seule erreur de nomenclature sur un conteneur peut coûter des millions en pénalités. Notre abonnement mensuel coûte moins cher qu'une seule erreur évitée.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucun frais caché</h3>
            <p className="text-slate-600 leading-relaxed">
              Le prix affiché est net. Aucune commission sur vos volumes d'importation, aucun frais de configuration, et les mises à jour réglementaires sont incluses.
            </p>
          </div>
        </motion.section>

      </main>

      <SiteFooter />
    </div>
  )
}
