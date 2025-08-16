import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de archivo no válido" }, { status: 400 })
    }

    // Simulate file processing
    const mockResponse = {
      success: true,
      filename: file.name,
      size: file.size,
      rows: 41188,
      columns: 21,
      schema: {
        age: "numeric",
        job: "categorical",
        marital: "categorical",
        education: "categorical",
        default: "categorical",
        housing: "categorical",
        loan: "categorical",
        contact: "categorical",
        month: "categorical",
        day_of_week: "categorical",
        duration: "numeric",
        campaign: "numeric",
        pdays: "numeric",
        previous: "numeric",
        poutcome: "categorical",
        emp_var_rate: "numeric",
        cons_price_idx: "numeric",
        cons_conf_idx: "numeric",
        euribor3m: "numeric",
        nr_employed: "numeric",
        y: "target",
      },
      preview: [
        {
          age: 56,
          job: "housemaid",
          marital: "married",
          education: "basic.4y",
          default: "no",
          housing: "no",
          loan: "no",
          y: "no",
        },
        {
          age: 57,
          job: "services",
          marital: "married",
          education: "high.school",
          default: "unknown",
          housing: "no",
          loan: "no",
          y: "no",
        },
        {
          age: 37,
          job: "services",
          marital: "married",
          education: "high.school",
          default: "no",
          housing: "yes",
          loan: "no",
          y: "no",
        },
        {
          age: 40,
          job: "admin.",
          marital: "married",
          education: "basic.6y",
          default: "no",
          housing: "no",
          loan: "no",
          y: "no",
        },
        {
          age: 56,
          job: "services",
          marital: "married",
          education: "high.school",
          default: "no",
          housing: "no",
          loan: "yes",
          y: "no",
        },
      ],
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json({ error: "Error procesando archivo" }, { status: 500 })
  }
}
