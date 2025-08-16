import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Manrope } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Sistema de Análisis y Clasificación de Datos Bancarios",
  description: "Plataforma académica para análisis de machine learning y clasificación de datos de marketing bancario",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-geist-sans: ${GeistSans.variable};
  --font-manrope: ${manrope.variable};
}
        `}</style>
      </head>
      <body className={`${GeistSans.variable} ${manrope.variable} antialiased`}>{children}</body>
    </html>
  )
}
