"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Shield, Mail, Phone, ArrowRight, ArrowLeft,
  User, Building2, CheckCircle2, Lock, Eye, EyeOff,
  CreditCard, Zap, Rocket, Check, Sparkles, AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const STEPS = [
  { id: 1, label: "Personnelle" },
  { id: 2, label: "Entreprise" },
  { id: 3, label: "Sécurité" },
  { id: 4, label: "Plan" },
]

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "50 000",
    desc: "Pour débuter",
    icon: Rocket,
    color: "border-slate-200 hover:border-blue-300",
    selectedColor: "border-blue-600 bg-blue-50",
    features: ["50 simulations/mois", "1 utilisateur", "Support email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "150 000",
    desc: "Le plus populaire",
    icon: Zap,
    badge: "Recommandé",
    color: "border-slate-200 hover:border-blue-300",
    selectedColor: "border-blue-600 bg-blue-50",
    features: ["500 simulations/mois", "5 utilisateurs", "Support prioritaire"],
  },
  {
    id: "entreprise",
    name: "Entreprise",
    price: "Sur devis",
    desc: "Pour les grandes équipes",
    icon: Building2,
    color: "border-slate-200 hover:border-blue-300",
    selectedColor: "border-blue-600 bg-blue-50",
    features: ["Illimité", "Utilisateurs illimités", "Account manager"],
  },
]

