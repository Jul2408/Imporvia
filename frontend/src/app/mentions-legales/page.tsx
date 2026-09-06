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

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions Légales" lastUpdated="1er janvier 2026">
      <h2>Éditeur du site</h2>
      <p>
        <strong>ImporVia SAS</strong><br />
        Société par Actions Simplifiée au capital de 10 000 000 FCFA<br />
        Siège social : Akwa, Avenue du Général Leclerc, Douala, Cameroun<br />
        RCCM : CI-ABJ-2021-B-1234<br />
        NIF : 2021-0001234-A<br />
        Directeur de la publication : Alain Bessala, Président-Directeur Général<br />
        Email : contact@imporvia.com<br />
        Téléphone : +225 07 00 00 00 00
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site et l'application sont hébergés par :<br />
        <strong>AWS Africa (Cape Town) Region</strong> – Amazon Web Services<br />
        410 Terry Avenue North, Seattle, WA 98109, USA<br />
        (Serveurs de traitement des données localisés en Afrique)
      </p>

      <h2>Propriété Intellectuelle</h2>
      <p>
        L'ensemble du contenu de ce site (textes, graphiques, logotypes, icônes, images, éléments sonores, logiciels) est la propriété exclusive de ImporVia SAS et est protégé par les lois ivoiriennes et internationales relatives à la propriété intellectuelle.
      </p>
      <p>
        Toute reproduction, représentation, modification ou adaptation, totale ou partielle, de quelque nature que ce soit, du site ou de son contenu, est strictement interdite sans autorisation préalable et écrite de ImporVia SAS.
      </p>

      <h2>Limitation de Responsabilité</h2>
      <p>
        ImporVia SAS s'efforce de maintenir les informations présentées sur ce site à jour et exactes. Cependant, elle décline toute responsabilité pour les erreurs, omissions ou résultats obtenus par une mauvaise utilisation de ces informations. Les résultats de simulation ne sauraient constituer un avis juridique ou fiscal.
      </p>

      <h2>Droit Applicable</h2>
      <p>
        Le présent site est soumis au droit de la République du Cameroun. Tout litige sera soumis à la compétence exclusive des tribunaux de Douala.
      </p>
    </LegalLayout>
  )
}
