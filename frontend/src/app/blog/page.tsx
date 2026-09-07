"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import Link from "next/link"
import { Search, Tag, Clock, ArrowRight, TrendingUp, BookOpen } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

const categories = ["Tous", "Réglementation", "TVA & Taxes", "Logistique", "Études de cas", "CEDEAO & CEMAC"]

const articles = [
  {
    id: 1,
    cat: "Réglementation",
    catColor: "bg-blue-100 text-blue-700",
    title: "Nouveaux tarifs douaniers 2026 : Ce que les importateurs doivent savoir",
    excerpt: "La CEMAC a annoncé une révision majeure du Tarif Extérieur Commun. Voici les changements qui impactent directement vos calculs de droits de douane dès janvier 2026.",
    date: "12 Mars 2026",
    readTime: "5 min",
    featured: true,
    img: "/projet-dextension-du-terminal-a-conteneurs-du-port-de-douala.webp"
  },
  {
    id: 2,
    cat: "TVA & Taxes",
    catColor: "bg-amber-100 text-amber-700",
    title: "Comment calculer la valeur en douane avec précision",
    excerpt: "La valeur en douane est la base de tous vos calculs. Une erreur ici se répercute sur tous les postes de taxation. Guide complet pour éviter les erreurs classiques.",
    date: "28 Fév 2026",
    readTime: "8 min",
    img: "/calcul.png"
  },
  {
    id: 3,
    cat: "Études de cas",
    catColor: "bg-violet-100 text-violet-700",
    title: "Optimisation des droits d'importation : Cas pratique Secteur Tech",
    excerpt: "Comment une PME camerounaise a réduit sa charge fiscale douanière de 23% en reclassant correctement ses équipements informatiques.",
    date: "15 Fév 2026",
    readTime: "6 min",
    img: "/service-transport-maritime.UVTB1Yc1_Z1jcI7d.webp"
  },
  {
    id: 4,
    cat: "Logistique",
    catColor: "bg-emerald-100 text-emerald-700",
    title: "Impact des nouvelles routes maritimes sur les délais de dédouanement",
    excerpt: "Les perturbations logistiques mondiales modifient les délais et les coûts de passage en douane. Stratégies pour anticiper ces changements.",
    date: "02 Fév 2026",
    readTime: "7 min",
    img: "/jad20210219-eco-ci-dossiertransport-port-abidjan_print.avif"
  },
  {
    id: 5,
    cat: "CEDEAO & CEMAC",
    catColor: "bg-rose-100 text-rose-700",
    title: "ZLECAf : Quelles opportunités concrètes pour les importateurs africains ?",
    excerpt: "La Zone de Libre-Échange Continentale Africaine entre dans sa phase opérationnelle. Voici comment en tirer parti pour réduire vos droits de douane.",
    date: "25 Jan 2026",
    readTime: "10 min",
    img: "/ChatGPT-Image-28-juil.-2026-02_00_01.png"
  },
  {
    id: 6,
    cat: "Réglementation",
    catColor: "bg-blue-100 text-blue-700",
    title: "Comprendre CAMCIS : Le nouveau système douanier camerounais expliqué",
    excerpt: "Guide pratique pour naviguer dans le système de dédouanement électronique du Cameroun. Étapes, délais et points de blocage à éviter.",
    date: "10 Jan 2026",
    readTime: "9 min",
    img: "/projet-dextension-du-terminal-a-conteneurs-du-port-de-douala.webp"
  },
]

export default function ImporViaBlog() {
  const [activeCategory, setActiveCategory] = useState("Tous")
  const [searchQuery, setSearchQuery] = useState("")

  const featured = articles[0]
  const filtered = articles.slice(1).filter(a => {
    const matchCat = activeCategory === "Tous" || a.cat === activeCategory
    const matchSearch = searchQuery === "" || a.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <SiteHeader />

      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
                  <BookOpen className="w-4 h-4" /> Ressources & Actualités
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                  Actualités douanières
                </h1>
                <p className="text-slate-300 text-lg max-w-2xl">
                  Restez informé des dernières réglementations, tendances et conseils pour optimiser vos opérations de dédouanement B2B.
                </p>
              </div>
              {/* Search */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="grow max-w-7xl mx-auto px-6 py-12 w-full">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {activeCategory === "Tous" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Article à la une</span>
            </div>
            <Link href={`/blog/article/${featured.id}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featured.img}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4 self-start">
                    {featured.cat}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{featured.readTime}</span>
                      <span>·</span>
                      <span>{featured.date}</span>
                    </div>
                    <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }} viewport={{ once: true }}
            >
              <Link href={`/blog/article/${article.id}`} className="group block h-full">
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${article.catColor}`}>{article.cat}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3 grow">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Aucun article trouvé pour votre recherche.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-10 md:p-14 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Recevez nos analyses directement</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">Rejoignez 3 000+ professionnels de la logistique africaine qui reçoivent nos analyses chaque semaine.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shrink-0">
              S'abonner
            </button>
          </div>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}
