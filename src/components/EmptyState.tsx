"use client"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-300">
      {/* Ícone com animação */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="mb-4"
      >
        <Search className="w-20 h-20 text-blue-500" />
      </motion.div>

      {/* Texto animado */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-white"
      >
        Faça login para continuar
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-400 mt-2 max-w-sm"
      >
        Agende e pague online, resgate itens do programa de fidelidade e muito mais
      </motion.p>
    </div>
  )
}
