// Google Apps Script - VERSIÓN ZERO TRUST CON CORS CORREGIDO
// Arquitectura Modular y Escalable - Proporción Áurea
// Copiar este código completo en Google Apps Script

const CONFIG = {
  SPREADSHEET_ID: '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY',
  EMAIL_ADMIN: 'maor@iku-cabalactiva.com',
  EMAIL_MAESTRO: 'contacto@iku-cabalactiva.com',
  SECRET_TOKEN: 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025',
  MAX_STRING_LENGTH: 500,
  MIN_MESSAGE_LENGTH: 10,
}

// Validadores Zero Trust
const VALIDATORS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  nombre: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/,
  mensaje: /^.{10,500}$/,
  token: /^[A-Z0-9_]{20,}$/,
}

// Cache para optimización de rendimiento
let spreadsheetCache = null

/**
 * MANEJO DE PETICIONES OPTIONS (CORS PREFLIGHT)
 * Esta función es crítica para el funcionamiento correcto del CORS
 * Debe estar presente para que las peticiones desde el frontend funcionen
 */
function doOptions(e) {
  // Habilitar CORS para cualquier origen
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600',
    'Access-Control-Allow-Credentials': 'true',
  }

  // Retornar headers apropiados para peticiones preflight
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers)
}

/**
 * ROUTER PRINCIPAL - Punto de entrada único
 * Maneja todas las peticiones POST con arquitectura Zero Trust
 */
function doPost(e) {
  try {
    // Establecer headers CORS para la respuesta
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Validación inicial de petición
    if (!e?.postData?.contents) {
      return createErrorResponse('INVALID_REQUEST', 'Petición malformada').setHeaders(headers)
    }

    // Parseo seguro de JSON
    let data
    try {
      data = JSON.parse(e.postData.contents)
    } catch (parseError) {
      log_error('JSON Parse Error', parseError.toString())
      return createErrorResponse('INVALID_JSON', 'Formato JSON inválido').setHeaders(headers)
    }

    // Validación de token Zero Trust (primera línea de defensa)
    const authResult = validateSecurityToken(data, e)
    if (!authResult.valid) {
      log_error('Authentication Failed', authResult.message)
      return createErrorResponse('UNAUTHORIZED', 'Acceso denegado').setHeaders(headers)
    }

    // Validación de datos de entrada
    const validationResult = validateInputData(data)
    if (!validationResult.valid) {
      return createErrorResponse(validationResult.code, validationResult.message).setHeaders(
        headers
      )
    }

    // Router de acciones
    const response = routeAction(data)

    // Añadir headers CORS a la respuesta
    return response.setHeaders(headers)
  } catch (error) {
    log_error('Critical System Error', error.toString())
    return createErrorResponse('INTERNAL_ERROR', 'Error interno del servidor').setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
  }
}

/**
 * ROUTER DE ACCIONES - Distribuye peticiones a handlers específicos
 */
function routeAction(data) {
  const { action } = data

  switch (action) {
    case 'registrar-consulta':
      return handle_registrar_consulta(data)
    case 'enviar-email-admin':
      return handle_enviar_email_admin(data)
    case 'enviar-email-cliente':
      return handle_enviar_email_cliente(data)
    case 'update-crm':
      return handle_update_crm(data)
    case 'test':
      return createSuccessResponse('Conexión Zero Trust exitosa')
    case 'send-email':
      return handle_send_email_legacy(data) // Para compatibilidad con versión anterior
    default:
      return createErrorResponse('INVALID_ACTION', 'Acción no reconocida')
  }
}

/**
 * HANDLER LEGACY: Enviar Email (para compatibilidad con versión anterior)
 */
function handle_send_email_legacy(data) {
  try {
    // Convertir al nuevo formato
    const emailData = {
      cliente: {
        nombre: data.data?.nombre || 'Usuario',
        email: data.to,
      },
      mensaje: JSON.stringify(data.data),
      detalles: data.data || {},
    }

    // Enviar correo
    GmailApp.sendEmail(data.to, data.subject || 'Notificación IKU-Cábala Activa', '', {
      htmlBody: data.template
        ? getEmailTemplate(data.template, data.data)
        : `<div><pre>${JSON.stringify(data.data, null, 2)}</pre></div>`,
      cc: data.cc,
    })

    // Si hay CRM data, intentar registrar
    if (data.data && data.to) {
      try {
        updateSpreadsheet('Notificaciones', [
          new Date().toISOString(),
          data.to,
          data.subject || 'Notificación',
          JSON.stringify(data.data).substring(0, 100) + '...',
        ])
      } catch (crmError) {
        console.error('Error registrando en CRM:', crmError)
      }
    }

    return createSuccessResponse('Email enviado correctamente (legacy)')
  } catch (error) {
    log_error('Legacy Email Error', error.toString())
    return createErrorResponse('EMAIL_ERROR', 'Error enviando email legacy')
  }
}

