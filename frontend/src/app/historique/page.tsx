"use client"

import * as React from "react"
import { Search, Download, History as HistoryIcon, Filter, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, type OperationStatus } from "@/components/ui/status-badge"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { motion } from "framer-motion"
import apiClient from "@/lib/api"
import { PdfReport } from "@/components/simulation/PdfReport"

const typeColors: Record<string, string> = {
  "Simulation": "text-blue-700 bg-blue-50",
  "Vérification": "text-emerald-700 bg-emerald-50",
  "Rapport": "text-purple-700 bg-purple-50",
}

const PAGE_SIZE = 10

export default function HistoriquePage() {
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("Tous")
  const [historyData, setHistoryData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedPdfSim, setSelectedPdfSim] = React.useState<any>(null)
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    apiClient.get("/simulations/")
      .then(res => setHistoryData(res.data?.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = historyData.filter(item => {
    const matchSearch = item.reference?.toLowerCase().includes(search.toLowerCase()) ||
      item.hs_code?.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "Tous" || "Simulation" === typeFilter
    return matchSearch && matchType
  })

  // Reset page on filter change
  React.useEffect(() => { setCurrentPage(1) }, [search, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const exportCSV = () => {
    if (filtered.length === 0) return
    const headers = ["Référence", "Code SH", "Valeur CIF (FCFA)", "Total Taxes (FCFA)", "Total à Payer (FCFA)", "Date", "Statut"]
    const rows = filtered.map(item => [
      item.reference || "",
      item.hs_code || "",
      item.cif_value ? parseFloat(item.cif_value).toFixed(2) : "",
      item.total_taxes ? parseFloat(item.total_taxes).toFixed(2) : "",
      item.total_to_pay ? parseFloat(item.total_to_pay).toFixed(2) : "",
      new Date(item.created_at).toLocaleDateString("fr-FR"),
      item.status || "",
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }) // BOM pour Excel
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `imporvia_historique_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Historique"
          description="Retrouvez toutes vos simulations, vérifications et rapports certifiés."
          actions={
            <Button variant="outline" className="gap-2" onClick={exportCSV} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /> Exporter CSV
            </Button>
          }
        />

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input className="pl-9" placeholder="Rechercher par référence, code SH..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["Tous", "Simulation", "Vérification", "Rapport"].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-primary-900 text-white"
                    : "bg-white border border-border text-text-secondary hover:bg-background"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Card className="premium-card overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<HistoryIcon className="h-8 w-8" />}
              title="Aucun enregistrement trouvé"
              description="Modifiez vos critères de recherche ou créez une nouvelle simulation."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-background">
                    {["Référence", "Type", "Code SH", "Date", "Montant Total", "Statut", "Document"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {paginated.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-background transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm font-semibold text-primary-700">{item.reference}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${typeColors["Simulation"] || ""}`}>
                          Simulation
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-text-primary max-w-50 truncate font-mono">{item.hs_code || "8517.12.00"}</td>
                      <td className="px-4 py-3.5 text-sm text-text-secondary whitespace-nowrap">{new Date(item.created_at).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-text-primary whitespace-nowrap">{item.total_to_pay ? parseFloat(item.total_to_pay).toLocaleString("fr-FR") + " FCFA" : item.cif_value ? parseFloat(item.cif_value).toLocaleString("fr-FR") + " FCFA" : "N/A"}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={item.status === "COMPLETED" ? "terminee" : item.status === "FAILED" ? "erreur" : "simulee"} /></td>
                      <td className="px-4 py-3.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPdfSim(item)}
                          className="gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {selectedPdfSim && (
          <PdfReport
            simulationData={{
              reference: selectedPdfSim.reference,
              hs_code: selectedPdfSim.hs_code || "8517.12.00",
              cif_value: selectedPdfSim.cif_value,
              fob_value: selectedPdfSim.fob_value,
              freight: selectedPdfSim.freight,
              insurance: selectedPdfSim.insurance,
              total_taxes: selectedPdfSim.total_taxes,
              total_to_pay: selectedPdfSim.total_to_pay,
              created_at: selectedPdfSim.created_at,
            }}
            onClose={() => setSelectedPdfSim(null)}
          />
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-text-muted">
            {filtered.length} enregistrements · Page {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

