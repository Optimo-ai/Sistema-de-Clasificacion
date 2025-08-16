import { DataUpload } from "@/components/data-upload"
import { Sidebar } from "@/components/sidebar"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <DataUpload />
      </main>
    </div>
  )
}
