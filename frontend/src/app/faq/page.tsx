"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { Info, HelpCircle, ChevronDown, MessageCircleQuestion, Search, Mail, Phone, ArrowRight } from "lucide-react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const faqCategories = [
  { id: "all", label: "Toutes les questions" },
  { id: "general", label: "Général & Définitions" },
  { id: "utilisation", label: "Utilisation de la plateforme" },
  { id: "calculs", label: "Calculs & Taxes douanières" },
  { id: "abonnement", label: "Abonnement & Tarifs" },
  { id: "securite", label: "Sécurité & Données" },
  { id: "entreprise", label: "Solutions Entreprise (ERP)" }
]

const faqs = [
  {
    category: "general",
    q: "Qu'est-ce que ImporVia ?",
    a: "ImporVia est une plateforme SaaS B2B qui permet aux entreprises importatrices d'estimer avec une précision absolue les droits de douane, la TVA, et les redevances annexes pour leurs expéditions, afin d'optimiser leurs marges et d'éviter les redressements douaniers."
  },
  {
    category: "general",
    q: "ImporVia remplace-t-il un transitaire agréé ?",
    a: "Non. ImporVia est un outil d'aide à la décision et de contrôle. Il ne remplace pas les services d'un commissionnaire en douane agréé (transitaire) qui reste légalement habilité à valider la déclaration en détail sur le système douanier (ex: SYDAM, SYDONIA)."
  },
  {
    category: "general",
    q: "Quels pays sont couverts par ImporVia ?",
    a: "ImporVia couvre actuellement 15 pays d'Afrique subsaharienne, dont la Côte d'Ivoire, le Cameroun, le Sénégal, le Mali, le Burkina Faso, le Togo, le Bénin, la Guinée, la RDC, le Gabon et le Maroc. Nous ajoutons de nouveaux pays chaque trimestre."
  },
  {
    category: "calculs",
    q: "Vos taux tarifaires sont-ils à jour ?",
    a: "Absolument. Notre moteur est indexé sur le Tarif Extérieur Commun (TEC) de la CEDEAO, CEMAC et autres zones économiques. Les nomenclatures (codes SH) et les taux de change douaniers sont mis à jour quotidiennement."
  },
  {
    category: "calculs",
    q: "Prenez-vous en compte les accords de libre-échange (ZLECAf, APE) ?",
    a: "Oui. Lors de la saisie de l'origine de votre marchandise, le système détecte automatiquement si un certificat d'origine préférentiel (ex: EUR.1, certificat ZLECAf) peut vous exempter de certains droits de douane."
  },
  {
    category: "calculs",
    q: "Comment est calculée la valeur en douane (base de calcul) ?",
    a: "La valeur en douane est calculée selon la méthode de la valeur transactionnelle (Article VII du GATT). ImporVia prend en compte la valeur FOB de la marchandise, le fret international, et l'assurance pour obtenir la valeur CIF, qui est la base de calcul standard utilisée par la plupart des douanes africaines."
  },
  {
    category: "utilisation",
    q: "Comment trouver le bon code SH pour ma marchandise ?",
    a: "ImporVia intègre un moteur de recherche intelligent dans sa base de nomenclature. Vous pouvez taper une description de votre produit en langage naturel (ex: 'ordinateur portable 15 pouces') et le système vous suggèrera les codes SH les plus pertinents avec leur taux associés."
  },
  {
    category: "utilisation",
    q: "Puis-je inviter des membres de mon équipe ?",
    a: "Oui. Selon votre plan, vous pouvez inviter de 1 à un nombre illimité de collaborateurs. Chaque membre se voit attribuer un rôle (Administrateur, Déclarant, Lecteur) pour contrôler finement leurs permissions."
  },
  {
    category: "abonnement",
    q: "Puis-je annuler mon abonnement mensuel à tout moment ?",
    a: "Oui, notre abonnement mensuel est sans engagement. Vous pouvez l'annuler en un clic depuis les paramètres de votre compte. L'abonnement annuel, quant à lui, est engagé sur 12 mois et vous fait bénéficier de 2 mois offerts."
  },
  {
    category: "abonnement",
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Nous acceptons les paiements par Mobile Money (Orange Money, MTN MoMo, Wave, Moov Money), par carte bancaire (Visa, Mastercard) et par virement bancaire pour les offres Enterprise. Les paiements sont sécurisés via CinetPay."
  },
  {
    category: "securite",
    q: "Mes factures fournisseurs téléchargées sont-elles confidentielles ?",
    a: "Totalement. Vos données sont hébergées sur des serveurs sécurisés (chiffrement AES-256). Nous ne partageons ni ne revendons aucune donnée commerciale ou financière à des tiers, y compris à l'administration douanière. Vous êtes les seuls maîtres de vos données."
  },
  {
    category: "securite",
    q: "Où sont hébergées mes données ?",
    a: "Vos données sont hébergées dans des datacenters situés en Afrique (Afrique du Sud) via Amazon Web Services (AWS Africa Region), garantissant la souveraineté numérique de vos informations et des latences minimales."
  },
  {
    category: "entreprise",
    q: "Proposez-vous une intégration avec notre ERP (SAP, Odoo) ?",
    a: "Oui. Pour les offres Enterprise, nous proposons des connecteurs natifs pour SAP S/4HANA, Odoo ERP, et une API REST complète pour vous permettre d'intégrer les calculs douaniers directement dans vos bons de commande et processus d'approvisionnement."
  },
  {
    category: "entreprise",
    q: "Avez-vous un programme partenaires pour les transitaires et cabinets conseils ?",
    a: "Absolument. Notre programme de partenariat permet aux transitaires agréés et aux cabinets de conseil en commerce international de proposer ImporVia à leurs clients sous forme de service white-label ou en mode référencement. Contactez-nous à partenaires@imporvia.com."
  },
]

