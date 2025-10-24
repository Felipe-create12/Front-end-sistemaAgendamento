"use client"
import Link from "next/link"
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-gray-300 pt-10 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo e descrição */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg md:text-xl font-semibold text-blue-400">AgendeJá</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Uma nova experiência<br />para uma antiga tradição.
          </p>
          <div className="flex space-x-4 text-gray-400 mt-4">
            <Link href="#"><FaFacebook className="hover:text-white" /></Link>
            <Link href="#"><FaInstagram className="hover:text-white" /></Link>
            <Link href="#"><FaYoutube className="hover:text-white" /></Link>
            <Link href="#"><FaTwitter className="hover:text-white" /></Link>
          </div>
        </div>

        {/* Acesso rápido */}
        <div>
          <h3 className="text-white font-semibold mb-3">Acesso rápido</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Início</Link></li>
            <li><Link href="/buscar" className="hover:text-white">Encontrar estabelecimentos</Link></li>
            <li><Link href="/meus-agendamentos" className="hover:text-white">Meus agendamentos</Link></li>
            <li><Link href="/favoritos" className="hover:text-white">Favoritos</Link></li>
          </ul>
        </div>

        {/* Mais */}
        <div>
          <h3 className="text-white font-semibold mb-3">Mais</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/termos" className="hover:text-white">Termos de uso</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Preferências de cookies</Link></li>
          </ul>
        </div>

        {/* Cadastro de gestor */}
        <div>
          <h3 className="text-white font-semibold mb-3">É um gestor?</h3>
          <p className="text-sm text-gray-400 mb-3">
            Cadastre seu estabelecimento e comece a receber agendamentos online.
          </p>
          <Link
            href="/gestor"
            className="inline-block px-4 py-2 bg-[#111] border border-gray-700 rounded-md text-sm text-white hover:bg-gray-800 transition"
          >
            Saiba mais
          </Link>
        </div>
      </div>

      {/* Linha final */}
      <div className="border-t border-gray-800 mt-10 pt-4 text-center text-sm text-gray-500">
        © 2025 StarApp Sistemas. Todos os direitos reservados.
      </div>
    </footer>
  )
}
