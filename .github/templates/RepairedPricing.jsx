import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PRICING_PLANS } from '../../utils/constants'
import ContactModal from '../common/ContactModal'
import PricingCard from '../common/PricingCard'
import crmService from '../../services/crmService'
import { toast } from 'react-hot-toast'

/**
 * Enhanced Pricing Component with CRM Integration
 * Includes payment gateway integration and transaction logging
 */
const Pricing = () => {
  const [showModal, setShowModal] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(null)
  
  /**
   * Handle purchase initiation with CRM logging
   */
  const handlePurchaseClick = async (plan) => {
    setProcessingPayment(plan.id)
    
    try {
      // Log purchase attempt to CRM
      await crmService.registrarCompra({
        clienteId: generateTempClientId(),
        producto: plan.title,
        monto: plan.price,
        proveedor: 'PayPal', // Default to PayPal
        estadoPago: 'Iniciado',
        sesionesRestantes: plan.sessions || 1
      })
      
      // Redirect to payment gateway
      if (plan.paypalUrl) {
        window.location.href = plan.paypalUrl
      } else {
        toast.error('URL de pago no configurada')
      }
      
    } catch (error) {
      console.error('Error processing purchase:', error)
      toast.error('Error al procesar la compra. Intenta nuevamente.')
    } finally {
      setProcessingPayment(null)
    }
  }
  
  /**
   * Generate temporary client ID for tracking
   */
  const generateTempClientId = () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  }
  
  /**
   * Enhanced PricingCard with CRM integration
   */
  const EnhancedPricingCard = ({ plan, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative bg-gradient-to-br ${plan.gradient} p-8 rounded-2xl shadow-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
            Más Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-4xl mb-4">{plan.icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">{plan.description}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-yellow-500">${plan.price}</span>
          <span className="text-gray-400 ml-2">USD</span>
        </div>
        
        <ul className="text-left mb-8 space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300 text-sm">
              <span className="text-yellow-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => handlePurchaseClick(plan)}
          disabled={processingPayment === plan.id}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            plan.popular
              ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
              : 'bg-slate-700 hover:bg-slate-600 text-white border border-yellow-500/30 hover:border-yellow-500'
          } ${processingPayment === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {processingPayment === plan.id ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            `Adquirir ${plan.title}`
          )}
        </button>
        
        {plan.whatsappUrl && (
          <a
            href={plan.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            💬 Consultar por WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  )
  
  return (
    <section id="pricing" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Planes y <span className="text-yellow-500">Precios</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tu camino espiritual
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
        >
          {PRICING_PLANS.map((plan, index) => (
            <EnhancedPricingCard 
              key={plan.id}
              plan={plan}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            ¿Necesitas más información? Contáctanos directamente
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            💬 Consultar Ahora
          </button>
        </motion.div>
        
        <ContactModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          herramienta="Consulta de Precios"
        />
      </div>
    </section>
  )
}

export default Pricing