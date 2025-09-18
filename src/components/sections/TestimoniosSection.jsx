import { motion } from 'framer-motion'
import TestimoniosCarousel from '../common/TestimoniosCarousel'

/**
 * Sección de Testimonios
 *
 * @component
 * @returns {JSX.Element} Componente de sección de testimonios
 */
const TestimoniosSection = () => {
  return (
    <section
      id="testimonios"
      className="py-20 bg-slate-800 bg-[url('/images/kabbalah-patterns-bg.svg')] bg-fixed bg-blend-overlay bg-opacity-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Testimonios de <span className="text-amber-500">Transformación</span>
          </h2>
          <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
            Descubre cómo las herramientas cabalísticas han transformado la vida de nuestros
            estudiantes
          </p>
        </motion.div>

        {/* Carrusel de testimonios */}
        <TestimoniosCarousel />

        {/* CTA después de testimonios */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-amber-200 mb-6 text-lg">
            ¿Listo para iniciar tu propia historia de transformación?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() =>
                document.getElementById('herramientas')?.scrollIntoView({ behavior: 'smooth' })
              }
              aria-label="Comenzar mi camino espiritual - Ver herramientas disponibles"
              className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-8 py-3 rounded-md shadow-lg hover:shadow-amber-500/30 font-semibold transition duration-300 transform hover:scale-105"
            >
              Descubrir Herramientas
            </button>
            <button
              onClick={() =>
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="border border-amber-500 text-amber-400 hover:bg-amber-500/10 px-8 py-3 rounded-md font-semibold transition duration-300"
            >
              Consulta Personalizada
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimoniosSection
