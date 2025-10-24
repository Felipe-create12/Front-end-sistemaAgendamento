"use client"
import { useEffect, useState } from "react"

type Agendamento = {
  id: number
  idServico: number
  idProfissional: number
  idCliente: number
  dataHora: string
  status: string
  servicoNome?: string
  profissionalNome?: string
  empresaNome?: string
}

export default function MeusAgendamentos({ idCliente }: { idCliente: number }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const res = await fetch(`https://localhost:7273/api/Agendamento/cliente/${idCliente}`)
        if (!res.ok) throw new Error("Erro ao buscar agendamentos")
        const data = await res.json()
        setAgendamentos(data)
      } catch (error) {
        console.error(error)
      }
    }
    if (idCliente) fetchAgendamentos()
  }, [idCliente])

  return (
    <main className="bg-[#0D0D0D] text-white min-h-screen flex flex-col items-center justify-start px-6 py-10">
      {/* Cabeçalho */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Meus Agendamentos</h1>
        <p className="text-gray-300 max-w-md">
          Aqui aparecerão os seus agendamentos confirmados e pendentes.
        </p>
      </section>

      {/* Lista */}
      <div className="w-full max-w-3xl space-y-4">
        {agendamentos.length > 0 ? (
          agendamentos.map((ag) => (
            <div
              key={ag.id}
              className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-md"
            >
              <div className="text-center md:text-left">
                <h2 className="text-lg font-semibold">{ag.servicoNome || "Serviço"}</h2>
                <p className="text-gray-400">Profissional: {ag.profissionalNome || "Não informado"}</p>
                <p className="text-gray-400">
                  Data: {new Date(ag.dataHora).toLocaleString("pt-BR")}
                </p>
              </div>
              <span
                className={`mt-3 md:mt-0 text-sm px-3 py-1 rounded-full ${
                  ag.status.toLowerCase() === "confirmado"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-600 text-black"
                }`}
              >
                {ag.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">Nenhum agendamento encontrado.</p>
        )}
      </div>

      {/* Botão */}
      <div className="mt-10">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg"
          onClick={() => (window.location.href = "/empresas")}
        >
          Fazer novo agendamento
        </button>
      </div>
    </main>
  )
}
