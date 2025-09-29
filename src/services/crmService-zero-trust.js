// CRM Service - Integración con Google Sheets (ZERO TRUST)
class CRMService {
  constructor() {
    this.webhookUrl =
      import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbzNdYV5WC2o_PF8qeWle8hZ9kvIsBiDeWXA4U5CNYwI6Blzx_ju-Cw19oDTRYYgnUzQxA/exec'
    // Token secreto - debe coincidir con Google Apps Script
    this.secretToken =
      import.meta.env.VITE_CRM_SECRET_TOKEN ||
      'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025'
  }

  // Validaciones frontend
  validateClienteData(clienteData) {
    const errors = []

    if (!clienteData.nombre || !/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/.test(clienteData.nombre)) {
      errors.push('Nombre inválido (solo letras, 2-50 caracteres)')
    }

    if (
      !clienteData.email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clienteData.email)
    ) {
      errors.push('Email inválido')
    }

    if (!clienteData.telefono || clienteData.telefono.length < 8) {
      errors.push('Teléfono inválido (mínimo 8 caracteres)')
    }

    return { valid: errors.length === 0, errors }
  }

  async registrarCliente(clienteData) {
    // Validación frontend
    const validation = this.validateClienteData(clienteData)
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`)
    }

    const cliente = {
      id: Date.now().toString(),
      nombre: clienteData.nombre.trim(),
      email: clienteData.email.toLowerCase().trim(),
      telefono: clienteData.telefono.trim(),
      fecha_registro: new Date().toISOString(),
      estado: 'Activo',
      prioridad: 'Normal',
    }

    await this.sendToWebhook('update-crm', {
      sheetName: 'Clientes',
      values: Object.values(cliente),
    })

    return cliente
  }

  async registrarCompra(compraData) {
    // Validación frontend
    if (!compraData.clienteId || !compraData.producto || !compraData.monto) {
      throw new Error('Datos de compra incompletos')
    }

    if (compraData.monto <= 0 || compraData.monto > 10000) {
      throw new Error('Monto inválido')
    }

    const compra = {
      id_cliente: compraData.clienteId,
      producto: compraData.producto.trim(),
      monto: parseFloat(compraData.monto),
      proveedor: compraData.proveedor || 'No especificado',
      fecha_compra: new Date().toISOString(),
      estado_pago: compraData.estadoPago || 'Pendiente',
      sesiones_restantes: compraData.sesionesRestantes || 1,
    }

    await this.sendToWebhook('update-crm', {
      sheetName: 'Compras',
      values: Object.values(compra),
    })

    return compra
  }

  async programarSesion(sesionData) {
    // Validación frontend
    if (!sesionData.clienteId || !sesionData.tipoSesion) {
      throw new Error('Datos de sesión incompletos')
    }

    if (sesionData.fechaSesion && new Date(sesionData.fechaSesion) < new Date()) {
      throw new Error('La fecha de sesión no puede ser en el pasado')
    }

    const sesion = {
      id_cliente: sesionData.clienteId,
      fecha_sesion: sesionData.fechaSesion || new Date().toISOString(),
      tipo_sesion: sesionData.tipoSesion.trim(),
      estado: 'Programada',
      notas: (sesionData.notas || '').trim(),
      proxima_sesion: sesionData.proximaSesion || '',
    }

    await this.sendToWebhook('update-crm', {
      sheetName: 'Sesiones',
      values: Object.values(sesion),
    })

    return sesion
  }

  async sendToWebhook(action, data) {
    const payload = {
      action,
      token: this.secretToken, // Zero Trust token
      timestamp: new Date().toISOString(),
      ...data,
    }

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CRM-Token': this.secretToken, // Token también en header
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error en webhook: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    // Si el backend responde success: false, lanzar error con el mensaje
    if (result.success === false) {
      throw new Error(
        `Acceso no autorizado: ${result.error || 'Error del servidor'} (${
          result.code || 'UNKNOWN'
        })`
      )
    }
    if (result.error) {
      throw new Error(`Error del servidor: ${result.error} (${result.code || 'UNKNOWN'})`)
    }
    return result
  }

  // Método de prueba de conexión
  async testConnection() {
    try {
      const result = await this.sendToWebhook('test', {})
      // Si el backend responde success: false o hay error, devolver success: false
      if (result.success === false || result.error) {
        return { success: false, error: result.error || 'Error del servidor' }
      }
      // Si el token es incorrecto pero el backend responde success: true, detectar por mensaje
      if (result.message && /token|autorizado|acceso/i.test(result.message)) {
        return { success: false, error: result.message }
      }
      return { success: true, message: result.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Validador de email reutilizable
export const validateEmail = email => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

// Sanitizador de strings
export const sanitizeString = str => {
  return str ? str.trim().replace(/[<>"'&]/g, '') : ''
}

export default new CRMService()
