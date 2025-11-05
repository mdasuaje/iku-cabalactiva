// Email Service - Automatización de correos
class EmailService {
  constructor() {
    this.webhookUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL || 
      'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';
  }

  // Enviar notificación de nueva compra
  async notificarNuevaCompra(compraData) {
    const emailData = {
      to: 'maor@iku-cabalactiva.com',
      subject: `🎉 Nueva Compra: ${compraData.producto}`,
      template: 'nueva-compra',
      data: {
        cliente: compraData.cliente,
        producto: compraData.producto,
        monto: compraData.monto,
        proveedor: compraData.proveedor,
        fecha: new Date().toLocaleDateString('es-ES')
      }
    };

    return this.enviarEmail(emailData);
  }

  // Notificar nueva sesión al Maestro Isaac
  async notificarNuevaSesion(sesionData) {
    const emailData = {
      to: 'kabbalahuniversal@gmail.com',
      cc: 'maor@iku-cabalactiva.com',
      subject: `📅 Nueva Sesión Programada: ${sesionData.tipoSesion}`,
      template: 'nueva-sesion',
      data: {
        cliente: sesionData.cliente,
        tipoSesion: sesionData.tipoSesion,
        fechaSesion: sesionData.fechaSesion,
        notas: sesionData.notas
      }
    };

    return this.enviarEmail(emailData);
  }

  // Recordatorio de próxima sesión
  async recordatorioProximaSesion(sesionData) {
    const emailData = {
      to: 'kabbalahuniversal@gmail.com',
      cc: 'maor@iku-cabalactiva.com',
      subject: `⏰ Recordatorio: Sesión en 24 horas`,
      template: 'recordatorio-sesion',
      data: {
        cliente: sesionData.cliente,
        tipoSesion: sesionData.tipoSesion,
        fechaSesion: sesionData.fechaSesion,
        enlaceZoom: sesionData.enlaceZoom
      }
    };

    return this.enviarEmail(emailData);
  }

  // Método genérico para enviar emails
  async enviarEmail(emailData) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send-email',
        ...emailData
      })
    });

    if (!response.ok) {
      throw new Error(`Error al enviar email: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new EmailService();