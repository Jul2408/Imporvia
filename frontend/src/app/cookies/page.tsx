"use client"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import Link from "next/link"
import { Cookie, BarChart2, Shield, Settings } from "lucide-react"

const cookieTypes = [
  {
    icon: Shield,
    name: "Cookies Essentiels",
    desc: "Indispensables au bon fonctionnement du site. Ils vous permettent de naviguer et d'utiliser les fonctionnalités de base (session, authentification). Ils ne peuvent pas être désactivés.",
    examples: ["session_token", "csrf_token", "auth_state"],
    required: true,
    color: "text-blue-600", bg: "bg-blue-50"
  },
  {
    icon: BarChart2,
    name: "Cookies Analytiques",
    desc: "Nous aident à comprendre comment les visiteurs interagissent avec notre site (pages visitées, durée, erreurs). Toutes les données sont anonymisées.",
    examples: ["_ga", "_gid", "plausible_ignore"],
    required: false,
    color: "text-violet-600", bg: "bg-violet-50"
  },
  {
    icon: Settings,
    name: "Cookies de Préférences",
    desc: "Permettent au site de mémoriser vos préférences (langue, thème) pour vous offrir une expérience personnalisée à votre prochaine visite.",
    examples: ["lang_pref", "theme_mode", "sidebar_state"],
    required: false,
    color: "text-amber-600", bg: "bg-amber-50"
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">Document légal</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2 mb-3">Politique de Cookies</h1>
          <p className="text-slate-400 text-sm">Dernière mise à jour : 1er janvier 2026</p>
        </div>
      </div>

      <main className="grow max-w-4xl mx-auto px-6 py-16 w-full space-y-8">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Qu'est-ce qu'un cookie ?</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone) lors de votre visite sur un site web. Il permet au site de mémoriser des informations sur votre visite afin de vous proposer une expérience optimale et de générer des statistiques d'audience.
          </p>
        </div>

        {cookieTypes.map((type, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${type.bg} ${type.color} rounded-2xl flex items-center justify-center`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{type.name}</h3>
              </div>
              <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${type.required ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}
              `}>
                {type.required ? 'Obligatoire' : 'Désactivable'}
              </span>
            </div>
            <p className="text-slate-600 mb-5 leading-relaxed">{type.desc}</p>
            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">Exemples de cookies :</p>
              <div className="flex flex-wrap gap-2">
                {type.examples.map(ex => (
                  <code key={ex} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-mono font-bold border border-slate-200">{ex}</code>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Comment gérer vos cookies ?</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Vous pouvez configurer votre navigateur pour qu'il refuse tous les cookies ou pour qu'il vous avertisse avant d'en accepter un. Cependant, si vous désactivez les cookies essentiels, certaines fonctionnalités de notre plateforme pourraient ne plus fonctionner correctement.
          </p>
          <p className="text-slate-600">
            Pour nous contacter au sujet de notre politique de cookies : <strong>dpo@imporvia.com</strong>
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Retour à l'accueil</Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
