import React from 'react'
import { motion } from 'framer-motion'
import { SOCIAL_LINKS } from '@utils/constants'

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-yellow-500/5 to-purple-500/5"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            IKU <span className="text-yellow-500">Cábala</span> Activa
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            ¿Sientes que repites patrones una y otra vez? La Cábala Activa te muestra el 'por qué' y el 'para qué'. 
            <span className="text-yellow-500 font-semibold">Da el primer paso hacia una vida plena</span>
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => {
                const message = encodeURIComponent('Hola, quiero mi sesión de Cábala Activa. ¿Podrías guiarme?')
                window.open(`https://wa.me/${SOCIAL_LINKS.whatsapp.number.replace('+', '')}?text=${message}`, '_blank')
              }}
              className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
            >
              💬 Quiero mi Sesión
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
      </div>
    </section>
  )
}

export default Hero