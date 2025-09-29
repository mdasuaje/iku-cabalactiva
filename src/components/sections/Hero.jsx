import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ContactModal from '../common/ContactModal'

const Hero = () => {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-yellow-500/5 to-purple-500/5"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Columna Derecha - Contenido (Orden 1 en móvil) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left order-1 md:order-2"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="inline-block">IKU</span> <span className="text-yellow-500 inline-block">Cábala</span> <span className="inline-block">Activa</span>
            </h1>
            
            <div className="space-y-4 text-gray-300 mb-8">
              <p className="text-lg md:text-xl leading-relaxed">
                Transforma tu realidad y atrae abundancia de todo lo bueno a tu vida
              </p>
              <p className="text-yellow-500 font-semibold text-lg md:text-xl">
                Sabiduría milenaria para tiempos modernos
              </p>
            </div>

            {/* Información del Rabbí integrada */}
            <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-yellow-500/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                <span className="text-yellow-500">Rabbí Isaac Benzaquén</span>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Más de 25 años de experiencia en la enseñanza y práctica de la Cábala. 
                Especializado en herramientas espirituales que transforman vidas y atraen 
                abundancia en todas sus formas.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-yellow-500 font-bold text-xl">25+</div>
                  <div className="text-xs text-gray-400">Años de experiencia</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-yellow-500 font-bold text-xl">5000+</div>
                  <div className="text-xs text-gray-400">Vidas transformadas</div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center"
            >
              <button 
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
              >
                ✉️ Quiero mi Sesión
              </button>
              
              <button 
                onClick={() => document.getElementById('herramientas')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500/10 transition-colors cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                Conocer Herramientas
              </button>
            </motion.div>
          </motion.div>

          {/* Columna Izquierda - Imagen del Maestro (Orden 2 en móvil) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 md:order-1"
          >
            <div className="relative max-h-96 mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-purple-500/20 rounded-2xl overflow-hidden">
                <img 
                  src="/images/maestro/isaac-benzaquen-con-firma.jpg" 
                  alt="Rabbí Isaac Benzaquén - IKU Cábala Activa"
                  className="max-h-96 w-auto object-contain mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <ContactModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        herramienta="Sesión Cabalística"
      />
    </section>
  )
}

export default Hero