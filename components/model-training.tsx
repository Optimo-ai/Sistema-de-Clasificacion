"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Play, CheckCircle, Settings, Trophy, BarChart3, Zap, Target, Timer, HardDrive } from "lucide-react"
import { type TrainedModel, formatMetric, formatTime, formatSize, getModelColor } from "@/lib/ml-utils"

const algorithms = [
  { name: "K-Nearest Neighbors", abbr: "KNN", description: "Clasificación basada en vecinos más cercanos" },
  { name: "Random Forest", abbr: "RF", description: "Ensemble de árboles de decisión" },
  { name: "Naive Bayes", abbr: "NB", description: "Clasificador probabilístico bayesiano" },
  { name: "Support Vector Machine", abbr: "SVM", description: "Máquinas de vectores de soporte" },
  { name: "Multi-Layer Perceptron", abbr: "MLP", description: "Red neuronal multicapa" },
  { name: "Gaussian Process Classifier", abbr: "GPC", description: "Clasificador de procesos gaussianos" },
]

export function ModelTraining() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(algorithms.map((a) => a.abbr))
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [currentAlgorithm, setCurrentAlgorithm] = useState("")
  const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([])
  const [bestModel, setBestModel] = useState<string>("")
  const [hyperparameterSearch, setHyperparameterSearch] = useState(true)

  const handleAlgorithmToggle = (abbr: string) => {
    setSelectedAlgorithms((prev) => (prev.includes(abbr) ? prev.filter((a) => a !== abbr) : [...prev, abbr]))
  }

  const startTraining = async () => {
    if (selectedAlgorithms.length === 0) {
      alert("Seleccione al menos un algoritmo para entrenar")
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)
    setTrainedModels([])

    try {
      // Simulate training progress
      for (let i = 0; i < selectedAlgorithms.length; i++) {
        const algorithm = algorithms.find((a) => a.abbr === selectedAlgorithms[i])
        setCurrentAlgorithm(algorithm?.name || "")
        setTrainingProgress((i / selectedAlgorithms.length) * 100)

        // Call training API
        const response = await fetch("/api/train", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            algorithms: [selectedAlgorithms[i]],
            hyperparameter_search: hyperparameterSearch,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          if (result.results && result.results.length > 0) {
            setTrainedModels((prev) => [...prev, result.results[0]])
          }
        }
      }

      setTrainingProgress(100)
      setCurrentAlgorithm("")

      // Determine best model
      if (trainedModels.length > 0) {
        const best = trainedModels.reduce((prev, current) =>
          current.metrics.f1_score > prev.metrics.f1_score ? current : prev,
        )
        setBestModel(best.abbreviation)
      }
    } catch (error) {
      console.error("Error durante el entrenamiento:", error)
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Entrenamiento de Modelos</h1>
        <p className="text-muted-foreground">
          Configure y entrene algoritmos de machine learning para clasificación de datos bancarios
        </p>
      </div>

      <Tabs defaultValue="configure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configuración</TabsTrigger>
          <TabsTrigger value="training">Entrenamiento</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Selección de Algoritmos
              </CardTitle>
              <CardDescription>Elija los algoritmos de machine learning que desea entrenar y comparar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {algorithms.map((algorithm) => (
                  <div key={algorithm.abbr} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                    <Checkbox
                      id={algorithm.abbr}
                      checked={selectedAlgorithms.includes(algorithm.abbr)}
                      onCheckedChange={() => handleAlgorithmToggle(algorithm.abbr)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor={algorithm.abbr} className="font-medium">
                          {algorithm.name}
                        </Label>
                        <Badge variant="outline" className="text-xs font-mono">
                          {algorithm.abbr}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{algorithm.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Entrenamiento</CardTitle>
              <CardDescription>Parámetros generales para el proceso de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hyperparameter-search"
                  checked={hyperparameterSearch}
                  onCheckedChange={(checked) => setHyperparameterSearch(checked as boolean)}
                />
                <Label htmlFor="hyperparameter-search">Búsqueda automática de hiperparámetros</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-size">Proporción de Test (%)</Label>
                  <Input id="test-size" type="number" defaultValue="20" min="10" max="40" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="random-state">Semilla Aleatoria</Label>
                  <Input id="random-state" type="number" defaultValue="42" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv-folds">Validación Cruzada (K-Fold)</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Folds</SelectItem>
                    <SelectItem value="5">5 Folds</SelectItem>
                    <SelectItem value="10">10 Folds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Control de Entrenamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={startTraining}
                  disabled={isTraining || selectedAlgorithms.length === 0}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isTraining ? "Entrenando..." : "Iniciar Entrenamiento"}
                </Button>
                <Badge variant="secondary">{selectedAlgorithms.length} algoritmos seleccionados</Badge>
              </div>

              {isTraining && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progreso del entrenamiento</span>
                    <span className="text-sm text-muted-foreground">{Math.round(trainingProgress)}%</span>
                  </div>
                  <Progress value={trainingProgress} className="w-full" />
                  {currentAlgorithm && <p className="text-sm text-muted-foreground">Entrenando: {currentAlgorithm}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {trainedModels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Modelos Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainedModels.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getModelColor(model.abbreviation)}`} />
                        <div>
                          <p className="font-medium">{model.algorithm}</p>
                          <p className="text-sm text-muted-foreground">
                            F1: {formatMetric(model.metrics.f1_score)} | Accuracy:{" "}
                            {formatMetric(model.metrics.accuracy)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={model.abbreviation === bestModel ? "default" : "secondary"}>
                        {model.abbreviation === bestModel ? "Mejor" : "Completado"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {trainedModels.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay modelos entrenados</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Configure y entrene algoritmos para ver los resultados aquí
                </p>
                <Button variant="outline">Ir a Configuración</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Best Model Card */}
              {bestModel && (
                <Card className="border-accent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-accent" />
                      Mejor Modelo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const best = trainedModels.find((m) => m.abbreviation === bestModel)
                      return best ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent">{best.abbreviation}</div>
                            <div className="text-sm text-muted-foreground">{best.algorithm}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatMetric(best.metrics.f1_score)}</div>
                            <div className="text-sm text-muted-foreground">F1-Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatMetric(best.metrics.accuracy)}</div>
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatTime(best.metrics.training_time)}</div>
                            <div className="text-sm text-muted-foreground">Tiempo</div>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Metrics Comparison Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Comparación de Métricas
                  </CardTitle>
                  <CardDescription>Rendimiento comparativo de todos los modelos entrenados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Modelo</TableHead>
                          <TableHead className="text-center">Accuracy</TableHead>
                          <TableHead className="text-center">Precision</TableHead>
                          <TableHead className="text-center">Recall</TableHead>
                          <TableHead className="text-center">F1-Score</TableHead>
                          <TableHead className="text-center">ROC-AUC</TableHead>
                          <TableHead className="text-center">
                            <Timer className="h-4 w-4 inline mr-1" />
                            Tiempo
                          </TableHead>
                          <TableHead className="text-center">
                            <HardDrive className="h-4 w-4 inline mr-1" />
                            Tamaño
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainedModels
                          .sort((a, b) => b.metrics.f1_score - a.metrics.f1_score)
                          .map((model, index) => (
                            <TableRow key={index} className={model.abbreviation === bestModel ? "bg-accent/5" : ""}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`h-3 w-3 rounded-full ${getModelColor(model.abbreviation)}`} />
                                  <div>
                                    <div className="font-medium">{model.abbreviation}</div>
                                    <div className="text-xs text-muted-foreground">{model.algorithm}</div>
                                  </div>
                                  {model.abbreviation === bestModel && <Trophy className="h-4 w-4 text-accent" />}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {formatMetric(model.metrics.accuracy)}
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {formatMetric(model.metrics.precision)}
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {formatMetric(model.metrics.recall)}
                              </TableCell>
                              <TableCell className="text-center font-mono font-medium">
                                {formatMetric(model.metrics.f1_score)}
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {formatMetric(model.metrics.roc_auc)}
                              </TableCell>
                              <TableCell className="text-center text-sm">
                                {formatTime(model.metrics.training_time)}
                              </TableCell>
                              <TableCell className="text-center text-sm">
                                {formatSize(model.metrics.model_size)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mejor Accuracy</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatMetric(Math.max(...trainedModels.map((m) => m.metrics.accuracy)))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {
                        trainedModels.find(
                          (m) => m.metrics.accuracy === Math.max(...trainedModels.map((m) => m.metrics.accuracy)),
                        )?.abbreviation
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Entrenamiento Más Rápido</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatTime(Math.min(...trainedModels.map((m) => m.metrics.training_time)))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {
                        trainedModels.find(
                          (m) =>
                            m.metrics.training_time === Math.min(...trainedModels.map((m) => m.metrics.training_time)),
                        )?.abbreviation
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Modelos Entrenados</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{trainedModels.length}</div>
                    <p className="text-xs text-muted-foreground">de {algorithms.length} algoritmos disponibles</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
