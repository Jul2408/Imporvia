"use client"

import { Mail, MapPin, ArrowRight, Globe, Shield, ChevronRight } from "lucide-react"
import { Linkedin, Twitter } from "@/components/ui/BrandIcons"
import Link from "next/link"
import { useState } from "react"

const footerLinks = {
  Produit: [
    { label: "Fonctionnalités",   href: "/fonctionnalites" },
    { label: "Tarifs",            href: "/tarifs" },
    { label: "Comment ça marche", href: "/comment-ca-marche" },
    { label: "FAQ",               href: "/faq" },
  ],
  Entreprise: [
    { label: "À propos",  href: "/a-propos" },
    { label: "Blog",      href: "/blog" },
    { label: "Contact",   href: "/contact" },
  ],
  Légal: [
    { label: "CGV",              href: "/cgv" },
    { label: "Confidentialité",  href: "/confidentialite" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Cookies",          href: "/cookies" },
  ],
}

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter,  label: "Twitter",  href: "#" },
  { icon: Globe,    label: "Site",     href: "/" },
]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer className="bg-slate-950 text-slate-400 relative overflow-hidden">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-200 h-100 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-100 h-75 bg-indigo-600/5 rounded-full blur-3xl" />

      {/* Top accent line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8 group">
              <img
                src="/logo.png"
                alt="ImporVia Logo"
                className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300 brightness-0 invert"
              />
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 mb-8 max-w-sm">
              La première plateforme intelligente qui simule, valide et sécurise
              vos déclarations en douane en Afrique Centrale. Précision au FCFA près.
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold mb-8">
              <Shield className="w-3.5 h-3.5" />
              Conforme TEC CEMAC 2026
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold text-white mb-3">
                Restez informé des mises à jour tarifaires
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</div>
                  Vous êtes inscrit(e) !
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/8 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all hover:scale-105 shrink-0 group shadow-lg shadow-blue-900/30"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="mt-8 space-y-3">
              <a
                href="mailto:contact@imporvia.com"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-blue-400 transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                </span>
                contact@imporvia.com
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </span>
                Douala, Cameroun — Akwa, Av. du Gén. Leclerc
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8 flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-4 h-px bg-blue-500 inline-block" />
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500/0 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">ImporVia</span>. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {[
              { label: "CGV",              href: "/cgv" },
              { label: "Confidentialité",  href: "/confidentialite" },
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "Cookies",          href: "/cookies" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="hover:text-slate-200 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