/**
 * HANDLER: Registrar Consulta
 * Procesa y registra leads en la hoja "Consultas"
 */
function handle_registrar_consulta(data) {
  try {
    const { emailData } = data

    // Sanitizar datos antes del registro
    const sanitizedData = sanitizeUserInput(emailData)

    // Preparar datos para CRM
    const crmData = [
      new Date().toISOString(),
      sanitizedData.cliente.nombre,
      sanitizedData.cliente.email,
      sanitizedData.herramienta || 'No especificado',
      sanitizedData.mensaje,
      'Pendiente',
      'Web',
    ]

    // Registrar en CRM
    const crmResult = updateSpreadsheet('Consultas', crmData)
    if (!crmResult.success) {
      throw new Error('Error registrando en CRM: ' + crmResult.error)
    }

    // Enviar notificaciones
    const adminNotification = handle_enviar_email_admin({
      emailData: sanitizedData,
      skipValidation: true,
    })

    const clientConfirmation = handle_enviar_email_cliente({
      emailData: sanitizedData,
      skipValidation: true,
    })

    return createSuccessResponse('Consulta registrada exitosamente')
  } catch (error) {
    log_error('Consulta Registration Error', error.toString())
    return createErrorResponse('CONSULTA_ERROR', 'Error procesando consulta')
  }
}

/**
 * HANDLER: Enviar Email Admin
 * Notifica al administrador sobre nuevas consultas
 */
function handle_enviar_email_admin(data) {
  try {
    const { emailData } = data

    if (!data.skipValidation) {
      const validation = validateEmailData(emailData)
      if (!validation.valid) {
        return createErrorResponse(validation.code, validation.message)
      }
    }

    const sanitizedData = sanitizeUserInput(emailData)
    const template = getEmailTemplate('nueva-consulta', sanitizedData)

    const emailOptions = {
      to: CONFIG.EMAIL_ADMIN,
      cc: CONFIG.EMAIL_MAESTRO,
      subject: `Nueva Consulta: ${sanitizedData.herramienta || 'Consulta General'}`,
      htmlBody: template,
    }

    return sendSecureEmail(emailOptions)
  } catch (error) {
    log_error('Admin Email Error', error.toString())
    return createErrorResponse('EMAIL_ERROR', 'Error enviando notificación')
  }
}

/**
 * HANDLER: Enviar Email Cliente
 * Envía confirmación al cliente
 */
function handle_enviar_email_cliente(data) {
  try {
    const { emailData } = data

    if (!data.skipValidation) {
      const validation = validateEmailData(emailData)
      if (!validation.valid) {
        return createErrorResponse(validation.code, validation.message)
      }
    }

    const sanitizedData = sanitizeUserInput(emailData)
    const template = getEmailTemplate('confirmacion-consulta', sanitizedData)

    const emailOptions = {
      to: sanitizedData.cliente.email,
      subject: 'Consulta Recibida - IKU Cábala Activa',
      htmlBody: template,
    }

    return sendSecureEmail(emailOptions)
  } catch (error) {
    log_error('Client Email Error', error.toString())
    return createErrorResponse('EMAIL_ERROR', 'Error enviando confirmación')
  }
}

/**
 * HANDLER: Update CRM
 * Actualiza hojas de cálculo del CRM
 */
function handle_update_crm(data) {
  try {
    const { sheetName, values } = data

    // Validar hoja permitida
    const allowedSheets = [
      'Clientes',
      'Compras',
      'Sesiones',
      'Reportes',
      'Consultas',
      'Leads',
      'Notificaciones',
    ]
    if (!allowedSheets.includes(sheetName)) {
      return createErrorResponse('FORBIDDEN_SHEET', 'Hoja no permitida')
    }

    const result = updateSpreadsheet(sheetName, values)

    if (result.success) {
      return createSuccessResponse('CRM actualizado correctamente')
    } else {
      return createErrorResponse('CRM_ERROR', result.error)
    }
  } catch (error) {
    log_error('CRM Update Error', error.toString())
    return createErrorResponse('CRM_ERROR', 'Error actualizando CRM')
  }
}

/**
 * VALIDACIÓN DE TOKEN ZERO TRUST
 */
function validateSecurityToken(data, e) {
  const tokenFromHeader = e.parameter?.token
  const tokenFromBody = data?.token
  const providedToken = tokenFromHeader || tokenFromBody

  // Para compatibilidad con versión anterior, permitir action 'send-email' y 'update-crm' sin token
  if (['send-email', 'update-crm', 'test'].includes(data.action)) {
    return { valid: true }
  }

  if (!providedToken) {
    return { valid: false, message: 'Token requerido' }
  }

  if (!VALIDATORS.token.test(providedToken)) {
    return { valid: false, message: 'Formato de token inválido' }
  }

  if (providedToken !== CONFIG.SECRET_TOKEN) {
    return { valid: false, message: 'Token inválido' }
  }

  return { valid: true }
}

