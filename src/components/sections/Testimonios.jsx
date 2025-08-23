import React from 'react'
import { motion } from 'framer-motion'

const Testimonios = () => {
  const testimonios = [
    {
      id: 1,
      nombre: 'María Elena González',
      pais: 'España',
      comentario: 'El trabajo con el Maestro Isaac ha sido la experiencia más transformadora de mi vida. Las herramientas cabalísticas me han ayudado a comprender aspectos profundos de mi ser.',
      rating: 5,
      herramienta: 'Paquete Completo'
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza',
      pais: 'México',
      comentario: 'La constelación familiar me ayudó a entender patrones que se repetían en mi familia durante generaciones. Fue una experiencia transformadora.',
      rating: 5,
      herramienta: 'Constelación Familiar'
    },
    {
      id: 3,
      nombre: 'Ana Rodríguez',
      pais: 'Argentina',
      comentario: 'Después de la limpieza áurica siento una claridad mental y emocional que no había experimentado antes. Mi conexión espiritual se fortaleció.',
      rating: 5,
      herramienta: 'Limpieza Áurica'
    }
  ]

  return (
    <section id="testimonios" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Testimonios de <span className="text-yellow-500">Transformación</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre cómo las herramientas cabalísticas han transformado la vida de nuestros estudiantes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonios.map((testimonio, index) => (
            <motion.div
              key={testimonio.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonio.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">★</span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">
                "{testimonio.comentario}"
              </p>
              
              <div className="border-t border-gray-600 pt-4">
                <div className="font-semibold text-white">
                  {testimonio.nombre}
                </div>
                <div className="text-gray-400 text-sm">
                  {testimonio.pais} • {testimonio.herramienta}
                </div>
              </div>
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
            ¿Listo para tu propia transformación espiritual?
          </p>
          <button className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Comenzar mi Camino
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonios