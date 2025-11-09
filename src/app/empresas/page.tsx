"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Empresa = {
  id: number
  nome: string
  endereco: string
  cidade: string
  estado: string
  telefone: string
  categoria: string
}

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("https://localhost:7273/api/Empresa", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Erro ao buscar empresas")
        const data = await res.json()
        setEmpresas(data)
      } catch (err) {
        console.error(err)
        alert("❌ Erro ao carregar empresas")
      } finally {
        setLoading(false)
      }
    }
    fetchEmpresas()
  }, [])

  if (loading) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Carregando empresas...</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-10">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-10 tracking-wide">Empresas Cadastradas</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {empresas.map((empresa) => (
            <div
                key={empresa.id}
                className="bg-neutral-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-transform"
                onClick={() => router.push(`/empresa/${empresa.id}/alterar-excluir`)}
            >
                <h2 className="text-2xl font-semibold mb-2">{empresa.nome}</h2>
                <p className="text-gray-400">{empresa.endereco}, {empresa.cidade} - {empresa.estado}</p>
                <p className="text-gray-400">📞 {empresa.telefone}</p>
                <p className="text-gray-400">🏷️ {empresa.categoria}</p>
            </div>
            ))}
        </div>
    </div>
  )
}
