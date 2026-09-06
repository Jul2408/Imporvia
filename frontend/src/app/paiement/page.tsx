"use client";
import React, { useState } from "react";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ImporViaPaiement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/billing/mock-checkout/");
      if (res.data.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex justify-between items-center px-lg py-sm w-full max-w-container-max mx-auto bg-surface-lowest border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-md">
          <span className="font-headline-md text-headline-md font-bold text-primary">ImporVia</span>
        </div>
        <nav className="hidden md:flex items-center gap-lg">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Fonctionnalités</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Comment ça marche</a>
          <a className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1" href="#">Tarifs</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Ressources</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">FAQ</a>
        </nav>
        <div className="flex items-center gap-sm">
          <button className="font-label-md text-label-md text-on-surface hover:bg-surface-container px-md py-sm rounded transition-colors duration-200">Se connecter</button>
          <button className="font-label-md text-label-md bg-primary text-on-primary px-md py-sm rounded hover:bg-opacity-90 transition-all duration-200 shadow-sm">Commencer</button>
        </div>
      </header>
      <main className="grow w-full max-w-container-max mx-auto px-md md:px-lg py-xl flex justify-center items-start">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg border border-surface-variant p-lg shadow-[0_2px_4px_rgba(15,23,42,0.05)]">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Détails du paiement</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">Saisissez vos informations de facturation pour activer votre abonnement.</p>
            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg text-center">
                <span className="material-symbols-outlined text-emerald-600 text-4xl mb-4 block">check_circle</span>
                <h2 className="text-xl font-bold text-emerald-800 mb-2">Paiement réussi !</h2>
                <p className="text-emerald-700">Votre compte a été activé. Redirection en cours...</p>
              </div>
            ) : (
              <form className="space-y-lg" onSubmit={handlePayment}>
                <div className="space-y-md">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-surface-variant pb-xs">Informations de contact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="firstName">Prénom</label>
                      <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full font-body-md text-body-md border border-surface-variant rounded bg-surface-container-lowest p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" id="firstName" placeholder="Jean" type="text"/>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="lastName">Nom</label>
                      <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full font-body-md text-body-md border border-surface-variant rounded bg-surface-container-lowest p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" id="lastName" placeholder="Dupont" type="text"/>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="email">Adresse e-mail professionnelle</label>
                      <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full font-body-md text-body-md border border-surface-variant rounded bg-surface-container-lowest p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" id="email" placeholder="jean.dupont@entreprise.com" type="email"/>
                    </div>
                  </div>
                </div>

                <div className="space-y-md pt-md">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-surface-variant pb-xs">Méthode de paiement</h2>
                  <div className="bg-surface-bright border border-surface-variant rounded p-md space-y-md">
                    <div className="flex items-center gap-sm mb-sm text-on-surface-variant">
                      <span className="material-symbols-outlined">credit_card</span>
                      <span className="font-label-md text-label-md">Carte de crédit ou débit</span>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="cardNumber">Numéro de carte</label>
                      <div className="relative">
                        <input required className="w-full font-body-md text-body-md border border-surface-variant rounded bg-surface-container-lowest p-sm pl-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" id="cardNumber" placeholder="0000 0000 0000 0000" type="text"/>
                        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">payment</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="expiry">Date d'expiration</label>
                        <input required className="w-full font-body-md text-body-md border border-surface-variant rounded bg-surface-container-lowest p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" id="expiry" placeholder="MM/AA" type="text"/>
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="cvc">CVC</label>
                        <div className="relative">
                          <input required className="w-full font-body-md text-body-md border border-surface-variant rounded bg-surface-container-lowest p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" id="cvc" placeholder="123" type="text"/>
                          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline-variant cursor-help text-sm" title="Code à 3 chiffres au dos de votre carte">help</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-lg">
                  <button disabled={loading} className="w-full bg-primary text-on-primary font-headline-sm text-headline-sm py-md rounded shadow-[0_4px_6px_rgba(15,23,42,0.1)] hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-sm disabled:opacity-50" type="submit">
                    {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <span className="material-symbols-outlined">lock</span>}
                    {loading ? "Traitement..." : "Payer et activer mon compte"}
                  </button>
                  <p className="text-center font-caption text-caption text-on-surface-variant mt-sm flex items-center justify-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span> Paiement 100% sécurisé et chiffré via notre passerelle mockée.
                  </p>
                </div>
              </form>
            )}
          </div>
          <div className="lg:col-span-5 space-y-lg">

            <div className="bg-surface-container-lowest rounded-lg border-t-4 border-t-primary border-x border-b border-surface-variant p-lg shadow-[0_2px_4px_rgba(15,23,42,0.05)] sticky top-25">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">Résumé de la commande</h2>
              <div className="flex items-start justify-between border-b border-surface-variant pb-md mb-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Plan PRO</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Facturation mensuelle</p>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface">150 000 FCFA</span>
              </div>

