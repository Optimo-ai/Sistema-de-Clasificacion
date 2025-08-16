import { Sidebar } from "@/components/sidebar"
import { DataAnalysis } from "@/components/data-analysis"

export default function DatosPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <DataAnalysis />
      </main>
    </div>
  )
}
