// components/LoadingScreen.tsx
"use client"

export default function LoadingScreen({ message = "Carregando..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 mb-4"></div>
        {/* Mensagem */}
        <p className="text-white text-lg font-semibold">{message}</p>
      </div>
    </div>
  )
}