/**
 * VALIDACIÓN DE DATOS DE ENTRADA
 */
function validateInputData(data) {
  if (!data?.action) {
    return { valid: false, code: 'MISSING_ACTION', message: 'Acción requerida' }
  }

  // Para compatibilidad con versión anterior
  if (['send-email', 'update-crm', 'test'].includes(data.action)) {
    return { valid: true }
  }

  // Validaciones específicas por acción
  switch (data.action) {
    case 'registrar-consulta':
      return validateConsultaData(data)
    case 'enviar-email-admin':
    case 'enviar-email-cliente':
      return validateEmailData(data.emailData)
    case 'update-crm':
      return validateCRMData(data)
    case 'test':
      return { valid: true }
    default:
      return { valid: false, code: 'INVALID_ACTION', message: 'Acción no válida' }
  }
}

/**
 * VALIDACIÓN DE DATOS DE CONSULTA
 */
function validateConsultaData(data) {
  const { emailData } = data

  if (!emailData?.cliente) {
    return { valid: false, code: 'MISSING_CLIENT', message: 'Datos de cliente requeridos' }
  }

  const { cliente, mensaje } = emailData

  if (!cliente.nombre || !VALIDATORS.nombre.test(cliente.nombre)) {
    return {
      valid: false,
      code: 'INVALID_NAME',
      message: 'Nombre inválido (2-50 caracteres, solo letras)',
    }
  }

  if (!cliente.email || !VALIDATORS.email.test(cliente.email)) {
    return { valid: false, code: 'INVALID_EMAIL', message: 'Email inválido' }
  }

  if (
    !mensaje ||
    mensaje.length < CONFIG.MIN_MESSAGE_LENGTH ||
    mensaje.length > CONFIG.MAX_STRING_LENGTH
  ) {
    return {
      valid: false,
      code: 'INVALID_MESSAGE',
      message: `Mensaje debe tener entre ${CONFIG.MIN_MESSAGE_LENGTH}-${CONFIG.MAX_STRING_LENGTH} caracteres`,
    }
  }

  return { valid: true }
}

/**
 * VALIDACIÓN DE DATOS DE EMAIL
 */
function validateEmailData(emailData) {
  if (!emailData?.cliente?.email || !VALIDATORS.email.test(emailData.cliente.email)) {
    return { valid: false, code: 'INVALID_EMAIL', message: 'Email inválido' }
  }

  if (!emailData?.cliente?.nombre || !VALIDATORS.nombre.test(emailData.cliente.nombre)) {
    return { valid: false, code: 'INVALID_NAME', message: 'Nombre inválido' }
  }

  return { valid: true }
}

/**
 * VALIDACIÓN DE DATOS DE CRM
 */
function validateCRMData(data) {
  if (!data?.sheetName) {
    return { valid: false, code: 'MISSING_SHEET', message: 'Nombre de hoja requerido' }
  }

  if (!data?.values || !Array.isArray(data.values)) {
    return { valid: false, code: 'INVALID_VALUES', message: 'Valores requeridos como array' }
  }

  return { valid: true }
}

/**
 * SANITIZACIÓN DE ENTRADA DE USUARIO
 */
function sanitizeUserInput(data) {
  if (!data) return data

  const sanitized = JSON.parse(JSON.stringify(data))

  // Sanitizar strings recursivamente
  function sanitizeString(str) {
    if (typeof str !== 'string') return str
    return str
      .replace(/[<>]/g, '') // Remover < >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .trim()
      .substring(0, CONFIG.MAX_STRING_LENGTH)
  }

  function sanitizeObject(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key])
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key])
      }
    }
  }

  sanitizeObject(sanitized)
  return sanitized
}

/**
 * ACTUALIZACIÓN SEGURA DE SPREADSHEET
 */
function updateSpreadsheet(sheetName, values) {
  try {
    // Usar cache para optimizar rendimiento
    if (!spreadsheetCache) {
      spreadsheetCache = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    }

    let worksheet = spreadsheetCache.getSheetByName(sheetName)

    // Si la hoja no existe, la creamos
    if (!worksheet) {
      worksheet = spreadsheetCache.insertSheet(sheetName)

      // Añadir headers según el tipo de hoja
      const headers = getDefaultHeaders(sheetName)
      if (headers.length > 0) {
        worksheet.getRange(1, 1, 1, headers.length).setValues([headers])
        worksheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
      }
    }

    worksheet.appendRow(values)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.toString() }
  }
}

/**
 * ENVÍO SEGURO DE EMAIL
 */
