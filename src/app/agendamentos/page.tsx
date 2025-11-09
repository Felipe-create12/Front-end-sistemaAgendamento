"use client"
import { useEffect, useState } from "react"

type Agendamento = {
  id: number
  idServico: number
  idProfissional: number
  idCliente: number
  empresaId: number
  dataHora: string
  status: string
  servicoNome?: string
  profissionalNome?: string
  empresaNome?: string
}

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [idCliente, setIdCliente] = useState<number | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // ✅ Estados novos
  const [showModal, setShowModal] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [showEditar, setShowEditar] = useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)

  // ✅ Estados para edição
  const [editServico, setEditServico] = useState("")
  const [editProfissional, setEditProfissional] = useState("")
  const [editDataHora, setEditDataHora] = useState("")

  // ✅ Listas de serviço e profissional
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([])
  const [profissionais, setProfissionais] = useState<{ id: number; nome: string }[]>([])

  useEffect(() => {
    const idClienteStr = localStorage.getItem("clienteId")
    const token = localStorage.getItem("token")
    if (idClienteStr && !isNaN(Number(idClienteStr)) && Number(idClienteStr) > 0 && token) {
      setIdCliente(Number(idClienteStr))
      setToken(token)
      setIsLogged(true)
    } else {
      setIdCliente(null)
      setToken(null)
      setIsLogged(false)
    }
  }, [])

  // ✅ Buscar agendamentos do cliente
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        if (!idCliente || !token) return
        const res = await fetch(`https://localhost:7273/api/Agendamento/cliente`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.status === 404) {
          setAgendamentos([])
          return
        }
        if (!res.ok) throw new Error("Erro ao buscar agendamentos")
        const data = await res.json()
        setAgendamentos(data)
      } catch {
        setAgendamentos([])
      }
    }
    if (isLogged && idCliente && token) fetchAgendamentos()
  }, [isLogged, idCliente, token])

  // ✅ Buscar serviços e profissionais
  useEffect(() => {
    const fetchServicosEProfissionais = async () => {
      try {
        const [resServicos, resProfissionais] = await Promise.all([
          fetch("https://localhost:7273/api/Servico"),
          fetch("https://localhost:7273/api/Profissional"),
        ])
        const dataServicos = await resServicos.json()
        const dataProfissionais = await resProfissionais.json()
        setServicos(dataServicos)
        setProfissionais(dataProfissionais)
      } catch (err) {
        console.error("Erro ao carregar listas:", err)
      }
    }
    fetchServicosEProfissionais()
  }, [])

  // ✅ Cancelar agendamento
  const cancelarAgendamento = async () => {
    if (!idToDelete || !token) return
    await fetch(`https://localhost:7273/api/Agendamento/deletar/${idToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    setAgendamentos((prev) => prev.filter(a => a.id !== idToDelete))
    setShowModal(false)
  }

  // ✅ Alterar agendamento
  // ✅ Alterar agendamento
const alterarAgendamento = async () => {
  if (!agendamentoSelecionado || !token) return

  // Garante formato ISO válido
  const dataHoraFormatada = new Date(editDataHora).toISOString()

  const body = {
    id: agendamentoSelecionado.id,
    idServico: Number(editServico),
    idProfissional: Number(editProfissional),
    idCliente: agendamentoSelecionado.idCliente,
    empresaId: agendamentoSelecionado.empresaId,
    dataHora: dataHoraFormatada,
    status: agendamentoSelecionado.status || "Pendente",
    servicoNome: agendamentoSelecionado.servicoNome || "",
    profissionalNome: agendamentoSelecionado.profissionalNome || "",
    empresaNome: agendamentoSelecionado.empresaNome || "",
  }

  console.log("Enviando PUT /api/Agendamento com body:", body)

  const res = await fetch(`https://localhost:7273/api/Agendamento`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const msg = await res.text()
  console.log("Resposta do servidor:", msg)

  if (res.ok) {
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === agendamentoSelecionado.id ? { ...a, ...body } : a))
    )
    setShowEditar(false)
    alert("✅ Agendamento alterado com sucesso!")
  } else {
    alert("❌ Erro ao alterar agendamento: " + msg)
  }
}


  if (!isLogged) {
    return (
      <main className="bg-[#0D0D0D] text-white min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[120px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44C183.81,80.89,86.24,103.73,0,120V0H1200V27.35c-85.73,26.15-175.8,52.79-321.39,77.44C677.4,138.3,472.52,31.71,321.39,56.44Z"
              fill="#111111"
            ></path>
          </svg>
        </div>

        <section className="text-center z-10">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">Faça login para continuar</h1>
          <p className="text-gray-400 mb-10 text-sm md:text-base">
            Agende e pague online, resgate itens do programa de fidelidade e muito mais.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-all shadow-lg"
          >
            Acessar
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-[#0D0D0D] text-white min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Meus Agendamentos</h1>
        <p className="text-gray-300 max-w-md">
          Aqui aparecerão os seus agendamentos confirmados e pendentes.
        </p>
      </section>

      <div className="w-full max-w-3xl space-y-4">
        {agendamentos.length > 0 ? (
          agendamentos.map((ag) => (
            <div
              key={ag.id}
              className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-md"
            >
              <div className="text-center md:text-left">
                <h2 className="text-lg font-semibold">{ag.servicoNome}</h2>
                <p className="text-gray-400">Profissional: {ag.profissionalNome}</p>
                <p className="text-gray-400">
                  Data: {new Date(ag.dataHora).toLocaleString("pt-BR")}
                </p>

                <button
                  onClick={() => {
                    setAgendamentoSelecionado(ag)
                    setShowDetalhes(true)
                  }}
                  className="text-blue-400 underline text-sm mt-2 mr-4"
                >
                  Ver detalhes
                </button>

                <button
                  onClick={() => {
                    setAgendamentoSelecionado(ag)
                    setEditServico(String(ag.idServico))
                    setEditProfissional(String(ag.idProfissional))
                    setEditDataHora(ag.dataHora.slice(0, 16))
                    setShowEditar(true)
                  }}
                  className="text-yellow-400 underline text-sm mt-2"
                >
                  Alterar
                </button>
              </div>

              <button
                className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                onClick={() => {
                  setIdToDelete(ag.id)
                  setShowModal(true)
                }}
              >
                Cancelar
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">Nenhum agendamento encontrado.</p>
        )}
      </div>

      <div className="mt-10">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg"
          onClick={() => (window.location.href = "/buscar")}
        >
          Fazer novo agendamento
        </button>
      </div>

      {/* ✅ Modal cancelar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] p-6 rounded-xl text-center space-y-4 w-full max-w-sm border border-gray-700">
            <h2 className="text-lg font-semibold">Cancelar agendamento?</h2>
            <p className="text-gray-300 text-sm">Essa ação não pode ser desfeita.</p>

            <div className="flex justify-between">
              <button className="px-6 py-2 bg-gray-600 rounded-lg" onClick={() => setShowModal(false)}>
                Não
              </button>
              <button className="px-6 py-2 bg-red-600 rounded-lg" onClick={cancelarAgendamento}>
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal detalhes */}
      {showDetalhes && agendamentoSelecionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121212] p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Detalhes da Comanda</h2>
            <p><strong>Serviço:</strong> {agendamentoSelecionado.servicoNome}</p>
            <p><strong>Profissional:</strong> {agendamentoSelecionado.profissionalNome}</p>
            <p><strong>Empresa:</strong> {agendamentoSelecionado.empresaNome}</p>
            <p><strong>Data:</strong> {new Date(agendamentoSelecionado.dataHora).toLocaleString("pt-BR")}</p>
            <p><strong>Status:</strong> {agendamentoSelecionado.status}</p>

            <button
              className="mt-4 bg-blue-600 px-4 py-2 rounded-lg w-full"
              onClick={() => setShowDetalhes(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ✅ Modal editar */}
      {showEditar && agendamentoSelecionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Alterar Agendamento</h2>

            <label className="block text-sm mb-2">Serviço</label>
            <select
              value={editServico}
              onChange={(e) => setEditServico(e.target.value)}
              className="w-full mb-4 p-2 bg-[#1A1A1A] border border-gray-600 rounded-lg"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-2">Profissional</label>
            <select
              value={editProfissional}
              onChange={(e) => setEditProfissional(e.target.value)}
              className="w-full mb-4 p-2 bg-[#1A1A1A] border border-gray-600 rounded-lg"
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-2">Data e Hora</label>
            <input
              type="datetime-local"
              value={editDataHora}
              onChange={(e) => setEditDataHora(e.target.value)}
              className="w-full mb-6 p-2 bg-[#1A1A1A] border border-gray-600 rounded-lg"
            />

            <div className="flex justify-between">
              <button
                className="bg-gray-600 px-4 py-2 rounded-lg"
                onClick={() => setShowEditar(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 px-4 py-2 rounded-lg"
                onClick={alterarAgendamento}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
