import { type NextRequest, NextResponse } from "next/server"

const algorithms = [
  {
    name: "K-Nearest Neighbors",
    abbr: "KNN",
    hyperparameters: { n_neighbors: 5, weights: "uniform", metric: "minkowski" },
  },
  {
    name: "Random Forest",
    abbr: "RF",
    hyperparameters: { n_estimators: 100, max_depth: 10, min_samples_split: 2 },
  },
  {
    name: "Naive Bayes",
    abbr: "NB",
    hyperparameters: { var_smoothing: 1e-9 },
  },
  {
    name: "Support Vector Machine",
    abbr: "SVM",
    hyperparameters: { C: 1.0, kernel: "rbf", gamma: "scale" },
  },
  {
    name: "Multi-Layer Perceptron",
    abbr: "MLP",
    hyperparameters: { hidden_layer_sizes: [100], activation: "relu", solver: "adam" },
  },
  {
    name: "Gaussian Process Classifier",
    abbr: "GPC",
    hyperparameters: { kernel: "RBF", optimizer: "fmin_l_bfgs_b" },
  },
]

function generateMockMetrics(algorithmName: string) {
  // Generate realistic but mock metrics
  const baseAccuracy = 0.85 + Math.random() * 0.1
  const precision = baseAccuracy + (Math.random() - 0.5) * 0.05
  const recall = baseAccuracy + (Math.random() - 0.5) * 0.05
  const f1 = (2 * (precision * recall)) / (precision + recall)
  const rocAuc = baseAccuracy + Math.random() * 0.05
  const prAuc = rocAuc - 0.1 + Math.random() * 0.05

  return {
    accuracy: Math.min(0.95, Math.max(0.75, baseAccuracy)),
    precision: Math.min(0.95, Math.max(0.7, precision)),
    recall: Math.min(0.95, Math.max(0.7, recall)),
    f1_score: Math.min(0.95, Math.max(0.7, f1)),
    roc_auc: Math.min(0.95, Math.max(0.75, rocAuc)),
    pr_auc: Math.min(0.9, Math.max(0.65, prAuc)),
    training_time: Math.random() * 30 + 5, // 5-35 seconds
    model_size: Math.random() * 50 + 10, // 10-60 MB
  }
}

export async function POST(request: NextRequest) {
  try {
    const { algorithms: selectedAlgorithms, hyperparameter_search = true } = await request.json()

    const results = []

    for (const algoName of selectedAlgorithms || algorithms.map((a) => a.abbr)) {
      // Simulate training time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const algorithm = algorithms.find((a) => a.abbr === algoName)
      if (!algorithm) continue

      const metrics = generateMockMetrics(algorithm.name)

      results.push({
        algorithm: algorithm.name,
        abbreviation: algorithm.abbr,
        hyperparameters: algorithm.hyperparameters,
        metrics,
        confusion_matrix: [
          [7234, 456],
          [234, 914],
        ],
        feature_importance:
          algorithm.abbr === "RF"
            ? {
                duration: 0.25,
                euribor3m: 0.18,
                nr_employed: 0.15,
                emp_var_rate: 0.12,
                cons_price_idx: 0.1,
                age: 0.08,
                campaign: 0.07,
                pdays: 0.05,
              }
            : null,
        training_completed: true,
        timestamp: new Date().toISOString(),
      })
    }

    // Sort by F1 score to determine best model
    results.sort((a, b) => b.metrics.f1_score - a.metrics.f1_score)

    return NextResponse.json({
      success: true,
      results,
      best_model: results[0]?.abbreviation,
      total_trained: results.length,
      hyperparameter_search_enabled: hyperparameter_search,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error en entrenamiento" }, { status: 500 })
  }
}
