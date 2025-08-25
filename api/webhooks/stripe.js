// Webhook Stripe - Producción
import webhookService from '../../src/services/webhookService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    
    console.log('Stripe webhook recibido:', event.type);
    
    // Procesar el webhook
    await webhookService.procesarStripeWebhook(event);
    
    console.log('Stripe webhook procesado exitosamente');
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}