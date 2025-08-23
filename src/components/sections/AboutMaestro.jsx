import React from 'react'
import { motion } from 'framer-motion'

const AboutMaestro = () => {
  return (
    <section id="maestro" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagen del Maestro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative max-h-96 mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-purple-500/20 rounded-2xl overflow-hidden">
                <img 
                  src="/images/maestro/isaac-benzaquen-con-firma.jpg" 
                  alt="Rabino y Maestro Isaac Benzaquén con firma"
                  className="max-h-96 w-auto object-contain mx-auto"
                />
                <div className="w-full h-full bg-yellow-500/30 rounded-2xl flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-6xl">👨‍🏫</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Información del Maestro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Maestro <span className="text-yellow-500">Isaac Benzaquén</span>
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed">
                Rabino y Maestro de Cábala con más de 25 años de experiencia en la enseñanza 
                y práctica de la sabiduría ancestral judía.
              </p>
              
              <p>
                Especializado en herramientas espirituales cabalísticas que transforman vidas, 
                el Maestro Isaac ha guiado a miles de personas en su camino de crecimiento 
                espiritual y autoconocimiento.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-yellow-500 font-bold text-2xl">25+</div>
                  <div className="text-sm">Años de experiencia</div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-yellow-500 font-bold text-2xl">5000+</div>
                  <div className="text-sm">Personas transformadas</div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-yellow-500 font-bold text-2xl">4</div>
                  <div className="text-sm">Herramientas principales</div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-yellow-500 font-bold text-2xl">∞</div>
                  <div className="text-sm">Sabiduría ancestral</div>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-yellow-500 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Conocer más sobre el Maestro
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutMaestro