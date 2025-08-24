import React from 'react'
import { motion } from 'framer-motion'
import { herramientasCabalisticas } from '@data/herramientas'
import { openWhatsApp, WHATSAPP_MESSAGES } from '@utils/whatsapp'

const Herramientas = () => {
  return (
    <section id="herramientas" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Herramientas <span className="text-yellow-500">Cabalísticas</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre las cuatro herramientas espirituales que transformarán tu conexión con la sabiduría ancestral
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {herramientasCabalisticas.map((herramienta, index) => (
            <motion.div
              key={herramienta.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {herramienta.nombre}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {herramienta.descripcion}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-yellow-500 font-bold text-lg">
                    ${herramienta.precio} {herramienta.moneda}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {herramienta.duracion}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-2">
                    <p className="text-green-400 text-xs font-semibold text-center">
                      🎁 DESCUENTO 20% - Solo esta semana
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      try {
                        const paypalWindow = window.open(herramienta.paypalLink, '_blank')
                        if (!paypalWindow) {
                          window.location.href = herramienta.paypalLink
                        }
                      } catch (error) {
                        window.location.href = herramienta.paypalLink
                      }
                    }}
                    className="w-full bg-yellow-500 text-slate-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors transform hover:scale-105"
                  >
                    💳 ADQUIRIR AHORA
                  </button>
                  <button 
                    onClick={() => {
                      const message = `Hola, quiero consultar sobre ${herramienta.nombre}. ¿Incluye garantía de 30 días?`
                      openWhatsApp(message)
                    }}
                    className="w-full border border-green-500 text-green-500 py-2 rounded-lg font-semibold hover:bg-green-500/10 transition-colors text-sm"
                  >
                    💬 Consultar Garantía
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Herramientas