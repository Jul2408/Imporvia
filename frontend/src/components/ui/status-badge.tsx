import * as React from "react"
import { Badge } from "./badge"

export type OperationStatus =
  | "brouillon"
  | "en_preparation"
  | "simulee"
  | "a_verifier"
  | "validee"
  | "terminee"
  | "archivee"
  | "erreur"

const statusConfig: Record<OperationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  brouillon: { label: "Brouillon", variant: "outline" },
  en_preparation: { label: "En préparation", variant: "secondary" },
  simulee: { label: "Simulée", variant: "info" },
  a_verifier: { label: "À vérifier", variant: "warning" },
  validee: { label: "Validée", variant: "success" },
  terminee: { label: "Terminée", variant: "success" },
  archivee: { label: "Archivée", variant: "outline" },
  erreur: { label: "Erreur", variant: "destructive" },
}

export function StatusBadge({ status }: { status: OperationStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
