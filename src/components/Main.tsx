"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEmpresasProximas } from "@/hooks/useEmpresasProximas"

export default function Main() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState("")
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [barbershops, setBarbershops] = useState<any[]>([])
  const [userName, setUserName] = useState<string>("")

  // Importando hook
  const { buscarEmpresasProximas, loading } = useEmpresasProximas()

  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
    setCurrentDate(date.toLocaleDateString("pt-BR", options))

    // Buscar nome do usuário logado
    const nome = localStorage.getItem("user")
    if (nome) setUserName(nome)
  }, [])

  const handleLocation = async () => {
    try {
      setLocationEnabled(true)
      const empresas = await buscarEmpresasProximas()
      setBarbershops(empresas)
    } catch (error) {
      console.error("Erro ao buscar empresas:", error)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#0D0D0D] text-white px-4 py-10 sm:px-6 md:px-8 lg:px-10">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
          {userName ? `Seja bem-vindo, ${userName}` : "Seja bem-vindo(a)"}
        </h1>
        <p className="text-gray-400 mb-6">{currentDate}</p>

        {/* Barra de busca */}
        <div
          className="relative w-full mb-10"
          onClick={() => router.push(`/buscar`)}
        >
          <input
            type="text"
            placeholder="Encontre um estabelecimento"
            className="w-full bg-[#1A1A1A] text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            readOnly
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197M16 10.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-medium mb-6">Empresas próximas</h2>

        {/* Estados da localização */}
        {!locationEnabled ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854866.png"
              alt="Ícone localização"
              className="w-16 h-16 mb-3"
            />
            <button
              onClick={handleLocation}
              className="text-blue-400 font-medium hover:underline"
            >
              Habilitar localização
            </button>
            <p className="text-gray-400 mt-2">
              Habilite o acesso à localização para encontrarmos os estabelecimentos
              mais próximos a você =)
            </p>
          </div>
        ) : loading ? (
          <p className="text-gray-300 mt-6">Carregando empresas próximas...</p>
        ) : barbershops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {barbershops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => router.push(`/empresa/${shop.id}`)}
                className="bg-[#1C1C1C] rounded-md px-4 py-3 flex items-center justify-between shadow-md transition hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.nome}
                    onError={(e) => (e.currentTarget.src = "/images/empresas/default.jpg")}
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="text-white font-bold text-sm truncate">
                      {shop.nome}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">{shop.endereco}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      📍{" "}
                      {typeof shop.distancia === "number"
                        ? shop.distancia < 1
                          ? `${(shop.distancia * 1000).toFixed(0)}m`
                          : `${shop.distancia.toFixed(2)}km`
                        : "Distância não disponível"}
                    </p>
                  </div>
                </div>
                <button className="text-green-400 text-2xl ml-2">&#8250;</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-6 text-center">
            Nenhuma empresa encontrada próxima a você.
          </p>
        )}
      </div>
    </main>
  )
}
