import React from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

/**
 * PayPal Script Provider Component
 * Provides PayPal SDK context to the application
 */
const PayPalProvider = ({ children }) => {
  const initialOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
    'data-client-token': import.meta.env.VITE_PAYPAL_CLIENT_TOKEN,
    locale: 'es_ES',
    components: 'buttons,funding-eligibility',
    'enable-funding': 'venmo,paylater',
    'disable-funding': 'card'
  }

  // Validate PayPal configuration
  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    console.warn('PayPal Client ID not configured. Using test mode.')
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  )
}

export default PayPalProvider