"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

export default function Buscar() {
  const [search, setSearch] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
    setCurrentDate(date.toLocaleDateString("pt-BR", options))
  }, [])

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Cabeçalho */}
        <h1 className="text-xl sm:text-2xl mb-1">Seja bem vindo(a)</h1>
        <p className="text-gray-400 mb-6">{currentDate}</p>

        {/* Campo de busca */}
        <div className="relative mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busque por nome ou cidade"
            className="w-full bg-[#1A1A1A] text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Aviso de caracteres mínimos */}
        {search.length > 0 && search.length < 4 && (
          <p className="text-red-500 text-sm mb-4">
            Digite pelo menos 4 caracteres
          </p>
        )}

        {/* Botões de filtro */}
        <div className="flex gap-3 mb-10">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">
            Nome
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition">
            Cidade
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition">
            Próximas
          </button>
        </div>

        {/* Animação e texto central */}
        {search.length < 4 && (
          <div className="flex flex-col items-center mt-10 text-center">
            {/* Ícone animado */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <Search className="w-28 h-28 text-blue-500 opacity-80 drop-shadow-lg" />
            </motion.div>

            {/* Textos */}
            <h2 className="text-lg font-medium text-white">
              Encontre um estabelecimento
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-sm">
              Pesquise pelo nome ou cidade do estabelecimento
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
