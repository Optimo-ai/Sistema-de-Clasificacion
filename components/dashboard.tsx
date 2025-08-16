import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Brain, Target, TrendingUp, Database, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Panel de Control - Análisis de Marketing Bancario</h1>
        <p className="text-muted-foreground">
          Sistema académico para clasificación y análisis de datos mediante algoritmos de machine learning
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
          <Upload className="h-6 w-6" />
          <span className="text-sm">Cargar Dataset</span>
        </Button>
        <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
          <Brain className="h-6 w-6" />
          <span className="text-sm">Entrenar Modelos</span>
        </Button>
        <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
          <Target className="h-6 w-6" />
          <span className="text-sm">Realizar Predicción</span>
        </Button>
        <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
          <TrendingUp className="h-6 w-6" />
          <span className="text-sm">Ver Reportes</span>
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dataset Actual</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41,188</div>
            <p className="text-xs text-muted-foreground">registros en bank-additional-full.csv</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                20 variables + target
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Entrenados</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0/6</div>
            <p className="text-xs text-muted-foreground">algoritmos completados</p>
            <div className="mt-2">
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">modelo no seleccionado</p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Pendiente entrenamiento
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Estado del Pipeline de Machine Learning
          </CardTitle>
          <CardDescription>Progreso de las fases del análisis de datos y entrenamiento de modelos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: "Carga de Datos", status: "pending", description: "Subir archivo CSV o Excel" },
              { step: "Análisis Exploratorio", status: "pending", description: "EDA y visualizaciones" },
              { step: "Preprocesamiento", status: "pending", description: "Limpieza y codificación" },
              { step: "División Train/Test", status: "pending", description: "Split estratificado 80/20" },
              { step: "Entrenamiento de Modelos", status: "pending", description: "6 algoritmos con hiperparámetros" },
              { step: "Evaluación y Selección", status: "pending", description: "Métricas y modelo óptimo" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                {item.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-accent" />
                ) : item.status === "in-progress" ? (
                  <Clock className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{item.step}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <Badge variant={item.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {item.status === "completed"
                    ? "Completado"
                    : item.status === "in-progress"
                      ? "En Progreso"
                      : "Pendiente"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Algorithms Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Algoritmos de Clasificación</CardTitle>
          <CardDescription>Modelos de machine learning supervisado para análisis comparativo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "K-Nearest Neighbors", abbr: "KNN", status: "pending" },
              { name: "Random Forest", abbr: "RF", status: "pending" },
              { name: "Naive Bayes", abbr: "NB", status: "pending" },
              { name: "Support Vector Machine", abbr: "SVM", status: "pending" },
              { name: "Multi-Layer Perceptron", abbr: "MLP", status: "pending" },
              { name: "Gaussian Process", abbr: "GPC", status: "pending" },
            ].map((algorithm, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {algorithm.abbr}
                  </Badge>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
                <div className="font-medium text-sm">{algorithm.name}</div>
                <div className="text-xs text-muted-foreground mt-1">No entrenado</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
