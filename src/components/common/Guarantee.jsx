import React from 'react'
import { motion } from 'framer-motion'

const Guarantee = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6"
    >
      <div className="flex items-center justify-center mb-3">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
          <span className="text-2xl">🛡️</span>
        </div>
        <h3 className="text-green-400 font-bold text-lg">
          GARANTÍA TOTAL DE SATISFACCIÓN
        </h3>
      </div>
      <p className="text-green-300 text-center text-sm">
        Si no experimentas una transformación significativa en los primeros 30 días, 
        te devolvemos el 100% de tu inversión. Sin preguntas.
      </p>
    </motion.div>
  )
}

export default Guarantee