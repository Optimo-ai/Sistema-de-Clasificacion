export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  roc_auc: number
  pr_auc: number
  training_time: number
  model_size: number
}

export interface TrainedModel {
  algorithm: string
  abbreviation: string
  hyperparameters: Record<string, any>
  metrics: ModelMetrics
  confusion_matrix: number[][]
  feature_importance?: Record<string, number>
  training_completed: boolean
  timestamp: string
  id?: string
  version?: number
  status?: string
}

export interface PredictionResult {
  prediction: string
  probabilities: {
    yes: number
    no: number
  }
  confidence: number
  model_used: string
}

export interface DatasetInfo {
  filename: string
  size: number
  rows: number
  columns: number
  schema: Record<string, string>
  preview: Record<string, any>[]
}

export const formatMetric = (value: number, decimals = 3): string => {
  return value.toFixed(decimals)
}

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`
}

export const formatSize = (mb: number): string => {
  if (mb < 1) {
    return `${(mb * 1024).toFixed(0)} KB`
  }
  return `${mb.toFixed(1)} MB`
}

export const getModelColor = (abbreviation: string): string => {
  const colors: Record<string, string> = {
    KNN: "bg-blue-500",
    RF: "bg-green-500",
    NB: "bg-yellow-500",
    SVM: "bg-purple-500",
    MLP: "bg-red-500",
    GPC: "bg-indigo-500",
  }
  return colors[abbreviation] || "bg-gray-500"
}
