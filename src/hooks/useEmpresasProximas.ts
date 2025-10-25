"use client"
import { useState } from "react"

export function useEmpresasProximas() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscarEmpresasProximas = async (): Promise<any[]> => {
    if (!("geolocation" in navigator)) {
      alert("Geolocalização não suportada pelo seu navegador.")
      return []
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true)
          setError(null)
          const { latitude, longitude } = position.coords

          try {
            const response = await fetch(
              `https://localhost:7273/api/Empresa/proximas?latitude=${latitude}&longitude=${longitude}&raioKm=5`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )

            if (!response.ok) {
              throw new Error(`Erro ao buscar empresas: ${response.status}`)
            }

            const data = await response.json()

            const empresasComImagens = data.map((empresa: any) => ({
              ...empresa,
              image: `/sistema-agendamento/public/images/empresa${empresa.id}.jpg`,
            }))

            resolve(empresasComImagens)
          } catch (err: any) {
            console.error("Erro ao buscar empresas:", err)
            setError(err.message)
            reject(err)
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          alert("Permita o acesso à sua localização para continuar.")
          reject(err)
        }
      )
    })
  }

  return { buscarEmpresasProximas, loading, error }
}
