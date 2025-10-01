import React from 'react'
import { motion } from 'framer-motion'

const PricingCard = ({ 
  title, 
  price, 
  features, 
  isFeatured, 
  stripeUrlEnv, 
  stripePartesUrlEnv, 
  paypalUrlEnv, 
  delay = 0 
}) => {
  const handlePayment = (url) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      console.error('URL de pago no configurada')
      alert('Error: URL de pago no disponible. Contacta al soporte.')
    }
  }

  // Obtener URLs de las variables de entorno
  const stripeUrl = stripeUrlEnv ? import.meta.env[stripeUrlEnv] : null
  const stripePartesUrl = stripePartesUrlEnv ? import.meta.env[stripePartesUrlEnv] : null
  const paypalUrl = paypalUrlEnv ? import.meta.env[paypalUrlEnv] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
      data-testid="pricing-card"
      className={`relative bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border h-full flex flex-col ${
        isFeatured 
          ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-purple-500/10 lg:col-span-1 xl:col-span-1' 
          : 'border-slate-600/50'
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
            ⭐ Recomendado
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 min-h-[3rem] flex items-center justify-center">
          {title}
        </h3>
        <div className="text-3xl font-bold text-yellow-500 mb-2">
          ${price} USD
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-300 text-sm">
            <span className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 mt-auto">
        {/* Botón Stripe principal */}
        {stripeUrl && (
          <button
            onClick={() => handlePayment(stripeUrl)}
            className="w-full bg-slate-900 text-yellow-500 px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm"
          >
            💳 Pagar con Tarjeta
          </button>
        )}
        
        {/* Botón Stripe a plazos (solo para paquete) */}
        {stripePartesUrl && (
          <button
            onClick={() => handlePayment(stripePartesUrl)}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
          >
            💳 Pagar en 3 Partes
          </button>
        )}
        
        {/* Botón PayPal */}
        {paypalUrl && (
          <button
            onClick={() => handlePayment(paypalUrl)}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            🌐 Pagar con PayPal
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default PricingCard