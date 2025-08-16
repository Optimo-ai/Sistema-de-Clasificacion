import { Sidebar } from "@/components/sidebar"
import { ReportsSystem } from "@/components/reports-system"

export default function ReportesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ReportsSystem />
      </main>
    </div>
  )
}
