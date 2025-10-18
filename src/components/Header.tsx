"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const hiddenMenuRoutes = ["/login"]
  const [isLogged, setIsLogged] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLogged(!!token)
  }, [pathname])

  

  return (
    <header className="bg-[#0D0D0D] text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-appbarber.png" alt="" className="h-8" />
          <span className="text-lg font-semibold text-blue-400">AgendeJá</span>
        </Link>

        {!hiddenMenuRoutes.includes(pathname) && (
          <nav className="flex items-center gap-8">
            <Link href="/" className="hover:text-blue-400 transition">Início</Link>
            <Link href="/buscar" className="hover:text-blue-400 transition">Buscar</Link>
            <Link href="/agendamentos" className="hover:text-blue-400 transition">Meus Agendamentos</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-gray-500">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
          {isLogged ? (
            <button
              onClick={() => {
                localStorage.removeItem("token")
                window.location.href = "/"
              }}
              className="bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 transition"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 transition"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
