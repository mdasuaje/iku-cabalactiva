import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Componente de tarjetas para mostrar las herramientas cabalísticas
 *
 * @component
 * @returns {JSX.Element} Componente de tarjetas de herramientas
 */
const HerramientasCards = () => {
  // Estado para controlar la tarjeta activa/expandida
  const [activeCard, setActiveCard] = useState(null)

  // Datos de las herramientas
  const herramientas = [
    {
      id: 'carta-astral',
      title: 'Carta Astral Cabalística',
      price: '$67 USD',
      icon: '✨',
      color: 'from-purple-600 to-indigo-700',
      shortDesc: 'Descubre tu propósito y potencial espiritual.',
      fullDesc:
        'La Carta Astral Cabalística es una herramienta personalizada que revela tu conexión cósmica única. A través del análisis de tu fecha, hora y lugar de nacimiento, el Maestro Isaac Benzaquén interpreta los patrones energéticos que influyen en tu vida, identificando tus talentos ocultos y desafíos espirituales. Este análisis profundo te ayuda a comprender tu propósito vital y a tomar decisiones alineadas con tu verdadero ser.',
      benefits: [
        'Análisis personalizado de tu energía natal',
        'Identificación de patrones kármicos',
        'Guía para potenciar tus talentos ocultos',
        'Interpretación de ciclos espirituales',
        'Consulta personal con el Maestro Isaac',
      ],
      cta: 'Obtener mi Carta Astral',
    },
    {
      id: 'constelacion',
      title: 'Constelación Familiar Cabalística',
      price: '$97 USD',
      icon: '👪',
      color: 'from-blue-600 to-cyan-700',
      shortDesc: 'Sana patrones familiares transgeneracionales.',
      fullDesc:
        'La Constelación Familiar Cabalística revela y transforma los patrones ocultos que afectan a tu linaje. Esta poderosa técnica combina la sabiduría ancestral de la Cábala con la terapia sistémica moderna para identificar y sanar traumas, secretos y dinámicas inconscientes transmitidas por generaciones. El Maestro Isaac guía este proceso de sanación profunda, permitiéndote liberar cargas emocionales heredadas y restaurar el flujo natural de amor y equilibrio en tu sistema familiar.',
      benefits: [
        'Identificación de patrones familiares limitantes',
        'Liberación de cargas transgeneracionales',
        'Restauración del orden y equilibrio familiar',
        'Resolución de conflictos ancestrales',
        'Sanación de vínculos dañados',
      ],
      cta: 'Sanar mi Linaje Familiar',
    },
    {
      id: 'limpieza',
      title: 'Limpieza Áurica Cabalística',
      price: '$150 USD',
      icon: '🌈',
      color: 'from-amber-500 to-orange-600',
      shortDesc: 'Purifica tu campo energético espiritual.',
      fullDesc:
        'La Limpieza Áurica Cabalística es un ritual sagrado diseñado para purificar tu campo energético de influencias negativas, bloqueos emocionales y entidades energéticas. A través de antiguas técnicas cabalísticas, el Maestro Isaac Benzaquén trabaja directamente con tu aura para restaurar su luminosidad natural, fortalecer tus defensas energéticas y optimizar el flujo vital. Este proceso transformador despeja el camino para manifestaciones positivas y conexiones espirituales más profundas.',
      benefits: [
        'Purificación energética completa',
        'Eliminación de bloqueos emocionales',
        'Protección contra influencias negativas',
        'Restauración del equilibrio vibracional',
        'Activación de centros energéticos',
      ],
      cta: 'Purificar mi Campo Energético',
    },
    {
      id: 'meditacion',
      title: 'Meditación Cabalística',
      price: '$67 USD',
      icon: '🧘',
      color: 'from-green-600 to-teal-700',
      shortDesc: 'Expande tu consciencia y conexión espiritual.',
      fullDesc:
        'La Meditación Cabalística es una práctica transformadora que te conecta con las dimensiones más elevadas de la consciencia. Basada en los 72 nombres sagrados de Dios y los 10 Sefirot del Árbol de la Vida, esta técnica milenaria te guía en un viaje interior hacia la sabiduría universal. El Maestro Isaac Benzaquén te enseñará técnicas específicas para canalizar energía divina, activar la glándula pineal y acceder a estados expandidos de percepción que potenciarán tu desarrollo espiritual y manifestación consciente.',
      benefits: [
        'Técnicas ancestrales de meditación',
        'Conexión con la sabiduría universal',
        'Activación de centros energéticos superiores',
        'Prácticas para la manifestación consciente',
        'Herramientas para la evolución espiritual',
      ],
      cta: 'Iniciar mi Práctica Meditativa',
    },
  ]

  // Animación de contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Animación de cada tarjeta
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
    tap: {
      y: 0,
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
  }

  const expandCard = id => {
    if (activeCard === id) {
      setActiveCard(null)
    } else {
      setActiveCard(id)
    }
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {herramientas.map(herramienta => (
        <motion.div
          key={herramienta.id}
          className={`flex flex-col rounded-xl overflow-hidden border border-purple-200/20 shadow-xl backdrop-blur-sm
            ${
              activeCard === herramienta.id
                ? 'md:col-span-2 lg:col-span-2 bg-white/10'
                : 'bg-white/5'
            }`}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          layout
          transition={{
            layout: {
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 25,
            },
          }}
        >
          {/* Encabezado de la tarjeta */}
          <div
            className={`p-5 bg-gradient-to-br ${herramienta.color} cursor-pointer`}
            onClick={() => expandCard(herramienta.id)}
          >
            <div className="flex justify-between items-center">
              <span className="text-3xl">{herramienta.icon}</span>
              <span className="font-bold text-white/90 text-lg">{herramienta.price}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mt-3">{herramienta.title}</h3>
            {activeCard !== herramienta.id && (
              <p className="text-white/80 mt-2 text-sm">{herramienta.shortDesc}</p>
            )}
          </div>

          {/* Contenido expandido */}
          {activeCard === herramienta.id && (
            <motion.div
              className="p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-amber-200 mb-4">{herramienta.fullDesc}</p>

              <div className="mb-5">
                <h4 className="text-amber-500 font-semibold mb-3">Beneficios:</h4>
                <ul className="space-y-2">
                  {herramienta.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      <span className="text-amber-100/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full py-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-md shadow-lg hover:shadow-amber-500/30 transition duration-300 transform hover:scale-102 font-medium">
                {herramienta.cta}
              </button>
            </motion.div>
          )}

          {/* Botón de expansión (solo visible si no está expandido) */}
          {activeCard !== herramienta.id && (
            <div className="p-3 mt-auto">
              <button
                onClick={() => expandCard(herramienta.id)}
                className="w-full py-2 border border-purple-300/30 text-amber-300 rounded-md hover:bg-purple-500/10 transition duration-300"
              >
                Descubrir más
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default HerramientasCards
