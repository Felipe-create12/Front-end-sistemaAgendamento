"use client"

import { ThemeProvider } from "next-themes"
import { useEffect, useState } from "react"
import Header from "@/components/Header"

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Header />
      {children}
    </ThemeProvider>
  )
}
