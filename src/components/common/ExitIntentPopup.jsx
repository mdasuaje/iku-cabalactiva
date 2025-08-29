import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import contactService from '../../services/contactService'

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !localStorage.getItem('exitIntentShown')) {
        setShowPopup(true)
        localStorage.setItem('exitIntentShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      toast.loading('Enviando solicitud...')
      
      await contactService.enviarLeadMagnet({
        email,
        source: 'exit-intent-popup'
      })
      
      toast.dismiss()
      toast.success('¡Perfecto! Recibirás el PDF y tu descuento por email en breve.')
      setShowPopup(false)
      
    } catch (error) {
      toast.dismiss()
      toast.error('Error al procesar. Inténtalo de nuevo.')
    }
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-slate-800 rounded-lg p-8 max-w-md w-full border border-yellow-500"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-yellow-500 font-bold text-2xl mb-4 text-center">
              ¡ESPERA! 🎁
            </h2>
            
            <p className="text-white mb-6 text-center">
              Descarga GRATIS <strong>"Los 7 Secretos de la Cábala"</strong> 
              y recibe un <strong className="text-yellow-500">descuento del 20%</strong> en tu primera sesión
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                placeholder="Tu email aquí"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-slate-700 text-white border border-gray-600 focus:border-yellow-500"
              />
              <button 
                type="submit"
                className="w-full bg-yellow-500 text-slate-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
              >
                DESCARGAR GRATIS + DESCUENTO
              </button>
            </form>
            
            <p className="text-gray-400 text-xs text-center mt-4">
              🔒 100% privado • No spam • Descuento válido por 48 horas
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExitIntentPopup