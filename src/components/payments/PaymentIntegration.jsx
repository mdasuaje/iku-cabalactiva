import { useState } from 'react';
import crmService from '../../services/crmService';
import emailService from '../../services/emailService';

const PaymentIntegration = ({ producto, cliente }) => {
  const [procesando, setProcesando] = useState(false);

  // Procesar pago exitoso (llamado desde Stripe/PayPal)
  const procesarPagoExitoso = async (paymentData) => {
    setProcesando(true);
    
    try {
      // 1. Registrar cliente
      const clienteRegistrado = await crmService.registrarCliente({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono
      });

      // 2. Registrar compra
      const compra = await crmService.registrarCompra({
        clienteId: clienteRegistrado.id,
        producto: producto.nombre,
        monto: producto.precio,
        proveedor: paymentData.proveedor,
        estadoPago: 'Completado',
        sesionesRestantes: producto.sesiones
      });

      // 3. Enviar notificación
      await emailService.notificarNuevaCompra({
        cliente: clienteRegistrado,
        producto: producto.nombre,
        monto: producto.precio,
        proveedor: paymentData.proveedor
      });

      // 4. Si requiere sesión, programar y notificar al Maestro
      if (producto.requiereSesion) {
        const fechaSesion = new Date();
        fechaSesion.setDate(fechaSesion.getDate() + 3);

        await crmService.programarSesion({
          clienteId: clienteRegistrado.id,
          fechaSesion: fechaSesion.toISOString(),
          tipoSesion: producto.nombre,
          notas: 'Sesión inicial - Pendiente confirmación'
        });

        await emailService.notificarNuevaSesion({
          cliente: clienteRegistrado,
          tipoSesion: producto.nombre,
          fechaSesion: fechaSesion.toISOString(),
          notas: `Nueva compra - ${paymentData.proveedor}`
        });
      }

      return { success: true, cliente: clienteRegistrado, compra };
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw error;
    } finally {
      setProcesando(false);
    }
  };

  return {
    procesarPagoExitoso,
    procesando
  };
};

export default PaymentIntegration;