import React from 'react'
import { motion } from 'framer-motion'
import { filosofiaCabalaActiva } from '@data/herramientas'

const Philosophy = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Cábala Activa: Un camino hacia la{' '}
            <span className="text-yellow-500">felicidad y la plenitud</span>
          </h2>
          
          <div className="text-lg text-gray-300 leading-relaxed space-y-6 mb-12">
            <p>
              ¿Sientes que hay algo que te detiene? Esos obstáculos que parecen imposibles de superar, 
              esos desafíos personales que no sabes cómo resolver. ¿Te gustaría encontrar una sanación 
              que vaya más allá del cuerpo, que sane tus emociones y tu espíritu, liberándote de cargas 
              pasadas para abrirte a nuevas posibilidades?
            </p>
            
            <p>
              Imagina una transformación profunda. Un camino de crecimiento constante que te permite 
              evolucionar, expandir tu conciencia y encontrar un nuevo sentido a cada parte de tu vida: 
              tu pareja, tu familia, tu salud. Descubre el propósito sagrado detrás de cada relación y evento.
            </p>
            
            <p className="text-yellow-400 font-semibold">
              Más que una simple felicidad, encontrarás una alegría verdadera, una dicha que nace de tu 
              conexión con algo más grande que tú mismo. Es una sensación de plenitud que te hace sentir 
              completo, invencible y confiado en la vida.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20 mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              La Sabiduría Ancestral de la Cábala קבלה
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Este camino se basa en la antigua sabiduría de la Cábala, una enseñanza ancestral cuya 
              efectividad ha sido probada y comprobada. Te empoderará para crear una nueva realidad, 
              llena de plenitud y bendiciones. Esto es precisamente lo que te ofrece Cábala Activa 
              a través de sus cuatro poderosas Herramientas Cabalísticas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-700/30 rounded-lg p-6 border border-yellow-500/20"
            >
              <h4 className="text-xl font-semibold text-yellow-500 mb-3">
                Aplicación Práctica
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Cábala Activa trasciende la mera teoría. Su objetivo es aplicar el conocimiento 
                cabalístico a situaciones prácticas de la vida, abarcando el crecimiento personal, 
                la superación de desafíos en la salud, las relaciones y el desarrollo espiritual.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-700/30 rounded-lg p-6 border border-yellow-500/20"
            >
              <h4 className="text-xl font-semibold text-yellow-500 mb-3">
                Guía Experta
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Con la guía amable y experta del Rabino y Maestro de Cábala Isaac Benzaquén, 
                un líder espiritual con décadas de experiencia, podrás alinear tu ser interior 
                con tu propósito de vida y experimentar una profunda armonía.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105">
              Comenzar mi Transformación
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Philosophy