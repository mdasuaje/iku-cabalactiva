import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactModal from './ContactModal'

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    setShowModal(true)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-16 right-0 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
          >
            <div className="text-sm font-semibold">¿Necesitas ayuda? Contáctanos</div>
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </motion.button>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-xs"
      >
        ×
      </button>


      
      <ContactModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        herramienta="Consulta General"
      />
    </div>
  )
}

export default WhatsAppFloat