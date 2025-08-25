// Webhook Service - Manejo de webhooks de Stripe y PayPal
import crmService from './crmService.js';
import emailService from './emailService.js';
// import calendarService from './calendarService.js';

class WebhookService {
  // Procesar webhook de Stripe
  async procesarStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.procesarPagoExitoso(event.data.object, 'Stripe');
          break;
        case 'payment_intent.payment_failed':
          await this.procesarPagoFallido(event.data.object, 'Stripe');
          break;
        default:
          console.log(`Evento Stripe no manejado: ${event.type}`);
      }
    } catch (error) {
      console.error('Error procesando webhook Stripe:', error);
      throw error;
    }
  }

  // Procesar webhook de PayPal
  async procesarPayPalWebhook(event) {
    try {
      switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          await this.procesarPagoExitoso(event.resource, 'PayPal');
          break;
        case 'PAYMENT.CAPTURE.DENIED':
          await this.procesarPagoFallido(event.resource, 'PayPal');
          break;
        default:
          console.log(`Evento PayPal no manejado: ${event.event_type}`);
      }
    } catch (error) {
      console.error('Error procesando webhook PayPal:', error);
      throw error;
    }
  }

  // Procesar pago exitoso
  async procesarPagoExitoso(paymentData, proveedor) {
    const clienteData = this.extraerDatosCliente(paymentData);
    const productoData = this.extraerDatosProducto(paymentData);

    // 1. Registrar cliente
    const cliente = await crmService.registrarCliente(clienteData);

    // 2. Registrar compra
    const compra = await crmService.registrarCompra({
      clienteId: cliente.id,
      producto: productoData.nombre,
      monto: productoData.precio,
      proveedor: proveedor,
      estadoPago: 'Completado',
      sesionesRestantes: productoData.sesiones
    });

    // 3. Enviar notificación de compra
    await emailService.notificarNuevaCompra({
      cliente: clienteData,
      producto: productoData.nombre,
      monto: productoData.precio,
      proveedor: proveedor
    });

    // 4. Programar sesión inicial si es necesario
    if (productoData.requiereSesion) {
      const sesion = await this.programarSesionInicial(cliente, productoData);
      
      // 5. Notificar nueva sesión al Maestro Isaac
      await emailService.notificarNuevaSesion({
        cliente: clienteData,
        tipoSesion: productoData.nombre,
        fechaSesion: sesion.fecha_sesion,
        notas: `Nueva compra - ${proveedor}`
      });
    }

    return { cliente, compra };
  }

  // Procesar pago fallido
  async procesarPagoFallido(paymentData, proveedor) {
    console.log(`Pago fallido en ${proveedor}:`, paymentData);
    // Aquí se puede implementar lógica adicional para pagos fallidos
  }

  // Programar sesión inicial
  async programarSesionInicial(cliente, producto) {
    // Fecha sugerida: 3 días después de la compra
    const fechaSugerida = new Date();
    fechaSugerida.setDate(fechaSugerida.getDate() + 3);

    const sesion = await crmService.programarSesion({
      clienteId: cliente.id,
      fechaSesion: fechaSugerida.toISOString(),
      tipoSesion: producto.nombre,
      notas: 'Sesión inicial - Pendiente confirmación'
    });

    return sesion;
  }

  // Extraer datos del cliente del payload
  extraerDatosCliente(paymentData) {
    return {
      nombre: paymentData.billing_details?.name || paymentData.payer?.name?.given_name + ' ' + paymentData.payer?.name?.surname || 'Cliente',
      email: paymentData.billing_details?.email || paymentData.payer?.email_address || '',
      telefono: paymentData.billing_details?.phone || paymentData.payer?.phone?.phone_number?.national_number || ''
    };
  }

  // Extraer datos del producto del payload
  extraerDatosProducto(paymentData) {
    const productos = {
      'carta-astral': { nombre: 'Carta Astral Cabalística', precio: 67, sesiones: 1, requiereSesion: true },
      'constelacion': { nombre: 'Constelación Familiar Cabalística', precio: 97, sesiones: 1, requiereSesion: true },
      'limpieza-aurica': { nombre: 'Limpieza Áurica Cabalística', precio: 150, sesiones: 1, requiereSesion: true },
      'meditacion': { nombre: 'Meditación Cabalística', precio: 67, sesiones: 1, requiereSesion: false }
    };

    // Identificar producto basado en metadata o descripción
    const productId = paymentData.metadata?.product_id || 'carta-astral';
    return productos[productId] || productos['carta-astral'];
  }
}

export default new WebhookService();