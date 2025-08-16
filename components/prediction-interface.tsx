"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Upload, User, FileText, Download, CheckCircle, AlertCircle, Brain, Zap } from "lucide-react"
import type { PredictionResult } from "@/lib/ml-utils"

interface SinglePredictionForm {
  age: string
  job: string
  marital: string
  education: string
  default: string
  housing: string
  loan: string
  contact: string
  month: string
  day_of_week: string
  duration: string
  campaign: string
  pdays: string
  previous: string
  poutcome: string
  emp_var_rate: string
  cons_price_idx: string
  cons_conf_idx: string
  euribor3m: string
  nr_employed: string
}

interface BatchPredictionResult {
  success: boolean
  predictions: Array<{
    row_id: number
    prediction: string
    probability_yes: number
    probability_no: number
  }>
  summary: {
    total_predictions: number
    predicted_yes: number
    predicted_no: number
    avg_confidence: number
  }
  model_used: string
  processing_time: number
}

const jobOptions = [
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
]

const maritalOptions = ["divorced", "married", "single", "unknown"]

const educationOptions = [
  "basic.4y",
  "basic.6y",
  "basic.9y",
  "high.school",
  "illiterate",
  "professional.course",
  "university.degree",
  "unknown",
]

const binaryOptions = ["no", "yes", "unknown"]

const contactOptions = ["cellular", "telephone"]

const monthOptions = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

const dayOptions = ["mon", "tue", "wed", "thu", "fri"]

const poutcomeOptions = ["failure", "nonexistent", "success"]

