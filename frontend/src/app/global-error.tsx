"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { RefreshCcw, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
          <div className="text-center max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="h-20 w-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Une erreur est survenue.</h1>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Une erreur inattendue s'est produite. Notre équipe a été notifiée. Vous pouvez réessayer ou retourner au tableau de bord.
              </p>
              {error?.digest && (
                <p className="text-xs text-slate-400 mt-2">Code : {error.digest}</p>
              )}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={reset}>
                <RefreshCcw className="h-4 w-4" /> Réessayer
              </Button>
              <Link href="/dashboard">
                <Button className="gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <Home className="h-4 w-4" /> Retour au dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
