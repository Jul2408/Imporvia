"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { Calculator, CheckSquare, FileBox, BarChart3, Database, ShieldAlert, ArrowRight, Server, Lock, Fingerprint, Code2, Plug, Globe, Check, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

const features = [
  {
    icon: Calculator,
    title: "Moteur de calcul expert",
    description: "Simulation ultra-précise des droits de douane (TEC), de la TVA et des redevances additionnelles basée sur le code SH, la valeur en douane et l'incoterm utilisé.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    icon: Database,
    title: "Nomenclatures toujours à jour",
    description: "Base de données tarifaire connectée directement aux référentiels douaniers, garantissant l'utilisation des taux exacts applicables au jour J, sans aucune saisie manuelle.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100"
  },
  {
    icon: ShieldAlert,
    title: "Détection des anomalies en temps réel",
    description: "Algorithme de contrôle de cohérence identifiant instantanément les erreurs fréquentes dans les déclarations ou les factures de transitaires avant tout décaissement.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    icon: FileBox,
    title: "Archivage structuré & Audit",
    description: "Stockage sécurisé et centralisé de l'ensemble de vos simulations, notes de détails et rapports pour un audit simplifié en cas de contrôle de l'administration douanière.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  {
    icon: BarChart3,
    title: "Tableaux de bord & Business Intelligence",
    description: "Analyse visuelle poussée de vos coûts logistiques, statistiques par port d'entrée et identification automatique des axes d'optimisation tarifaire.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100"
  },
  {
    icon: CheckSquare,
    title: "Rapports de Conformité automatisés",
    description: "Génération de rapports de simulation au format standardisé (PDF/Excel) pour simplifier vos échanges avec le transitaire et accélérer le passage en douane.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100"
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const plans = ["Starter", "Pro", "Enterprise"]
const featureMatrix = [
  { feature: "Simulations mensuelles", values: ["50 / mois", "500 / mois", "Illimitées"] },
  { feature: "Utilisateurs inclus", values: ["1", "5", "Illimités"] },
  { feature: "Codes SH & nomenclatures", values: [true, true, true] },
  { feature: "Calcul multi-zones (CEMAC, CEDEAO)", values: [true, true, true] },
  { feature: "Détection des accords ZLECAf/APE", values: [false, true, true] },
  { feature: "Export PDF & Excel", values: [true, true, true] },
  { feature: "Accès API REST", values: [false, true, true] },
  { feature: "Intégration ERP (SAP, Odoo)", values: [false, false, true] },
  { feature: "Tableaux de bord BI", values: [false, true, true] },
  { feature: "Support prioritaire", values: [false, true, true] },
  { feature: "Account manager dédié", values: [false, false, true] },
]

const integrations = [
  { name: "SAP S/4HANA", desc: "Synchronisation bidirectionnelle des coûts douaniers.", icon: "🏭" },
  { name: "Odoo ERP", desc: "Calcul automatique lors de la création des bons de commande.", icon: "🔧" },
  { name: "SYDAM / SYDONIA", desc: "Pré-remplissage des déclarations douanières officielles.", icon: "🏛️" },
  { name: "REST API", desc: "Intégration sur mesure dans vos propres systèmes via API.", icon: "💻" },
]

export default function ImporViaFonctionnalites() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="grow w-full overflow-x-hidden">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 text-center">
          <div className="absolute top-20 right-0 w-125 h-125 bg-blue-100/50 rounded-full blur-[120px] pointer-events-none -z-10" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-sm font-bold uppercase tracking-widest mb-6">
              La plateforme complète
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight">
              Tout ce dont vous avez besoin<br className="hidden md:block"/> pour vos douanes
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              ImporVia regroupe l'ensemble des outils nécessaires pour anticiper, vérifier et optimiser le coût de vos opérations d'importation de bout en bout.
            </p>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                variants={itemVariants}
                key={index}
                className={`bg-white border ${feature.border} rounded-4xl p-8 md:p-10 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group shadow-sm flex flex-col`}
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base grow">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Interactive Feature Demo Section */}
        <section className="bg-white border-y border-slate-200 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Voyez ImporVia en action
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Chaque étape du processus a été pensée pour être intuitive, rapide et sans erreur possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Tab navigation */}
              <div className="flex flex-col gap-4">
                {[
                  { title: "1. Saisie rapide du produit", desc: "Entrez le code SH de votre marchandise ou effectuez une recherche par mots-clés dans notre base de 7 000+ codes. Le moteur identifie automatiquement la nomenclature et les taux applicables.", icon: Database },
                  { title: "2. Résultat détaillé en temps réel", desc: "Obtenez une décomposition ligne par ligne de tous les droits et taxes : droit de douane, TVA, redevances statistiques, droits de port... Tout est transparent et documenté.", icon: Calculator },
                  { title: "3. Génération du rapport certifié", desc: "Exportez votre simulation en PDF ou Excel, prêt à être transmis à votre comptable ou à votre commissionnaire en douane pour validation officielle.", icon: CheckSquare },
                ].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${activeTab === i ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTab === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <tab.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg mb-2 ${activeTab === i ? 'text-blue-700' : 'text-slate-900'}`}>{tab.title}</h3>
                        {activeTab === i && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-slate-600 text-sm leading-relaxed">
                            {tab.desc}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Visual mockup */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-slate-400 text-xs font-mono">simulation.imporvia.com</span>
                </div>
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div key="tab0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs mb-2 font-mono">CODE SH</p>
                        <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center justify-between">
                          <span className="text-white font-mono font-bold text-xl">8471.30</span>
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">TROUVÉ ✓</span>
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs mb-2 font-mono">DESCRIPTION</p>
                        <p className="text-white font-medium">Ordinateurs portables d'un poids ≤ 10 kg</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 rounded-xl p-4">
                          <p className="text-slate-400 text-xs mb-1 font-mono">VALEUR CIF</p>
                          <p className="text-white font-bold text-lg">2 500 000 FCFA</p>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-4">
                          <p className="text-slate-400 text-xs mb-1 font-mono">ORIGINE</p>
                          <p className="text-white font-bold text-lg">🇨🇳 Chine</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 1 && (
                    <motion.div key="tab1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                      {[
                        { label: "Droits de douane (10%)", value: "250 000 FCFA", color: "text-red-400" },
                        { label: "TVA sur importation (18%)", value: "495 000 FCFA", color: "text-amber-400" },
                        { label: "Redevance statistique (1%)", value: "25 000 FCFA", color: "text-blue-400" },
                        { label: "PRÉLÈVEMENT COMMUNAUTAIRE (1%)", value: "25 000 FCFA", color: "text-violet-400" },
                      ].map((line, i) => (
                        <div key={i} className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
                          <span className="text-slate-300 text-sm">{line.label}</span>
                          <span className={`font-bold font-mono ${line.color}`}>{line.value}</span>
                        </div>
                      ))}
                      <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-emerald-300 font-bold">TOTAL DÛ</span>
                        <span className="text-emerald-300 font-extrabold font-mono text-xl">795 000 FCFA</span>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 2 && (
                    <motion.div key="tab2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="bg-slate-800 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CheckSquare className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="text-white font-bold text-lg mb-1">Rapport SIM-2026-1042</p>
                        <p className="text-slate-400 text-sm mb-4">Généré le 28 Août 2026 à 19:00</p>
                        <div className="flex gap-3 justify-center">
                          <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                            📄 PDF
                          </div>
                          <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                            📊 Excel
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-4">
                        <p className="text-blue-300 text-sm font-medium">✓ Rapport certifié ImporVia — Conforme TEC CEMAC 2026</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Comparatif des offres</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Trouvez le plan adapté à la taille et aux besoins de votre entreprise.</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="py-6 px-8 text-slate-500 font-bold text-sm uppercase tracking-wider w-1/2">Fonctionnalité</th>
                    {plans.map((plan, i) => (
                      <th key={i} className="py-6 px-6 text-center">
                        <span className={`font-extrabold text-lg ${i === 1 ? 'text-blue-600' : 'text-slate-900'}`}>{plan}</span>
                        {i === 1 && <div className="text-xs text-blue-400 font-bold mt-1">Populaire</div>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureMatrix.map((row, ri) => (
                    <tr key={ri} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-8 font-medium text-slate-700">{row.feature}</td>
                      {row.values.map((val, vi) => (
                        <td key={vi} className="py-4 px-6 text-center">
                          {typeof val === 'boolean' ? (
                            val ? (
                              <div className="flex justify-center"><Check className="w-5 h-5 text-emerald-500" /></div>
                            ) : (
                              <div className="flex justify-center"><X className="w-5 h-5 text-slate-300" /></div>
                            )
                          ) : (
                            <span className={`font-bold text-sm ${vi === 1 ? 'text-blue-600' : 'text-slate-700'}`}>{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/tarifs" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 text-lg">
              Voir les tarifs détaillés <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Integrations */}
        <section className="bg-white border-t border-slate-200 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Intégrations & API</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                ImporVia s'intègre nativement dans votre écosystème d'entreprise existant via notre API REST documentée.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {integrations.map((integ, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{integ.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{integ.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{integ.desc}</p>
                </motion.div>
              ))}
            </div>


          </div>
        </section>

        {/* Security Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-white shadow-2xl">
            <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Sécurité & Architecture Entreprise</h2>
                <p className="text-lg text-slate-400">Vos données logistiques et douanières sont sensibles. Nous appliquons les standards de sécurité les plus stricts de l'industrie.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { icon: Lock, label: "Chiffrement de bout en bout", desc: "Toutes les simulations et factures transitent via SSL/TLS et sont chiffrées au repos (AES-256).", color: "text-blue-400" },
                  { icon: Server, label: "Cloud Hautement Disponible", desc: "Hébergement sur des serveurs certifiés garantissant un uptime de 99.99% pour vos équipes logistiques.", color: "text-indigo-400" },
                  { icon: Fingerprint, label: "Authentification Forte", desc: "Gestion fine des accès (RBAC) pour séparer les droits entre le service import, comptable et la direction.", color: "text-emerald-400" },
                ].map((sec, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                      <sec.icon className={`w-8 h-8 ${sec.color}`} />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{sec.label}</h4>
                    <p className="text-slate-400">{sec.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-blue-600 to-indigo-700 border border-blue-500 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Prêt à optimiser vos processus ?</h2>
              <p className="text-blue-100 mb-10 text-xl font-medium max-w-2xl mx-auto">
                Créez votre compte gratuitement et lancez votre première simulation douanière complète en moins de 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/inscription" className="inline-flex justify-center items-center gap-2 font-bold px-10 py-4 rounded-xl bg-white hover:bg-slate-50 text-blue-700 transition-all shadow-xl hover:scale-105">
                  Créer mon compte maintenant
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/tarifs" className="inline-flex justify-center items-center gap-2 font-bold px-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all">
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
