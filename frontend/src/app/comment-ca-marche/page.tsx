"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { Shield, FileText, Settings, ArrowRight, UserPlus, CreditCard, Calculator, CheckCircle2, Download, LogIn } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const steps = [
  {
    icon: UserPlus,
    title: "1. Inscription rapide",
    description: "Créez votre profil professionnel sécurisé en quelques clics. Renseignez le NIF/RCCM de votre entreprise pour paramétrer votre espace."
  },
  {
    icon: FileText,
    title: "2. Saisie de la Facture",
    description: "Entrez les détails de votre expédition : valeur FOB/CAF, fret, assurance, et le code SH (Système Harmonisé) de vos articles."
  },
  {
    icon: Calculator,
    title: "3. Simulation & Calcul",
    description: "Notre moteur croise vos données avec le tarif extérieur commun (TEC) et applique toutes les taxes douanières en temps réel."
  },
  {
    icon: CheckCircle2,
    title: "4. Contrôle de Conformité",
    description: "L'algorithme vérifie automatiquement les interdictions, les quotas et les accords de libre-échange applicables à votre marchandise."
  },
  {
    icon: Download,
    title: "5. Édition du Rapport",
    description: "Générez un rapport détaillé certifié, prêt à être transmis à votre comptabilité ou à votre commissionnaire en douane agréé."
  },
  {
    icon: LogIn,
    title: "6. Suivi & Historique",
    description: "Conservez toutes vos simulations dans votre coffre-fort numérique pour vos futurs audits douaniers ou fiscaux."
  }
]

export default function ImporViaCommentCaMarche() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="grow max-w-7xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="absolute top-1/4 left-0 w-125 h-125 bg-blue-200/50 rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-sm font-bold uppercase tracking-widest mb-6">
            Votre flux de travail optimisé
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Un Processus Simple et Infaillible
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Découvrez comment ImporVia sécurise et simplifie vos opérations de dédouanement en six étapes claires, garantissant une conformité totale.
          </p>
        </motion.section>

        <div className="relative max-w-5xl mx-auto mb-32">
          {/* Connecting line for desktop */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-24 left-0 h-1 bg-linear-to-r from-blue-200 via-indigo-300 to-emerald-200 -translate-y-1/2 z-0 rounded-full" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                key={index} 
                className="flex flex-col items-center text-center group bg-white p-8 rounded-4xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 border border-blue-100 shadow-inner flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 transform group-hover:-translate-y-3 group-hover:rotate-6">
                  <step.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* African Professionals Section */}
        <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop" alt="Expert douanier" className="w-full h-125 object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-slate-900/90 to-transparent p-8 pt-24">
              <p className="text-white font-bold text-xl mb-1">Accompagnement Expert</p>
              <p className="text-slate-300">Notre équipe est composée d'anciens cadres de l'administration douanière et de transitaires chevronnés.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 lg:pl-8"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Pensé par des experts, <br/>
              <span className="text-blue-600">Pour des professionnels.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nous comprenons la réalité du terrain dans les ports et frontières terrestres africaines. ImporVia n'est pas juste un calculateur, c'est un outil de conformité conçu pour faire face à la complexité des réglementations locales et communautaires (UEMOA, CEMAC, ZLECAf).
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-3xl font-black text-indigo-600 mb-2">100%</p>
                <p className="text-sm font-bold text-slate-700">Conforme à la réglementation douanière en vigueur</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-3xl font-black text-emerald-600 mb-2">24/7</p>
                <p className="text-sm font-bold text-slate-700">Disponibilité du service cloud et support technique</p>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Prêt à fiabiliser vos opérations ?</h2>
            <p className="text-slate-300 mb-10 text-lg">
              Ne laissez plus vos marges s'évaporer à cause d'erreurs de tarification douanière.
            </p>
            <Link href="/inscription" className="inline-flex justify-center items-center gap-2 font-bold px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl hover:-translate-y-1">
              Démarrer une simulation gratuite
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  )
}