export function PredictionInterface() {
  const [selectedModel, setSelectedModel] = useState("RF")
  const [singleForm, setSingleForm] = useState<SinglePredictionForm>({
    age: "",
    job: "",
    marital: "",
    education: "",
    default: "",
    housing: "",
    loan: "",
    contact: "",
    month: "",
    day_of_week: "",
    duration: "",
    campaign: "",
    pdays: "",
    previous: "",
    poutcome: "",
    emp_var_rate: "",
    cons_price_idx: "",
    cons_conf_idx: "",
    euribor3m: "",
    nr_employed: "",
  })
  const [singleResult, setSingleResult] = useState<PredictionResult | null>(null)
  const [batchFile, setBatchFile] = useState<File | null>(null)
  const [batchResult, setBatchResult] = useState<BatchPredictionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSinglePrediction = async () => {
    // Validate required fields
    const requiredFields = Object.entries(singleForm).filter(([key, value]) => value === "")
    if (requiredFields.length > 0) {
      alert("Por favor, complete todos los campos requeridos")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/predict/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: singleForm,
          modelId: selectedModel,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSingleResult(result)
      }
    } catch (error) {
      console.error("Error en predicción individual:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchPrediction = async () => {
    if (!batchFile) {
      alert("Por favor, seleccione un archivo")
      return
    }

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("file", batchFile)
      formData.append("modelId", selectedModel)

      const response = await fetch("/api/predict/file", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setBatchResult(result)
      }
    } catch (error) {
      console.error("Error en predicción batch:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const updateFormField = (field: keyof SinglePredictionForm, value: string) => {
    setSingleForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Sistema de Predicciones</h1>
        <p className="text-muted-foreground">
          Realice predicciones individuales o por lotes utilizando los modelos entrenados
        </p>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Selección de Modelo
          </CardTitle>
          <CardDescription>Elija el modelo entrenado para realizar las predicciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="model-select">Modelo:</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KNN">K-Nearest Neighbors</SelectItem>
                <SelectItem value="RF">Random Forest</SelectItem>
                <SelectItem value="NB">Naive Bayes</SelectItem>
                <SelectItem value="SVM">Support Vector Machine</SelectItem>
                <SelectItem value="MLP">Multi-Layer Perceptron</SelectItem>
                <SelectItem value="GPC">Gaussian Process</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-2">
              Modelo seleccionado: {selectedModel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Predicción Individual</TabsTrigger>
          <TabsTrigger value="batch">Predicción por Lotes</TabsTrigger>
        </TabsList>

        {/* Single Prediction */}
        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Datos del Cliente
              </CardTitle>
              <CardDescription>Complete la información del cliente para realizar la predicción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Demographic Information */}
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="ej: 35"
                    value={singleForm.age}
                    onChange={(e) => updateFormField("age", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job">Trabajo</Label>
                  <Select value={singleForm.job} onValueChange={(value) => updateFormField("job", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar trabajo" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobOptions.map((job) => (
                        <SelectItem key={job} value={job}>
                          {job}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marital">Estado Civil</Label>
                  <Select value={singleForm.marital} onValueChange={(value) => updateFormField("marital", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Educación</Label>
                  <Select value={singleForm.education} onValueChange={(value) => updateFormField("education", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar educación" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationOptions.map((edu) => (
                        <SelectItem key={edu} value={edu}>
                          {edu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Financial Information */}
                <div className="space-y-2">
                  <Label htmlFor="default">Crédito en Default</Label>
                  <Select value={singleForm.default} onValueChange={(value) => updateFormField("default", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {binaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="housing">Préstamo Hipotecario</Label>
                  <Select value={singleForm.housing} onValueChange={(value) => updateFormField("housing", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {binaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan">Préstamo Personal</Label>
                  <Select value={singleForm.loan} onValueChange={(value) => updateFormField("loan", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {binaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campaign Information */}
                <div className="space-y-2">
                  <Label htmlFor="contact">Tipo de Contacto</Label>
                  <Select value={singleForm.contact} onValueChange={(value) => updateFormField("contact", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar contacto" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactOptions.map((contact) => (
                        <SelectItem key={contact} value={contact}>
                          {contact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Mes de Contacto</Label>
                  <Select value={singleForm.month} onValueChange={(value) => updateFormField("month", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Día de la Semana</Label>
                  <Select
                    value={singleForm.day_of_week}
                    onValueChange={(value) => updateFormField("day_of_week", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOptions.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Numerical Fields */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (segundos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="ej: 180"
                    value={singleForm.duration}
                    onChange={(e) => updateFormField("duration", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign">Número de Contactos</Label>
                  <Input
                    id="campaign"
                    type="number"
                    placeholder="ej: 2"
                    value={singleForm.campaign}
                    onChange={(e) => updateFormField("campaign", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdays">Días desde Último Contacto</Label>
                  <Input
                    id="pdays"
                    type="number"
                    placeholder="ej: 999"
                    value={singleForm.pdays}
                    onChange={(e) => updateFormField("pdays", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previous">Contactos Previos</Label>
                  <Input
                    id="previous"
                    type="number"
                    placeholder="ej: 0"
                    value={singleForm.previous}
                    onChange={(e) => updateFormField("previous", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poutcome">Resultado Campaña Anterior</Label>
                  <Select value={singleForm.poutcome} onValueChange={(value) => updateFormField("poutcome", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      {poutcomeOptions.map((outcome) => (
                        <SelectItem key={outcome} value={outcome}>
                          {outcome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Economic Indicators */}
                <div className="space-y-2">
                  <Label htmlFor="emp_var_rate">Tasa Variación Empleo</Label>
                  <Input
                    id="emp_var_rate"
                    type="number"
                    step="0.1"
                    placeholder="ej: 1.1"
                    value={singleForm.emp_var_rate}
                    onChange={(e) => updateFormField("emp_var_rate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cons_price_idx">Índice Precios Consumidor</Label>
                  <Input
                    id="cons_price_idx"
                    type="number"
                    step="0.01"
                    placeholder="ej: 93.994"
                    value={singleForm.cons_price_idx}
                    onChange={(e) => updateFormField("cons_price_idx", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cons_conf_idx">Índice Confianza Consumidor</Label>
                  <Input
                    id="cons_conf_idx"
                    type="number"
                    step="0.1"
                    placeholder="ej: -36.4"
                    value={singleForm.cons_conf_idx}
                    onChange={(e) => updateFormField("cons_conf_idx", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="euribor3m">Euribor 3 meses</Label>
                  <Input
                    id="euribor3m"
                    type="number"
                    step="0.001"
                    placeholder="ej: 4.857"
                    value={singleForm.euribor3m}
                    onChange={(e) => updateFormField("euribor3m", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nr_employed">Número de Empleados</Label>
                  <Input
                    id="nr_employed"
                    type="number"
                    step="0.1"
                    placeholder="ej: 5191.0"
                    value={singleForm.nr_employed}
                    onChange={(e) => updateFormField("nr_employed", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={handleSinglePrediction} disabled={isProcessing} className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {isProcessing ? "Procesando..." : "Realizar Predicción"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSingleForm({
                      age: "",
                      job: "",
                      marital: "",
                      education: "",
                      default: "",
                      housing: "",
                      loan: "",
                      contact: "",
                      month: "",
                      day_of_week: "",
                      duration: "",
                      campaign: "",
                      pdays: "",
                      previous: "",
                      poutcome: "",
                      emp_var_rate: "",
                      cons_price_idx: "",
                      cons_conf_idx: "",
                      euribor3m: "",
                      nr_employed: "",
                    })
                    setSingleResult(null)
                  }}
                >
                  Limpiar Formulario
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Single Prediction Result */}
          {singleResult && (
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Resultado de la Predicción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      <Badge
                        variant={singleResult.prediction === "yes" ? "default" : "secondary"}
                        className="text-lg px-4 py-2"
                      >
                        {singleResult.prediction === "yes" ? "SÍ" : "NO"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Predicción</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{(singleResult.confidence * 100).toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Confianza</p>
                    <Progress value={singleResult.confidence * 100} className="mt-2" />
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">Probabilidades</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Sí:</span>
                        <span className="font-mono">{(singleResult.probabilities.yes * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No:</span>
                        <span className="font-mono">{(singleResult.probabilities.no * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Predicción realizada con el modelo {singleResult.model_used}.
                    {singleResult.prediction === "yes"
                      ? "El cliente tiene alta probabilidad de suscribirse al depósito a plazo."
                      : "El cliente tiene baja probabilidad de suscribirse al depósito a plazo."}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Batch Prediction */}
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Predicción por Lotes
              </CardTitle>
              <CardDescription>
                Suba un archivo CSV o Excel con múltiples registros para predicción masiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium mb-1">Seleccione archivo para predicción</p>
                  <p className="text-sm text-muted-foreground mb-4">CSV, XLSX, XLS hasta 50MB</p>
                  <Button variant="outline" onClick={() => document.getElementById("batch-file-input")?.click()}>
                    Seleccionar Archivo
                  </Button>
                  <input
                    id="batch-file-input"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setBatchFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>

                {batchFile && (
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{batchFile.name}</span>
                      <Badge variant="secondary">{(batchFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                    <Button onClick={() => setBatchFile(null)} variant="ghost" size="sm">
                      Remover
                    </Button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleBatchPrediction}
                    disabled={!batchFile || isProcessing}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {isProcessing ? "Procesando..." : "Ejecutar Predicciones"}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Procesando predicciones...</span>
                      <span className="text-sm text-muted-foreground">Esto puede tomar unos minutos</span>
                    </div>
                    <Progress value={65} className="w-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Batch Results */}
          {batchResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    Resumen de Predicciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{batchResult.summary.total_predictions}</div>
                      <p className="text-sm text-muted-foreground">Total Predicciones</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{batchResult.summary.predicted_yes}</div>
                      <p className="text-sm text-muted-foreground">Predicciones "Sí"</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{batchResult.summary.predicted_no}</div>
                      <p className="text-sm text-muted-foreground">Predicciones "No"</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(batchResult.summary.avg_confidence * 100).toFixed(1)}%</div>
                      <p className="text-sm text-muted-foreground">Confianza Promedio</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Descargar Resultados CSV
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Descargar Reporte Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Primeras 10 Predicciones</CardTitle>
                  <CardDescription>Vista previa de los resultados de predicción</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Predicción</TableHead>
                          <TableHead className="text-right">Prob. Sí</TableHead>
                          <TableHead className="text-right">Prob. No</TableHead>
                          <TableHead className="text-right">Confianza</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchResult.predictions.slice(0, 10).map((pred) => (
                          <TableRow key={pred.row_id}>
                            <TableCell>{pred.row_id}</TableCell>
                            <TableCell>
                              <Badge variant={pred.prediction === "yes" ? "default" : "secondary"}>
                                {pred.prediction === "yes" ? "SÍ" : "NO"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {(pred.probability_yes * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {(pred.probability_no * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {(Math.max(pred.probability_yes, pred.probability_no) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
