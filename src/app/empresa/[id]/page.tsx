"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import EmpresaPage from "@/components/EmpresaPage"

export default function EmpresaDetalhe() {
  const params = useParams()
  const id = params?.id
  console.log("ID usado na requisição:", id)
  const [empresa, setEmpresa] = useState<any>(null)
  const [servicos, setServicos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = localStorage.getItem("token")
        // Busca os dados da empresa
        const empresaRes = await fetch(`https://localhost:7273/api/Empresa/${1}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!empresaRes.ok) throw new Error("Erro ao buscar empresa")
        const empresaData = await empresaRes.json()
        setEmpresa(empresaData)

        // Busca os serviços relacionados à empresa
        const servicoRes = await fetch(`https://localhost:7273/api/Servico/${1}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (servicoRes.ok) {
          const servicoData = await servicoRes.json()
          setServicos(servicoData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEmpresa()
  }, [id])
  
  // Passa os serviços como prop
  return <EmpresaPage empresa={{ ...empresa, servicos }} />
  
}
