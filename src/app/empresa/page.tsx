"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import EmpresaPage from "@/components/EmpresaPage"

export default function EmpresaDetalhe() {
  const { id } = useParams()
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const response = await fetch(`https://localhost:7273/api/Empresa/?id=${id}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) throw new Error("Erro ao buscar empresa")
        const data = await response.json()
        setEmpresa(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEmpresa()
  }, [id])


  return <EmpresaPage empresa={empresa} />
}