export default function ImporViaFAQ() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = useMemo(() => {
    let result = activeCategory === "all" ? faqs : faqs.filter(f => f.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    }
    return result
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-500/30">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-slate-900 text-white pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-bold uppercase tracking-widest mb-6">
              Centre d'Aide
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">Questions Fréquentes</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              Consultez notre base de connaissances pour obtenir des réponses immédiates sur l'utilisation de la plateforme et les réglementations douanières.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setActiveCategory("all") }}
                placeholder="Rechercher une question..."
                className="w-full pl-12 pr-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 transition-all text-sm font-medium"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <main className="grow max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10 w-full">
        
        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full lg:w-72 shrink-0"
        >
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <MessageCircleQuestion className="w-5 h-5 text-blue-600" />
              Catégories
            </h2>
            <ul className="flex flex-col gap-1">
              {faqCategories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); setSearchQuery("") }}
                    className={`w-full text-left font-semibold text-sm px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeCategory === cat.id && !searchQuery
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Contact CTA in sidebar */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pas de réponse ?</p>
              <Link href="/contact" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Contacter le support</span>
              </Link>
            </div>
          </div>
        </motion.aside>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="grow flex flex-col gap-8"
        >
          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Limites de responsabilité</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                ImporVia fournit des simulations tarifaires basées sur les données que vous saisissez. La décision finale concernant la classification tarifaire appartient toujours à l'administration des Douanes lors de la validation du dossier officiel.
              </p>
            </div>
          </div>

          {/* Results counter */}
          {searchQuery && (
            <p className="text-sm text-slate-500 font-medium">
              {filteredFaqs.length} résultat{filteredFaqs.length !== 1 ? 's' : ''} pour <strong>"{searchQuery}"</strong>
            </p>
          )}

          <section>
            {!searchQuery && (
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                {faqCategories.find(c => c.id === activeCategory)?.label}
              </h2>
            )}
            
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                      <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold mb-2">Aucune question trouvée</p>
                      <p className="text-slate-400 text-sm">Essayez avec d'autres mots-clés ou <Link href="/contact" className="text-blue-600 font-bold hover:underline">contactez-nous</Link>.</p>
                    </div>
                  ) : (
                    filteredFaqs.map((faq, i) => {
                      const isOpen = openFaq === faq.q
                      return (
                        <div 
                          key={i} 
                          className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-blue-400 shadow-lg shadow-blue-500/10' : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
                        >
                          <button 
                            onClick={() => setOpenFaq(isOpen ? null : faq.q)}
                            className="w-full px-7 py-5 flex justify-between items-center text-left"
                          >
                            <h3 className={`font-bold pr-8 leading-snug transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-900'}`}>{faq.q}</h3>
                            <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                              >
                                <div className="px-7 pb-6 pt-0 text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                                  <div className="pt-4">{faq.a}</div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Still need help */}
          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
              <p className="text-slate-300 font-medium">Notre équipe d'experts est disponible pour vous aider du lundi au vendredi.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
                <Mail className="w-5 h-5" />
                Nous écrire
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  )
}
