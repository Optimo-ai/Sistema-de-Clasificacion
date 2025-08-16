"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, Database, Brain, FileText, Settings, Upload, Target } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigationItems = [
  { icon: BarChart3, label: "Panel Principal", href: "/" },
  { icon: Database, label: "Datos y EDA", href: "/datos" },
  { icon: Brain, label: "Modelos ML", href: "/modelos" },
  { icon: Target, label: "Predicciones", href: "/predicciones" },
  { icon: FileText, label: "Reportes", href: "/reportes" },
  { icon: Upload, label: "Cargar Datos", href: "/upload" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-4">
      <div className="mb-8">
        <h1 className="text-xl font-serif font-bold text-sidebar-foreground mb-2">Sistema de Análisis ML</h1>
        <p className="text-sm text-muted-foreground">Clasificación de Datos Bancarios</p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 text-left"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <Card className="mt-8 p-4 bg-sidebar-primary">
        <h3 className="font-serif font-semibold mb-2 text-sm">Estado del Sistema</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dataset:</span>
            <span className="text-accent">Cargado</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Modelos:</span>
            <span className="text-muted-foreground">0/6</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mejor Modelo:</span>
            <span className="text-muted-foreground">N/A</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