export default function ImporViaInscription() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [direction, setDirection] = React.useState(1)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "Cameroun",
    sector: "",
    password: "",
    confirm: "",
    plan: "pro",
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const goNext = () => {
    if (step < 4) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  const { register } = useAuth()

  const handleSubmit = async () => {
    setError("")
    setSubmitting(true)
    try {
      await register({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        phone_number: form.phone,
      })
    } catch (e: any) {
      console.error("Registration error:", e)
      const data = e?.response?.data
      if (data) {
        if (data.email) {
          const msg = Array.isArray(data.email) ? data.email.join(" ") : data.email
          setError(`Email : ${msg}`)
        } else if (data.password) {
          const msg = Array.isArray(data.password) ? data.password.join(" ") : data.password
          setError(`Mot de passe : ${msg}`)
        } else if (data.detail) {
          setError(data.detail)
        } else {
          const firstKey = Object.keys(data)[0]
          if (firstKey) {
            const val = data[firstKey]
            setError(`${firstKey} : ${Array.isArray(val) ? val.join(" ") : val}`)
          } else {
            setError("Champs invalides. Veuillez vérifier vos données.")
          }
        }
      } else {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-slate-900 overflow-hidden">

      {/* ─── LEFT PANEL ─── */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-slate-900 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/projet-dextension-du-terminal-a-conteneurs-du-port-de-douala.webp"
            alt="Port de Douala"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img src="/logo.png" alt="ImporVia Logo" className="h-20 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>

        <div className="relative z-10 p-8 lg:p-12 mt-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold mb-6">
              <CheckCircle2 className="w-4 h-4" /> Inscription rapide
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Rejoignez les leaders de l'import/export.
            </h1>
            <ul className="space-y-4 mb-8">
              {["Simulations illimitées", "Vérification intelligente des codes SH", "Accès au réseau de transitaires"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex flex-col justify-start md:justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-28 relative overflow-y-auto">

        {/* Mobile Logo */}
        <div className="md:hidden flex justify-center mb-8">
          <Link href="/"><img src="/logo.png" alt="ImporVia Logo" className="h-16 w-auto object-contain" /></Link>
        </div>

        <div className="w-full max-w-xl mx-auto">

          {/* Title */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Créer votre compte</h2>
            <p className="text-slate-600 font-medium">Veuillez renseigner vos informations pour débuter.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Step Indicator */}
          <div className="mb-10">
            <div className="relative">
              {/* Track */}
              <div className="absolute left-0 top-5 w-full h-1 bg-slate-100 rounded-full" />
              {/* Progress */}
              <motion.div
                className="absolute left-0 top-5 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
              {/* Dots */}
              <div className="relative flex justify-between">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: step === s.id ? 1.15 : 1,
                        backgroundColor: step > s.id ? "#16a34a" : step === s.id ? "#2563eb" : "#f1f5f9",
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white z-10 relative"
                    >
                      {step > s.id ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span className={step >= s.id ? "text-white" : "text-slate-400"}>{s.id}</span>
                      )}
                    </motion.div>
                    <span className={`mt-2 text-xs font-bold whitespace-nowrap transition-colors duration-300 ${step === s.id ? "text-blue-600" : step > s.id ? "text-emerald-600" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-5"
              >

                {/* ── STEP 1: Informations personnelles ── */}
                {step === 1 && (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Informations personnelles</p>
                        <p className="text-xs text-slate-500">Vos données d'identification</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Prénom" id="firstName" icon={<User className="h-4 w-4" />}>
                        <input id="firstName" type="text" placeholder="Arthur" value={form.firstName} onChange={e => update("firstName", e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Nom" id="lastName" icon={<User className="h-4 w-4" />}>
                        <input id="lastName" type="text" placeholder="Ndongo" value={form.lastName} onChange={e => update("lastName", e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Adresse Email Professionnelle" id="email" icon={<Mail className="h-4 w-4" />}>
                      <input id="email" type="email" placeholder="arthur@entreprise.cm" value={form.email} onChange={e => update("email", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Numéro de téléphone" id="phone" icon={<Phone className="h-4 w-4" />}>
                      <input id="phone" type="tel" placeholder="+237 6 99 99 99 99" value={form.phone} onChange={e => update("phone", e.target.value)} className={inputCls} />
                    </Field>
                  </>
                )}

                {/* ── STEP 2: Entreprise ── */}
                {step === 2 && (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Informations entreprise</p>
                        <p className="text-xs text-slate-500">Votre structure professionnelle</p>
                      </div>
                    </div>
                    <Field label="Raison sociale" id="company" icon={<Building2 className="h-4 w-4" />}>
                      <input id="company" type="text" placeholder="NDONGO IMPORT SARL" value={form.company} onChange={e => update("company", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Pays" id="country" icon={<Shield className="h-4 w-4" />}>
                      <select id="country" value={form.country} onChange={e => update("country", e.target.value)} className={inputCls}>
                        {["Cameroun", "Côte d'Ivoire", "Sénégal", "Gabon", "RDC", "Mali", "Burkina Faso", "Togo", "Bénin", "Autre"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Secteur d'activité" id="sector" icon={<CreditCard className="h-4 w-4" />}>
                      <select id="sector" value={form.sector} onChange={e => update("sector", e.target.value)} className={inputCls}>
                        <option value="">Sélectionner un secteur</option>
                        {["Transit & Logistique", "Commerce import/export", "Industrie & Fabrication", "Distribution & Retail", "Agriculture & Agroalimentaire", "Autre"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </>
                )}

                {/* ── STEP 3: Sécurité ── */}
                {step === 3 && (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Sécurité du compte</p>
                        <p className="text-xs text-slate-500">Choisissez un mot de passe fort</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 8 caractères"
                          value={form.password}
                          onChange={e => update("password", e.target.value)}
                          className={`${inputCls} pr-11`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="relative group">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Confirmer le mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Répétez le mot de passe"
                          value={form.confirm}
                          onChange={e => update("confirm", e.target.value)}
                          className={`${inputCls} pr-11 ${form.confirm && form.password !== form.confirm ? "border-red-400 focus:border-red-500" : ""}`}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700">
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {form.confirm && form.password !== form.confirm && (
                        <p className="text-xs text-red-500 mt-1 font-medium">Les mots de passe ne correspondent pas.</p>
                      )}
                    </div>
                    {/* Strength Indicator */}
                    {form.password && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map(lvl => (
                            <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${passwordStrength(form.password) >= lvl ? strengthColor(passwordStrength(form.password)) : "bg-slate-200"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">{strengthLabel(passwordStrength(form.password))}</p>
                      </div>
                    )}
                    <label className="flex items-start gap-3 cursor-pointer group mt-2">
                      <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        J'accepte les <Link href="/cgv" className="text-blue-600 font-bold hover:underline">Conditions Générales de Vente</Link> et la <Link href="/confidentialite" className="text-blue-600 font-bold hover:underline">Politique de Confidentialité</Link> d'ImporVia.
                      </span>
                    </label>
                  </>
                )}

                {/* ── STEP 4: Plan ── */}
                {step === 4 && (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Choisissez votre plan</p>
                        <p className="text-xs text-slate-500">Modifiable à tout moment · 14 jours d'essai gratuit</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {PLANS.map((plan) => {
                        const Icon = plan.icon
                        const selected = form.plan === plan.id
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => update("plan", plan.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${selected ? plan.selectedColor : plan.color} relative`}
                          >
                            {plan.badge && (
                              <span className="absolute top-3 right-3 text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                {plan.badge}
                              </span>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${selected ? "bg-blue-600" : "bg-slate-100"}`}>
                                <Icon className={`h-4 w-4 ${selected ? "text-white" : "text-slate-500"}`} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                                <p className="text-xs text-slate-500">{plan.desc}</p>
                              </div>
                              <p className="ml-auto text-sm font-extrabold text-slate-900 whitespace-nowrap">
                                {plan.price === "Sur devis" ? "Sur devis" : <>{plan.price} <span className="text-xs font-normal text-slate-400">FCFA/mois</span></>}
                              </p>
                            </div>
                            <ul className="flex flex-wrap gap-x-4 gap-y-1 pl-11">
                              {plan.features.map(f => (
                                <li key={f} className="flex items-center gap-1 text-xs text-slate-500">
                                  <Check className="h-3 w-3 text-emerald-500" /> {f}
                                </li>
                              ))}
                            </ul>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step === 1 ? (
              <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                Annuler
              </Link>
            ) : (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex justify-center items-center py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all hover:-translate-y-0.5 group"
              >
                Étape suivante
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex justify-center items-center py-4 px-8 rounded-xl shadow-lg shadow-emerald-500/30 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed gap-2"
              >
                {submitting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Créer mon compte
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600 font-medium">
              Vous avez déjà un compte ?{" "}
              <Link href="/connexion" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────

const inputCls =
  "block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-600 text-sm text-slate-900 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium hover:border-slate-300"

function Field({ label, id, icon, children }: { label: string; id: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        {children}
      </div>
    </div>
  )
}

function passwordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

function strengthColor(score: number) {
  if (score <= 1) return "bg-red-400"
  if (score === 2) return "bg-orange-400"
  if (score === 3) return "bg-yellow-400"
  return "bg-emerald-500"
}

function strengthLabel(score: number) {
  if (score <= 1) return "Mot de passe faible"
  if (score === 2) return "Mot de passe moyen"
  if (score === 3) return "Mot de passe fort"
  return "Mot de passe très fort ✓"
}
