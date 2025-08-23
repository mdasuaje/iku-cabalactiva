import React from 'react'
import { motion } from 'framer-motion'
import { paquetes } from '@data/herramientas'

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Planes y <span className="text-yellow-500">Precios</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tu camino espiritual
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {paquetes.map((paquete, index) => (
            <motion.div
              key={paquete.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border-2 ${
                paquete.id === 'paquete-completo' 
                  ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' 
                  : 'border-slate-600'
              }`}
            >
              {paquete.id === 'paquete-completo' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {paquete.nombre}
                </h3>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">
                    ${paquete.precio}
                  </div>
                  {paquete.precioFinanciado && (
                    <div className="text-gray-300 text-sm">
                      o 3 pagos de ${paquete.precioFinanciado[0]}
                    </div>
                  )}
                </div>

                <p className="text-gray-300 mb-6">
                  {paquete.descripcion}
                </p>

                <ul className="space-y-3 mb-8">
                  {paquete.incluye.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="text-yellow-500 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    paquete.id === 'paquete-completo'
                      ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400'
                      : 'bg-slate-600 text-white hover:bg-slate-500'
                  }`}
                >
                  Seleccionar Plan
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            ¿Necesitas más información? Contáctanos directamente
          </p>
          <button
            onClick={() => window.open('https://wa.me/1234567890', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            💬 Consultar por WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing