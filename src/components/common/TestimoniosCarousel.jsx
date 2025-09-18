import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Componente de carrusel de testimonios
 *
 * @component
 * @returns {JSX.Element} Componente de carrusel de testimonios
 */
const TestimoniosCarousel = () => {
  // Datos de testimonios
  const testimonios = [
    {
      id: 1,
      nombre: 'Ana María Sánchez',
      ubicacion: 'Madrid, España',
      foto: '/images/testimonios/testimonio-1.jpg',
      texto:
        'La Carta Astral Cabalística del Maestro Isaac transformó mi vida. Por primera vez entendí mi propósito espiritual y las lecciones que vine a aprender. Las sincronicidades comenzaron a aparecer desde el día que recibí mi carta, y ahora siento una conexión profunda con mi camino.',
      herramienta: 'Carta Astral Cabalística',
      rating: 5,
    },
    {
      id: 2,
      nombre: 'Carlos Gutiérrez',
      ubicacion: 'Buenos Aires, Argentina',
      foto: '/images/testimonios/testimonio-2.jpg',
      texto:
        'Llevaba años arrastrando problemas familiares que no entendía. La Constelación Familiar Cabalística reveló patrones transgeneracionales que estaban afectando mi prosperidad y relaciones. Tres meses después de la sesión, mi negocio comenzó a florecer y mi relación con mi padre sanó completamente.',
      herramienta: 'Constelación Familiar Cabalística',
      rating: 5,
    },
    {
      id: 3,
      nombre: 'Lucía Fernández',
      ubicacion: 'Ciudad de México, México',
      foto: '/images/testimonios/testimonio-3.jpg',
      texto:
        'Me sentía energéticamente drenada y con bloqueos creativos constantes. Después de la Limpieza Áurica Cabalística, fue como si una niebla se disipara de mi vida. Mi energía se renovó, los proyectos comenzaron a fluir y las personas tóxicas simplemente desaparecieron de mi entorno. Una experiencia verdaderamente transformadora.',
      herramienta: 'Limpieza Áurica Cabalística',
      rating: 5,
    },
    {
      id: 4,
      nombre: 'Javier Morales',
      ubicacion: 'Bogotá, Colombia',
      foto: '/images/testimonios/testimonio-4.jpg',
      texto:
        'Las técnicas de Meditación Cabalística que aprendí con el Maestro Isaac han transformado mi práctica espiritual. He experimentado estados de conciencia que nunca creí posibles y una conexión con lo divino que ha traído mucha paz a mi vida. Recomiendo esta herramienta a cualquiera que busque profundizar en su camino espiritual.',
      herramienta: 'Meditación Cabalística',
      rating: 5,
    },
    {
      id: 5,
      nombre: 'Elena Rodríguez',
      ubicacion: 'Santiago, Chile',
      foto: '/images/testimonios/testimonio-5.jpg',
      texto:
        'Durante años luché con decisiones importantes sobre mi carrera. Mi Carta Astral Cabalística reveló talentos que había ignorado toda mi vida. Seis meses después de seguir las recomendaciones del Maestro Isaac, estoy en un nuevo camino profesional que me llena de satisfacción y propósito.',
      herramienta: 'Carta Astral Cabalística',
      rating: 5,
    },
    {
      id: 6,
      nombre: 'Roberto Méndez',
      ubicacion: 'Lima, Perú',
      foto: '/images/testimonios/testimonio-6.jpg',
      texto:
        'Las meditaciones cabalísticas son una herramienta poderosa que ha transformado mi conexión espiritual. He notado cambios profundos en mi intuición y capacidad para manifestar. El Maestro Isaac transmite este conocimiento ancestral de manera accesible y profunda.',
      herramienta: 'Meditación Cabalística',
      rating: 5,
    },
  ]

  // Estado para el carrusel
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const autoplayTimerRef = useRef(null)

  // Función para avanzar al siguiente testimonio
  const nextTestimonio = () => {
    setDirection('right')
    setCurrentIndex(prevIndex => (prevIndex === testimonios.length - 1 ? 0 : prevIndex + 1))
  }

  // Función para retroceder al testimonio anterior
  const prevTestimonio = () => {
    setDirection('left')
    setCurrentIndex(prevIndex => (prevIndex === 0 ? testimonios.length - 1 : prevIndex - 1))
  }

  // Gestionar el autoplay del carrusel
  useEffect(() => {
    if (autoplayEnabled) {
      autoplayTimerRef.current = setInterval(() => {
        nextTestimonio()
      }, 5000) // Cambia cada 5 segundos
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [autoplayEnabled, currentIndex])

  // Pausa el autoplay cuando el usuario interactúa
  const handleInteraction = () => {
    setAutoplayEnabled(false)

    // Reinicia el autoplay después de 10 segundos de inactividad
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
    }

    autoplayTimerRef.current = setTimeout(() => {
      setAutoplayEnabled(true)
    }, 10000)
  }

  // Variantes de animación para el carrusel
  const slideVariants = {
    enter: direction => ({
      x: direction === 'right' ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: direction => ({
      x: direction === 'right' ? -500 : 500,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: 'easeIn',
      },
    }),
  }

  // Renderizar las estrellas según la calificación
  const renderRating = rating => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${index < rating ? 'text-amber-400' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))
  }

  // Manejo de gestos para móviles
  const handleDragStart = () => {
    setDragging(true)
    handleInteraction()
  }

  const handleDragEnd = (e, info) => {
    setDragging(false)

    // Determinar dirección del swipe basado en la velocidad/distancia
    if (info.offset.x > 100 || info.velocity.x > 0.5) {
      prevTestimonio()
    } else if (info.offset.x < -100 || info.velocity.x < -0.5) {
      nextTestimonio()
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Carrusel */}
      <div
        className="relative overflow-hidden rounded-xl h-[480px] md:h-[400px]"
        onClick={handleInteraction}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-purple-200/20 shadow-2xl"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Foto del testimonio */}
            <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto md:mx-0">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-500">
                  {testimonios[currentIndex].foto ? (
                    <img
                      src={testimonios[currentIndex].foto}
                      alt={`Foto de ${testimonios[currentIndex].nombre}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-3xl text-white">
                      {testimonios[currentIndex].nombre.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-500 to-amber-600 text-xs px-3 py-1 rounded-full text-white font-medium">
                  {testimonios[currentIndex].herramienta.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Contenido del testimonio */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-amber-500 font-semibold text-lg">
                    {testimonios[currentIndex].nombre}
                  </h4>
                  <p className="text-amber-200/60 text-xs">{testimonios[currentIndex].ubicacion}</p>
                </div>
                <div className="flex">{renderRating(testimonios[currentIndex].rating)}</div>
              </div>

              <div className="flex-1">
                <p className="text-amber-100 italic relative">
                  <span className="text-amber-500 text-3xl absolute -left-2 -top-3">"</span>
                  {testimonios[currentIndex].texto}
                  <span className="text-amber-500 text-3xl">"</span>
                </p>
              </div>

              <div className="mt-4 text-right">
                <span className="inline-block text-amber-500 text-sm font-medium">
                  {testimonios[currentIndex].herramienta}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegación */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => {
            prevTestimonio()
            handleInteraction()
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-purple-200/30 transition-colors duration-300"
          aria-label="Testimonio anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Indicadores */}
        <div className="flex items-center space-x-2">
          {testimonios.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 'right' : 'left')
                setCurrentIndex(index)
                handleInteraction()
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                currentIndex === index ? 'bg-amber-500 w-4' : 'bg-purple-300/30'
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            nextTestimonio()
            handleInteraction()
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-purple-200/30 transition-colors duration-300"
          aria-label="Siguiente testimonio"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TestimoniosCarousel
