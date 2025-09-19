// Contact Service - Gestión inteligente de contactos
class ContactService {
  constructor() {
    const googleAppScriptUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL
    if (!googleAppScriptUrl) {
      console.error(
        'Error de configuración: VITE_GOOGLE_APP_SCRIPT_URL no está definida. Usando URL de respaldo.'
      )
    }
    this.webhookUrl =
      googleAppScriptUrl ||
      'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec'
    this.emailContacto = 'contacto@iku-cabalactiva.com'
    this.emailAdmin = 'maor@iku-cabalactiva.com'
  }

  // Enviar lead magnet (descarga gratuita)
  async enviarLeadMagnet(emailData) {
    const contactData = {
      action: 'send-email',
      to: this.emailContacto, // contacto@iku-cabalactiva.com
      cc: this.emailAdmin, // maor@iku-cabalactiva.com
      subject: `📥 Nuevo Lead: ${emailData.leadMagnet || 'Descarga PDF'}`,
      template: 'lead-magnet',
      data: {
        email: emailData.email,
        leadMagnet: emailData.leadMagnet,
        timestamp: new Date().toISOString(),
        source: emailData.source || 'website',
      },
    }

    // Registrar en CRM
    await this.registrarLead(emailData)

    // Enviar notificación
    return this.enviarNotificacion(contactData)
  }

  // Enviar consulta general
  async enviarConsulta(consultaData) {
    const contactData = {
      action: 'send-email',
      to: this.emailContacto, // contacto@iku-cabalactiva.com
      cc: this.emailAdmin, // maor@iku-cabalactiva.com
      subject: '💬 Nueva Consulta General',
      template: 'consulta-general',
      data: consultaData,
    }

    // Registrar en CRM
    await this.registrarConsulta(consultaData)

    return this.enviarNotificacion(contactData)
  }

  // Solo para sesiones confirmadas (pagadas)
  async notificarSesionConfirmada(sesionData) {
    const contactData = {
      action: 'send-email',
      to: 'contacto@iku-cabalactiva.com', // Solo sesiones pagadas
      cc: this.emailAdmin,
      subject: '📅 Sesión Confirmada (PAGADA)',
      template: 'sesion-confirmada',
      data: sesionData,
    }

    return this.enviarNotificacion(contactData)
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
          'Nuevo',
        ],
      }),
    })

    return response.json()
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
          'Pendiente',
        ],
      }),
    })

    return response.json()
  }

  // Enviar notificación
  async enviarNotificacion(emailData) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error(`Error enviando notificación: ${response.statusText}`)
    }

    return response.json()
  }

  // Método utilizado por el nuevo ContactForm.jsx
  async submitContactForm(formData) {
    try {
      // Preparar datos para el email
      const emailData = {
        action: 'registrar-consulta',
        token: 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025', // Token para Zero Trust
        emailData: {
          cliente: {
            nombre: formData.nombre,
            email: formData.email,
          },
          herramienta: formData.interes,
          mensaje: formData.mensaje,
          detalles: {
            telefono: formData.telefono,
            fechaNacimiento: formData.fechaNacimiento || '',
            horaNacimiento: formData.horaNacimiento || '',
            temaConstelacion: formData.temaConstelacion || '',
            fechaContacto: formData.fechaContacto,
            fuente: formData.fuente,
          },
        },
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        console.error('Error en respuesta del servidor:', response.statusText)
        throw new Error(`Error en el servidor: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error en submitContactForm:', error)
      throw error
    }
  }
}

export default new ContactService()