<ul className="space-y-sm mb-lg border-b border-surface-variant pb-md">
<li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-tertiary-fixed-dim" >check_circle</span>
                            Simulations illimitées
                        </li>
<li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-tertiary-fixed-dim" >check_circle</span>
                            Support prioritaire 24/7
                        </li>
<li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-tertiary-fixed-dim" >check_circle</span>
                            Export de rapports détaillés
                        </li>
<li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-tertiary-fixed-dim" >check_circle</span>
                            Veille réglementaire automatisée
                        </li>
</ul>
<div className="space-y-sm mb-md">
<div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
<span>Sous-total</span>
<span>150 000 FCFA</span>
</div>
<div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
<span>Taxes (0%)</span>
<span>0 FCFA</span>
</div>
</div>
<div className="flex justify-between items-end border-t border-surface-variant pt-md">
<span className="font-headline-sm text-headline-sm text-on-surface">Total à payer</span>
<div className="text-right">
<span className="font-headline-lg text-headline-lg text-primary block">150 000 FCFA</span>
<span className="font-caption text-caption text-on-surface-variant">TTC / mois</span>
</div>
</div>
</div>

<div className="bg-surface-bright rounded border border-surface-variant p-md flex items-center gap-md">
<img className="w-16 h-16 object-cover rounded" data-alt="A clean, minimalist 3D rendering of a secure server or padlock floating above a subtle blue gradient background. High-key lighting, modern B2B SaaS aesthetic, emphasizing trust and stability. Studio photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrWTY53DJ2gC4pPtKhCLEZna7S57VzZ3xGpTCeL2M_aq-kI9SNXEzlBO1XsHvPXerHT54iCM4Wlki6dKgcj0xfAs6JgIDuqO6_S-Mjfq5ZHT4V_q9mN5bGnBt2MeFG8ji1DIIW0Rb5GEP5H8hBX1q_d8ffGDBBpxEOuTypzF5Q4jDB-_CXVOM0cr6y7OmH2tZmmkcOodETTrG72GPmHsO_1bTnFUYPgIW5ZtB9RPVY4XgQctOdIzI"/>
<div>
<h4 className="font-label-md text-label-md text-on-surface font-semibold mb-xs">Garantie de conformité</h4>
<p className="font-caption text-caption text-on-surface-variant">Vos données sont traitées selon les normes de sécurité les plus strictes.</p>
</div>
</div>
</div>
</div>
</main>

<footer className="w-full px-lg py-xxl grid grid-cols-1 md:grid-cols-4 gap-xl max-w-container-max mx-auto bg-surface-container border-t border-outline-variant mt-auto">
<div className="col-span-1">
<div className="font-headline-md text-headline-md font-bold text-primary mb-md">ImporVia</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-md">La solution professionnelle pour l'exactitude douanière.</p>
<p className="font-caption text-caption text-on-surface-variant">© 2026 ImporVia. Tous droits réservés.</p>
</div>
<div className="col-span-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Produit</h4>
<ul className="space-y-sm">
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Simulations</a></li>
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Tarifs</a></li>
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">API</a></li>
</ul>
</div>
<div className="col-span-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Entreprise</h4>
<ul className="space-y-sm">
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">À propos</a></li>
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a></li>
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Carrières</a></li>
</ul>
</div>
<div className="col-span-1">
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Légal</h4>
<ul className="space-y-sm">
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">CGV</a></li>
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Confidentialité</a></li>
<li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Mentions légales</a></li>
</ul>
</div>
</footer>

    </>
  );
}
