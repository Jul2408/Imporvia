"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calculator, CheckSquare, FileText, Download } from "lucide-react"

export interface TimelineItem {
  id: string
  time: string
  title: string
  description?: string
  type: "simulation" | "verification" | "report" | "default"
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  const getIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "simulation": return <Calculator className="h-4 w-4" />
      case "verification": return <CheckSquare className="h-4 w-4" />
      case "report": return <Download className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getColor = (type: TimelineItem["type"]) => {
    switch (type) {
      case "simulation": return "bg-blue-100 text-blue-600 ring-blue-50"
      case "verification": return "bg-emerald-100 text-emerald-600 ring-emerald-50"
      case "report": return "bg-purple-100 text-purple-600 ring-purple-50"
      default: return "bg-slate-100 text-slate-600 ring-slate-50"
    }
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {items.map((item, itemIdx) => (
          <motion.li 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: itemIdx * 0.1, duration: 0.3 }}
          >
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ${getColor(item.type)}`}>
                    {getIcon(item.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-text-primary font-medium">
                      {item.title}{' '}
                      {item.description && (
                        <span className="font-normal text-text-muted">{item.description}</span>
                      )}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-text-muted">
                    <time dateTime={item.time}>{item.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
