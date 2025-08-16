"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Database, BarChart3, TrendingUp, Users, Target, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface EDAData {
  dataset_info: {
    total_rows: number
    total_columns: number
    missing_values: number
    duplicate_rows: number
  }
  target_distribution: {
    yes: number
    no: number
    balance_ratio: number
  }
  numerical_stats: Record<
    string,
    {
      mean: number
      std: number
      min: number
      max: number
    }
  >
  categorical_stats: Record<string, Record<string, number>>
  correlations: Record<string, number>
}

const COLORS = ["#0891b2", "#84cc16", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export function DataAnalysis() {
  const [edaData, setEdaData] = useState<EDAData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEDAData()
  }, [])

  const fetchEDAData = async () => {
    try {
      const response = await fetch("/api/reports/eda")
      if (response.ok) {
        const data = await response.json()
        setEdaData(data)
      }
    } catch (error) {
      console.error("Error fetching EDA data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!edaData) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
            <p className="text-muted-foreground text-center mb-4">
              Cargue un dataset para ver el análisis exploratorio
            </p>
            <Button variant="outline">Cargar Datos</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare chart data
  const targetData = [
    {
      name: "No",
      value: edaData.target_distribution.no,
      percentage: (
        (edaData.target_distribution.no / (edaData.target_distribution.yes + edaData.target_distribution.no)) *
        100
      ).toFixed(1),
    },
    {
      name: "Sí",
      value: edaData.target_distribution.yes,
      percentage: (
        (edaData.target_distribution.yes / (edaData.target_distribution.yes + edaData.target_distribution.no)) *
        100
      ).toFixed(1),
    },
  ]

  const jobData = Object.entries(edaData.categorical_stats.job || {})
    .map(([job, count]) => ({
      job: job.replace(".", ""),
      count,
      percentage: ((count / edaData.dataset_info.total_rows) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const educationData = Object.entries(edaData.categorical_stats.education || {})
    .map(([education, count]) => ({
      education: education.replace(".", " "),
      count,
      percentage: ((count / edaData.dataset_info.total_rows) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count)

  const numericalData = Object.entries(edaData.numerical_stats).map(([variable, stats]) => ({
    variable,
    ...stats,
  }))

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Análisis Exploratorio de Datos</h1>
        <p className="text-muted-foreground">
          Estadísticas descriptivas y visualizaciones del dataset de marketing bancario
        </p>
      </div>

      {/* Dataset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edaData.dataset_info.total_rows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">filas en el dataset</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variables</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edaData.dataset_info.total_columns}</div>
            <p className="text-xs text-muted-foreground">columnas + variable objetivo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Faltantes</CardTitle>
            {edaData.dataset_info.missing_values === 0 ? (
              <CheckCircle className="h-4 w-4 text-accent" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edaData.dataset_info.missing_values}</div>
            <p className="text-xs text-muted-foreground">
              {edaData.dataset_info.missing_values === 0 ? "Dataset completo" : "requieren imputación"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicados</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edaData.dataset_info.duplicate_rows}</div>
            <p className="text-xs text-muted-foreground">registros duplicados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="target" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="target">Variable Objetivo</TabsTrigger>
          <TabsTrigger value="categorical">Variables Categóricas</TabsTrigger>
          <TabsTrigger value="numerical">Variables Numéricas</TabsTrigger>
          <TabsTrigger value="correlations">Correlaciones</TabsTrigger>
        </TabsList>

        {/* Target Variable Analysis */}
        <TabsContent value="target" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Distribución de la Variable Objetivo
                </CardTitle>
                <CardDescription>Balance de clases en la variable 'y' (suscripción al depósito)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={targetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {targetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [value.toLocaleString(), "Registros"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Balance</CardTitle>
                <CardDescription>Métricas de distribución de clases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Clase Mayoritaria (No)</span>
                    <span className="text-sm">{edaData.target_distribution.no.toLocaleString()}</span>
                  </div>
                  <Progress value={88.8} className="h-2" />
                  <span className="text-xs text-muted-foreground">88.8% del dataset</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Clase Minoritaria (Sí)</span>
                    <span className="text-sm">{edaData.target_distribution.yes.toLocaleString()}</span>
                  </div>
                  <Progress value={11.2} className="h-2" />
                  <span className="text-xs text-muted-foreground">11.2% del dataset</span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ratio de Balance</span>
                    <Badge variant={edaData.target_distribution.balance_ratio < 0.2 ? "destructive" : "secondary"}>
                      {(edaData.target_distribution.balance_ratio * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dataset desbalanceado - considerar técnicas de balanceo
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categorical Variables */}
        <TabsContent value="categorical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Distribución por Trabajo
                </CardTitle>
                <CardDescription>Frecuencia de categorías profesionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="job" angle={-45} textAnchor="end" height={60} fontSize={12} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [value.toLocaleString(), "Registros"]}
                        labelFormatter={(label) => `Trabajo: ${label}`}
                      />
                      <Bar dataKey="count" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Educación</CardTitle>
                <CardDescription>Niveles educativos en el dataset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={educationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ education, percentage }) => `${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {educationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [value.toLocaleString(), "Registros"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categorical Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Variables Categóricas</CardTitle>
              <CardDescription>Estadísticas de frecuencia por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variable</TableHead>
                      <TableHead>Categorías Únicas</TableHead>
                      <TableHead>Categoría Más Frecuente</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Porcentaje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">job</TableCell>
                      <TableCell>{Object.keys(edaData.categorical_stats.job || {}).length}</TableCell>
                      <TableCell>admin.</TableCell>
                      <TableCell>{(edaData.categorical_stats.job?.["admin."] || 0).toLocaleString()}</TableCell>
                      <TableCell>25.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">education</TableCell>
                      <TableCell>{Object.keys(edaData.categorical_stats.education || {}).length}</TableCell>
                      <TableCell>university.degree</TableCell>
                      <TableCell>
                        {(edaData.categorical_stats.education?.["university.degree"] || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>29.5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Numerical Variables */}
        <TabsContent value="numerical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estadísticas Descriptivas
              </CardTitle>
              <CardDescription>Medidas de tendencia central y dispersión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variable</TableHead>
                      <TableHead className="text-right">Media</TableHead>
                      <TableHead className="text-right">Desv. Estándar</TableHead>
                      <TableHead className="text-right">Mínimo</TableHead>
                      <TableHead className="text-right">Máximo</TableHead>
                      <TableHead className="text-right">Rango</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {numericalData.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stat.variable}</TableCell>
                        <TableCell className="text-right font-mono">{stat.mean.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{stat.std.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{stat.min.toFixed(0)}</TableCell>
                        <TableCell className="text-right font-mono">{stat.max.toFixed(0)}</TableCell>
                        <TableCell className="text-right font-mono">{(stat.max - stat.min).toFixed(0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Edad</CardTitle>
              <CardDescription>Histograma de la variable edad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { range: "17-25", count: 2847 },
                      { range: "26-35", count: 12456 },
                      { range: "36-45", count: 13892 },
                      { range: "46-55", count: 8234 },
                      { range: "56-65", count: 3456 },
                      { range: "66+", count: 303 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value.toLocaleString(), "Registros"]} />
                    <Bar dataKey="count" fill={COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlations */}
        <TabsContent value="correlations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Correlaciones</CardTitle>
              <CardDescription>Correlaciones entre variables numéricas principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(edaData.correlations).map(([pair, correlation], index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-sm font-medium">{pair.replace("_", " → ")}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.abs(correlation) * 100} className="w-16 h-2" />
                      <Badge variant={Math.abs(correlation) > 0.5 ? "default" : "secondary"}>
                        {correlation.toFixed(3)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights de Correlación</CardTitle>
              <CardDescription>Interpretación de las correlaciones más relevantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Correlación Fuerte</h4>
                <p className="text-sm text-muted-foreground">
                  emp_var_rate y euribor3m muestran correlación muy alta (0.973), indicando relación económica directa.
                </p>
              </div>
              <div className="p-3 bg-muted/50 border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Correlación Moderada</h4>
                <p className="text-sm text-muted-foreground">
                  Las variables económicas tienden a correlacionarse entre sí, reflejando el contexto macroeconómico.
                </p>
              </div>
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Correlación Débil</h4>
                <p className="text-sm text-muted-foreground">
                  Variables demográficas como edad muestran correlaciones bajas con variables de campaña.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
