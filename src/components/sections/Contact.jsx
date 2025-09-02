import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { t } from '../../utils/i18n'
import contactService from '../../services/contactService'
import ContactModal from '../common/ContactModal'

const Contact = () => {
  const [showModal, setShowModal] = useState(false)



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
            Desbloquea el potencial de tu vida; ¡la transformación comienza hoy!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-yellow-500/10 to-purple-500/10 rounded-2xl p-8 border border-yellow-500/20">
            <h3 className="text-3xl font-bold text-white mb-6">
              ¿Listo para tu transformación?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Conecta con el Maestro Isaac y descubre el poder de la Cábala en tu vida
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                ✉️ Contactar por Email
              </button>
              
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500/10 transition-colors"
              >
                Ver Herramientas
              </button>
            </div>
          </div>
        </motion.div>
        
        <ContactModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          herramienta="Consulta General"
        />
      </div>
    </section>
  )
}

export default Contact