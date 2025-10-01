import React, { useState } from 'react'
import { motion } from 'framer-motion'
import UrgencyTimer from '@components/common/UrgencyTimer'
import ContactModal from '../common/ContactModal'

const CTA = () => {
  const [showModal, setShowModal] = useState(false)

  const handleContactClick = () => {
    setShowModal(true)
  }

  const handleVerPlanesClick = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-500">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            ¿Listo para Transformar tu Vida?
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-800 mb-8 leading-relaxed font-medium">
            Cábala Activa no es teoría: son herramientas prácticas que transforman tu vida 
            en lo personal, familiar, espiritual y profesional.
          </p>

          {/* TESTIMONIO DESTACADO - PRUEBA SOCIAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-slate-900/30 shadow-2xl"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
            </div>
            <blockquote className="text-lg md:text-xl text-slate-900 italic font-medium mb-4">
              "El trabajo con el Rabbí Isaac ha sido la experiencia más transformadora de mi vida. 
              Las herramientas cabalísticas me han ayudado a comprender aspectos profundos de mi ser."
            </blockquote>
            <cite className="text-slate-700 font-semibold">
              — María Elena González, España
            </cite>
          </motion.div>

          {/* GARANTÍA INTEGRADA - REDUCCIÓN DE RIESGO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-green-500/20 border-2 border-green-600/40 rounded-2xl p-8 mb-12 shadow-lg"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-green-700 font-bold text-2xl">
                GARANTÍA TOTAL DE SATISFACCIÓN
              </h3>
            </div>
            <p className="text-green-800 text-lg font-medium">
              Si no experimentas una transformación significativa en los primeros 30 días, 
              te devolvemos el 100% de tu inversión. Sin preguntas.
            </p>
          </motion.div>

          {/* LLAMADOS A LA ACCIÓN OPTIMIZADOS */}
          <div className="space-y-6">
            <UrgencyTimer />
            
            {/* BOTONES DE CONVERSIÓN DIRECTA */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-900/20 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                🚀 Comienza tu Transformación Ahora
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* PAQUETE COMPLETO - STRIPE */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 text-slate-900 shadow-lg border-2 border-yellow-600"
                >
                  <div className="text-center mb-4">
                    <span className="bg-slate-900 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold">
                      MÁS POPULAR
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Paquete de Transformación Completa</h4>
                  <p className="text-sm mb-4 opacity-90">4 herramientas cabalísticas + sesiones personalizadas</p>
                  <div className="text-3xl font-bold mb-4">$997 USD</div>
                  <a
                    href={import.meta.env.VITE_STRIPE_CHECKOUT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-slate-900 text-yellow-500 py-4 px-6 rounded-lg font-bold text-center hover:bg-slate-800 transition-colors"
                  >
                    ⚡ Transformar mi Vida Ahora
                  </a>
                </motion.div>

                {/* SESIÓN ÚNICA - PAYPAL */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/50 rounded-xl p-6 text-slate-900 shadow-lg border-2 border-slate-300"
                >
                  <h4 className="text-xl font-bold mb-2">Sesión Individual</h4>
                  <p className="text-sm mb-4 opacity-90">Consulta personalizada de 90 minutos</p>
                  <div className="text-3xl font-bold mb-4">$297 USD</div>
                  <a
                    href={import.meta.env.VITE_PAYPAL_SINGLE_SESSION}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-center hover:bg-blue-700 transition-colors"
                  >
                    💙 Reservar Sesión Única
                  </a>
                </motion.div>
              </div>

              <p className="text-slate-700 text-sm mt-6 text-center">
                ✅ Pago seguro • ✅ Acceso inmediato • ✅ Garantía 30 días
              </p>
            </div>
            
            {/* BOTÓN ALTERNATIVO - VER MÁS OPCIONES */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerPlanesClick}
              className="bg-slate-900/20 text-slate-900 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-slate-900/30 transition-all duration-300 mx-auto block"
            >
              Ver Todas las Opciones
            </motion.button>

            {/* OPCIÓN SECUNDARIA - CONTACTO PARA DUDAS */}
            <div className="pt-4">
              <button
                onClick={handleContactClick}
                className="text-slate-700 hover:text-slate-900 font-semibold text-lg underline decoration-2 underline-offset-4 transition-colors"
              >
                ¿Todavía tienes dudas? Contáctanos
              </button>
            </div>
            
            <p className="text-slate-700 text-sm">
              ✅ Respuesta inmediata • ✅ Sin compromisos • ✅ Consulta gratuita
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900">30+</div>
              <div className="text-slate-800 text-sm">Años experiencia</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">5000+</div>
              <div className="text-slate-800 text-sm">Vidas transformadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">4</div>
              <div className="text-slate-800 text-sm">Herramientas únicas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-slate-800 text-sm">Resultados reales</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <ContactModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        herramienta="Sesión Cabalística"
      />
    </section>
  )
}

export default CTA