import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ToolDetailModal = ({ isOpen, onClose, plan, onOpenContact }) => {
  if (!plan) return null

  const handleViewPricing = () => {
    onClose()
    // Scroll suave a la sección de precios
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const handleAskQuestion = () => {
    onClose()
    // Abrir el ContactModal existente
    if (onOpenContact) {
      onOpenContact(plan.title)
    }
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-yellow-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {plan.title}
                </h2>
                <div className="text-3xl font-bold text-yellow-500">
                  ${plan.price} USD
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Long Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-500 mb-4">
                Sobre esta herramienta cabalística
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">
                {plan.longDescription}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-yellow-500 mb-4">
                ¿Qué incluye?
              </h3>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons - Fusión: Prioridad a captura de leads + Conversión directa */}
            <div className="space-y-4">
              {/* CTA Principal - Captura de leads */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAskQuestion}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-4 rounded-lg font-semibold text-lg transition-colors transform hover:scale-105"
                >
                  � Quiero Más Información
                </button>
                <button
                  onClick={handleViewPricing}
                  className="flex-1 border-2 border-purple-500 text-purple-400 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-colors"
                >
                  � Ver Todos los Planes
                </button>
              </div>

              {/* Separador visual */}
              <div className="flex items-center justify-center my-6">
                <div className="border-t border-gray-600 flex-1"></div>
                <span className="px-4 text-gray-400 text-sm">O si ya estás decidido</span>
                <div className="border-t border-gray-600 flex-1"></div>
              </div>

              {/* CTAs Secundarios - Conversión directa */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-yellow-500/20">
                <p className="text-gray-300 text-center text-sm mb-4">
                  ⚡ Adquiere esta herramienta directamente:
                </p>
                <div className="space-y-3">
                  {/* PayPal Button */}
                  {plan.paypalUrlEnv && import.meta.env[plan.paypalUrlEnv] && (
                    <a
                      href={import.meta.env[plan.paypalUrlEnv]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      💙 Pagar con PayPal - ${plan.price} USD
                    </a>
                  )}
                  
                  {/* Stripe Button */}
                  {plan.stripeUrlEnv && import.meta.env[plan.stripeUrlEnv] && (
                    <a
                      href={import.meta.env[plan.stripeUrlEnv]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      � Pagar con Tarjeta - ${plan.price} USD
                    </a>
                  )}
                  
                  {/* Stripe Payment in Parts (if applicable) */}
                  {plan.stripePartesUrlEnv && import.meta.env[plan.stripePartesUrlEnv] && (
                    <a
                      href={import.meta.env[plan.stripePartesUrlEnv]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      ⚡ Pagar en Cuotas - ${plan.price} USD
                    </a>
                  )}
                </div>
                <p className="text-gray-400 text-xs text-center mt-2">
                  ✅ Pago seguro • ✅ Acceso inmediato • ✅ Garantía 30 días
                </p>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>✨ Guía personal del Rabbí Isaac Benzaquén</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ToolDetailModal