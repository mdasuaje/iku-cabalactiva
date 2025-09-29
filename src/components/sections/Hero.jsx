import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ContactModal from '../common/ContactModal'

const Hero = () => {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background inmersivo con múltiples capas */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-800"></div>
      
      {/* Efectos atmosféricos cabalísticos */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-500/3 to-transparent rounded-full"></div>
      </div>

      {/* Partículas de luz flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-float-delay"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-300/25 rounded-full animate-float-slow"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Layout centrado y inmersivo */}
        <div className="flex flex-col items-center text-center space-y-8 max-w-6xl mx-auto">
          
          {/* Imagen del Maestro como elemento dominante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative mb-6"
          >
            {/* Aura mística alrededor del Maestro */}
            <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500/20 via-purple-500/15 to-yellow-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/10 to-purple-600/10 rounded-full blur-xl"></div>
            
            {/* Container de la imagen con efectos */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-purple-500/30 rounded-full blur-sm"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-2xl">
                <img 
                  src="/images/maestro/isaac-benzaquen-con-firma.jpg" 
                  alt="Rabbí Isaac Benzaquén - Maestro de Cábala"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Anillos de luz cabalísticos */}
              <div className="absolute -inset-2 rounded-full border border-yellow-500/20 animate-spin-slow"></div>
              <div className="absolute -inset-6 rounded-full border border-purple-500/15 animate-spin-reverse-slow"></div>
            </div>
          </motion.div>

          {/* Título y subtítulo rediseñados */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Nombre del Maestro como elemento principal */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-500 mb-2 tracking-wide">
              Rabbí Isaac Benzaquén
            </h2>
            
            {/* Título de la plataforma */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              <span className="inline-block">IKU</span> <span className="text-yellow-500 inline-block">Cábala</span> <span className="inline-block">Activa</span>
            </h1>
            
            {/* Filosofía central */}
            <div className="max-w-4xl mx-auto space-y-3">
              <p className="text-xl md:text-2xl lg:text-3xl text-yellow-400 font-semibold leading-relaxed">
                "Transforma tu realidad y atrae abundancia de todo lo bueno a tu vida"
              </p>
              <p className="text-lg md:text-xl text-purple-300 font-medium">
                Sabiduría milenaria para tiempos modernos
              </p>
            </div>
          </motion.div>

          {/* Credenciales del Maestro de forma elegante */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30 shadow-2xl max-w-4xl"
          >
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">25+</div>
                <div className="text-gray-300 font-medium">Años de experiencia cabalística</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">5000+</div>
                <div className="text-gray-300 font-medium">Vidas transformadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">∞</div>
                <div className="text-gray-300 font-medium">Sabiduría ancestral</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-yellow-500/20">
              <p className="text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">
                Especializado en herramientas espirituales que conectan con la esencia divina, 
                sanando el alma y manifestando abundancia en todos los aspectos de la vida.
              </p>
            </div>
          </motion.div>

          {/* CTAs rediseñados */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4"
          >
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25"
            >
              🕊️ Iniciar mi Transformación
            </button>
            
            <button 
              onClick={() => document.getElementById('herramientas')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-3 border-purple-400 text-purple-300 px-10 py-5 rounded-full font-bold text-xl hover:bg-purple-500/20 hover:border-purple-300 transition-all duration-300 backdrop-blur-sm"
            >
              ✨ Explorar Herramientas Sagradas
            </button>
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