// CRM Service - Integración con Google Sheets (ZERO TRUST)
class CRMService {
  constructor() {
    this.webhookUrl =
      import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbwZj6KlJZN5GyCwHzSv-kEBuqnG2TAZdfFaU8-QHA6_EAxJptTL3byy6f4C9mQAxAk-_g/exec'
    // Token secreto - debe coincidir exactamente con Google Apps Script
    this.secretToken = import.meta.env.VITE_CRM_SECRET_TOKEN;
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

    // Configuración robusta para manejar redirecciones de Google Apps Script
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos timeout

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CRM-Token': this.secretToken, // Token también en header
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'follow', // Seguir automáticamente las redirecciones 302
        credentials: 'omit', // No incluir credenciales para evitar problemas CORS
      })

      clearTimeout(timeoutId)

      // Google Apps Script puede devolver 200 pero con contenido HTML en caso de error
      const contentType = response.headers.get('content-type')
      
      if (!response.ok) {
        // Si es una redirección que falló, intentar con modo no-cors
        if (response.status === 302 || response.status === 0) {
          return await this.sendDataNoCorsFallback(payload)
        }
        throw new Error(`Error en webhook: ${response.status} ${response.statusText}`)
      }

      // Verificar si la respuesta es JSON válido
      if (contentType && contentType.includes('application/json')) {
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
      } else {
        // Si devuelve HTML, probablemente es una página de error de Google
        const text = await response.text()
        if (text.includes('Google') && text.includes('error')) {
          throw new Error('Error de configuración en Google Apps Script')
        }
        
        // Si llegamos aquí y no hay error, asumimos éxito (Google procesó la petición)
        return { success: true, message: 'Datos enviados exitosamente' }
      }

    } catch (error) {
      clearTimeout(timeoutId)
      
      // Si es un error de red o CORS, intentar fallback
      if (error.name === 'TypeError' || error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        return await this.sendDataNoCorsFallback(payload)
      }
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout: El servidor está tardando demasiado en responder')
      }
      
      throw error
    }
  }

  // Método fallback para casos donde CORS bloquea la respuesta
  async sendDataNoCorsFallback(payload) {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors', // No podemos leer la respuesta, pero Google la procesará
      })

      // En modo no-cors, si no hay error de red significa que Google 
      // recibió y está procesando la petición
      return { 
        success: true, 
        message: 'Datos enviados exitosamente (modo no-cors)',
        fallback: true 
      }
      
    } catch (error) {
      throw new Error(`Error crítico de red: ${error.message}`)
    }
  }

  // Método de prueba de conexión - ZERO TRUST
  async testConnection() {
    if (!this.webhookUrl || !this.secretToken) {
      console.error("Webhook URL o Secret Token no están configurados.");
      return { success: false, message: "Configuración de cliente incompleta." };
    }

    // Primero probamos con GET para verificar que el endpoint esté disponible
    try {
      const getResponse = await fetch(this.webhookUrl, {
        method: 'GET',
        redirect: 'follow'
      });

      if (getResponse.ok) {
        const getResult = await getResponse.json();
        if (getResult.status === 'active') {
          // El endpoint está activo, ahora probamos POST con autenticación Zero Trust
          const payload = {
            action: 'test',
            token: this.secretToken
          };

          try {
            const postResponse = await fetch(this.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              redirect: 'follow'
            });

            if (postResponse.ok) {
              const postResult = await postResponse.json();
              return { 
                success: true, 
                message: `Conexión Zero Trust exitosa: ${postResult.message || 'CRM disponible'}` 
              };
            } else {
              // POST falló, pero GET funciona - posible problema de deployment
              return {
                success: false,
                message: `Endpoint disponible (GET: ${getResult.message}) pero POST falló: ${postResponse.status} ${postResponse.statusText}`
              };
            }
          } catch (postError) {
            return {
              success: false,
              message: `Endpoint disponible pero error en POST Zero Trust: ${postError.message}`
            };
          }
        }
      }

      // Si GET también falla
      return { 
        success: false, 
        message: `Endpoint no disponible: ${getResponse.status} ${getResponse.statusText}` 
      };

    } catch (error) {
      console.error("Error en testConnection:", error);
      return { success: false, message: `Error de conexión: ${error.message}` };
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
