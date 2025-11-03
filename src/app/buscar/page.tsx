"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEmpresasProximas } from "@/hooks/useEmpresasProximas"

export default function Buscar() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [filterType, setFilterType] = useState<"nome" | "cidade" | "proximas" | "">("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState("")

  // Importa hook reutilizável
  const { buscarEmpresasProximas, loading: loadingProximas } = useEmpresasProximas()

  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
    setCurrentDate(date.toLocaleDateString("pt-BR", options))

    const nome = localStorage.getItem("user")
    setUserName(nome || "") // Garante que userName seja vazio se não houver usuário
  }, [])

  const handleFilter = async (type: "nome" | "cidade" | "proximas") => {
    if (type !== "proximas" && search.length < 4) {
      alert("Digite pelo menos 4 caracteres para buscar.")
      return
    }

    setFilterType(type)
    setLoading(true)
    setResults([])

    try {
      let url = ""

      if (type === "nome") {
        url = `https://localhost:7273/api/Empresa/filtrar/${encodeURIComponent(search)}`
      } else if (type === "cidade") {
        url = `https://localhost:7273/api/Empresa/filtrar/cidade?cidade=${encodeURIComponent(search)}`
      } else if (type === "proximas") {
        // ✅ Usa o hook
        const empresas = await buscarEmpresasProximas()
        setResults(empresas)
        setLoading(false)
        return
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Erro ao buscar empresas")

      const data = await response.json()
      // Corrige caminho da imagem
      const empresasComImagens = data.map((empresa: any) => ({
        ...empresa,
        image: `/images/empresa/${empresa.id}.jpg`,
      }))
      setResults(empresasComImagens)
    } catch (error) {
      console.error("Erro na busca:", error)
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || loadingProximas

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-xl sm:text-2xl mb-1">
          {userName ? `Seja bem-vindo, ${userName}` : "Seja bem-vindo(a)"}
        </h1>
        <p className="text-gray-400 mb-6">{currentDate}</p>

        {/* Campo de busca */}
        <div className="relative mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              filterType === "nome"
                ? "Busque por nome"
                : filterType === "cidade"
                ? "Busque por cidade"
                : "Busque por nome ou cidade"
            }
            className="w-full bg-[#1A1A1A] text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Botões de filtro */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilterType("nome")}
            className={`px-4 py-2 rounded-full transition ${filterType === "nome" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Nome
          </button>
          <button
            onClick={() => setFilterType("cidade")}
            className={`px-4 py-2 rounded-full transition ${filterType === "cidade" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Cidade
          </button>
          <button
            onClick={() => handleFilter("proximas")}
            className={`px-4 py-2 rounded-full transition ${filterType === "proximas" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Próximas
          </button>
        </div>
        {/* Botão buscar para nome/cidade */}
        {(filterType === "nome" || filterType === "cidade") && (
          <button
            onClick={() => handleFilter(filterType)}
            className="mb-6 px-6 py-2 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
            disabled={search.length < 4}
          >
            Buscar
          </button>
        )}

        {/* Validação só ao buscar */}
        {((filterType === "nome" || filterType === "cidade") && search.length > 0 && search.length < 4) && (
          <p className="text-red-500 text-sm mb-4">Digite pelo menos 4 caracteres para buscar</p>
        )}

        {/* Resultados */}
        {isLoading ? (
          <p className="text-gray-400 text-center">Carregando...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((empresa: any) => (
              <div
                key={empresa.id}
                onClick={() => router.push(`/empresa/${empresa.id}`)}
                className="bg-[#1C1C1C] rounded-md px-4 py-3 flex items-center justify-between shadow-md transition hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    src={empresa.image}
                    alt={empresa.nome}
                    onError={(e) => (e.currentTarget.src = "/images/empresas/default.jpg")}
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="text-white font-bold text-sm truncate">{empresa.nome}</h3>
                    <p className="text-gray-400 text-xs truncate">{empresa.endereco}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      📍{" "}
                      {typeof empresa.distancia === "number"
                        ? empresa.distancia < 1
                          ? `${(empresa.distancia * 1000).toFixed(0)}m`
                          : `${empresa.distancia.toFixed(2)}km`
                        : "Distância não disponível"}
                    </p>
                  </div>
                </div>
                <button className="text-green-400 text-2xl ml-2">&#8250;</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-10 text-center">
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6"
            >
              <Search className="w-28 h-28 text-blue-500 opacity-80 drop-shadow-lg" />
            </motion.div>
            <h2 className="text-lg font-medium text-white">
              Encontre um estabelecimento
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-sm">
              Pesquise pelo nome, cidade ou encontre os mais próximos.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
