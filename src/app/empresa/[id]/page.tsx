"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import EmpresaPage from "@/components/EmpresaPage"

type Servico = {
  id?: number
  nome: string
  preco: number
  duracaoEmMinutos: number
}

type Profissional = {
  id?: number
  nome: string
  especialidade?: string
}

type Empresa = {
  id: number
  nome?: string
  endereco?: string
  telefone?: string
  cidade?: string
  estado?: string
  cep?: string
  categoria?: string 
  servicos?: Servico[]
  profissionais?: Profissional[]
  image?: string
}

export default function EmpresaDetalhe() {
  const params = useParams()
  const id = params?.id

  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch(`https://localhost:7273/api/Empresa/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Erro ao buscar a empresa")
        const data = await res.json()
        // Adiciona a imagem da empresa
        const empresaComImagem: Empresa = {
          ...data,
          image: `/images/empresa/${data.id}.jpg`,
        }

        setEmpresa(empresaComImagem)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEmpresa()
  }, [id])

  if (loading) {
    return (
      <main className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  if (error || !empresa) {
    return (
      <main className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">{error || "Empresa não encontrada"}</p>
      </main>
    )
  }

  // Passa a empresa completa com serviços e profissionais para o componente
  return <EmpresaPage empresa={empresa} />
}
