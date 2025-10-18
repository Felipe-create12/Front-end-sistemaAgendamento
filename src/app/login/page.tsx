"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("https://localhost:7273/api/Seguranca/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, senha }),
      })

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos.")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">Entrar</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuário</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 transition rounded p-2 font-medium"
          >
            Entrar
          </button>

          <Link  href="/register" className="flex">Não possui uma conta? <p className="text-blue-700 ml-1.5">Cadastre-se</p></Link>
        </form>
      </div>
    </div>
  )
}
