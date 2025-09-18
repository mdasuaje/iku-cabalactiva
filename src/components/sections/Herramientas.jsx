import { useState } from 'react'
import { motion } from 'framer-motion'
import { herramientasCabalisticas } from '../../data/herramientas'
import ContactModal from '../common/ContactModal'
import HerramientasCards from '../common/HerramientasCards'

/**
 * Sección de Herramientas Cabalísticas
 *
 * @component
 * @returns {JSX.Element} Componente de sección de herramientas
 */
const Herramientas = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedHerramienta, setSelectedHerramienta] = useState('')
  const [displayMode, setDisplayMode] = useState('cards') // 'cards' o 'list'

  const handleIniciarCamino = herramienta => {
    setSelectedHerramienta(herramienta.nombre)
    setShowModal(true)
  }

  return (
    <section
      id="herramientas"
      className="py-20 bg-slate-800 bg-[url('/images/sacred-geometry-bg.svg')] bg-fixed bg-blend-overlay bg-opacity-40"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Herramientas <span className="text-amber-500">Cabalísticas</span>
          </h2>
          <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
            Descubre las cuatro herramientas espirituales que transformarán tu conexión con la
            sabiduría ancestral
          </p>

          {/* Selector de modo de visualización */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setDisplayMode('cards')}
              className={`px-4 py-2 rounded-md transition-all flex items-center ${
                displayMode === 'cards'
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Tarjetas Interactivas
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              className={`px-4 py-2 rounded-md transition-all flex items-center ${
                displayMode === 'list'
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Lista Clásica
            </button>
          </div>
        </motion.div>

        {/* Vista de tarjetas interactivas (nuevo componente) */}
        {displayMode === 'cards' && <HerramientasCards />}

        {/* Vista de lista tradicional (componente original) */}
        {displayMode === 'list' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {herramientasCabalisticas.map((herramienta, index) => (
              <motion.div
                key={herramienta.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{herramienta.nombre}</h3>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {herramienta.descripcion}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-yellow-500 font-bold text-lg">
                      ${herramienta.precio} {herramienta.moneda}
                    </span>
                    <span className="text-gray-400 text-sm">{herramienta.duracion}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-2">
                      <p className="text-green-400 text-xs font-semibold text-center">
                        🎁 DESCUENTO 20% - Solo esta semana
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        try {
                          const paypalWindow = window.open(herramienta.paypalLink, '_blank')
                          if (!paypalWindow) {
                            window.location.href = herramienta.paypalLink
                          }
                        } catch (error) {
                          window.location.href = herramienta.paypalLink
                        }
                      }}
                      className="w-full bg-yellow-500 text-slate-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors transform hover:scale-105"
                    >
                      💳 ADQUIRIR AHORA
                    </button>
                    <button
                      onClick={() => handleIniciarCamino(herramienta)}
                      className="w-full border border-yellow-500 text-yellow-500 py-2 rounded-lg font-semibold hover:bg-yellow-500/10 transition-colors text-sm"
                    >
                      🌟 Iniciar mi Camino
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Nota sobre prueba gratuita */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-amber-200 text-lg">
            ¿No estás seguro de cuál elegir?{' '}
            <span className="text-amber-500 font-medium">
              Agenda una consulta introductoria gratuita
            </span>{' '}
            para recibir orientación personal.
          </p>
        </motion.div>
      </div>

      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        herramienta={selectedHerramienta}
      />
    </section>
  )
}

export default Herramientas
