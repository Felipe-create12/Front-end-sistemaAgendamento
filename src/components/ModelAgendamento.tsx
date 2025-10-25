"use client"

import { useState } from "react"

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
  foto?: string
}

type ModalAgendamentoProps = {
  servico: Servico
  profissionais: Profissional[]
  empresaId: number
  onClose: () => void
}

export default function ModalAgendamento({ servico, profissionais, empresaId, onClose }: ModalAgendamentoProps) {
  const [etapa, setEtapa] = useState<"profissional" | "horario" | "confirmar">("profissional")
  const [profissional, setProfissional] = useState<Profissional | null>(null)
  const [dataSelecionada, setDataSelecionada] = useState("")
  const [horarioSelecionado, setHorarioSelecionado] = useState("")
  const [loading, setLoading] = useState(false)

  const horarios = {
    manhã: ["08:00", "08:30", "09:00", "09:30", "10:00"],
    tarde: ["13:00", "13:30", "14:00", "14:30", "15:00"],
    noite: ["18:00", "18:30", "19:00", "19:30", "20:00"],
  }

  const handleConfirmar = async () => {
    if (!profissional || !dataSelecionada || !horarioSelecionado) {
      alert("Selecione todas as informações antes de confirmar.")
      return
    }

    const token = localStorage.getItem("token")
    const idClienteStr = localStorage.getItem("clienteId")

    if (!token || !idClienteStr) {
      alert("Você precisa estar logado para agendar.")
      return
    }

    const idCliente = Number(idClienteStr)
    if (isNaN(idCliente) || idCliente <= 0) {
      alert("ID do cliente inválido. Faça login novamente.")
      return
    }

    if (!empresaId || isNaN(empresaId)) {
      alert("Empresa inválida. Contate o administrador.")
      return
    }

    setLoading(true)
    try {
      const body = {
        agendamentoDto: {
          idServico: Number(servico.id),
          idProfissional: Number(profissional.id),
          idCliente: idCliente,
          dataHora: `${dataSelecionada}T${horarioSelecionado}:00`,
          status: "Pendente",
          empresaId: Number(empresaId),
        }
      }

      const res = await fetch("https://localhost:7273/api/Agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("❌ Erro na resposta do servidor:", errorText)
        alert(`Erro ao criar agendamento: ${errorText}`)
        return
      }

      alert("✅ Agendamento realizado com sucesso!")
      onClose()
    } catch (err) {
      console.error(err)
      alert("Erro ao confirmar agendamento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        {/* Etapa 1: Profissional */}
        {etapa === "profissional" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Escolha um profissional para <span className="text-blue-500">{servico.nome}</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {profissionais.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProfissional(p)}
                  className={`cursor-pointer rounded-xl p-4 text-center border-2 ${
                    profissional?.id === p.id
                      ? "border-blue-500 bg-[#111]"
                      : "border-transparent bg-[#151515]"
                  } hover:border-blue-500 transition`}
                >
                  <img
                    src={p.foto || "/images/default-avatar.png"}
                    alt={p.nome}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-medium">{p.nome}</h3>
                  <p className="text-sm text-gray-400">{p.especialidade}</p>
                </div>
              ))}
            </div>

            <button
              disabled={!profissional}
              onClick={() => setEtapa("horario")}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition disabled:opacity-40"
            >
              Selecionar horário
            </button>
          </>
        )}

        {/* Etapa 2: Horário */}
        {etapa === "horario" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Escolha a data e o horário</h2>

            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="w-full bg-[#111] p-2 rounded-md mb-6 text-white"
            />

            {Object.entries(horarios).map(([periodo, horas]) => (
              <div key={periodo} className="mb-4">
                <h3 className="text-lg font-medium mb-2 capitalize">{periodo}</h3>
                <div className="flex flex-wrap gap-2">
                  {horas.map((hora) => (
                    <button
                      key={hora}
                      onClick={() => setHorarioSelecionado(hora)}
                      className={`px-4 py-2 rounded-md text-sm ${
                        horarioSelecionado === hora
                          ? "bg-blue-600"
                          : "bg-[#111] hover:bg-blue-800"
                      } transition`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEtapa("profissional")}
                className="flex-1 bg-gray-700 hover:bg-gray-800 py-2 rounded-md transition"
              >
                Voltar
              </button>
              <button
                disabled={!horarioSelecionado || !dataSelecionada}
                onClick={() => setEtapa("confirmar")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Etapa 3: Confirmar */}
        {etapa === "confirmar" && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center">Confirmar agendamento</h2>

            <div className="bg-[#111] p-4 rounded-md mb-4">
              <p className="font-medium text-lg">{servico.nome}</p>
              <p className="text-gray-400">{profissional?.nome}</p>
              <p className="text-gray-400">
                {dataSelecionada.split("-").reverse().join("/")} às {horarioSelecionado}
              </p>
              <p className="text-green-400 font-semibold mt-2">
                R$ {servico.preco.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEtapa("horario")}
                className="flex-1 bg-gray-700 hover:bg-gray-800 py-2 rounded-md transition"
              >
                Voltar
              </button>
              <button
                disabled={loading}
                onClick={handleConfirmar}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition disabled:opacity-50"
              >
                {loading ? "Agendando..." : "Confirmar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
