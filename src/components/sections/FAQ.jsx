import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactModal from '../common/ContactModal'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const faqs = [
    {
      pregunta: '¿Qué es la Cábala y cómo puede ayudarme?',
      respuesta: 'La Cábala es la sabiduría ancestral judía que estudia la naturaleza divina y la conexión del ser humano con el Creador. Te ayuda a comprender tu propósito de vida, sanar patrones limitantes y desarrollar tu potencial espiritual.'
    },
    {
      pregunta: '¿Necesito conocimientos previos de Cábala?',
      respuesta: 'No es necesario tener conocimientos previos. El Maestro Isaac adapta cada sesión al nivel de comprensión de cada persona, desde principiantes hasta estudiantes avanzados.'
    },
    {
      pregunta: '¿Cómo funcionan las sesiones online?',
      respuesta: 'Las sesiones se realizan por videollamada en un ambiente privado y seguro. Recibirás un enlace de acceso y todo el material de apoyo necesario. La calidad de la transmisión espiritual es la misma que en persona.'
    },
    {
      pregunta: '¿Cuánto tiempo dura cada herramienta?',
      respuesta: 'Cada herramienta tiene una duración específica: Carta Astral y Meditación (60-90 min), Constelación Familiar (90-120 min), y Limpieza Áurica (120-150 min). El tiempo puede extenderse según las necesidades.'
    },
    {
      pregunta: '¿Qué incluye el seguimiento post-sesión?',
      respuesta: 'Incluye material de apoyo personalizado, seguimiento por WhatsApp durante 7-14 días según la herramienta, y acceso a recursos adicionales para profundizar en tu práctica espiritual.'
    },
    {
      pregunta: '¿Puedo combinar diferentes herramientas?',
      respuesta: 'Sí, de hecho es recomendable. El Paquete Completo incluye las 4 herramientas con un enfoque integral para tu transformación espiritual durante 6 meses.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Preguntas <span className="text-yellow-500">Frecuentes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestras herramientas cabalísticas
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.pregunta}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-yellow-500 text-xl flex-shrink-0"
                  >
                    ▼
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-700/30 rounded-b-lg p-6 border-x border-b border-yellow-500/20">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.respuesta}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-6">
            ¿Tienes más preguntas? Contáctanos directamente
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ✉️ Contactar por Email
          </button>
        </motion.div>
        
        <ContactModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          herramienta="Consulta FAQ"
        />
      </div>
    </section>
  )
}

export default FAQ