import React from 'react'
import { motion } from 'framer-motion'

const PricingCard = () => {
  const pricingOptions = [
    {
      id: 'single-session',
      title: 'Sesión Única',
      price: '$150',
      description: 'Combinación personalizada de herramientas cabalísticas',
      features: ['Consulta personalizada', 'Herramientas específicas', 'Guía espiritual'],
      paypalUrl: import.meta.env.VITE_PAYPAL_SINGLE_SESSION,
      popular: false
    },
    {
      id: 'full-package',
      title: 'Programa Completo',
      price: '$1,000',
      description: '10 sesiones / 6 meses (financiable en 3 partes)',
      features: ['10 sesiones completas', '6 meses de seguimiento', 'Todas las herramientas', 'Soporte continuo'],
      paypalUrl: import.meta.env.VITE_PAYPAL_FULL_PACKAGE,
      stripeUrl: import.meta.env.VITE_STRIPE_CHECKOUT,
      popular: true
    }
  ]

  const handlePayment = (url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {pricingOptions.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.02 }}
          className={`relative bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border ${
            option.popular 
              ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-purple-500/10' 
              : 'border-slate-600/50'
          }`}
        >
          {option.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                Más Popular
              </span>
            </div>
          )}
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{option.title}</h3>
            <div className="text-4xl font-bold text-yellow-500 mb-2">{option.price} USD</div>
            <p className="text-gray-300 text-sm">{option.description}</p>
          </div>

          <ul className="space-y-2 mb-6">
            {option.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-300 text-sm">
                <span className="text-yellow-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="space-y-2">
            {option.stripeUrl && (
              <button
                onClick={() => handlePayment(option.stripeUrl)}
                className="w-full bg-slate-900 text-yellow-500 px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                💳 Pagar con Tarjeta
              </button>
            )}
            <button
              onClick={() => handlePayment(option.paypalUrl)}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🌐 Pagar con PayPal
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PricingCard