"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="mb-8"
        >
          <div className="text-9xl font-extrabold text-primary-100 select-none leading-none">
            404
          </div>
          <div className="relative -mt-8">
            <div className="h-16 w-16 bg-primary-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-2xl font-bold text-text-primary">
            Oups, cette page n'existe pas.
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé.
            Retournez sur votre tableau de bord pour continuer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" /> Page précédente
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Home className="h-4 w-4" /> Retour au dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
