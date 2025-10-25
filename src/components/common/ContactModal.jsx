import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const PricingSection = () => {
  const pricingOptions = [
    {
      id: 'single-session',
      title: 'Sesión Única',
      price: '$150',
      paypalUrl: import.meta.env.VITE_PAYPAL_SINGLE_SESSION
    },
    {
      id: 'full-package', 
      title: 'Programa Completo',
      price: '$1,000',
      paypalUrl: import.meta.env.VITE_PAYPAL_FULL_PACKAGE,
      stripeUrl: import.meta.env.VITE_STRIPE_CHECKOUT
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
              {option.stripeUrl && (
                <button
                  onClick={() => window.open(option.stripeUrl, '_blank')}
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  💳 Pagar con Tarjeta
                </button>
              )}
              <button
                onClick={() => window.open(option.paypalUrl, '_blank')}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                🌍 Pagar con PayPal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { apiService } from '../../services/api'

const ContactModal = ({ isOpen, onClose, herramienta = "Consulta General" }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [showPricing, setShowPricing] = useState(false)
  const [isSending, setIsSending] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)
    const toastId = toast.loading("Enviando mensaje...")
    try {
      const result = await apiService.sendContactForm({
        ...formData,
        asunto: herramienta,
        to: 'contacto@iku-cabalactiva.com',
        cc: 'maor@iku-cabalactiva.com'
      })
      if (result.success) {
        toast.update(toastId, {
          render: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        })
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
        onClose()
      } else {
        throw new Error(result.error || 'Ocurrió un error en el servidor.')
      }
    } catch (error) {
      toast.update(toastId, {
        render: `Error al enviar: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 6000,
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