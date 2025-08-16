import { type NextRequest, NextResponse } from "next/server"

// Mock model storage
const modelStorage: any[] = []

export async function GET() {
  try {
    return NextResponse.json({
      models: modelStorage,
      count: modelStorage.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo modelos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const model = await request.json()

    // Add version and ID
    const newModel = {
      ...model,
      id: `model_${Date.now()}`,
      version: modelStorage.length + 1,
      created_at: new Date().toISOString(),
      status: "trained",
    }

    modelStorage.push(newModel)

    return NextResponse.json({
      success: true,
      model: newModel,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error guardando modelo" }, { status: 500 })
  }
}
