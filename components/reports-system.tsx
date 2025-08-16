"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  BookOpen,
  Code,
  PieChart,
  Target,
  Brain,
  CheckCircle,
  Clock,
  Award,
  FileSpreadsheet,
  Presentation,
} from "lucide-react"

interface ReportData {
  title: string
  description: string
  type: "academic" | "executive" | "technical"
  status: "ready" | "generating" | "error"
  lastGenerated: string
  size: string
  format: string[]
}

const availableReports: ReportData[] = [
  {
    title: "Reporte Académico Completo",
    description: "Análisis exhaustivo con metodología, resultados y conclusiones para publicación académica",
    type: "academic",
    status: "ready",
    lastGenerated: "2024-01-15 14:30",
    size: "2.4 MB",
    format: ["PDF", "LaTeX", "Jupyter"],
  },
  {
    title: "Resumen Ejecutivo",
    description: "Síntesis de resultados y recomendaciones para stakeholders y tomadores de decisiones",
    type: "executive",
    status: "ready",
    lastGenerated: "2024-01-15 14:25",
    size: "856 KB",
    format: ["PDF", "PowerPoint"],
  },
  {
    title: "Documentación Técnica",
    description: "Especificaciones técnicas, arquitectura del sistema y guía de implementación",
    type: "technical",
    status: "ready",
    lastGenerated: "2024-01-15 14:20",
    size: "1.8 MB",
    format: ["PDF", "Markdown", "HTML"],
  },
  {
    title: "Análisis Comparativo de Modelos",
    description: "Comparación detallada de rendimiento entre los 6 algoritmos implementados",
    type: "technical",
    status: "ready",
    lastGenerated: "2024-01-15 14:15",
    size: "1.2 MB",
    format: ["PDF", "Excel", "CSV"],
  },
]

const modelMetrics = [
  {
    model: "Random Forest",
    abbr: "RF",
    accuracy: 0.912,
    precision: 0.847,
    recall: 0.723,
    f1: 0.781,
    roc_auc: 0.889,
    training_time: 12.4,
    rank: 1,
  },
  {
    model: "Support Vector Machine",
    abbr: "SVM",
    accuracy: 0.908,
    precision: 0.834,
    recall: 0.718,
    f1: 0.772,
    roc_auc: 0.885,
    training_time: 28.7,
    rank: 2,
  },
  {
    model: "Multi-Layer Perceptron",
    abbr: "MLP",
    accuracy: 0.905,
    precision: 0.829,
    recall: 0.712,
    f1: 0.766,
    roc_auc: 0.881,
    training_time: 45.2,
    rank: 3,
  },
  {
    model: "Gaussian Process",
    abbr: "GPC",
    accuracy: 0.901,
    precision: 0.821,
    recall: 0.705,
    f1: 0.759,
    roc_auc: 0.876,
    training_time: 67.8,
    rank: 4,
  },
  {
    model: "K-Nearest Neighbors",
    abbr: "KNN",
    accuracy: 0.897,
    precision: 0.815,
    recall: 0.698,
    f1: 0.752,
    roc_auc: 0.871,
    training_time: 8.9,
    rank: 5,
  },
  {
    model: "Naive Bayes",
    abbr: "NB",
    accuracy: 0.889,
    precision: 0.802,
    recall: 0.685,
    f1: 0.739,
    roc_auc: 0.863,
    training_time: 3.2,
    rank: 6,
  },
]

