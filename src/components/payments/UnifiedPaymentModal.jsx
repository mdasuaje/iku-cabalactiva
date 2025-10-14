import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PayPalButton from './PayPalButton'
import StripeCheckout from './StripeCheckout'
import { toast } from 'react-hot-toast'

/**
 * Unified Payment Modal Component
 * Provides a seamless payment experience with multiple gateways
 */
const UnifiedPaymentModal = ({ 
  isOpen, 
  onClose, 
  product, 
  amount, 
  currency = 'USD',
  description 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [clienteData, setClienteData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  })
  const [step, setStep] = useState('info') // 'info', 'payment', 'success'
  const [paymentResult, setPaymentResult] = useState(null)

  const handleClienteDataChange = (field, value) => {
    setClienteData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateClienteData = () => {
    if (!clienteData.nombre.trim()) {
      toast.error('El nombre es requerido')
      return false
    }
    if (!clienteData.email.trim() || !clienteData.email.includes('@')) {
      toast.error('Email válido es requerido')
      return false
    }
    if (!clienteData.telefono.trim()) {
      toast.error('El teléfono es requerido')
      return false
    }
    return true
  }

  const handleContinueToPayment = () => {
    if (validateClienteData()) {
      setStep('payment')
    }
  }

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result)
    setStep('success')
    toast.success('¡Pago completado exitosamente!')
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    toast.error('Error en el pago. Intenta nuevamente.')
  }

  const handleClose = () => {
    setStep('info')
    setPaymentResult(null)
    setClienteData({ nombre: '', email: '', telefono: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'info' && 'Información Personal'}
                {step === 'payment' && 'Método de Pago'}
                {step === 'success' && '¡Pago Completado!'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Product Info */}
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
              <h3 className="font-semibold text-gray-900">{product}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-yellow-600">
                  ${amount} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'info' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={clienteData.nombre}
                    onChange={(e) => handleClienteDataChange('nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={clienteData.email}
                    onChange={(e) => handleClienteDataChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={clienteData.telefono}
                    onChange={(e) => handleClienteDataChange('telefono', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <button
                  onClick={handleContinueToPayment}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Continuar al Pago
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selecciona tu método de pago
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">💳</div>
                        <div className="text-sm font-medium">PayPal</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">💳</div>
                        <div className="text-sm font-medium">Tarjeta</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Component */}
                <div className="border-t pt-6">
                  {paymentMethod === 'paypal' && (
                    <PayPalButton
                      amount={amount}
                      currency={currency}
                      product={product}
                      clienteData={clienteData}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}

                  {paymentMethod === 'stripe' && (
                    <StripeCheckout
                      amount={amount}
                      currency={currency.toLowerCase()}
                      product={product}
                      clienteData={clienteData}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}
                </div>

                <button
                  onClick={() => setStep('info')}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
                >
                  ← Volver a información personal
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900">
                  ¡Pago Completado!
                </h3>
                
                <p className="text-gray-600">
                  Tu compra de <strong>{product}</strong> ha sido procesada exitosamente.
                </p>
                
                {paymentResult && (
                  <div className="bg-gray-50 p-4 rounded-lg text-left">
                    <p className="text-sm text-gray-600">
                      <strong>ID de Transacción:</strong> {paymentResult.transactionId?.slice(-12)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Monto:</strong> ${paymentResult.amount} {paymentResult.currency}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Recibirás un email de confirmación en breve.
                  </p>
                  
                  <button
                    onClick={handleClose}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UnifiedPaymentModal