import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { contactService } from '../../services/contactService'

/**
 * Formulario de contacto mejorado con validación, animaciones y feedback visual
 *
 * @component
 * @returns {JSX.Element} Componente de formulario de contacto
 */
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStep, setFormStep] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  // Observamos el campo de interés para personalizar las opciones del segundo paso
  const interestField = watch('interes')

  const onSubmit = async data => {
    try {
      setIsSubmitting(true)
      // Enriquecemos los datos con información adicional
      const enrichedData = {
        ...data,
        fechaContacto: new Date().toISOString(),
        fuente: document.referrer || 'Acceso directo',
      }

      await contactService.submitContactForm(enrichedData)

      // Mostramos notificación de éxito
      toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', {
        duration: 5000,
        position: 'bottom-center',
        icon: '✨',
      })

      // Reseteamos el formulario
      reset()
      setFormStep(0)
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      toast.error('Hubo un problema al enviar el formulario. Por favor, inténtalo nuevamente.', {
        duration: 5000,
        position: 'bottom-center',
        icon: '❌',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setFormStep(formStep + 1)
  const prevStep = () => setFormStep(formStep - 1)

  // Animaciones para los campos del formulario
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-purple-200/20">
      <h3 className="text-2xl font-semibold text-center mb-6 text-amber-500">
        Descubre tu Camino Espiritual
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formStep === 0 && (
          <motion.div
            className="space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="nombre" className="block text-sm font-medium text-amber-200 mb-1">
                Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre completo"
                className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                  ${
                    errors.nombre
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                  }`}
                {...register('nombre', {
                  required: 'Este campo es obligatorio',
                  minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
                })}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-amber-200 mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                  ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                  }`}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido',
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="telefono" className="block text-sm font-medium text-amber-200 mb-1">
                Teléfono (WhatsApp)
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder="+34 612 345 678"
                className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                  ${
                    errors.telefono
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                  }`}
                {...register('telefono', {
                  required: 'El teléfono es obligatorio para contacto por WhatsApp',
                  pattern: {
                    value: /^\+?[0-9\s\-()]{7,20}$/,
                    message: 'Formato de teléfono inválido',
                  },
                })}
              />
              {errors.telefono && (
                <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="interes" className="block text-sm font-medium text-amber-200 mb-1">
                ¿Qué herramienta te interesa más?
              </label>
              <select
                id="interes"
                className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                  ${
                    errors.interes
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                  }`}
                {...register('interes', { required: 'Por favor selecciona una opción' })}
              >
                <option value="" className="bg-gray-800">
                  Selecciona una opción
                </option>
                <option value="carta-astral" className="bg-gray-800">
                  Carta Astral Cabalística
                </option>
                <option value="constelacion" className="bg-gray-800">
                  Constelación Familiar Cabalística
                </option>
                <option value="limpieza" className="bg-gray-800">
                  Limpieza Áurica Cabalística
                </option>
                <option value="meditacion" className="bg-gray-800">
                  Meditación Cabalística
                </option>
                <option value="otra" className="bg-gray-800">
                  Otra consulta
                </option>
              </select>
              {errors.interes && (
                <p className="mt-1 text-xs text-red-500">{errors.interes.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-md shadow-lg hover:shadow-amber-500/30 transition duration-300 transform hover:scale-105"
              >
                Siguiente
              </button>
            </motion.div>
          </motion.div>
        )}

        {formStep === 1 && (
          <motion.div
            className="space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="fechaNacimiento"
                className="block text-sm font-medium text-amber-200 mb-1"
              >
                Fecha de Nacimiento
              </label>
              <input
                id="fechaNacimiento"
                type="date"
                className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                  ${
                    errors.fechaNacimiento
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                  }`}
                {...register('fechaNacimiento', {
                  required:
                    interestField === 'carta-astral'
                      ? 'Campo necesario para la Carta Astral'
                      : false,
                })}
              />
              {errors.fechaNacimiento && (
                <p className="mt-1 text-xs text-red-500">{errors.fechaNacimiento.message}</p>
              )}
            </motion.div>

            {(interestField === 'carta-astral' || interestField === 'constelacion') && (
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="horaNacimiento"
                  className="block text-sm font-medium text-amber-200 mb-1"
                >
                  Hora de Nacimiento (aproximada)
                </label>
                <input
                  id="horaNacimiento"
                  type="time"
                  className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                    ${
                      errors.horaNacimiento
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                    }`}
                  {...register('horaNacimiento')}
                />
                <p className="mt-1 text-xs text-amber-200/50">
                  Si no conoces la hora exacta, elige una aproximada
                </p>
              </motion.div>
            )}

            {interestField === 'constelacion' && (
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="temaConstelacion"
                  className="block text-sm font-medium text-amber-200 mb-1"
                >
                  Tema familiar que deseas trabajar
                </label>
                <textarea
                  id="temaConstelacion"
                  rows="3"
                  placeholder="Describe brevemente el tema familiar que te gustaría abordar"
                  className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                    ${
                      errors.temaConstelacion
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                    }`}
                  {...register('temaConstelacion')}
                />
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label htmlFor="mensaje" className="block text-sm font-medium text-amber-200 mb-1">
                Mensaje o Consulta
              </label>
              <textarea
                id="mensaje"
                rows="4"
                placeholder="Cuéntanos más sobre lo que te trae a IKU Cábala Activa..."
                className={`w-full px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:outline-none
                  ${
                    errors.mensaje
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-purple-300/30 focus:border-amber-500 focus:ring-amber-200/20'
                  }`}
                {...register('mensaje', {
                  required: 'Por favor, déjanos un mensaje',
                  minLength: { value: 10, message: 'El mensaje debe tener al menos 10 caracteres' },
                })}
              />
              {errors.mensaje && (
                <p className="mt-1 text-xs text-red-500">{errors.mensaje.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-amber-500 rounded focus:ring-amber-200"
                  {...register('aceptaTerminos', {
                    required: 'Debes aceptar los términos y condiciones',
                  })}
                />
                <span className="ml-2 text-xs text-amber-200">
                  Acepto recibir información sobre servicios de IKU Cábala Activa y la{' '}
                  <a href="/privacidad" className="text-amber-500 hover:text-amber-400 underline">
                    política de privacidad
                  </a>
                </span>
              </label>
              {errors.aceptaTerminos && (
                <p className="mt-1 text-xs text-red-500">{errors.aceptaTerminos.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-purple-300/30 text-amber-300 rounded-md hover:bg-purple-500/10 transition duration-300"
              >
                Atrás
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-md shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-amber-500/30
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Consulta'
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </form>
    </div>
  )
}

export default ContactForm
