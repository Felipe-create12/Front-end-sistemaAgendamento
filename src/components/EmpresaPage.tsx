"use client"

import { useState, useRef } from "react"

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

type EmpresaProps = {
  empresa: {
    image: string
    nome?: string
    endereco?: string
    telefone?: string
    cidade?: string
    estado?: string
    cep?: string
    servicos?: Servico[]
    profissionais?: Profissional[]
  } | null
}

export default function EmpresaPage({ empresa }: EmpresaProps) {
  const [abaAtiva, setAbaAtiva] = useState<"servicos" | "profissionais">("servicos")
  const servicosRef = useRef<HTMLDivElement>(null)

  const handleAgendarNow = () => {
    setAbaAtiva("servicos")
    servicosRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleAgendarServico = (s: Servico) => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Você precisa estar logado para agendar este serviço.")
      return
    }

    // Aqui você pode abrir modal de agendamento ou redirecionar para a página de checkout
    console.log("Agendando serviço:", s)
  }

  if (!empresa) {
    return (
      <main className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Nenhuma empresa encontrada.</p>
      </main>
    )
  }

  return (
    <main className="bg-[#0D0D0D] text-white min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[2fr,1fr] gap-8">
        {/* COLUNA PRINCIPAL */}
        <div>
          {/* Cabeçalho */}
          <section className="flex flex-wrap md:flex-nowrap items-center justify-between mb-6">
            <div className="flex items-center gap-4 overflow-hidden">
              <img
                src={empresa.image}
                alt={empresa.nome}
                onError={(e) => (e.currentTarget.src = "/images/empresas/default.jpg")}
                className="w-12 h-12 rounded-full object-cover border border-gray-700"
              />
              <h1 className="text-2xl font-semibold">{empresa.nome || "Nome não disponível"}</h1>
              <p className="text-sm text-gray-400">⭐ 5.0</p>
            </div>

            <button
              onClick={handleAgendarNow}
              className="bg-orange-500 text-black font-semibold px-4 py-2 rounded-md hover:bg-orange-600 transition mt-4 md:mt-0"
            >
              Agendar agora
            </button>
          </section>

          {/* Abas */}
          <div className="flex gap-6 border-b border-gray-800 mb-4">
            <button
              onClick={() => setAbaAtiva("servicos")}
              className={`pb-2 transition ${
                abaAtiva === "servicos"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setAbaAtiva("profissionais")}
              className={`pb-2 transition ${
                abaAtiva === "profissionais"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Profissionais
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="mt-4">
            {abaAtiva === "servicos" ? (
              <div ref={servicosRef} className="space-y-3">
                {empresa.servicos && empresa.servicos.length > 0 ? (
                  empresa.servicos.map((s, i) => (
                    <div
                      key={s.id || i}
                      className="bg-[#1C1C1C] p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{s.nome}</p>
                        <p className="text-gray-400 text-sm">
                          R$ {s.preco?.toFixed(2)} • {s.duracaoEmMinutos} min
                        </p>
                      </div>
                      <button
                        className="bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                        onClick={() => handleAgendarServico(s)}
                      >
                        Agendar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum serviço disponível</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {empresa.profissionais && empresa.profissionais.length > 0 ? (
                  empresa.profissionais.map((p, i) => (
                    <div
                      key={p.id || i}
                      className="bg-[#1C1C1C] p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{p.nome}</p>
                        <p className="text-gray-400 text-sm">{p.especialidade || "Profissional"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum profissional cadastrado</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PAINEL LATERAL */}
        <aside className="bg-[#111] rounded-xl p-5 flex flex-col gap-6 h-fit">
          {/* Localização */}
          <div>
            <h2 className="text-lg font-semibold mb-2">📍 Localização</h2>
            <p className="text-gray-400 text-sm">{empresa.endereco || "Endereço não informado"}</p>
            <p className="text-gray-400 text-sm">
              {empresa.cidade && empresa.estado
                ? `${empresa.cidade} - ${empresa.estado}`
                : "Cidade/Estado não informado"}
            </p>
          </div>

          {/* Contato */}
          <div>
            <h2 className="text-lg font-semibold mb-2">📞 Contato</h2>
            <p className="text-gray-400 text-sm">{empresa.telefone || "Não informado"}</p>
          </div>

          {/* Formas de pagamento */}
          <div>
            <h2 className="text-lg font-semibold mb-2">💳 Formas de pagamento</h2>
            <div className="flex flex-wrap gap-2">
              {["Crédito", "Débito", "PIX", "Dinheiro"].map((item) => (
                <span
                  key={item}
                  className="bg-[#1C1C1C] text-gray-300 text-xs px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
