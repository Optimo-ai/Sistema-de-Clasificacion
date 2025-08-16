import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock EDA statistics
    const edaReport = {
      dataset_info: {
        total_rows: 41188,
        total_columns: 21,
        missing_values: 0,
        duplicate_rows: 12,
      },
      target_distribution: {
        yes: 4640,
        no: 36548,
        balance_ratio: 0.112,
      },
      numerical_stats: {
        age: { mean: 40.02, std: 10.42, min: 17, max: 98 },
        duration: { mean: 258.29, std: 259.28, min: 0, max: 4918 },
        campaign: { mean: 2.57, std: 2.77, min: 1, max: 56 },
        pdays: { mean: 962.48, std: 186.91, min: 0, max: 999 },
      },
      categorical_stats: {
        job: {
          "admin.": 10422,
          "blue-collar": 9254,
          technician: 6743,
          services: 3969,
          management: 2924,
        },
        education: {
          "university.degree": 12168,
          "high.school": 9515,
          "basic.9y": 6045,
          "professional.course": 5243,
        },
      },
      correlations: {
        age_duration: 0.003,
        campaign_pdays: -0.075,
        emp_var_rate_euribor3m: 0.973,
        cons_price_idx_cons_conf_idx: -0.138,
      },
    }

    return NextResponse.json(edaReport)
  } catch (error) {
    return NextResponse.json({ error: "Error generando EDA" }, { status: 500 })
  }
}
