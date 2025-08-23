import React from 'react'
import { motion } from 'framer-motion'

const ValueProposition = () => {
  const benefits = [
    {
      icon: '🔑',
      title: 'Transformación Real',
      description: 'No borramos tus problemas, te damos las llaves para transformarlos en oportunidades'
    },
    {
      icon: '🌟',
      title: 'Herramientas Prácticas',
      description: 'Cábala Activa aplicada a situaciones reales: personal, familiar, espiritual y profesional'
    },
    {
      icon: '💎',
      title: 'Sabiduría Ancestral',
      description: 'Conocimiento milenario adaptado para resolver desafíos del mundo moderno'
    },
    {
      icon: '🎯',
      title: 'Resultados Medibles',
      description: 'Cambios concretos en tu vida, relaciones, salud y propósito espiritual'
    }
  ]

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
            ¿Por qué <span className="text-yellow-500">Cábala Activa</span> Funciona?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            El obstáculo más fuerte no está afuera: está en cómo lo interpretas. 
            Descubre por qué miles de personas han transformado su vida con nuestro método.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/30 transition-colors">
                <span className="text-3xl">{benefit.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 rounded-2xl p-8 border border-yellow-500/20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Propuesta de Valor Central
          </h3>
          <p className="text-lg text-yellow-400 font-semibold italic">
            "Cábala Activa no es teoría: son herramientas prácticas que transforman tu vida 
            en lo personal, familiar, espiritual y profesional."
          </p>
          <p className="text-gray-300 mt-4">
            - Maestro y Rabino Isaac Benzaquén
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ValueProposition