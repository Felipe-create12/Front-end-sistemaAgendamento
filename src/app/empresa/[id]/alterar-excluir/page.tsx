"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function AlterarExcluirEmpresa() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [form, setForm] = useState<any>(null)
  const [servicos, setServicos] = useState<any[]>([])
  const [profissionais, setProfissionais] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`https://localhost:7273/api/Empresa/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Erro ao buscar empresa")
        const data = await res.json()

        setForm({
          id: data.id,
          nome: data.nome,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          telefone: data.telefone,
          categoria: data.categoria,
          latitude: data.latitude,
          longitude: data.longitude,
          distancia : data.distancia
        })
        setServicos(data.servicos || [])
        setProfissionais(data.profissionais || [])
      } catch {
        alert("❌ Erro ao carregar empresa")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchEmpresa()
  }, [id])

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`https://localhost:7273/api/Empresa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, servicos, profissionais })
      })
      alert("✅ Empresa atualizada com sucesso!")
      router.push("/empresas")
    } catch {
      alert("❌ Erro ao atualizar empresa")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta empresa?")) return
    try {
      const token = localStorage.getItem("token")
      await fetch(`https://localhost:7273/api/Empresa/deletar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      alert("✅ Empresa excluída com sucesso!")
      router.push("/empresas")
    } catch {
      alert("❌ Erro ao excluir empresa")
    }
  }

  const addServico = () => setServicos([...servicos, { nome: "", preco: "", duracaoEmMinutos: "" }])
  const removeServico = (index: number) => setServicos(servicos.filter((_, i) => i !== index))

  const addProfissional = () => setProfissionais([...profissionais, { nome: "", especialidade: "" }])
  const removeProfissional = (index: number) => setProfissionais(profissionais.filter((_, i) => i !== index))

  if (loading) return <p className="text-white">Carregando...</p>
  if (!form) return <p className="text-white">Empresa não encontrada</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-neutral-900/80 backdrop-blur-md p-10 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400 tracking-wide">
            Alterar / Excluir Empresa
          </h1>

          <div className="space-y-4">
            {Object.keys(form).map((field) => (
              field !== "distancia" && (
                <div key={field}>
                  <label className="capitalize text-gray-300 text-sm">{field}</label>
                  <input
                    name={field}
                    value={(form as any)[field] || ""}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              )
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-4">Serviços</h2>
          {servicos.map((s, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 mb-3">
              <input placeholder="Nome" value={s.nome} onChange={e=>{const a=[...servicos];a[i].nome=e.target.value;setServicos(a);}} className="bg-neutral-800 p-3 rounded-lg" />
              <input placeholder="Preço" value={s.preco} onChange={e=>{const a=[...servicos];a[i].preco=e.target.value;setServicos(a);}} className="bg-neutral-800 p-3 rounded-lg" />
              <input placeholder="Duração" value={s.duracaoEmMinutos} onChange={e=>{const a=[...servicos];a[i].duracaoEmMinutos=e.target.value;setServicos(a);}} className="bg-neutral-800 p-3 rounded-lg" />
              <button type="button" onClick={() => removeServico(i)} className="bg-red-600 hover:bg-red-700 p-3 rounded-lg flex items-center justify-center transition">🗑️</button>
            </div>
          ))}
          <button type="button" onClick={addServico} className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg mt-2 transition">
            + Adicionar Serviço
          </button>

          <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-4">Profissionais</h2>
          {profissionais.map((p, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 mb-3">
              <input placeholder="Nome" value={p.nome} onChange={e=>{const a=[...profissionais];a[i].nome=e.target.value;setProfissionais(a);}} className="bg-neutral-800 p-3 rounded-lg" />
              <input placeholder="Especialidade" value={p.especialidade} onChange={e=>{const a=[...profissionais];a[i].especialidade=e.target.value;setProfissionais(a);}} className="bg-neutral-800 p-3 rounded-lg" />
              <button type="button" onClick={() => removeProfissional(i)} className="bg-red-600 hover:bg-red-700 p-3 rounded-lg flex items-center justify-center transition">🗑️</button>
            </div>
          ))}
          <button type="button" onClick={addProfissional} className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg mt-2 transition">
            + Adicionar Profissional
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 p-6 flex gap-6 shadow-inner">
        <button onClick={handleUpdate} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
          💾 Salvar Alterações
        </button>
        <button onClick={handleDelete} className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 py-3 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
          🗑️ Excluir Empresa
        </button>
      </div>
    </div>
  )
}
