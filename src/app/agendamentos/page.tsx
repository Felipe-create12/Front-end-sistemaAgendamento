"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Agendamentos() {
  const [isLogged, setIsLogged] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLogged(!!token)
  }, [])

  const handleLoginRedirect = () => {
    router.push("/login")
  }

  if (!isLogged) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold mb-3">Faça login para continuar</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Agende e pague online, resgate itens do programa de fidelidade e muito mais
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-medium"
        >
          Acessar
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-3">Seus Agendamentos</h1>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Aqui aparecerão os seus agendamentos confirmados e pendentes.
      </p>
      <button
        onClick={() => router.push("/buscar")}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-medium"
      >
        Fazer novo agendamento
      </button>
    </main>
  )
}
