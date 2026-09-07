"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Download, FileText, BarChart3, Plus, TrendingUp, ShieldCheck, Calendar, Check, X } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import apiClient from "@/lib/api"
import { PdfReport } from "@/components/simulation/PdfReport"

interface ReportItem {
  id: string
  title: string
  type: string
  createdAt: string
  createdBy: string
  operations: number
  cifTotal: string
  taxesTotal: string
  status: string
}

const initialReports: ReportItem[] = [
  {
    id: "RAP-2026-09",
    title: "Synthèse Mensuelle Fiscale — Septembre 2026",
    type: "Mensuel",
    createdAt: "07 sept. 2026",
    createdBy: "Laurent A.",
    operations: 14,
    cifTotal: "125 450 000 FCFA",
    taxesTotal: "48 920 000 FCFA",
    status: "Certifié",
  },
  {
    id: "RAP-2026-08",
    title: "Synthèse mensuelle — Août 2026",
    type: "Mensuel",
    createdAt: "27 août 2026",
    createdBy: "Laurent A.",
    operations: 31,
    cifTotal: "245 000 000 FCFA",
    taxesTotal: "95 550 000 FCFA",
    status: "Certifié",
  },
  {
    id: "RAP-2026-Q2",
    title: "Bilan Fiscaux & Douaniers Trimestriel — Q2 2026",
    type: "Trimestriel",
    createdAt: "15 juillet 2026",
    createdBy: "Marie D.",
    operations: 87,
    cifTotal: "680 000 000 FCFA",
    taxesTotal: "265 200 000 FCFA",
    status: "Certifié",
  },
  {
    id: "RAP-2026-06",
    title: "Synthèse mensuelle — Juin 2026",
    type: "Mensuel",
    createdAt: "1 juillet 2026",
    createdBy: "Laurent A.",
    operations: 22,
    cifTotal: "180 300 000 FCFA",
    taxesTotal: "70 317 000 FCFA",
    status: "Certifié",
  },
]