export function ReportsSystem() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)

  const handleGenerateReport = async (reportTitle: string) => {
    setGeneratingReport(reportTitle)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setGeneratingReport(null)
  }

  const handleDownloadReport = (report: ReportData, format: string) => {
    // Simulate download
    console.log(`Descargando ${report.title} en formato ${format}`)
  }

  const formatMetric = (value: number, decimals = 3) => value.toFixed(decimals)
  const formatTime = (seconds: number) => `${seconds.toFixed(1)}s`

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Sistema de Reportes</h1>
        <p className="text-muted-foreground">
          Genere reportes académicos, ejecutivos y técnicos del análisis de machine learning
        </p>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reportes Disponibles</TabsTrigger>
          <TabsTrigger value="metrics">Métricas y Resultados</TabsTrigger>
          <TabsTrigger value="notebook">Notebook Jupyter</TabsTrigger>
        </TabsList>

        {/* Available Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableReports.map((report, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {report.type === "academic" && <BookOpen className="h-5 w-5 text-primary" />}
                      {report.type === "executive" && <Presentation className="h-5 w-5 text-accent" />}
                      {report.type === "technical" && <Code className="h-5 w-5 text-muted-foreground" />}
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        report.type === "academic" ? "default" : report.type === "executive" ? "secondary" : "outline"
                      }
                    >
                      {report.type === "academic" ? "Académico" : report.type === "executive" ? "Ejecutivo" : "Técnico"}
                    </Badge>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Estado:</span>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Listo</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tamaño:</span>
                        <div className="mt-1">{report.size}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Última generación:</span>
                        <div className="mt-1">{report.lastGenerated}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Formatos:</span>
                        <div className="flex gap-1 mt-1">
                          {report.format.map((fmt) => (
                            <Badge key={fmt} variant="outline" className="text-xs">
                              {fmt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2 flex-wrap">
                      {report.format.map((format) => (
                        <Button
                          key={format}
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report, format)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          {format}
                        </Button>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleGenerateReport(report.title)}
                      disabled={generatingReport === report.title}
                      className="w-full"
                    >
                      {generatingReport === report.title ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Regenerar Reporte
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>Genere reportes específicos o personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <PieChart className="h-6 w-6" />
                  <span className="text-sm">Reporte de EDA</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Comparación Modelos</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Análisis Predictivo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics and Results */}
        <TabsContent value="metrics" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mejor Modelo</CardTitle>
                <Award className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Random Forest</div>
                <p className="text-xs text-muted-foreground">F1-Score: 0.781</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mejor Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91.2%</div>
                <p className="text-xs text-muted-foreground">Random Forest</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Más Rápido</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2s</div>
                <p className="text-xs text-muted-foreground">Naive Bayes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modelos Evaluados</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">Algoritmos diferentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tabla Comparativa de Métricas
              </CardTitle>
              <CardDescription>Rendimiento detallado de todos los modelos entrenados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead className="text-center">Accuracy</TableHead>
                      <TableHead className="text-center">Precision</TableHead>
                      <TableHead className="text-center">Recall</TableHead>
                      <TableHead className="text-center">F1-Score</TableHead>
                      <TableHead className="text-center">ROC-AUC</TableHead>
                      <TableHead className="text-center">Tiempo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelMetrics.map((model, index) => (
                      <TableRow key={index} className={model.rank === 1 ? "bg-accent/5" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={model.rank === 1 ? "default" : "secondary"}>#{model.rank}</Badge>
                            {model.rank === 1 && <Award className="h-4 w-4 text-accent" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{model.abbr}</div>
                            <div className="text-xs text-muted-foreground">{model.model}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono">{formatMetric(model.accuracy)}</TableCell>
                        <TableCell className="text-center font-mono">{formatMetric(model.precision)}</TableCell>
                        <TableCell className="text-center font-mono">{formatMetric(model.recall)}</TableCell>
                        <TableCell className="text-center font-mono font-medium">{formatMetric(model.f1)}</TableCell>
                        <TableCell className="text-center font-mono">{formatMetric(model.roc_auc)}</TableCell>
                        <TableCell className="text-center text-sm">{formatTime(model.training_time)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights del Análisis</CardTitle>
              <CardDescription>Conclusiones principales del estudio comparativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Random Forest</strong> obtuvo el mejor rendimiento general con un F1-Score de 0.781 y accuracy
                  de 91.2%, demostrando robustez en el dataset desbalanceado.
                </AlertDescription>
              </Alert>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Support Vector Machine</strong> mostró el segundo mejor rendimiento con métricas muy
                  competitivas, siendo una alternativa sólida para este tipo de clasificación.
                </AlertDescription>
              </Alert>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Naive Bayes</strong> fue el algoritmo más rápido (3.2s) pero con menor accuracy, ideal para
                  aplicaciones que requieren predicciones en tiempo real.
                </AlertDescription>
              </Alert>

              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  El <strong>desbalance de clases</strong> (11.2% positivos) afectó el rendimiento de todos los modelos,
                  sugiriendo la necesidad de técnicas de balanceo para mejorar el recall.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jupyter Notebook */}
        <TabsContent value="notebook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Notebook Jupyter de Reproducibilidad
              </CardTitle>
              <CardDescription>
                Notebook académico completo con código, análisis y resultados para reproducibilidad científica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Contenido del Notebook</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Introducción y objetivos del estudio</li>
                    <li>• Análisis exploratorio de datos (EDA)</li>
                    <li>• Preprocesamiento y limpieza de datos</li>
                    <li>• Implementación de los 6 algoritmos de ML</li>
                    <li>• Evaluación y comparación de modelos</li>
                    <li>• Visualizaciones y gráficos de resultados</li>
                    <li>• Conclusiones y recomendaciones</li>
                    <li>• Referencias bibliográficas</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Información del Notebook</Label>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Celdas totales:</span>
                        <span>47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Celdas de código:</span>
                        <span>28</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Celdas markdown:</span>
                        <span>19</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tamaño estimado:</span>
                        <span>3.2 MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Dependencias</Label>
                    <div className="flex flex-wrap gap-1">
                      {["pandas", "numpy", "scikit-learn", "matplotlib", "seaborn", "plotly", "jupyter"].map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descargar Notebook (.ipynb)
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    Exportar como HTML
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <FileSpreadsheet className="h-4 w-4" />
                    Exportar como PDF
                  </Button>
                </div>

                {generatingReport === "notebook" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Generando notebook...</span>
                      <span className="text-sm text-muted-foreground">Esto puede tomar unos minutos</span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Code Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Código</CardTitle>
              <CardDescription>Ejemplo de celdas del notebook generado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-2"># Celda 1: Importación de librerías</div>
                  <pre className="text-sm font-mono">
                    {`import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns`}
                  </pre>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-2"># Celda 15: Entrenamiento Random Forest</div>
                  <pre className="text-sm font-mono">
                    {`# Configuración del modelo Random Forest
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=2,
    random_state=42
)

# Entrenamiento del modelo
rf_model.fit(X_train_scaled, y_train)

# Predicciones
y_pred_rf = rf_model.predict(X_test_scaled)
y_proba_rf = rf_model.predict_proba(X_test_scaled)[:, 1]`}
                  </pre>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-2"># Celda 25: Evaluación de métricas</div>
                  <pre className="text-sm font-mono">
                    {`# Cálculo de métricas de rendimiento
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

accuracy = accuracy_score(y_test, y_pred_rf)
precision = precision_score(y_test, y_pred_rf, pos_label='yes')
recall = recall_score(y_test, y_pred_rf, pos_label='yes')
f1 = f1_score(y_test, y_pred_rf, pos_label='yes')

print(f"Accuracy: {accuracy:.3f}")
print(f"Precision: {precision:.3f}")
print(f"Recall: {recall:.3f}")
print(f"F1-Score: {f1:.3f}")`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
