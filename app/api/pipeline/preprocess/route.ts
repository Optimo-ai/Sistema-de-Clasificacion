import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate preprocessing steps
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const preprocessingResult = {
      success: true,
      steps_completed: [
        "Limpieza de valores nulos",
        "Codificación de variables categóricas",
        "Escalado de variables numéricas",
        "Detección de outliers",
      ],
      statistics: {
        missing_values_handled: 0,
        categorical_encoded: 10,
        numerical_scaled: 10,
        outliers_detected: 127,
      },
      encoded_features: {
        job: [
          "admin.",
          "blue-collar",
          "entrepreneur",
          "housemaid",
          "management",
          "retired",
          "self-employed",
          "services",
          "student",
          "technician",
          "unemployed",
          "unknown",
        ],
        marital: ["divorced", "married", "single", "unknown"],
        education: [
          "basic.4y",
          "basic.6y",
          "basic.9y",
          "high.school",
          "illiterate",
          "professional.course",
          "university.degree",
          "unknown",
        ],
      },
    }

    return NextResponse.json(preprocessingResult)
  } catch (error) {
    return NextResponse.json({ error: "Error en preprocesamiento" }, { status: 500 })
  }
}
