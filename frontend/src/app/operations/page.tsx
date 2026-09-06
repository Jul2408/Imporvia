"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, FileBox } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, type OperationStatus } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import apiClient from "@/lib/api"
import Link from "next/link"
export default function OperationsPage() {
  const [search, setSearch] = React.useState("")
  const [operations, setOperations] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiClient.get("/simulations/")
      .then(res => setOperations(res.data?.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = operations.filter(
    op =>
      op.reference?.toLowerCase().includes(search.toLowerCase()) ||
      op.hs_code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Opérations"
          description="Gérez et suivez l'ensemble de vos opérations d'importation."
          actions={
            <Link href="/simulation/nouvelle">
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" /> Nouvelle opération
              </Button>
            </Link>
          }
        />

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              className="pl-9"
              placeholder="Rechercher une opération..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <Filter className="h-4 w-4" /> Filtres
          </Button>
        </div>

        {/* Table */}
        <Card className="premium-card overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FileBox className="h-8 w-8" />}
              title="Aucune opération trouvée"
              description="Aucune opération ne correspond à votre recherche. Essayez d'autres termes."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-background">
                    {["Référence", "Code SH", "Valeur CIF", "Montant estimé (Taxes)", "Date", "Statut", ""].map(h => (
                      <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {filtered.map((op, i) => (
                    <motion.tr
                      key={op.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-background transition-colors group"
                    >
                      <td className="px-4 py-3.5 text-sm font-semibold text-primary-700 whitespace-nowrap">{op.reference}</td>
                      <td className="px-4 py-3.5 text-sm text-text-primary max-w-50 truncate">{op.hs_code || "N/A"}</td>
                      <td className="px-4 py-3.5 text-sm text-text-secondary">{op.cif_value ? parseFloat(op.cif_value).toLocaleString("fr-FR") + " FCFA" : "N/A"}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-text-primary whitespace-nowrap">{op.total_to_pay ? parseFloat(op.total_to_pay).toLocaleString("fr-FR") + " FCFA" : "N/A"}</td>
                      <td className="px-4 py-3.5 text-sm text-text-secondary whitespace-nowrap">{new Date(op.created_at).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={op.status === "COMPLETED" ? "terminee" : op.status === "FAILED" ? "erreur" : "simulee"} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-surface-hover">
                          <MoreHorizontal className="h-4 w-4 text-text-muted" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-text-muted">{filtered.length} opérations</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Précédent</Button>
            <Button variant="outline" size="sm">Suivant</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
