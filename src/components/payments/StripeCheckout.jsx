import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { toast } from 'react-hot-toast'
import crmService from '../../services/crmService'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

/**
 * Stripe Payment Form Component
 */
const StripePaymentForm = ({ 
  amount, 
  currency = 'usd', 
  product, 
  clienteData,
  onSuccess,
  onError 
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: clienteData?.nombre || 'Cliente',
          email: clienteData?.email || '',
          phone: clienteData?.telefono || ''
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      // Create payment intent (this would typically be done on your backend)
      const paymentIntent = await createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        payment_method: paymentMethod.id,
        description: product,
        metadata: {
          product: product,
          cliente_email: clienteData?.email || '',
          cliente_nombre: clienteData?.nombre || ''
        }
      })

      // Confirm payment
      const { error: confirmError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: paymentMethod.id
        }
      )

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      // Register client if provided
      let clienteId = null
      if (clienteData) {
        try {
          const cliente = await crmService.registrarCliente(clienteData)
          clienteId = cliente.id
        } catch (error) {
          console.warn('Error registering client:', error)
        }
      }

      // Register purchase in CRM
      const compraData = {
        clienteId: clienteId || `stripe_${confirmedPayment.id}`,
        producto: product,
        monto: amount,
        proveedor: 'Stripe',
        estadoPago: 'Completado',
        transactionId: confirmedPayment.id,
        currency: currency.toUpperCase(),
        paymentMethod: 'Tarjeta de Crédito',
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand
      }

      await crmService.registrarCompra(compraData)

      // Success notification
      toast.success(`¡Pago completado! Transacción: ${confirmedPayment.id.slice(-8)}`)
      
      if (onSuccess) {
        onSuccess({
          transactionId: confirmedPayment.id,
          amount: amount,
          currency: currency,
          product: product,
          paymentMethod: paymentMethod
        })
      }

    } catch (error) {
      console.error('Stripe payment error:', error)
      setPaymentError(error.message)
      toast.error(`Error en el pago: ${error.message}`)
      
      if (onError) {
        onError(error)
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Información de la tarjeta
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{paymentError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          `Pagar $${amount} ${currency.toUpperCase()}`
        )}
      </button>
    </form>
  )
}

/**
 * Create payment intent (mock function - should be implemented on backend)
 */
const createPaymentIntent = async (paymentData) => {
  // This is a mock implementation
  // In production, this should call your backend API
  return {
    client_secret: 'pi_mock_client_secret',
    id: 'pi_mock_payment_intent'
  }
}

/**
 * Stripe Checkout Component with Elements Provider
 */
const StripeCheckout = (props) => {
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#f59e0b',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }

  const options = {
    appearance
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm {...props} />
    </Elements>
  )
}

export default StripeCheckout