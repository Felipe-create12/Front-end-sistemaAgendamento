"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Sun, Moon, ChevronDown, LogOut, Bell } from "lucide-react"
import { useTheme } from "next-themes"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [language, setLanguage] = useState<"br" | "en">("br")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const hiddenMenuRoutes = ["/login"]
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLogged(!!token)
    setMounted(true)

    // Recupera idioma salvo
    const savedLang = localStorage.getItem("lang")
    if (savedLang === "en" || savedLang === "br") setLanguage(savedLang)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleLanguage = () => {
    const newLang = language === "br" ? "en" : "br"
    setLanguage(newLang)
    localStorage.setItem("lang", newLang)
  }

  if (!mounted) return null

  return (
    <header className="bg-[#0D0D0D] text-white shadow-md sticky top-0 z-50 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-semibold text-blue-400">AgendeJá</span>
        </Link>

        {/* MENU DESKTOP */}
        {!hiddenMenuRoutes.includes(pathname) && (
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className={`hover:text-blue-400 transition ${pathname === "/" ? "text-blue-400" : ""}`}>
              {language === "br" ? "Início" : "Home"}
            </Link>
            <Link href="/buscar" className={`hover:text-blue-400 transition ${pathname === "/buscar" ? "text-blue-400" : ""}`}>
              {language === "br" ? "Buscar" : "Search"}
            </Link>
            <Link href="/agendamentos" className={`hover:text-blue-400 transition ${pathname === "/agendamentos" ? "text-blue-400" : ""}`}>
              {language === "br" ? "Agendamentos" : "Bookings"}
            </Link>
          </nav>
        )}

        {/* AÇÕES À DIREITA */}
        <div className="flex items-center gap-2 sm:gap-3 relative" ref={dropdownRef}>
          {/* ÍCONE DE NOTIFICAÇÕES */}
          <button
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition relative"
            title={language === "br" ? "Notificações" : "Notifications"}
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>

          {/* BOTÃO DE IDIOMA */}
          <button
            onClick={toggleLanguage}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            title={language === "br" ? "Mudar idioma para Inglês" : "Change language to Portuguese"}
          >
            <img
              src={language === "br" ? "https://flagcdn.com/w20/br.png" : "https://flagcdn.com/w20/us.png"}
              alt={language === "br" ? "BR" : "EN"}
              className="w-6 h-6 rounded-full object-cover"
            />
          </button>

          {/* PERFIL */}
          {isLogged && (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-gray-800 px-2 sm:px-3 py-1.5 rounded-full hover:bg-gray-700 transition gap-1 sm:gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="size-6 text-gray-300">
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653Zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438ZM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
          )}

          {/* DROPDOWN PERFIL */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-36 bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-800 overflow-hidden animate-fadeIn">
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user") // Limpa nome do usuário
                  window.location.href = "/"
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#E6005A] hover:bg-[#ff006e] text-white py-2 text-sm font-medium transition"
              >
                <LogOut size={16} />
                {language === "br" ? "Sair" : "Logout"}
              </button>
            </div>
          )}

          {/* BOTÃO DE TEMA */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            title={language === "br" ? "Alterar tema" : "Toggle theme"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* LOGIN (caso deslogado) */}
          {!isLogged && (
            <Link
              href="/login"
              className="block bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-700 text-sm transition"
            >
              {language === "br" ? "Entrar" : "Login"}
            </Link>
          )}
        </div>
      </div>

      {/* MENU MOBILE */}
      {!hiddenMenuRoutes.includes(pathname) && (
        <nav className="flex md:hidden justify-around bg-[#111] border-t border-gray-800 py-2 text-sm">
          <Link href="/" className={`flex flex-col items-center ${pathname === "/" ? "text-blue-400" : "text-gray-400"}`}>
            {language === "br" ? "Início" : "Home"}
          </Link>
          <Link href="/buscar" className={`flex flex-col items-center ${pathname === "/buscar" ? "text-blue-400" : "text-gray-400"}`}>
            {language === "br" ? "Buscar" : "Search"}
          </Link>
          <Link href="/agendamentos" className={`flex flex-col items-center ${pathname === "/agendamentos" ? "text-blue-400" : "text-gray-400"}`}>
            {language === "br" ? "Agendar" : "Book"}
          </Link>
        </nav>
      )}
    </header>
  )
}
