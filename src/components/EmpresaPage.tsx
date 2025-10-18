"use client"

type EmpresaProps = {
  empresa: any
}

export default function EmpresaPage({ empresa }: EmpresaProps) {
  return (
    <main className="bg-[#0D0D0D] text-white min-h-screen px-6 py-8">
      {/* Header */}
      <section className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{empresa?.nome || "Nome não disponível"}</h1>
        </div>
        <button className="bg-orange-500 px-4 py-2 rounded-md font-semibold hover:bg-orange-600">
          Agendar agora
        </button>
      </section>

      {/* Imagem */}
      <div className="w-full h-64 bg-black flex items-center justify-center mb-6">
        <img
          src={empresa?.logoUrl || "/images/empresas/default.jpg"}
          alt={empresa?.nome || "Logo empresa"}
          className="h-full object-contain"
          onError={(e) => (e.currentTarget.src = "/images/empresas/default.jpg")}
        />
      </div>

      {/* Detalhes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Coluna esquerda */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Localização</h2>
          <p className="text-gray-400">{empresa?.endereco || "Endereço não informado"}</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">Formas de pagamento</h2>
          <div className="flex flex-wrap gap-2">
            {empresa?.formasPagamento?.length ? (
              empresa.formasPagamento.map((p: string, i: number) => (
                <span key={i} className="bg-gray-800 px-3 py-1 rounded-md text-sm">
                  {p}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Não informado</p>
            )}
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-2">Comodidades</h2>
          <div className="flex flex-wrap gap-2">
            {empresa?.comodidades?.length ? (
              empresa.comodidades.map((c: string, i: number) => (
                <span key={i} className="bg-gray-800 px-3 py-1 rounded-md text-sm">
                  {c}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Não informado</p>
            )}
          </div>
        </div>

        {/* Coluna direita */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contato</h2>
          <p className="text-gray-400">📱 {empresa?.telefone || "Não informado"}</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">Serviços</h2>
          <div className="flex flex-col gap-3">
            {empresa?.servicos?.length ? (
              empresa.servicos.map((s: any, i: number) => (
                <div
                  key={i}
                  className="bg-[#1C1C1C] p-3 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{s?.nome || "Serviço sem nome"}</p>
                    <p className="text-gray-400 text-sm">
                      R$ {s?.preco?.toFixed(2) || "0.00"} • {s?.duracaoMinutos || 0} min
                    </p>
                  </div>
                  <button className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                    Agendar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhum serviço disponível</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
