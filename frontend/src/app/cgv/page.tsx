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

export default function CGVPage() {
  return (
    <LegalLayout title="Conditions Générales de Vente (CGV)" lastUpdated="1er janvier 2026">
      <h2>Article 1 – Identification du Vendeur</h2>
      <p>
        La société <strong>ImporVia SAS</strong>, au capital de 10 000 000 FCFA, dont le siège social est situé à Akwa, Avenue du Général Leclerc, Douala, Cameroun. RCCM DLA-2021-B-1234. Email : contact@imporvia.com.
      </p>

      <h2>Article 2 – Objet et Champ d'Application</h2>
      <p>
        Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les droits et obligations des parties dans le cadre de la souscription par le Client aux services SaaS de simulation douanière proposés par ImporVia. Toute souscription implique l'acceptation sans réserve des présentes CGV.
      </p>

      <h2>Article 3 – Description des Services</h2>
      <p>ImporVia fournit une plateforme SaaS permettant :</p>
      <ul>
        <li>La simulation et l'estimation des droits de douane, TVA et taxes annexes pour l'importation de marchandises en Afrique subsaharienne.</li>
        <li>La vérification de la nomenclature des codes SH (Système Harmonisé).</li>
        <li>La génération de rapports de conformité aux formats PDF et Excel.</li>
        <li>L'archivage sécurisé des simulations réalisées.</li>
      </ul>
      <p><strong>Important :</strong> Les résultats fournis par ImporVia sont des estimations à titre informatif et ne constituent pas un avis juridique officiel. Ils ne remplacent pas la déclaration en douane légale effectuée par un commissionnaire en douane agréé.</p>

      <h2>Article 4 – Tarifs et Modalités de Paiement</h2>
      <p>
        Les prix des abonnements sont indiqués en FCFA (Franc CFA) sur la page Tarifs de notre site web. Ils s'entendent hors taxes et sont payables d'avance, au moment de la souscription. Les paiements sont sécurisés via notre prestataire de paiement certifié (CinetPay).
      </p>

      <h2>Article 5 – Durée et Résiliation</h2>
      <p>
        L'abonnement mensuel est sans engagement et peut être résilié à tout moment, avec effet à la fin de la période en cours. L'abonnement annuel est souscrit pour une durée minimale de 12 mois.
      </p>

      <h2>Article 6 – Responsabilité</h2>
      <p>
        ImporVia s'engage à fournir ses services avec diligence et à maintenir à jour sa base de données tarifaires. Cependant, ImporVia ne saurait être tenue responsable des décisions commerciales, douanières ou fiscales prises par le Client sur la base des simulations réalisées.
      </p>

      <h2>Article 7 – Droit Applicable</h2>
      <p>
        Les présentes CGV sont soumises au droit camerounais. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux compétents de Douala, Cameroun.
      </p>
    </LegalLayout>
  )
}
