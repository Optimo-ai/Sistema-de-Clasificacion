import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { test_size = 0.2, random_state = 42, stratify = true } = await request.json()

    // Simulate train/test split
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const totalRows = 41188
    const trainSize = Math.floor(totalRows * (1 - test_size))
    const testSize = totalRows - trainSize

    const splitResult = {
      success: true,
      train_size: trainSize,
      test_size: testSize,
      test_ratio: test_size,
      stratified: stratify,
      class_distribution: {
        train: { yes: Math.floor(trainSize * 0.112), no: Math.floor(trainSize * 0.888) },
        test: { yes: Math.floor(testSize * 0.112), no: Math.floor(testSize * 0.888) },
      },
    }

    return NextResponse.json(splitResult)
  } catch (error) {
    return NextResponse.json({ error: "Error en división de datos" }, { status: 500 })
  }
}
