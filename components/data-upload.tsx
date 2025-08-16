"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, Database, Eye, Download } from "lucide-react"

interface FileData {
  name: string
  size: number
  type: string
  lastModified: number
  preview?: any[]
  schema?: { [key: string]: string }
  validRows?: number
  totalRows?: number
  errors?: string[]
}

export function DataUpload() {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const validTypes = [".csv", ".xlsx", ".xls"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!validTypes.includes(fileExtension)) {
      alert("Por favor, seleccione un archivo CSV o Excel (.xlsx, .xls)")
      return
    }

    setIsProcessing(true)

    // Simulate file processing
    setTimeout(() => {
      const mockPreviewData = [
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
      ]

      const mockSchema = {
        age: "numeric",
        job: "categorical",
        marital: "categorical",
        education: "categorical",
        default: "categorical",
        housing: "categorical",
        loan: "categorical",
        y: "target",
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        preview: mockPreviewData,
        schema: mockSchema,
        validRows: 41188,
        totalRows: 41188,
        errors: [],
      })
      setIsProcessing(false)
    }, 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Carga de Datos</h1>
        <p className="text-muted-foreground">
          Suba archivos CSV o Excel para análisis de machine learning. El sistema detectará automáticamente el esquema y
          validará los datos.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Dataset
          </CardTitle>
          <CardDescription>Formatos soportados: CSV (.csv), Excel (.xlsx, .xls). Tamaño máximo: 100MB</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isProcessing ? (
              <div className="space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                <div>
                  <p className="font-medium">Procesando archivo...</p>
                  <p className="text-sm text-muted-foreground">Detectando esquema y validando datos</p>
                </div>
                <Progress value={65} className="w-full max-w-xs mx-auto" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Arrastre archivos aquí o haga clic para seleccionar</p>
                  <p className="text-sm text-muted-foreground">CSV, XLSX, XLS hasta 100MB</p>
                </div>
                <Button onClick={() => document.getElementById("file-input")?.click()} className="mx-auto">
                  Seleccionar Archivo
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Information */}
      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información del Archivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Nombre</p>
                <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Tamaño</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Registros</p>
                <p className="text-sm text-muted-foreground">
                  {uploadedFile.validRows?.toLocaleString()} válidos de {uploadedFile.totalRows?.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Estado</p>
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schema Detection */}
      {uploadedFile?.schema && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Esquema Detectado
            </CardTitle>
            <CardDescription>Variables identificadas automáticamente en el dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(uploadedFile.schema).map(([column, type]) => (
                <div key={column} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="font-medium text-sm">{column}</span>
                  <Badge
                    variant={type === "target" ? "default" : type === "numeric" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {type === "target"
                      ? "Variable Objetivo"
                      : type === "numeric"
                        ? "Numérica"
                        : type === "categorical"
                          ? "Categórica"
                          : type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {uploadedFile?.preview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa de Datos
            </CardTitle>
            <CardDescription>Primeras 5 filas del dataset cargado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(uploadedFile.preview[0]).map((column) => (
                      <TableHead key={column} className="font-medium">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedFile.preview.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex} className="text-sm">
                          {String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Validación Completada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Dataset validado exitosamente. {uploadedFile.validRows?.toLocaleString()} registros listos para
                análisis. El archivo contiene todas las columnas requeridas para el análisis de marketing bancario.
              </AlertDescription>
            </Alert>

            <div className="mt-4 flex gap-3">
              <Button className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Proceder al EDA
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Descargar Reporte de Validación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
