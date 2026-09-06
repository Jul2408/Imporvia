"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Target, Users, Globe, Award, ArrowRight, CheckCircle2, MapPin } from "lucide-react"

const stats = [
  { value: "2 000+", label: "Entreprises clientes", color: "text-blue-600" },
  { value: "98.7%", label: "Précision des calculs", color: "text-emerald-600" },
  { value: "15+", label: "Pays couverts", color: "text-violet-600" },
  { value: "24/7", label: "Disponibilité du service", color: "text-amber-500" },
]

const values = [
  {
    icon: Shield,
    title: "Conformité avant tout",
    desc: "Nous concevons chaque fonctionnalité autour d'un impératif légal : vous protéger contre tout risque de redressement douanier.",
    color: "text-blue-600", bg: "bg-blue-50"
  },
  {
    icon: Target,
    title: "Précision absolue",
    desc: "Notre moteur de calcul est mis à jour quotidiennement pour refléter les derniers taux tarifaires officiels du TEC CEDEAO/CEMAC.",
    color: "text-emerald-600", bg: "bg-emerald-50"
  },
  {
    icon: Globe,
    title: "Pensé pour l'Afrique",
    desc: "Nous sommes la première plateforme conçue par et pour des professionnels de la logistique africaine, avec une connaissance du terrain unique.",
    color: "text-amber-600", bg: "bg-amber-50"
  },
  {
    icon: Users,
    title: "Client d'abord",
    desc: "Notre équipe de support est composée d'anciens cadres douaniers qui comprennent votre réalité et vous guident avec précision.",
    color: "text-violet-600", bg: "bg-violet-50"
  },
]

const team = [
  { initials: "AB", name: "Alain Bessala", role: "CEO & Cofondateur", detail: "Ancien Inspecteur Principal des Douanes, 15 ans d'expérience", color: "bg-blue-600" },
  { initials: "KD", name: "Kouamé Diomandé", role: "CTO & Cofondateur", detail: "Ingénieur ML, ex-senior engineer chez une fintech nigériane", color: "bg-indigo-600" },
  { initials: "AS", name: "Aïcha Sangaré", role: "Directrice Produit", detail: "MBA Droit international, spécialiste des réglementations UEMOA", color: "bg-violet-600" },
  { initials: "PL", name: "Patrice Lumumba Jr.", role: "Directeur Commercial", detail: "15 ans dans le secteur du fret et de la logistique panafricaine", color: "bg-emerald-600" },
]

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-28 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-bold rounded-full uppercase tracking-wider mb-8">
              Notre Mission
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Démocratiser la <span className="text-blue-400">conformité douanière</span> en Afrique
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Nous croyons que chaque entreprise africaine, quelle que soit sa taille, mérite d'accéder à des outils de précision pour naviguer dans la complexité du commerce international.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl font-extrabold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-slate-500 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="grow max-w-6xl mx-auto px-6 py-24 w-full space-y-32">
        
        {/* Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Née d'une frustration terrain, <span className="text-blue-600">construite pour la résoudre.</span>
            </h2>
            <div className="space-y-5 text-slate-600 leading-relaxed text-lg">
              <p>
                En 2021, nos cofondateurs travaillaient encore pour l'administration douanière. Ils ont vu de leurs propres yeux des entreprises honnêtes pénalisées non par mauvaise volonté, mais par manque d'accès à une information tarifaire claire et fiable.
              </p>
              <p>
                Des calculs faits sur des tableurs Excel dépassés, des nomenclatures SH incorrectes, des accords de libre-échange ignorés... Le résultat : des millions FCFA de redressements évitables chaque année.
              </p>
              <p>
                ImporVia est notre réponse. Une plateforme technologique, construite par d'anciens experts douaniers, pour mettre le savoir-faire réglementaire à la portée de tous.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-900 rounded-3xl p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl">Nos engagements</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Taux tarifaires mis à jour quotidiennement",
                  "Couverture de 15+ pays africains",
                  "Calcul multi-zones (CEDEAO, CEMAC, ZLECAf)",
                  "Données hébergées en Afrique (Souveraineté numérique)",
                  "Aucune donnée client revendue à des tiers",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Nos valeurs fondamentales</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Les principes qui guident chaque décision que nous prenons.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${val.bg} ${val.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">L'équipe dirigeante</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Des professionnels formés sur le terrain, au service de votre conformité.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-20 h-20 ${member.color} rounded-3xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-5 shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{member.name}</h3>
                <p className="text-blue-600 font-bold text-sm mb-3">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Offices */}
        <section className="bg-white border border-slate-200 rounded-3xl p-10 md:p-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Nos bureaux</h2>
            <p className="text-slate-600">Présents au cœur des principales places commerciales africaines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { ville: "Douala", pays: "Cameroun", adresse: "Akwa, Avenue du Général Leclerc", hq: true },
              { ville: "Douala", pays: "Cameroun", adresse: "Bonanjo, Rue de Nachtigal" },
              { ville: "Dakar", pays: "Sénégal", adresse: "Almadies, Route de Ngor" },
            ].map((bureau, i) => (
              <div key={i} className={`p-6 rounded-2xl ${bureau.hq ? 'bg-blue-600 text-white' : 'bg-slate-50 border border-slate-200'}`}>
                <div className={`w-10 h-10 rounded-xl ${bureau.hq ? 'bg-white/20' : 'bg-blue-50'} flex items-center justify-center mb-4`}>
                  <MapPin className={`w-5 h-5 ${bureau.hq ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${bureau.hq ? 'text-white' : 'text-slate-900'}`}>{bureau.ville}</h3>
                  {bureau.hq && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">Siège</span>}
                </div>
                <p className={`text-sm font-medium mb-2 ${bureau.hq ? 'text-blue-100' : 'text-slate-500'}`}>{bureau.pays}</p>
                <p className={`text-sm ${bureau.hq ? 'text-blue-200' : 'text-slate-500'}`}>{bureau.adresse}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Prêt à nous rejoindre ?</h2>
            <p className="text-blue-100 mb-10 text-xl max-w-2xl mx-auto">
              Rejoignez les 2 000+ entreprises qui font confiance à ImporVia pour sécuriser leurs importations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inscription" className="inline-flex items-center justify-center gap-2 font-bold px-10 py-4 rounded-xl bg-white hover:bg-slate-50 text-blue-700 transition-all shadow-xl hover:scale-105">
                Démarrer gratuitement <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 font-bold px-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
