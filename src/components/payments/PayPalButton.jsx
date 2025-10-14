import React, { useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-hot-toast'
import crmService from '../../services/crmService'

/**
 * PayPal Button Component with CRM Integration
 * Handles PayPal payments and logs transactions to CRM
 */
const PayPalButton = ({ 
  amount, 
  currency = 'USD', 
  product, 
  clienteData,
  onSuccess,
  onError,
  onCancel 
}) => {
  const [{ isPending }] = usePayPalScriptReducer()
  const [processing, setProcessing] = useState(false)

  /**
   * Create PayPal order
   */
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: currency
          },
          description: product,
          custom_id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        }
      ],
      application_context: {
        brand_name: 'IKU Cábala Activa',
        locale: 'es_ES',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    })
  }

  /**
   * Handle successful payment approval
   */
  const onApprove = async (data, actions) => {
    setProcessing(true)
    
    try {
      // Capture the payment
      const details = await actions.order.capture()
      
      // Register client if provided
      let clienteId = null
      if (clienteData) {
        try {
          const cliente = await crmService.registrarCliente(clienteData)
          clienteId = cliente.id
        } catch (error) {
          console.warn('Error registering client:', error)
          // Continue with purchase even if client registration fails
        }
      }

      // Register purchase in CRM
      const compraData = {
        clienteId: clienteId || `paypal_${details.payer.payer_id}`,
        producto: product,
        monto: parseFloat(amount),
        proveedor: 'PayPal',
        estadoPago: 'Completado',
        transactionId: details.id,
        currency: currency,
        payerEmail: details.payer.email_address,
        payerName: details.payer.name?.given_name + ' ' + details.payer.name?.surname,
        paymentMethod: 'PayPal',
        captureId: details.purchase_units[0].payments.captures[0].id
      }

      await crmService.registrarCompra(compraData)

      // Success notification
      toast.success(`¡Pago completado! Transacción: ${details.id.slice(-8)}`)
      
      // Call success callback
      if (onSuccess) {
        onSuccess({
          transactionId: details.id,
          amount: amount,
          currency: currency,
          product: product,
          details: details
        })
      }

    } catch (error) {
      console.error('Error processing PayPal payment:', error)
      toast.error('Error procesando el pago. Contacta soporte.')
      
      if (onError) {
        onError(error)
      }
    } finally {
      setProcessing(false)
    }
  }

  /**
   * Handle payment errors
   */
  const onErrorHandler = (error) => {
    console.error('PayPal payment error:', error)
    toast.error('Error en el pago. Intenta nuevamente.')
    
    if (onError) {
      onError(error)
    }
  }

  /**
   * Handle payment cancellation
   */
  const onCancelHandler = (data) => {
    console.log('PayPal payment cancelled:', data)
    toast.info('Pago cancelado')
    
    if (onCancel) {
      onCancel(data)
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        <span className="ml-2 text-gray-600">Cargando PayPal...</span>
      </div>
    )
  }

  return (
    <div className="paypal-button-container">
      {processing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
            <span className="ml-2 text-gray-700">Procesando pago...</span>
          </div>
        </div>
      )}
      
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45
        }}
        disabled={processing}
      />
    </div>
  )
}

export default PayPalButton