import { Sidebar } from "@/components/sidebar"
import { PredictionInterface } from "@/components/prediction-interface"

export default function PrediccionesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <PredictionInterface />
      </main>
    </div>
  )
}
