"use client"

import { useState } from "react"
import Link from "next/link"

export default function CadastroEmpresa() {
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    categoria: ""
  })

  const [servicos, setServicos] = useState([{ nome: "", preco: "", duracaoEmMinutos: "" }])
  const [profissionais, setProfissionais] = useState([{ nome: "", especialidade: "" }])

  const [loadingGeo, setLoadingGeo] = useState(false)
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null)
  const [showMap, setShowMap] = useState(false)

  // ====== GEOCODE VIA NOMINATIM (FREE) ======
  async function buscarCoordenadasNominatim() {
    const query = `${form.endereco}, ${form.cidade}, ${form.estado}, ${form.cep}`
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    
    const res = await fetch(url)
    const data = await res.json()
    if (!data.length) throw new Error("Endereço não encontrado")

    return { lat: data[0].lat, lon: data[0].lon }
  }

  // ====== (OPCIONAL) GOOGLE GEOCODING ======
  async function buscarCoordenadasGoogle() {
    const apiKey = "SUA_GOOGLE_API_KEY_AQUI" // <-- coloque sua API aqui
    const query = `${form.endereco}, ${form.cidade}, ${form.estado}, ${form.cep}`
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
    
    const res = await fetch(url)
    const data = await res.json()

    if (!data.results?.length) throw new Error("Endereço não encontrado no Google")

    const loc = data.results[0].geometry.location
    return { lat: loc.lat, lon: loc.lng }
  }

  async function calcularCoords() {
    try {
      setLoadingGeo(true)
      let result

      // preferencia: Nominatim (grátis)
      result = await buscarCoordenadasNominatim()

      setCoords(result)
      setShowMap(true)
      alert("✅ Localização encontrada!")
      
    } catch (e) {
      alert("❌ Erro ao buscar localização.")
    } finally {
      setLoadingGeo(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!coords) return alert("Busque a localização antes de cadastrar!")

    try {
      const token = localStorage.getItem("token")

      const empresaRes = await fetch("https://localhost:7273/api/Empresa", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, latitude: coords.lat, longitude: coords.lon })
      })

      const empresa = await empresaRes.json()

      for (const s of servicos)
        await fetch("https://localhost:7273/api/Servico", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...s, empresaId: empresa.id })
        })

      for (const p of profissionais)
        await fetch("https://localhost:7273/api/Profissional", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...p, empresaId: empresa.id })
        })

      alert("✅ Empresa cadastrada com sucesso!")

    } catch {
      alert("❌ Erro ao cadastrar.")
    }
  }

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const addServico = () => setServicos([...servicos, { nome: "", preco: "", duracaoEmMinutos: "" }])
  const addProfissional = () => setProfissionais([...profissionais, { nome: "", especialidade: "" }])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-neutral-900 p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-5 text-blue-400">Cadastro de Empresa</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {Object.keys(form).map((field) => (
            <div key={field}>
              <label className="capitalize text-gray-300">{field}</label>
              <input name={field} value={(form as any)[field]} onChange={handleChange}
                className="w-full bg-neutral-800 p-2 rounded mt-1" required />
            </div>
          ))}

          {/* BOTÃO BUSCAR GEO */}
          <button type="button"
            onClick={calcularCoords}
            className="w-full bg-yellow-500 py-2 rounded mt-2 font-bold">
            {loadingGeo ? "Buscando localização..." : "Buscar localização"}
          </button>

          {/* PREVIEW MAP */}
          {showMap && coords && (
            <iframe
              className="w-full h-64 rounded mt-3"
              src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${coords.lat},${coords.lon}`}
            />
          )}

          {/* Serviços */}
          <h2 className="text-xl font-bold text-blue-400 mt-6">Serviços</h2>
          {servicos.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input placeholder="Nome" name="nome" value={s.nome} onChange={e=>{const a=[...servicos];a[i].nome=e.target.value;setServicos(a);}} className="bg-neutral-800 p-2 rounded" />
              <input placeholder="Preço" name="preco" value={s.preco} onChange={e=>{const a=[...servicos];a[i].preco=e.target.value;setServicos(a);}} className="bg-neutral-800 p-2 rounded" />
              <input placeholder="Duração" name="duracaoEmMinutos" value={s.duracaoEmMinutos} onChange={e=>{const a=[...servicos];a[i].duracaoEmMinutos=e.target.value;setServicos(a);}} className="bg-neutral-800 p-2 rounded" />
            </div>
          ))}
          <button type="button" onClick={addServico} className="bg-gray-700 p-2 rounded">+ Serviço</button>

          {/* Profissionais */}
          <h2 className="text-xl font-bold text-blue-400 mt-6">Profissionais</h2>
          {profissionais.map((p, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input placeholder="Nome" value={p.nome} onChange={e=>{const a=[...profissionais];a[i].nome=e.target.value;setProfissionais(a);}} className="bg-neutral-800 p-2 rounded" />
              <input placeholder="Especialidade" value={p.especialidade} onChange={e=>{const a=[...profissionais];a[i].especialidade=e.target.value;setProfissionais(a);}} className="bg-neutral-800 p-2 rounded" />
            </div>
          ))}
          <button type="button" onClick={addProfissional} className="bg-gray-700 p-2 rounded">+ Profissional</button>

          {/* SUBMIT */}
          <button className="w-full bg-blue-600 py-3 rounded mt-4 font-bold">
            Cadastrar Empresa
          </button>
          <Link href="/empresas" className="block text-center mt-4 text-blue-400 hover:underline">
                Ver empresas cadastradas
          </Link>
        </form>
      </div>
    </div>
  )
}
