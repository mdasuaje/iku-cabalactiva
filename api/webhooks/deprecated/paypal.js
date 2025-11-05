// Webhook endpoint para PayPal
import webhookService from '../../src/services/webhookService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    
    // Procesar el webhook
    await webhookService.procesarPayPalWebhook(event);
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}