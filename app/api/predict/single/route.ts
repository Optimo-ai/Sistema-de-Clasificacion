import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { features, modelId } = await request.json()

    // Simulate single prediction
    await new Promise((resolve) => setTimeout(resolve, 500))

    const prediction = Math.random() > 0.5 ? "yes" : "no"
    const probabilityYes = Math.random()
    const probabilityNo = 1 - probabilityYes

    return NextResponse.json({
      success: true,
      prediction,
      probabilities: {
        yes: probabilityYes,
        no: probabilityNo,
      },
      confidence: Math.max(probabilityYes, probabilityNo),
      model_used: modelId,
      features_used: Object.keys(features).length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error en predicción individual" }, { status: 500 })
  }
}