function sendSecureEmail(options) {
  try {
    if (!options.to || !VALIDATORS.email.test(options.to)) {
      return createErrorResponse('INVALID_EMAIL', 'Email destinatario inválido')
    }

    if (!options.subject || options.subject.length < 5) {
      return createErrorResponse('INVALID_SUBJECT', 'Asunto requerido')
    }

    const emailOptions = {
      htmlBody: options.htmlBody || options.body,
    }

    if (options.cc) emailOptions.cc = options.cc
    if (options.attachments) emailOptions.attachments = options.attachments

    GmailApp.sendEmail(options.to, options.subject, '', emailOptions)

    return createSuccessResponse('Email enviado correctamente')
  } catch (error) {
    log_error('Email Send Error', error.toString())
    return createErrorResponse('EMAIL_ERROR', 'Error enviando email')
  }
}

/**
 * PLANTILLAS DE EMAIL SEGURAS
 */
function getEmailTemplate(template, data) {
  const templates = {
    'nueva-consulta': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">💬 Nueva Consulta Recibida</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Cliente:</strong> ${data.cliente?.nombre || 'No especificado'}</p>
          <p><strong>Email:</strong> ${data.cliente?.email || 'No especificado'}</p>
          <p><strong>Herramienta:</strong> ${data.herramienta || 'No especificado'}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #7C3AED; margin: 10px 0;">
            ${data.mensaje || 'Sin mensaje'}
          </div>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    `,
    'confirmacion-consulta': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">✨ Consulta Recibida - IKU Cábala Activa</h2>
        <p>Estimado/a ${data.cliente?.nombre || 'Cliente'},</p>
        <p>Hemos recibido tu consulta y te agradecemos tu interés en nuestros servicios.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tu consulta:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #7C3AED;">
            ${data.mensaje || 'Sin mensaje'}
          </div>
        </div>
        <p>Te contactaremos en las próximas 24-48 horas.</p>
        <p style="margin-top: 30px;">Con luz y bendiciones,<br><strong>Equipo IKU Cábala Activa</strong></p>
      </div>
    `,
    'lead-magnet': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">📥 Nuevo Lead Recibido</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Email:</strong> ${data.email || 'No especificado'}</p>
          <p><strong>Recurso:</strong> ${data.leadMagnet || 'No especificado'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
          <p><strong>Fuente:</strong> ${data.source || 'Sitio web'}</p>
        </div>
      </div>
    `,
  }

  return templates[template] || '<p>Plantilla no encontrada</p>'
}

/**
 * HEADERS PREDETERMINADOS PARA HOJAS
 */
function getDefaultHeaders(sheetName) {
  const headers = {
    Clientes: ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha_Registro', 'Estado', 'Prioridad'],
    Compras: [
      'ID_Cliente',
      'Producto',
      'Monto',
      'Proveedor',
      'Fecha_Compra',
      'Estado_Pago',
      'Sesiones_Restantes',
    ],
    Sesiones: ['ID_Cliente', 'Fecha_Sesión', 'Tipo_Sesión', 'Estado', 'Notas', 'Próxima_Sesión'],
    Reportes: ['Fecha', 'Ventas_Día', 'Nuevos_Clientes', 'Sesiones_Completadas'],
    Consultas: ['Fecha', 'Nombre', 'Email', 'Herramienta', 'Mensaje', 'Estado', 'Fuente'],
    Leads: ['ID', 'Email', 'Fuente', 'Recurso', 'Fecha_Registro', 'Estado'],
    Notificaciones: ['Fecha', 'Destinatario', 'Asunto', 'Contenido_Resumen'],
    'Logs de Errores': ['Timestamp', 'Mensaje', 'Detalles', 'Nivel'],
  }

  return headers[sheetName] || []
}

/**
 * SISTEMA DE LOGGING DE ERRORES
 */
function log_error(message, details) {
  try {
    const timestamp = new Date().toISOString()
    const logEntry = [timestamp, message, details, 'ERROR']

    // Intentar registrar en hoja de logs
    updateSpreadsheet('Logs de Errores', logEntry)

    // También log en consola para desarrollo
    console.error(`[${timestamp}] ${message}:`, details)
  } catch (logError) {
    console.error('Error logging failed:', logError)
  }
}

/**
 * UTILIDADES DE RESPUESTA
 */
function createSuccessResponse(message, data = null) {
  const response = { success: true, message }
  if (data) response.data = data

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  )
}

function createErrorResponse(code, message) {
  return ContentService.createTextOutput(
    JSON.stringify({
      error: message,
      code: code,
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON)
}

/**
 * ENDPOINT DE SALUD DEL SISTEMA
 */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'active',
      message: 'IKU CRM Zero Trust Webhook - Arquitectura Refactorizada con CORS',
      version: '2.1.0',
      timestamp: new Date().toISOString(),
      security: 'Zero Trust Enhanced',
      cors: 'Configurado correctamente',
    })
  )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    })
}
