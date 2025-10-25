import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { apiService } from '../../services/api'

/**
 * Formulario de contacto reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSuccess - Función a ejecutar cuando el envío es exitoso
 * @param {Function} props.onError - Función a ejecutar cuando ocurre un error
 * @param {String} props.asunto - Asunto del contacto (por defecto "Consulta General")
 * @param {Boolean} props.compact - Versión compacta del formulario
 */
const ContactForm = ({
  onSuccess,
  onError,
  asunto = 'Consulta General',
  compact = false
}) => {


  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  
  // Estado de envío
  const [isSending, setIsSending] = useState(false)
  // Estado de errores para validación
  const [validationErrors, setValidationErrors] = useState({})

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Limpiar errores de validación al escribir
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      })
    }
  }

  // Validar formulario
  const validate = () => {
    const errors = {}
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }
    
    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    // Validar teléfono (opcional)
    if (formData.telefono && !/^[0-9+()\-\s]*$/.test(formData.telefono)) {
      errors.telefono = 'Formato de teléfono inválido'
    }
    
    // Validar mensaje (si es muy largo)
    if (formData.mensaje && formData.mensaje.length > 1000) {
      errors.mensaje = 'El mensaje no debe exceder los 1000 caracteres'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validación completa
    if (!validate()) {
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError || "Por favor verifica los campos marcados en rojo")
      return
    }
    
    setIsSending(true)
    const toastId = toast.loading("Enviando mensaje...")
    
    try {
      // Enviar usando el servicio API de AWS
      const result = await apiService.sendContactForm({
        ...formData,
        asunto,
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
        
        // Limpiar formulario
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
        
        // Llamar callback de éxito si existe
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(result)
        }
      } else {
        throw new Error(result.error || 'Ocurrió un error al procesar la solicitud')
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      toast.update(toastId, {
        render: `Error al enviar: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 6000,
      })
      
      // Llamar callback de error si existe
      if (onError && typeof onError === 'function') {
        onError(error)
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={`contact-form-container ${compact ? 'compact' : ''}`}>
      <ToastContainer position="bottom-right" theme="dark" />
      
      <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo*
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            autoComplete="name"
            required
            data-testid="name-input"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 bg-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            data-testid="email-input"
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
            data-testid="phone-input"
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
            rows={compact ? 2 : 3}
            data-testid="message-input"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 bg-white placeholder-gray-400"
            placeholder="Cuéntanos sobre tu consulta..."
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={isSending}
            data-testid="submit-button"
            className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSending ? 'Enviando...' : 'Enviar Consulta'}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          * Campos obligatorios
        </div>
      </form>
    </div>
  )
}

export default ContactForm