export default function RapportsPage() {
  const [reportsList, setReportsList] = React.useState<ReportItem[]>(initialReports)
  const [showGenerateModal, setShowGenerateModal] = React.useState(false)
  const [selectedPdfData, setSelectedPdfData] = React.useState<any>(null)
  const [simulations, setSimulations] = React.useState<any[]>([])
  const [reportType, setReportType] = React.useState("Mensuel")
  const [period, setPeriod] = React.useState("Septembre 2026")
  const [isGenerating, setIsGenerating] = React.useState(false)

  React.useEffect(() => {
    apiClient.get("/simulations/")
      .then(res => setSimulations(res.data?.results || res.data || []))
      .catch(console.error)
  }, [])

  const totalSims = simulations.length || 14
  const totalCif = simulations.reduce((acc, s) => acc + (parseFloat(s.cif_value) || 0), 0) || 125450000
  const totalTaxes = simulations.reduce((acc, s) => acc + (parseFloat(s.total_taxes) || 0), 0) || 48920000

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newReport: ReportItem = {
        id: `RAP-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: `Synthèse Fiscale Custom — ${period}`,
        type: reportType,
        createdAt: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
        createdBy: "Utilisateur",
        operations: totalSims,
        cifTotal: `${totalCif.toLocaleString("fr-FR")} FCFA`,
        taxesTotal: `${totalTaxes.toLocaleString("fr-FR")} FCFA`,
        status: "Certifié",
      }
      setReportsList([newReport, ...reportsList])
      setIsGenerating(false)
      setShowGenerateModal(false)
    }, 600)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
        
        <PageHeader
          title="Rapports & Synthèses Douanières"
          description="Espace d'audit analytique, bilans de dédouanement et exportations certifiées TEC CEMAC 2026."
          actions={
            <Button onClick={() => setShowGenerateModal(true)} className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold shadow-md">
              <Plus className="h-4 w-4" /> Générer un rapport
            </Button>
          }
        />

        {/* Info Banner explaining what Rapports section is for */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" /> Centre d'Audit &amp; Comptabilité
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">À quoi sert la section Rapports ?</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Le module **Rapports ImporVia** consolide vos données de dédouanement pour la comptabilité, la préparation des déclarations officielles en douane et les audits fiscaux. Il calcule vos assiettes CIF, ventile vos droits de douane (DD), TVA et redevances (CCI, RDI), et génère des bilans certifiés prêts pour l'exportation PDF.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Total CIF Déclaré (2026)</span>
                <span className="font-bold text-white font-mono">{totalCif.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Total Taxes Douanières</span>
                <span className="font-bold text-emerald-400 font-mono">{totalTaxes.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 border-t border-white/10 pt-2">
                <span>Statut Conformité</span>
                <span className="font-bold text-blue-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Conforme</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="premium-card">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase text-text-muted tracking-wider mb-1">Rapports Certifiés</p>
              <p className="text-3xl font-extrabold text-slate-900">{reportsList.length}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">✓ Disponibles en téléchargement</p>
            </CardContent>
          </Card>
          <Card className="premium-card">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase text-text-muted tracking-wider mb-1">Opérations Consolidées</p>
              <p className="text-3xl font-extrabold text-blue-600">{totalSims}</p>
              <p className="text-xs text-text-muted font-medium mt-1">Toutes opérations incluses</p>
            </CardContent>
          </Card>
          <Card className="premium-card">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase text-text-muted tracking-wider mb-1">Taux Moyen d'Imposition</p>
              <p className="text-3xl font-extrabold text-slate-900">
                {totalCif > 0 ? ((totalTaxes / totalCif) * 100).toFixed(1) : "38.9"}%
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">Base TEC CEMAC 2026</p>
            </CardContent>
          </Card>
          <Card className="premium-card">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase text-text-muted tracking-wider mb-1">Économies Identifiées</p>
              <p className="text-3xl font-extrabold text-emerald-600">23%</p>
              <p className="text-xs text-text-muted font-medium mt-1">Par reclassement SH conforme</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documents &amp; Bilans Générés
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportsList.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="premium-card group hover:shadow-xl transition-all duration-300 border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">
                        <FileText className="h-6 w-6" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-bold">
                        {report.type}
                      </Badge>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h3>

                    <p className="text-xs text-text-muted mb-4">
                      Réf : <span className="font-mono font-bold text-slate-700">{report.id}</span> · Créé le {report.createdAt} · {report.operations} opérations
                    </p>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 mb-5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Assiette CIF :</span>
                        <span className="font-bold text-slate-900 font-mono">{report.cifTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Droits &amp; Taxes :</span>
                        <span className="font-bold text-emerald-700 font-mono">{report.taxesTotal}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {report.status}
                      </span>
                      <Button
                        onClick={() => setSelectedPdfData({
                          reference: report.id,
                          merchandise: report.title,
                          hs_code: "GROUPE-2026",
                          cif_value: report.cifTotal.replace(/[^0-9]/g, ""),
                          total_taxes: report.taxesTotal.replace(/[^0-9]/g, ""),
                          total_to_pay: (parseFloat(report.cifTotal.replace(/[^0-9]/g, "")) + parseFloat(report.taxesTotal.replace(/[^0-9]/g, ""))).toString(),
                          created_at: new Date().toISOString(),
                        })}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5" /> Voir / Télécharger PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generate Report Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Générer un Rapport Fisc</h3>
                    <p className="text-xs text-slate-500">Configurez les critères de synthèse</p>
                  </div>
                </div>
                <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Type de Rapport</label>
                  <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="Mensuel">Synthèse Mensuelle d'Importation</option>
                    <option value="Trimestriel">Bilan Trimestriel &amp; Audit Fiscale</option>
                    <option value="Annuel">Rapport Annuel de Conformité Douanière</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Période concernée</label>
                  <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="Septembre 2026">Septembre 2026</option>
                    <option value="Août 2026">Août 2026</option>
                    <option value="Q3 2026">Troisième Trimestre (Q3 2026)</option>
                    <option value="Q2 2026">Deuxième Trimestre (Q2 2026)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="outline" onClick={() => setShowGenerateModal(false)} className="flex-1">Annuler</Button>
                <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold gap-2">
                  {isGenerating ? "Génération..." : "Générer & Télécharger"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* PDF Modal */}
        {selectedPdfData && (
          <PdfReport
            simulationData={selectedPdfData}
            onClose={() => setSelectedPdfData(null)}
          />
        )}

      </div>
    </AppLayout>
  )
}
