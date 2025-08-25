import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePayment = ({ producto, cliente, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const stripe = await stripePromise;
      
      // Crear PaymentIntent en el backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: producto.precio * 100, // centavos
          currency: 'usd',
          metadata: {
            product_id: producto.id,
            client_name: cliente.nombre,
            client_email: cliente.email
          }
        })
      });

      const { client_secret } = await response.json();

      // Confirmar pago
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: cliente.nombre,
            email: cliente.email
          }
        }
      });

      if (result.error) {
        console.error(result.error);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error('Error en pago:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment">
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? 'Procesando...' : `Pagar $${producto.precio} USD`}
      </button>
    </div>
  );
};

export default StripePayment;