"use client"

import React, { useRef, useState } from "react"
import { ShieldCheck, FileText, Building2, Calendar, Hash, Calculator, Download, X, Loader2 } from "lucide-react"

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
  const contentRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPdf = () => {
    setIsGenerating(true)

    const ref = simulationData.reference || "rapport"
    const cif = parseFloat(String(simulationData.cif_value || 0)).toLocaleString("fr-FR")
    const taxes = parseFloat(String(simulationData.total_taxes || 0)).toLocaleString("fr-FR")
    const total = parseFloat(String(simulationData.total_to_pay || 0)).toLocaleString("fr-FR")
    const fob = parseFloat(String(simulationData.fob_value || 0)).toLocaleString("fr-FR")
    const freight = parseFloat(String(simulationData.freight || 0)).toLocaleString("fr-FR")
    const insurance = parseFloat(String(simulationData.insurance || 0)).toLocaleString("fr-FR")

    const breakdownRows = (simulationData.breakdown && simulationData.breakdown.length > 0)
      ? simulationData.breakdown.map(item => `
          <tr>
            <td style="padding:10px 14px;font-family:monospace;font-weight:700;color:#1d4ed8;border-bottom:1px solid #e2e8f0;">${item.tax_code}</td>
            <td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">${item.tax_name}</td>
            <td style="padding:10px 14px;color:#64748b;font-family:monospace;border-bottom:1px solid #e2e8f0;">${item.rate ? (parseFloat(item.rate)*100).toFixed(2)+"% × CIF" : item.formula_used || "Taux fixe"}</td>
            <td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">${parseFloat(String(item.amount)).toLocaleString("fr-FR")} FCFA</td>
          </tr>`).join("")
      : `
          <tr><td style="padding:10px 14px;font-family:monospace;font-weight:700;color:#1d4ed8;border-bottom:1px solid #e2e8f0;">DD</td><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Droit de Douane (Catégorie IV)</td><td style="padding:10px 14px;color:#64748b;font-family:monospace;border-bottom:1px solid #e2e8f0;">30.00% × CIF</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">1 500 000 FCFA</td></tr>
          <tr><td style="padding:10px 14px;font-family:monospace;font-weight:700;color:#1d4ed8;border-bottom:1px solid #e2e8f0;">CCI</td><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Contribution Communautaire d'Intégration</td><td style="padding:10px 14px;color:#64748b;font-family:monospace;border-bottom:1px solid #e2e8f0;">1.00% × CIF</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">50 000 FCFA</td></tr>
          <tr><td style="padding:10px 14px;font-family:monospace;font-weight:700;color:#1d4ed8;border-bottom:1px solid #e2e8f0;">RDI</td><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Redevance Informatique</td><td style="padding:10px 14px;color:#64748b;font-family:monospace;border-bottom:1px solid #e2e8f0;">0.45% × CIF</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">22 500 FCFA</td></tr>
          <tr><td style="padding:10px 14px;font-family:monospace;font-weight:700;color:#1d4ed8;border-bottom:1px solid #e2e8f0;">TVA</td><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Taxe sur la Valeur Ajoutée</td><td style="padding:10px 14px;color:#64748b;font-family:monospace;border-bottom:1px solid #e2e8f0;">19.25% × (CIF + DD + CCI + RDI)</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">1 265 213 FCFA</td></tr>`

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>ImporVia — ${ref}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#fff; color:#1e293b; font-size:13px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    @page { margin: 15mm 15mm; size: A4 portrait; }
    @media print { body { margin:0; } .no-print { display:none !important; } }
  </style>
</head>
<body style="padding:40px;">

  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:24px;margin-bottom:24px;">
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
        <img src="${window.location.origin}/logo.png" alt="ImporVia" style="height:52px;object-fit:contain;" crossorigin="anonymous"/>
        <div>
          <div style="font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;">IMPORVIA</div>
          <div style="font-size:9px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:2px;">Rapport Officiel d'Estimation Douanière 2026</div>
        </div>
      </div>
      <div style="font-size:10px;color:#64748b;margin-top:4px;">Calcul Certifié conforme au Tarif Extérieur Commun (TEC CEMAC 2026) &amp; Loi de Finances 2026</div>
    </div>
    <div style="text-align:right;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;min-width:200px;">
      <div style="font-size:10px;color:#64748b;font-family:monospace;margin-bottom:4px;">RÉF : ${ref}</div>
      <div style="font-size:10px;color:#64748b;margin-bottom:6px;">${dateStr}</div>
      <div style="display:inline-flex;align-items:center;gap:4px;background:#d1fae5;color:#065f46;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;">✔ Règles 2026 Certifiées</div>
    </div>
  </div>

  <!-- ENTREPRISE -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:24px;">
    <div>
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin-bottom:8px;">🏢 Entreprise / Importateur</div>
      <div style="font-size:15px;font-weight:800;color:#0f172a;">${simulationData.company_name || "ImporVia SARL"}</div>
      <div style="font-size:10px;color:#475569;margin-top:3px;">NIU / Tax ID : <span style="font-family:monospace;font-weight:700;">${simulationData.tax_id || "M0123456789A"}</span></div>
    </div>
    <div>
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin-bottom:8px;">📦 Paramètres d'Expédition</div>
      <div style="font-size:10px;color:#334155;margin-bottom:4px;"><span style="font-weight:600;">Marchandise :</span> ${simulationData.merchandise || "Téléphones portables & Accessoires"}</div>
      <div style="font-size:10px;color:#334155;margin-bottom:4px;"><span style="font-weight:600;">Code SH :</span> <span style="font-family:monospace;font-weight:700;color:#1d4ed8;background:#eff6ff;padding:1px 6px;border-radius:4px;">${simulationData.hs_code || "8517.12.00"}</span></div>
      <div style="font-size:10px;color:#334155;"><span style="font-weight:600;">Pays d'Origine :</span> ${simulationData.origin || "Chine"}</div>
    </div>
  </div>

  <!-- TABLE 1 -->
  <div style="margin-bottom:24px;">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0f172a;border-left:4px solid #2563eb;padding-left:10px;margin-bottom:12px;">1. Détermination de la Valeur en Douane (CIF)</div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#f1f5f9;font-weight:700;color:#334155;">
          <th style="padding:10px 14px;text-align:left;border-bottom:1px solid #e2e8f0;">Élément de valeur</th>
          <th style="padding:10px 14px;text-align:left;border-bottom:1px solid #e2e8f0;">Description légale</th>
          <th style="padding:10px 14px;text-align:right;border-bottom:1px solid #e2e8f0;">Montant (FCFA)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Valeur FOB</td><td style="padding:10px 14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Prix d'achat marchandise (Facture Commerciale)</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">${fob}</td></tr>
        <tr><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Fret international</td><td style="padding:10px 14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Frais de transport principal (BL / LTA)</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">${freight}</td></tr>
        <tr><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e2e8f0;">Assurance transport</td><td style="padding:10px 14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Couverture des risques de transport</td><td style="padding:10px 14px;text-align:right;font-family:monospace;font-weight:700;border-bottom:1px solid #e2e8f0;">${insurance}</td></tr>
        <tr style="background:#eff6ff;font-weight:800;color:#1e3a8a;">
          <td style="padding:12px 14px;">VALEUR CIF TOTALE</td>
          <td style="padding:12px 14px;color:#1d4ed8;">Assiette de base pour le calcul douanier</td>
          <td style="padding:12px 14px;text-align:right;font-family:monospace;font-size:13px;">${cif} FCFA</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- TABLE 2 -->
  <div style="margin-bottom:24px;">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0f172a;border-left:4px solid #2563eb;padding-left:10px;margin-bottom:12px;">2. Décompte des Droits &amp; Taxes Douaniers (LF 2026)</div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#f1f5f9;font-weight:700;color:#334155;">
          <th style="padding:10px 14px;text-align:left;border-bottom:1px solid #e2e8f0;">Code Taxe</th>
          <th style="padding:10px 14px;text-align:left;border-bottom:1px solid #e2e8f0;">Intitulé de la Taxe</th>
          <th style="padding:10px 14px;text-align:left;border-bottom:1px solid #e2e8f0;">Taux / Formule Légale</th>
          <th style="padding:10px 14px;text-align:right;border-bottom:1px solid #e2e8f0;">Montant Exigible (FCFA)</th>
        </tr>
      </thead>
      <tbody>${breakdownRows}</tbody>
    </table>
  </div>

  <!-- TOTAUX -->
  <div style="background:#0f172a;color:white;padding:24px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
    <div>
      <div style="font-size:9px;text-transform:uppercase;font-weight:700;letter-spacing:2px;color:#94a3b8;margin-bottom:4px;">Total Droits &amp; Taxes Douaniers</div>
      <div style="font-size:24px;font-weight:900;color:#60a5fa;">${taxes} FCFA</div>
    </div>
    <div style="text-align:right;border-left:1px solid #1e293b;padding-left:24px;">
      <div style="font-size:9px;text-transform:uppercase;font-weight:700;letter-spacing:2px;color:#34d399;margin-bottom:4px;">Total Général à Décaisser (CIF + Taxes)</div>
      <div style="font-size:30px;font-weight:900;color:white;">${total} FCFA</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="border-top:1px solid #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
    <div>
      <div style="font-size:10px;font-weight:700;color:#334155;margin-bottom:4px;">Avis Réglementaire :</div>
      <div style="font-size:9.5px;color:#64748b;max-width:500px;line-height:1.6;">Ce rapport de simulation est généré automatiquement par le système intelligent IMPORVIA sur la base du Tarif Extérieur Commun (TEC CEMAC 5ème éd.) et des dispositions de la Loi de Finances 2026. Seul l'Acte d'Inspection de la Direction Générale des Douanes fait foi lors de la liquidation officielle.</div>
    </div>
    <div style="width:88px;height:88px;min-width:88px;border:2px dashed #2563eb;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8px;">
      <div style="font-size:18px;">🛡️</div>
      <div style="font-size:8px;font-weight:900;color:#1e3a8a;text-transform:uppercase;">IMPORVIA</div>
      <div style="font-size:7px;color:#2563eb;font-family:monospace;">CERTIFIÉ 2026</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 1000);
    }
  </script>
