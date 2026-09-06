import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { Linkedin, Twitter, Facebook } from "@/components/ui/BrandIcons"
const articles = [
  {
    id: 1,
    cat: "Réglementation",
    catColor: "bg-blue-100 text-blue-700",
    title: "Nouveaux tarifs douaniers 2026 : Ce que les importateurs doivent savoir",
    excerpt: "La CEMAC a annoncé une révision majeure du Tarif Extérieur Commun. Voici les changements qui impactent directement vos calculs de droits de douane dès janvier 2026.",
    content: `L'année 2026 marque un tournant décisif pour les importateurs opérant dans la zone CEMAC. Avec l'entrée en vigueur de la nouvelle nomenclature tarifaire, plusieurs changements majeurs vont impacter directement le coût de revient des marchandises importées.

Le Tarif Extérieur Commun (TEC) a été révisé pour s'aligner sur les nouvelles directives de l'OMD (Organisation Mondiale des Douanes). Parmi les modifications les plus notables, on observe une restructuration complète des chapitres 84 et 85 concernant les machines et appareils électroniques.

**Qu'est-ce qui change concrètement ?**
- Création de nouvelles sous-positions pour les technologies émergentes (drones, imprimantes 3D).
- Fusion de certaines lignes tarifaires obsolètes.
- Ajustement des taux de Droits de Douane (DD) pour favoriser l'importation d'équipements liés aux énergies renouvelables.

Avec ImporVia, toutes ces nouvelles règles sont déjà intégrées dans notre moteur de simulation pour l'année 2026. Vous pouvez dès aujourd'hui simuler vos futures importations au port de Douala en sélectionnant le référentiel "TEC 2026".`,
    date: "12 Mars 2026",
    readTime: "5 min",
    author: "Aminata Koné",
    authorRole: "Experte Douanière",
    img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function BlogPost({ params }: { params: { id: string } }) {
  const articleId = parseInt(params.id);
  const article = articles.find(a => a.id === articleId) || {
    id: articleId,
    cat: "Analyse",
    catColor: "bg-slate-100 text-slate-700",
    title: "L'importance de la conformité douanière dans la chaîne logistique",
    excerpt: "Une erreur de déclaration peut bloquer vos marchandises au port de Douala pendant des semaines.",
    content: `La méthode de la valeur transactionnelle reste le standard mondial pour l'évaluation douanière, tel que défini par l'Article VII du GATT. Cependant, son application pratique suscite souvent des litiges entre les opérateurs économiques et l'administration douanière.

**Les éléments à inclure dans la valeur en douane :**
1. **Le prix facturé** pour les marchandises (valeur FOB).
2. **Les frais de transport et d'assurance** jusqu'au port ou lieu d'introduction (valeur CIF).
3. **Certaines commissions et frais de courtage** supportés par l'acheteur.
4. **Le coût des emballages** (sauf s'ils sont admis en franchise).

**Les pièges à éviter :**
Il est crucial de déclarer la véritable nature de la transaction. Une sous-évaluation intentionnelle de la valeur FOB ou l'omission d'une ligne de fret maritime peut entraîner des redressements sévères (amendes allant jusqu'à 300% des droits éludés).

Utiliser un outil comme ImporVia vous permet de vérifier en amont les déclarations de votre transitaire et de vous assurer que tout est conforme avant le dépôt de la déclaration officielle.`,
    date: "15 Fév 2026",
    readTime: "4 min",
    author: "Jean-Paul Etoundi",
    authorRole: "Consultant Logistique (Cameroun)",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900">
      <SiteHeader />

      <main className="grow w-full pb-24">
        {/* Article Header */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour au blog
          </Link>
          
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${article.catColor}`}>
              {article.cat}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between py-6 border-y border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                {article.author ? article.author.substring(0,2).toUpperCase() : "AD"}
              </div>
              <div>
                <div className="font-bold text-slate-900">{article.author || "Équipe ImporVia"}</div>
                <div className="text-sm text-slate-500">{article.authorRole || "Rédaction"}</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {article.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.readTime} de lecture</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <div className="w-full h-[40vh] md:h-[60vh] rounded-4xl overflow-hidden shadow-xl">
            <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto px-6">
          <article className="prose prose-lg prose-slate prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-semibold">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '<br/><br/>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>') }} />
          </article>
          
          {/* Share & Tags */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">Partager :</span>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"><Linkedin className="w-5 h-5" /></button>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"><Twitter className="w-5 h-5" /></button>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
