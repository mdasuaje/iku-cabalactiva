import React from 'react'
import { motion } from 'framer-motion'
import SocialLinks from '@components/common/SocialLinks'

const SocialProof = () => {
  const stats = [
    {
      number: '30+',
      label: 'Años de experiencia',
      description: 'en enseñanza cabalística'
    },
    {
      number: '5000+',
      label: 'Estudiantes transformados',
      description: 'en todo el mundo'
    },
    {
      number: '4',
      label: 'Herramientas principales',
      description: 'de transformación espiritual'
    },
    {
      number: '6',
      label: 'Plataformas sociales',
      description: 'para conectar contigo'
    }
  ]

  return (
    <section className="py-16 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Únete a Nuestra <span className="text-yellow-500">Comunidad Global</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Conecta con miles de estudiantes de Cábala en nuestras redes sociales y canales oficiales
          </p>
        </motion.div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                {stat.number}
              </div>
              <div className="text-white font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Redes Sociales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Síguenos en Nuestras Redes Sociales
          </h3>
          <div className="flex justify-center">
            <SocialLinks variant="extended" className="justify-center" />
          </div>
          
          <div className="mt-8 p-6 bg-slate-700/30 rounded-lg border border-yellow-500/20 max-w-2xl mx-auto">
            <p className="text-gray-300 text-sm mb-4">
              <strong className="text-yellow-500">Instituto de Kabbalah Universal</strong> - 
              El grupo más completo de Kabbalah קבלה Cábala en español
            </p>
            <p className="text-gray-400 text-xs">
              Transformación espiritual personal a través de la Kabbalah קבלה Cábala
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialProof