"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const [aba, setAba] = useState<"dados" | "seguranca">("dados")
  const [form, setForm] = useState({ id: 0, nome: "", email: "", telefone: "" })
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const clienteId = localStorage.getItem("clienteId")

    if (!token || !clienteId) {
      router.push("/login")
      return
    }

    fetch(`https://localhost:7273/api/Cliente/${clienteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          id: data.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone
        })
      })
      .catch(() => alert("Erro ao carregar dados"))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmitDados = async (e: any) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    await fetch("https://localhost:7273/api/Cliente", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    alert("✅ Dados atualizados com sucesso!")
  }

  const handleSubmitSenha = async (e: any) => {
    e.preventDefault()
    if (novaSenha !== confirmarSenha) {
      alert("❌ As senhas não coincidem")
      return
    }

    const token = localStorage.getItem("token")
    const clienteId = localStorage.getItem("clienteId")

    const payload = {
      id: Number(clienteId),
      user: senhaAtual,       // senha atual → validada no service
      senha: novaSenha,       // nova senha → gravada no banco
      clienteId: Number(clienteId),
      clienteNome: ""         // não usamos, mas DTO exige
    }

    await fetch("https://localhost:7273/api/User", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })

    alert("✅ Senha atualizada com sucesso!")
    setSenhaAtual("")
    setNovaSenha("")
    setConfirmarSenha("")
  }

  if (loading) return <p className="text-white text-center mt-10">Carregando...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-neutral-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Perfil</h1>

        {/* Abas */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setAba("dados")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              aba === "dados" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            Meus Dados
          </button>
          <button
            onClick={() => setAba("seguranca")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              aba === "seguranca" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            Segurança
          </button>
        </div>

        {/* Conteúdo da aba */}
        {aba === "dados" && (
          <form onSubmit={handleSubmitDados} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300">Nome completo *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full bg-neutral-800 p-3 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-neutral-800 p-3 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Telefone *</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className="w-full bg-neutral-800 p-3 rounded-lg mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition w-full mt-4"
            >
              Salvar
            </button>
          </form>
        )}

        {aba === "seguranca" && (
          <form onSubmit={handleSubmitSenha} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300">Senha atual</label>
              <input
                name="senhaAtual"
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full bg-neutral-800 p-3 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Nova senha</label>
              <input
                name="novaSenha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full bg-neutral-800 p-3 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Confirmar nova senha</label>
              <input
                name="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-neutral-800 p-3 rounded-lg mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition w-full mt-4"
            >
              Alterar Senha
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
