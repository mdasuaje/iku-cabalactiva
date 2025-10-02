import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import crmService from '../../services/crmService.js'

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const PricingSection = () => {
  const pricingOptions = [
    {
      id: 'single-session',
      title: 'Sesión Individual',
      price: '$297',
      paypalUrlEnv: 'VITE_PAYPAL_SESION_INDIVIDUAL',
      stripeUrlEnv: 'VITE_STRIPE_SESION_INDIVIDUAL'
    },
    {
      id: 'full-package', 
      title: 'Paquete Completo',
      price: '$997',
      paypalUrlEnv: 'VITE_PAYPAL_PAQUETE_COMPLETO',
      stripeUrlEnv: 'VITE_STRIPE_PAQUETE_COMPLETO',
      stripePartesUrlEnv: 'VITE_STRIPE_PAQUETE_PARTES'
    }
  ]

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Opciones de Pago Directo
      </h3>
      <div className="space-y-3">
        {pricingOptions.map((option) => (
          <div key={option.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{option.title}</span>
              <span className="text-yellow-600 font-bold">{option.price}</span>
            </div>
            <div className="space-y-2">
              {/* --- INICIO DE IMPLEMENTACIÓN STRIPE CON FALLBACK INTELIGENTE --- */}
              {/* Stripe Payment Button - SIEMPRE VISIBLE */}
              {option.stripeUrlEnv && import.meta.env[option.stripeUrlEnv] ? (
                <a
                  href={import.meta.env[option.stripeUrlEnv]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>💳 Pagar con Tarjeta (Stripe)</span>
                </a>
              ) : (
                <button
                  onClick={() => 
                    alert('La opción de pago con tarjeta no está disponible en este momento. Por favor, contáctanos a ' + (import.meta.env.VITE_EMAIL_ADMIN || 'soporte@iku-cabalactiva.com') + ' para procesar tu pago manualmente.')
                  }
                  className="w-full bg-gray-400 text-white text-center font-bold py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                  title="Opción de pago con tarjeta no disponible temporalmente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>💳 Pagar con Tarjeta (Stripe)</span>
                </button>
              )}
              
              {/* Stripe Payment in Parts Button - SIEMPRE VISIBLE */}
              {option.stripePartesUrlEnv && import.meta.env[option.stripePartesUrlEnv] ? (
                <a
                  href={import.meta.env[option.stripePartesUrlEnv]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 text-center font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>⚡ Pagar en Cuotas</span>
                </a>
              ) : option.stripePartesUrlEnv ? (
                <button
                  onClick={() => 
                    alert('El pago en cuotas no está disponible temporalmente. Contáctanos a ' + (import.meta.env.VITE_EMAIL_ADMIN || 'soporte@iku-cabalactiva.com') + ' para opciones de financiamiento.')
                  }
                  className="w-full bg-gray-300 text-gray-600 text-center font-bold py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                  title="Pago en cuotas no disponible temporalmente"
                >
                  <span>⚡ Pagar en Cuotas</span>
                </button>
              ) : null}
              {/* --- FIN DE IMPLEMENTACIÓN STRIPE CON FALLBACK --- */}
              
              {/* PayPal Payment Button */}
              {option.paypalUrlEnv && import.meta.env[option.paypalUrlEnv] && (
                <button
                  onClick={() => window.open(import.meta.env[option.paypalUrlEnv], '_blank')}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  🌍 Pagar con PayPal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactModal = ({ isOpen, onClose, herramienta = "Consulta General" }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [showPricing, setShowPricing] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // URL del Web App de Google Apps Script
  const scriptURL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!scriptURL) {
      toast.error("El servicio de contacto no está disponible. Inténtelo más tarde.")
      return
    }
    setIsSending(true)
    const toastId = toast.loading("Enviando mensaje...")
    try {
      // Validar que la URL del script esté configurada (versión mejorada de develop)
      if (!scriptURL) {
        throw new Error('URL del Google Apps Script no configurada')
      }

      // Usar crmService.registrarCliente que maneja redirecciones y errores correctamente (de develop)
      await crmService.registrarCliente({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        mensaje: formData.mensaje
      })

      toast.update(toastId, {
        render: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      })
      
      // Limpiar formulario solo en caso de éxito
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
      onClose()
      
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      
      // Manejo mejorado de errores específicos (de develop)
      let errorMessage = "Error al enviar el mensaje"
      
      if (error.message.includes('Datos inválidos')) {
        errorMessage = error.message
      } else if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        errorMessage = "Problema de conexión. Verifique su internet e inténtelo de nuevo."
      } else if (error.message.includes('Timeout')) {
        errorMessage = "El servidor está tardando en responder. Inténtelo más tarde."
      } else if (error.message.includes('URL del Google Apps Script no configurada')) {
        errorMessage = "Error de configuración. Contacte al administrador."
      }
      
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 8000,
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <ToastContainer position="bottom-right" theme="dark" style={{ zIndex: 9999 }} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Contacto - {herramienta}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 bg-white placeholder-gray-400"
                  placeholder="Cuéntanos sobre tu consulta..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Enviando...' : 'Enviar Consulta'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPricing(!showPricing)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  {showPricing ? 'Ocultar' : 'Ver'} Precios
                </button>
              </div>
            </form>
            {showPricing && <PricingSection />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContactModal