import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Componente de preguntas frecuentes con animación de acordeón
 *
 * @component
 * @returns {JSX.Element} Componente de FAQ
 */
const FAQAccordion = () => {
  // Estado para el control de preguntas abiertas
  const [openItems, setOpenItems] = useState([])

  // Datos de preguntas frecuentes
  const faqItems = [
    {
      id: 'faq-1',
      question: '¿Qué es exactamente la Cábala y cómo puede beneficiarme?',
      answer:
        'La Cábala es una tradición mística ancestral que revela los secretos del universo y nuestra conexión con lo divino. A través de sus enseñanzas, podrás entender los patrones energéticos que gobiernan tu vida, descubrir tu propósito espiritual y aprender a manifestar conscientemente tu realidad. Las herramientas cabalísticas que ofrecemos te permiten aplicar esta sabiduría a situaciones concretas de tu vida, generando transformación, sanación y crecimiento espiritual.',
    },
    {
      id: 'faq-2',
      question:
        '¿Necesito tener conocimientos previos de espiritualidad para utilizar estas herramientas?',
      answer:
        'No, nuestras herramientas están diseñadas para ser accesibles a personas en cualquier nivel de su camino espiritual. El Maestro Isaac Benzaquén adapta sus enseñanzas y sesiones al nivel de comprensión de cada persona, explicando los conceptos necesarios de manera clara y práctica. Lo único que necesitas es una mente abierta y el deseo sincero de crecimiento y transformación personal.',
    },
    {
      id: 'faq-3',
      question: '¿Cómo se realizan las consultas? ¿Son presenciales o virtuales?',
      answer:
        'Ofrecemos consultas tanto presenciales como virtuales, dependiendo de tu ubicación y preferencia. Las sesiones virtuales se realizan a través de Zoom o WhatsApp, con la misma efectividad que las presenciales. El Maestro Isaac ha desarrollado técnicas específicas para trabajar energéticamente a distancia, permitiendo que personas de todo el mundo puedan beneficiarse de sus conocimientos sin importar dónde se encuentren.',
    },
    {
      id: 'faq-4',
      question:
        '¿Cuánto tiempo debo esperar para ver resultados después de utilizar una herramienta cabalística?',
      answer:
        'Los efectos de las herramientas cabalísticas suelen comenzar a manifestarse inmediatamente después de la sesión, aunque la profundidad de la transformación se desarrolla con el tiempo. Muchas personas experimentan cambios sutiles pero significativos en su energía, claridad mental y estado emocional desde el primer día. Para cambios más profundos relacionados con patrones arraigados, el proceso puede desarrollarse durante semanas o meses, especialmente en el caso de las Constelaciones Familiares Cabalísticas.',
    },
    {
      id: 'faq-5',
      question:
        '¿Las herramientas cabalísticas son compatibles con otras prácticas espirituales o religiosas?',
      answer:
        'Sí, absolutamente. La Cábala es una sabiduría universal que trasciende las barreras religiosas o culturales. Muchas personas integran las herramientas cabalísticas con sus propias prácticas espirituales, ya sean cristianas, budistas, hinduistas u otras tradiciones. La Cábala no busca reemplazar tu fe o creencias, sino enriquecerlas con una comprensión más profunda de los principios universales que sustentan toda espiritualidad auténtica.',
    },
    {
      id: 'faq-6',
      question: '¿Qué información necesito proporcionar para una Carta Astral Cabalística?',
      answer:
        'Para crear tu Carta Astral Cabalística, el Maestro Isaac necesitará tu nombre completo, fecha exacta de nacimiento (día, mes y año), hora de nacimiento (lo más precisa posible) y lugar de nacimiento (ciudad y país). Si desconoces la hora exacta, puedes proporcionar una aproximada, aunque esto podría afectar ligeramente la precisión de ciertos aspectos de la carta. Toda la información que proporciones será tratada con absoluta confidencialidad.',
    },
    {
      id: 'faq-7',
      question: '¿Puedo regalar una herramienta cabalística a un ser querido?',
      answer:
        'Sí, nuestras herramientas cabalísticas son un regalo transformador y significativo para seres queridos. Ofrecemos certificados de regalo personalizados para todas nuestras herramientas. Sin embargo, es importante tener en cuenta que la persona receptora debe estar abierta a recibir este tipo de trabajo energético y espiritual para que sea completamente efectivo. Contáctanos para más detalles sobre cómo personalizar tu regalo.',
    },
    {
      id: 'faq-8',
      question: '¿El Maestro Isaac ofrece seguimiento después de las consultas?',
      answer:
        'Sí, el Maestro Isaac Benzaquén ofrece seguimiento personalizado después de cada consulta. Dependiendo de la herramienta utilizada y tus necesidades específicas, se programarán sesiones de seguimiento para evaluar tu progreso y ajustar las recomendaciones si es necesario. Además, los clientes reciben materiales complementarios y tienen acceso a un canal directo de comunicación para resolver dudas que puedan surgir durante su proceso de transformación.',
    },
  ]

  // Función para alternar el estado de apertura de una pregunta
  const toggleItem = id => {
    setOpenItems(prevOpenItems =>
      prevOpenItems.includes(id)
        ? prevOpenItems.filter(item => item !== id)
        : [...prevOpenItems, id]
    )
  }

  // Verificar si una pregunta está abierta
  const isOpen = id => openItems.includes(id)

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqItems.map(item => (
        <motion.div
          key={item.id}
          className="border border-purple-300/20 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm"
          initial={false}
          animate={
            isOpen(item.id)
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(217, 119, 6, 0.3)',
                }
              : {}
          }
          transition={{ duration: 0.3 }}
        >
          {/* Encabezado de la pregunta */}
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
            onClick={() => toggleItem(item.id)}
            aria-expanded={isOpen(item.id)}
            aria-controls={`answer-${item.id}`}
          >
            <h3
              className={`text-lg font-medium ${
                isOpen(item.id) ? 'text-amber-500' : 'text-amber-300'
              }`}
            >
              {item.question}
            </h3>
            <span
              className={`transform transition-transform duration-300 ${
                isOpen(item.id) ? 'rotate-180' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          {/* Contenido de la respuesta */}
          <AnimatePresence>
            {isOpen(item.id) && (
              <motion.div
                id={`answer-${item.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 border-t border-purple-300/10 pt-2">
                  <p className="text-amber-100/80">{item.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* CTA después de las preguntas */}
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="text-amber-200 mb-4">
          ¿Tienes más preguntas sobre nuestras herramientas cabalísticas?
        </p>
        <a
          href="#contacto"
          className="inline-block px-8 py-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-md shadow-lg hover:shadow-amber-500/30 transition duration-300 transform hover:scale-105"
        >
          Consulta con el Maestro Isaac
        </a>
      </motion.div>
    </div>
  )
}

export default FAQAccordion
