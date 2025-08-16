import { Sidebar } from "@/components/sidebar"
import { ModelTraining } from "@/components/model-training"

export default function ModelosPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ModelTraining />
      </main>
    </div>
  )
}
