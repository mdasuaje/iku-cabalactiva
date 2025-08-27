import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { t } from '@utils/i18n'
import contactService from '@services/contactService'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.message?.trim()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }
    
    try {
      toast.loading('Procesando tu solicitud...')
      
      // Enviar consulta al equipo de contacto
      await contactService.enviarConsulta({
        nombre: formData.name,
        email: formData.email,
        telefono: formData.phone,
        mensaje: formData.message
      })
      
      toast.dismiss()
      toast.success('¡Consulta enviada! Nuestro equipo te contactará en 24 horas.')
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' })
      
    } catch (error) {
      toast.dismiss()
      toast.error('Error al procesar la solicitud. Inténtalo de nuevo.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Inicia tu <span className="text-yellow-500">Transformación</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle', 'Desbloquea el potencial de su vida; la transformación comienza hoy!')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              Información de Contacto
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 text-xl">💬</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                  <p className="text-gray-300">+1 929-833-6069</p>
                  <p className="text-gray-400 text-sm">Respuesta inmediata</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 text-xl">📧</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-gray-300">contacto@iku-cabalactiva.com</p>
                  <p className="text-gray-400 text-sm">Respuesta en 24 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 text-xl">🌐</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Sitio Web</h4>
                  <p className="text-gray-300">iku-cabalactiva.com</p>
                  <p className="text-gray-400 text-sm">Disponible 24/7</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border border-yellow-500/20">
              <h4 className="text-white font-semibold mb-3">Horarios de Atención</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex justify-between">
                  <span>Domingo - Jueves:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Viernes:</span>
                  <span>9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span>Cerrado (Shabat)</span>
                </div>
                <div className="text-yellow-500 text-xs mt-3 italic">
                  * Cerrado en festividades judías
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="+1 929-833-6069"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors resize-none"
                  placeholder="Cuéntanos sobre tu interés en las herramientas cabalísticas..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-yellow-500 text-slate-900 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Enviar Mensaje
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact