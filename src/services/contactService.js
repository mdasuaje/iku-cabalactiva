// Contact Service - Gestión inteligente de contactos
class ContactService {
  constructor() {
    this.webhookUrl = 'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';
    this.emailContacto = 'contacto@iku-cabalactiva.com';
    this.emailAdmin = 'maor@iku-cabalactiva.com';
  }

  // Enviar lead magnet (descarga gratuita)
  async enviarLeadMagnet(emailData) {
    const contactData = {
      action: 'send-email',
      to: this.emailContacto, // contacto@iku-cabalactiva.com
      cc: this.emailAdmin,    // maor@iku-cabalactiva.com
      subject: `📥 Nuevo Lead: ${emailData.leadMagnet || 'Descarga PDF'}`,
      template: 'lead-magnet',
      data: {
        email: emailData.email,
        leadMagnet: emailData.leadMagnet,
        timestamp: new Date().toISOString(),
        source: emailData.source || 'website'
      }
    };

    // Registrar en CRM
    await this.registrarLead(emailData);

    // Enviar notificación
    return this.enviarNotificacion(contactData);
  }

  // Enviar consulta general
  async enviarConsulta(consultaData) {
    const contactData = {
      action: 'send-email',
      to: this.emailContacto, // contacto@iku-cabalactiva.com
      cc: this.emailAdmin,    // maor@iku-cabalactiva.com
      subject: '💬 Nueva Consulta General',
      template: 'consulta-general',
      data: consultaData
    };

    // Registrar en CRM
    await this.registrarConsulta(consultaData);

    return this.enviarNotificacion(contactData);
  }

  // Solo para sesiones confirmadas (pagadas)
  async notificarSesionConfirmada(sesionData) {
    const contactData = {
      action: 'send-email',
      to: 'kabbalahuniversal@gmail.com', // Solo sesiones pagadas
      cc: this.emailAdmin,
      subject: '📅 Sesión Confirmada (PAGADA)',
      template: 'sesion-confirmada',
      data: sesionData
    };

    return this.enviarNotificacion(contactData);
  }

  // Registrar lead en CRM
  async registrarLead(leadData) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-crm',
        sheetName: 'Leads',
        values: [
          Date.now().toString(),
          leadData.email,
          leadData.source || 'website',
          leadData.leadMagnet || 'PDF Descarga',
          new Date().toISOString(),
          'Nuevo'
        ]
      })
    });

    return response.json();
  }

  // Registrar consulta en CRM
  async registrarConsulta(consultaData) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-crm',
        sheetName: 'Consultas',
        values: [
          Date.now().toString(),
          consultaData.nombre,
          consultaData.email,
          consultaData.telefono || '',
          consultaData.mensaje,
          new Date().toISOString(),
          'Pendiente'
        ]
      })
    });

    return response.json();
  }

  // Enviar notificación
  async enviarNotificacion(emailData) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error(`Error enviando notificación: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new ContactService();