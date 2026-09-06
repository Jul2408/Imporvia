import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import Link from "next/link"

function LegalLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">Document légal</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2 mb-3">{title}</h1>
          <p className="text-slate-400 text-sm">Dernière mise à jour : {lastUpdated}</p>
        </div>
      </div>
      <main className="grow">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 prose prose-slate max-w-none">
            {children}
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 font-bold hover:underline">← Retour à l'accueil</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de Confidentialité" lastUpdated="1er janvier 2026">
      <h2>1. Responsable du Traitement</h2>
      <p>
        Le responsable du traitement est <strong>ImporVia SAS</strong>, dont le siège social est situé à Akwa, Douala, Cameroun. Pour toute question relative à la protection de vos données, contactez : <strong>dpo@imporvia.com</strong>.
      </p>

      <h2>2. Données Collectées</h2>
      <p>Dans le cadre de l'utilisation de notre plateforme, nous collectons les données suivantes :</p>
      <ul>
        <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail, numéro de téléphone professionnel.</li>
        <li><strong>Données de l'entreprise :</strong> Raison sociale, RCCM/NIF, secteur d'activité.</li>
        <li><strong>Données d'utilisation :</strong> Simulations réalisées, codes SH utilisés, historique de connexion.</li>
        <li><strong>Données de paiement :</strong> Traitées directement par notre prestataire sécurisé (CinetPay). ImporVia ne stocke jamais vos coordonnées bancaires complètes.</li>
      </ul>

      <h2>3. Finalités du Traitement</h2>
      <p>Vos données sont utilisées exclusivement pour :</p>
      <ul>
        <li>Exécuter et améliorer le service de simulation douanière.</li>
        <li>Gérer votre compte et votre abonnement.</li>
        <li>Vous informer des mises à jour réglementaires (avec votre consentement).</li>
        <li>Assurer la sécurité et l'intégrité de la plateforme.</li>
      </ul>

      <h2>4. Conservation des Données</h2>
      <p>
        Vos données à caractère personnel sont conservées pendant toute la durée de votre abonnement actif, puis pendant une période maximale de 3 ans à des fins légales et d'archivage, conformément à la législation ivoirienne.
      </p>

      <h2>5. Partage des Données</h2>
      <p>
        Nous ne vendons, ne louons et ne partageons <strong>jamais</strong> vos données commerciales ou de simulation avec des tiers, y compris l'administration douanière ou fiscale, sauf obligation légale expresse.
      </p>

      <h2>6. Vos Droits</h2>
      <p>Conformément aux lois applicables sur la protection des données, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez <strong>dpo@imporvia.com</strong>.</p>

      <h2>7. Sécurité des Données</h2>
      <p>
        Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nos serveurs sont hébergés dans des datacenters certifiés ISO 27001 sur le continent africain.
      </p>
    </LegalLayout>
  )
}
