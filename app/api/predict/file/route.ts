import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const modelId = formData.get("modelId") as string

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 })
    }

    // Simulate batch prediction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock predictions
    const numRows = Math.floor(Math.random() * 1000) + 100
    const predictions = Array.from({ length: numRows }, (_, i) => ({
      row_id: i + 1,
      prediction: Math.random() > 0.5 ? "yes" : "no",
      probability_yes: Math.random(),
      probability_no: Math.random(),
    }))

    const summary = {
      total_predictions: numRows,
      predicted_yes: predictions.filter((p) => p.prediction === "yes").length,
      predicted_no: predictions.filter((p) => p.prediction === "no").length,
      avg_confidence: predictions.reduce((sum, p) => sum + Math.max(p.probability_yes, p.probability_no), 0) / numRows,
    }

    return NextResponse.json({
      success: true,
      predictions,
      summary,
      model_used: modelId,
      processing_time: 2.5,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error en predicción batch" }, { status: 500 })
  }
}