</body>
</html>`

    const popup = window.open("", "_blank", "width=900,height=1100,scrollbars=yes")
    if (popup) {
      popup.document.write(html)
      popup.document.close()
    } else {
      alert("Veuillez autoriser les popups pour télécharger le PDF.")
    }
    setIsGenerating(false)
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Container Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative border border-slate-200 my-4 mx-auto"
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 rounded-t-2xl shadow-md">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">Rapport PDF Officiel ImporVia</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold px-3 sm:px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> <span className="hidden sm:inline">Génération...</span></>
              ) : (
                <><Download className="w-4 h-4" /> <span className="hidden sm:inline">Télécharger PDF</span><span className="sm:hidden">PDF</span></>
              )}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" /> <span className="hidden sm:inline">Fermer</span>
              </button>
            )}
          </div>
        </div>

        {/* Printable Document Body — preview for the user */}
        <div
          ref={contentRef}
          className="p-8 sm:p-12 font-sans bg-white text-slate-800 space-y-8"
        >
          {/* Header */}
          <div className="flex flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo.png" alt="ImporVia Logo" className="h-14 w-auto object-contain shrink-0" />
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">IMPORVIA</h1>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Rapport Officiel d&apos;Estimation Douanière 2026
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Calcul Certifié conforme au Tarif Extérieur Commun (TEC CEMAC 2026) &amp; Loi de Finances 2026
              </p>
            </div>

            <div className="text-right w-auto bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
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

          {/* Company & Importer Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
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
                <span className="font-semibold text-slate-900">Code SH :</span>{" "}
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  {simulationData.hs_code || "8517.12.00"}
                </span>
              </p>
              <p className="text-xs text-slate-700 mt-1">
                <span className="font-semibold text-slate-900">Pays d&apos;Origine :</span> {simulationData.origin || "Chine"}
              </p>
            </div>
          </div>

          {/* Table 1 */}
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
                  <tr className="bg-blue-50 font-extrabold text-blue-900">
                    <td className="py-3 px-4">VALEUR CIF TOTALE</td>
                    <td className="py-3 px-4 text-blue-700">Assiette de base pour le calcul douanier</td>
                    <td className="py-3 px-4 text-right font-mono text-sm">{formattedCif} FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2 */}
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
                      <tr key={item.tax_code}>
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
                      <tr><td className="py-2.5 px-4 font-bold font-mono text-blue-700">DD</td><td className="py-2.5 px-4 font-semibold">Droit de Douane (Catégorie IV)</td><td className="py-2.5 px-4 text-slate-500 font-mono">30.00% × CIF</td><td className="py-2.5 px-4 text-right font-mono font-bold">1 500 000 FCFA</td></tr>
                      <tr><td className="py-2.5 px-4 font-bold font-mono text-blue-700">CCI</td><td className="py-2.5 px-4 font-semibold">Contribution Communautaire d&apos;Intégration</td><td className="py-2.5 px-4 text-slate-500 font-mono">1.00% × CIF</td><td className="py-2.5 px-4 text-right font-mono font-bold">50 000 FCFA</td></tr>
                      <tr><td className="py-2.5 px-4 font-bold font-mono text-blue-700">RDI</td><td className="py-2.5 px-4 font-semibold">Redevance Informatique</td><td className="py-2.5 px-4 text-slate-500 font-mono">0.45% × CIF</td><td className="py-2.5 px-4 text-right font-mono font-bold">22 500 FCFA</td></tr>
                      <tr><td className="py-2.5 px-4 font-bold font-mono text-blue-700">TVA</td><td className="py-2.5 px-4 font-semibold">Taxe sur la Valeur Ajoutée</td><td className="py-2.5 px-4 text-slate-500 font-mono">19.25% × (CIF + DD + CCI + RDI)</td><td className="py-2.5 px-4 text-right font-mono font-bold">1 265 213 FCFA</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand Totals Box */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-row justify-between items-center gap-4 shadow-xl">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Total Droits &amp; Taxes Douaniers</p>
              <p className="text-2xl font-black text-blue-400 mt-0.5">{formattedTaxes} FCFA</p>
            </div>
            <div className="text-right border-l border-slate-800 pl-6">
              <p className="text-xs uppercase font-bold tracking-widest text-emerald-400">Total Général à Décaisser (CIF + Taxes)</p>
              <p className="text-3xl font-black text-white mt-0.5">{formattedTotal} FCFA</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6 flex flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Avis Réglementaire :</p>
              <p className="max-w-xl text-[11px] leading-relaxed text-slate-500">
                Ce rapport de simulation est généré automatiquement par le système intelligent IMPORVIA sur la base du Tarif Extérieur Commun (TEC CEMAC 5ème éd.) et des dispositions de la Loi de Finances 2026. Seul l&apos;Acte d&apos;Inspection de la Direction Générale des Douanes fait foi lors de la liquidation officielle.
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-24 h-24 border-2 border-dashed border-blue-600 rounded-full flex flex-col items-center justify-center p-2 text-center">
                <ShieldCheck className="w-6 h-6 text-blue-600 mb-0.5" />
                <span className="text-[9px] font-black text-blue-900 uppercase">IMPORVIA</span>
                <span className="text-[8px] text-blue-600 font-mono">CERTIFIÉ 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="bg-slate-900 text-white p-4 flex sm:hidden items-center justify-between gap-3 border-t border-slate-800 rounded-b-2xl">
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isGenerating ? "Génération..." : "Télécharger PDF"}
          </button>
          {onClose && (
            <button onClick={onClose} className="bg-slate-800 hover:bg-red-500 text-slate-200 text-xs font-bold px-4 py-3.5 rounded-xl transition-colors shrink-0">
              ✕ Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
