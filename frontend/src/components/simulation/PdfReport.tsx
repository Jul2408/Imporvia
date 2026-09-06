"use client"

import React from "react"
import { ShieldCheck, FileText, Building2, Calendar, Hash, Calculator } from "lucide-react"

interface PdfReportProps {
  simulationData: {
    reference?: string
    merchandise?: string
    hs_code?: string
    origin?: string
    fob_value?: number | string
    freight?: number | string
    insurance?: number | string
    cif_value?: number | string
    total_taxes?: number | string
    total_to_pay?: number | string
    currency?: string
    company_name?: string
    tax_id?: string
    breakdown?: Array<{
      tax_code: string
      tax_name: string
      rate?: string
      amount: number | string
      formula_used?: string
    }>
    created_at?: string
  }
  onClose?: () => void
}

export function PdfReport({ simulationData, onClose }: PdfReportProps) {
  const handlePrint = () => {
    window.print()
  }

  const dateStr = simulationData.created_at
    ? new Date(simulationData.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })

  const formattedCif = parseFloat(String(simulationData.cif_value || 0)).toLocaleString("fr-FR")
  const formattedTaxes = parseFloat(String(simulationData.total_taxes || 0)).toLocaleString("fr-FR")
  const formattedTotal = parseFloat(String(simulationData.total_to_pay || 0)).toLocaleString("fr-FR")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block">
      {/* Container Card */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 print:shadow-none print:border-none print:w-full print:max-w-none print:m-0">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Aperçu du Rapport PDF Officiel</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              🖨️ Télécharger / Imprimer (PDF)
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                Fermer
              </button>
            )}
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="pdf-report-content" className="p-8 sm:p-12 font-sans bg-white text-slate-800 space-y-8 print:p-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  IV
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">IMPORVIA</h1>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Système Officiel d&apos;Estimation Douanière 2026
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Conforme au Tarif Extérieur Commun (TEC CEMAC) &amp; Loi de Finances 2026
              </p>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 font-mono mb-1">
                <Hash className="w-3.5 h-3.5 text-blue-600" />
                <span>RÉF : {simulationData.reference || "SIM-2026-8841"}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{dateStr}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Règles 2026 Certifiées</span>
              </div>
            </div>
          </div>

          {/* Company & Importer Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Entreprise / Importateur
              </h3>
              <p className="font-extrabold text-slate-900 text-base">
                {simulationData.company_name || "ImporVia SARL"}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                NIU / Tax ID : <span className="font-mono font-bold text-slate-800">{simulationData.tax_id || "M0123456789A"}</span>
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" /> Paramètres d&apos;Expédition
              </h3>
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Marchandise :</span> {simulationData.merchandise || "Téléphones portables & Accessoires"}
              </p>
              <p className="text-xs text-slate-700 mt-1">
                <span className="font-semibold text-slate-900">Code SH :</span> <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{simulationData.hs_code || "8517.12.00"}</span>
              </p>
              <p className="text-xs text-slate-700 mt-1">
                <span className="font-semibold text-slate-900">Pays d&apos;Origine :</span> {simulationData.origin || "Chine"}
              </p>
            </div>
          </div>

          {/* Table 1: Base Valuation (FOB / Freight / Insurance / CIF) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
              1. Détermination de la Valeur en Douane (CIF)
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Élément de valeur</th>
                    <th className="py-3 px-4">Description légale</th>
                    <th className="py-3 px-4 text-right">Montant (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">Valeur FOB</td>
                    <td className="py-2.5 px-4 text-slate-500">Prix d&apos;achat marchandise (Facture Commerciale)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">{parseFloat(String(simulationData.fob_value || 0)).toLocaleString("fr-FR")}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">Fret international</td>
                    <td className="py-2.5 px-4 text-slate-500">Frais de transport principal (BL / LTA)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">{parseFloat(String(simulationData.freight || 0)).toLocaleString("fr-FR")}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">Assurance transport</td>
                    <td className="py-2.5 px-4 text-slate-500">Couverture des risques de transport</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">{parseFloat(String(simulationData.insurance || 0)).toLocaleString("fr-FR")}</td>
                  </tr>
                  <tr className="bg-blue-50/70 font-extrabold text-blue-900">
                    <td className="py-3 px-4">VALEUR CIF TOTALE</td>
                    <td className="py-3 px-4 text-blue-700">Assiette de base pour le calcul douanier</td>
                    <td className="py-3 px-4 text-right font-mono text-sm">{formattedCif} FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Itemized Tax Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
              2. Décompte des Droits &amp; Taxes Douaniers (LF 2026)
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code Taxe</th>
                    <th className="py-3 px-4">Intitulé de la Taxe</th>
                    <th className="py-3 px-4">Taux / Formule Légale</th>
                    <th className="py-3 px-4 text-right">Montant Exigible (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {(simulationData.breakdown && simulationData.breakdown.length > 0) ? (
                    simulationData.breakdown.map(item => (
                      <tr key={item.tax_code} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold font-mono text-blue-700">{item.tax_code}</td>
                        <td className="py-3 px-4 font-semibold">{item.tax_name}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{item.rate ? `${(parseFloat(item.rate) * 100).toFixed(2)}%` : item.formula_used || "Taux fixe"}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {parseFloat(String(item.amount)).toLocaleString("fr-FR")} FCFA
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td className="py-2.5 px-4 font-bold font-mono text-blue-700">DD</td>
                        <td className="py-2.5 px-4 font-semibold">Droit de Douane (Catégorie IV)</td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono">30.00% × CIF</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold">1 500 000 FCFA</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold font-mono text-blue-700">CCI</td>
                        <td className="py-2.5 px-4 font-semibold">Contribution Communautaire d&apos;Intégration</td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono">1.00% × CIF</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold">50 000 FCFA</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold font-mono text-blue-700">RDI</td>
                        <td className="py-2.5 px-4 font-semibold">Redevance Informatique</td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono">0.45% × CIF</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold">22 500 FCFA</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold font-mono text-blue-700">TVA</td>
                        <td className="py-2.5 px-4 font-semibold">Taxe sur la Valeur Ajoutée</td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono">19.25% × (CIF + DD + CCI + RDI)</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold">1 265 213 FCFA</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand Totals Box */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Total Droits &amp; Taxes Douaniers</p>
              <p className="text-2xl font-black text-blue-400 mt-0.5">{formattedTaxes} FCFA</p>
            </div>
            <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              <p className="text-xs uppercase font-bold tracking-widest text-emerald-400">Total Général à Décaisser (CIF + Taxes)</p>
              <p className="text-3xl font-black text-white mt-0.5">{formattedTotal} FCFA</p>
            </div>
          </div>

          {/* Footer & Certification Stamp */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Avis Réglementaire :</p>
              <p className="max-w-xl text-[11px] leading-relaxed text-slate-500">
                Ce rapport de simulation est généré automatiquement par le système intelligent IMPORVIA sur la base du Tarif Extérieur Commun (TEC CEMAC 5ème éd.) et des dispositions de la Loi de Finances 2026. Seul l&apos;Acte d&apos;Inspection de la Direction Générale des Douanes fait foi lors de la liquidation officielle.
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="w-24 h-24 border-2 border-dashed border-blue-600 rounded-full flex flex-col items-center justify-center p-2 text-center mx-auto sm:ml-auto">
                <ShieldCheck className="w-6 h-6 text-blue-600 mb-0.5" />
                <span className="text-[9px] font-black text-blue-900 uppercase">IMPORVIA</span>
                <span className="text-[8px] text-blue-600 font-mono">CERTIFIÉ 2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
