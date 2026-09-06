"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import {
  Calculator,
  CheckSquare,
  FileBox,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Star,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Zap,
  Clock,
  Lock,
  ChevronRight
} from "lucide-react"

// Background images for infinite scroll (Port, logistics, containers)
const bgImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?q=80&w=800&auto=format&fit=crop"
]

const scrollImages1 = [...bgImages, ...bgImages]
const scrollImages2 = [...bgImages].reverse()
const scrollImages3 = [...scrollImages2, ...scrollImages2]

const features = [
  {
    icon: Calculator,
    title: "Simulation précise",
    description: "Estimez droits et taxes en quelques secondes avec notre moteur de calcul douanier.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: CheckSquare,
    title: "Vérification instantanée",
    description: "Comparez factures et déclarations pour détecter tout écart avant paiement.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: FileBox,
    title: "Gestion centralisée",
    description: "Tous vos documents douaniers en un seul endroit, accessibles à tout moment.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: BarChart3,
    title: "Rapports analytiques",
    description: "Visualisez vos tendances d'importation et optimisez vos coûts logistiques.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
]

const stats = [
  { value: "98%", label: "Précision des calculs" },
  { value: "2 000+", label: "Opérations traitées" },
  { value: "340K", label: "FCFA économisés en moy." },
  { value: "< 30s", label: "Temps de simulation" },
]

export default function ImporViaAccueil() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Framer Motion Variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }
  const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30">

      <SiteHeader />

      <main>
        {/* ===== HERO WITH INFINITE SCROLL BG ===== */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">

          {/* Animated Background Columns - 100% visible, no white gradient blocking them */}
          <div className="absolute inset-0 z-0 flex gap-4 p-4 opacity-50 -rotate-12 scale-[1.3] pointer-events-none">
            <div className="flex-1 flex flex-col gap-4 animate-scroll-y">
              {scrollImages1.map((src, i) => <img key={`col1-${i}`} src={src} alt="" className="w-full h-64 object-cover rounded-2xl shadow-lg transition-all duration-700" />)}
            </div>
            <div className="flex-1 flex flex-col gap-4 animate-scroll-y-fast pt-32">
              {scrollImages3.map((src, i) => <img key={`col2-${i}`} src={src} alt="" className="w-full h-80 object-cover rounded-2xl shadow-lg transition-all duration-700" />)}
            </div>
            <div className="flex-1 hidden md:flex flex-col gap-4 animate-scroll-y pb-24">
              {scrollImages1.map((src, i) => <img key={`col3-${i}`} src={src} alt="" className="w-full h-72 object-cover rounded-2xl shadow-lg transition-all duration-700" />)}
            </div>
            <div className="flex-1 hidden lg:flex flex-col gap-4 animate-scroll-y-fast">
              {scrollImages3.map((src, i) => <img key={`col4-${i}`} src={src} alt="" className="w-full h-64 object-cover rounded-2xl shadow-lg transition-all duration-700" />)}
            </div>
          </div>

          {/* Dark overlay to make white text pop. The user wanted the background clearly visible. 
              We use a slight dark gradient from left to ensure text is perfectly readable. */}
          <div className="absolute inset-0 z-0 bg-linear-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 z-0 bg-blue-900/10 mix-blend-overlay" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Text - Completely transparent, no white box, text is white for contrast */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="lg:col-span-7"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md rounded-full px-4 py-1.5 text-sm text-blue-300 font-bold border border-blue-400/30 mb-8">
                <Globe2 className="w-4 h-4 text-blue-400" />
                Le standard B2B en conformité douanière
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-6 drop-shadow-2xl">
                Dédouanez avec{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
                  certitude
                </span>{" "}
                et rapidité.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 font-medium drop-shadow-lg max-w-2xl">
                La première plateforme intelligente qui simule, valide et sécurise vos déclarations en douane.
                Optimisez vos coûts logistiques avant même l'embarquement de vos marchandises.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/inscription"
                  className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">Démarrer une simulation <ArrowRight className="w-5 h-5" /></span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Demander une démo
                </Link>
              </motion.div>

              {/* Social proof - African Professionals */}
              <motion.div variants={fadeUp} className="flex items-center gap-4 pt-10 mt-10 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=100&auto=format&fit=crop", // African woman
                    "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?q=80&w=100&auto=format&fit=crop", // African man
                    "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=100&auto=format&fit=crop"  // African man
                  ].map((src, i) => (
                    <img key={`user-${i}`} src={src} className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover shadow-xl" alt="User" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={`star-${s}`} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-sm text-slate-300 font-medium mt-1">Recommandé par +500 transitaires au Cameroun et en zone CEMAC</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: UI Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: 15, perspective: 1000 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              <div className="bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-200 relative z-10 transform-gpu">
                {/* Card header */}
                <div className="bg-slate-50/80 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-slate-500 text-sm font-mono tracking-wider font-semibold">DOSSIER-4892</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VALIDE
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Image inside card */}
                  <div className="w-full h-32 rounded-xl overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="text-white font-bold text-sm">Marchandise : Électronique</p>
                      <p className="text-slate-300 text-xs">Origine: Shanghai → Douala</p>
                    </div>
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 transition-all hover:bg-slate-100">
                      <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Valeur CAF</p>
                      <p className="text-xl font-bold text-slate-900">25 000 000</p>
                      <p className="text-xs text-slate-400 font-mono">FCFA</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 relative overflow-hidden transition-all hover:bg-blue-100">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full blur-xl" />
                      <p className="text-xs text-blue-700 font-bold mb-1 uppercase tracking-wider">Taxes & Droits</p>
                      <p className="text-xl font-bold text-blue-800">4 250 000</p>
                      <p className="text-xs text-blue-600 font-mono">FCFA</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-700 flex justify-between">
                      <span>Détail des lignes</span>
                      <span className="text-blue-600">Calcul en temps réel</span>
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Droits de Douane", value: 60, color: "bg-blue-500" },
                        { label: "TVA", value: 30, color: "bg-indigo-400" },
                        { label: "Redevances", value: 10, color: "bg-slate-400" },
                      ].map((item, idx) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 font-medium w-32 shrink-0">{item.label}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 1.5, delay: 1 + (idx * 0.2), ease: "easeOut" }}
                              className={`${item.color} h-full rounded-full`}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-8 text-right">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 px-6 py-4 flex items-center gap-4 z-20 hover:scale-105 transition-transform cursor-default"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Économies garanties</p>
                  <p className="text-base font-bold text-white">-18% de frais annexes</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="border-b border-slate-200 bg-white relative z-10 shadow-sm overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100"
          >
            {stats.map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                key={stat.label}
                className="text-center px-4"
              >
                <p className="text-3xl md:text-5xl font-extrabold text-blue-600 mb-2 tracking-tight">{stat.value}</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===== NEW CONTENT: POURQUOI IMPORVIA ===== */}
        <section className="py-24 px-6 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-50 via-white to-white pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Une technologie conçue pour la <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">performance</span>
              </h2>
              <p className="text-xl text-slate-600">
                Laissez notre algorithme gérer la complexité douanière. Concentrez-vous sur le développement de votre activité.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  key={i}
                  className="bg-white shadow-sm border border-slate-200 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                >
                  <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <f.icon className={`w-7 h-7 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== COMMENT ÇA MARCHE (HOW IT WORKS) - African Images ===== */}
        <section className="py-32 px-6 bg-slate-50 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-size-[32px_32px]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-sm font-bold uppercase tracking-widest mb-6">
                Simplifiez vos processus
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Le dédouanement, sans la complexité.
              </h2>
            </motion.div>

            <div className="space-y-32">
              {/* Step 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="order-2 lg:order-1 relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group"
                >
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1200&auto=format&fit=crop" alt="Professionnel de bureau" className="w-full h-112.5 object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="order-1 lg:order-2 space-y-6 lg:pl-10"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">1</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Saisissez les paramètres de votre expédition</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Entrez la valeur de la marchandise, le code SH et le pays d'origine. Notre base de données intégrée suggère automatiquement les classifications correctes pour éviter les pénalités.
                  </p>
                  <ul className="space-y-4 pt-4">
                    {["Autocomplétion intelligente des codes SH", "Prise en compte des incoterms", "Mise à jour quotidienne des taux de change"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="space-y-6 lg:pr-10"
                >
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">2</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Notre moteur calcule tout instantanément</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    En une fraction de seconde, notre algorithme croise vos données avec le tarif douanier en vigueur (TEC). Il identifie les droits de douane, la TVA, et les taxes spécifiques à votre produit.
                  </p>
                  <Link href="/fonctionnalites" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group pt-2">
                    Découvrir notre algorithme
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group"
                >
                  <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/calcul.png" alt="Calcul et analyse" className="w-full h-112.5 object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST & INTEGRATIONS ===== */}
        <section className="py-20 px-6 bg-white border-y border-slate-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto text-center"
          >
            <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-12 uppercase tracking-widest">
              Conçu pour s'intégrer à votre écosystème
            </h2>
            <div className="flex overflow-hidden">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                className="flex flex-nowrap items-center gap-12 md:gap-24 opacity-60 hover:grayscale-0 transition-all duration-500 w-max"
              >
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="flex flex-nowrap items-center gap-12 md:gap-24 pl-12 md:pl-24">
                    <div className="flex items-center gap-2 text-2xl font-black text-slate-800"><Building2 className="w-8 h-8" /> LOGISYS</div>
                    <div className="flex items-center gap-2 text-2xl font-black text-slate-800"><Zap className="w-8 h-8" /> ERP Connect</div>
                    <div className="flex items-center gap-2 text-2xl font-black text-slate-800"><ShieldCheck className="w-8 h-8" /> SYDAM / SYDONIA</div>
                    <div className="flex items-center gap-2 text-2xl font-black text-slate-800"><Globe2 className="w-8 h-8" /> TradeNet</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ===== TESTIMONIALS (African Professionals) ===== */}
        <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                Ils optimisent leurs marges avec ImporVia
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Avant ImporVia, nous avions souvent des mauvaises surprises de trésorerie au port de Douala. Aujourd'hui, nos provisions douanières sont exactes au FCFA (XAF) près.",
                  name: "Sarah Koné",
                  role: "Directrice Supply Chain, ImportTech Cameroun",
                  img: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=200&auto=format&fit=crop"
                },
                {
                  quote: "L'outil a divisé par 3 le temps passé à vérifier les factures de nos transitaires. Le contrôle de cohérence est redoutablement efficace et sécurisé.",
                  name: "Marc Traoré",
                  role: "Directeur Financier, RetailCorp",
                  img: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?q=80&w=200&auto=format&fit=crop"
                },
                {
                  quote: "C'est l'outil indispensable pour toute entreprise qui importe régulièrement dans la zone CEMAC. Les rapports PDF générés sont clairs et reconnus à la douane camerounaise.",
                  name: "Amadou Diallo",
                  role: "Gérant, Centrale d'Achat (Douala)",
                  img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop"
                }
              ].map((t, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all hover:-translate-y-2 shadow-2xl"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-lg text-slate-300 italic mb-8 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.img} className="w-14 h-14 rounded-full object-cover border-2 border-white/30" alt={t.name} />
                    <div>
                      <h4 className="font-bold text-white">{t.name}</h4>
                      <p className="text-sm text-blue-300">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-blue-700 to-blue-900 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_50px_rgba(37,99,235,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                  Prenez une longueur d'avance
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
                  Rejoignez les leaders de l'import/export qui ont déjà automatisé et sécurisé leurs processus douaniers.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/inscription"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-700 font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-xl hover:-translate-y-1 hover:scale-105"
                  >
                    Créer un compte gratuit
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-blue-800/50 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 border border-blue-400 hover:-translate-y-1"
                  >
                    Demander une démo
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
