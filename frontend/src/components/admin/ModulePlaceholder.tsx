"use client"

import React from "react"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
}

export function ModulePlaceholder({ title, description, icon: Icon, badgeText = "Bientôt disponible" }: ModulePlaceholderProps) {
  return (
    <main className="flex-1 p-6 lg:p-10 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-white border border-slate-200 rounded-3xl shadow-xl flex items-center justify-center">
            <Icon className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-full border border-blue-100 mb-6">
            {badgeText}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{title}</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Être notifié de l'ouverture
          </button>
        </motion.div>
        
      </div>
    </main>
  )
}
