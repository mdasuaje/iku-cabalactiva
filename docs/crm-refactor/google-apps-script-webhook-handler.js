/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WEBHOOK HANDLER PARA IKU CÁBALA ACTIVA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Propósito: Recibir webhooks de Stripe y PayPal, registrar en CRM y enviar notificaciones
 * Autor: Mauro Asuaje (maor@iku-cabalactiva.com)
 * Rabbí: Isaac Benzaquén (kabbalahuniversal@gmail.com)
 * Fecha: 2025-01-05
 * Versión: 1.0
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // ID de la hoja de cálculo de Google Sheets (CRM)
  SPREADSHEET_ID: 'TU_SPREADSHEET_ID_AQUI', // ⚠️ ACTUALIZAR CON TU ID
  
  // Nombres de las hojas
  SHEETS: {
    CLIENTES: 'Clientes',
    COMPRAS: 'Compras',
    SESIONES: 'Sesiones'
  },
  
  // Emails de notificación
  EMAILS: {
    ADMIN: 'maor@iku-cabalactiva.com',
    RABBI: 'kabbalahuniversal@gmail.com'
  },
  
  // Productos disponibles
  PRODUCTOS: {
    'carta-astral': {
      nombre: 'Carta Astral Cabalística',
      precio: 97,
      sesiones: 1,
      requiereSesion: true
    },
    'constelacion': {
      nombre: 'Constelación Familiar Cabalística',
      precio: 147,
      sesiones: 1,
      requiereSesion: true
    },
    'limpieza-aurica': {
      nombre: 'Limpieza Áurica Cabalística',
      precio: 247,
      sesiones: 1,
      requiereSesion: true
    },
    'meditacion': {
      nombre: 'Meditación Cabalística',
      precio: 97,
      sesiones: 1,
      requiereSesion: false
    },
    'paquete-completo': {
      nombre: 'Paquete Completo + Mandala de Poder y Éxito',
      precio: 997,
      sesiones: 4,
      requiereSesion: true
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL - RECEPTOR DE WEBHOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Función que recibe las peticiones HTTP POST (webhooks)
 * Esta función se ejecuta automáticamente cuando se recibe un webhook
 * 
 * @param {Object} e - Objeto de evento que contiene los datos de la petición
 * @returns {ContentService.TextOutput} - Respuesta HTTP
 */
function doPost(e) {
  try {
    // Log de inicio
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('🔔 WEBHOOK RECIBIDO');
    Logger.log('Timestamp: ' + new Date().toISOString());
    Logger.log('═══════════════════════════════════════════════════════════');
    
    // 1. Validar que hay datos en la petición
    if (!e || !e.postData) {
      Logger.log('❌ ERROR: No hay datos en la petición');
      return crearRespuestaError('No hay datos en la petición', 400);
    }
    
    // 2. Validar que el contenido es JSON
    if (e.postData.type !== 'application/json') {
      Logger.log('❌ ERROR: Formato de petición inválido: ' + e.postData.type);
      return crearRespuestaError('Formato de petición inválido', 400);
    }
    
    // 3. Parsear el payload JSON
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
      Logger.log('✅ Payload parseado correctamente');
    } catch (parseError) {
      Logger.log('❌ ERROR: JSON inválido - ' + parseError.toString());
      return crearRespuestaError('JSON inválido', 400);
    }
    
    // 4. Identificar el origen del webhook (Stripe o PayPal)
    const origen = identificarOrigen(payload);
    Logger.log('📍 Origen identificado: ' + origen);
    
    // 5. Procesar según el origen
    let resultado;
    if (origen === 'STRIPE') {
      resultado = procesarStripeWebhook(payload);
    } else if (origen === 'PAYPAL') {
      resultado = procesarPayPalWebhook(payload);
    } else {
      Logger.log('❌ ERROR: Origen desconocido');
      return crearRespuestaError('Origen de webhook desconocido', 400);
    }
    
    // 6. Retornar respuesta exitosa
    Logger.log('✅ Webhook procesado exitosamente');
    Logger.log('═══════════════════════════════════════════════════════════');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Webhook procesado exitosamente',
        timestamp: new Date().toISOString(),
        resultado: resultado
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Manejo de errores generales
    Logger.log('❌ ERROR CRÍTICO: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    Logger.log('═══════════════════════════════════════════════════════════');
    
    return crearRespuestaError('Error interno del servidor: ' + error.toString(), 500);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROCESAMIENTO DE STRIPE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Procesa webhooks de Stripe
 * 
 * @param {Object} payload - Datos del webhook de Stripe
 * @returns {Object} - Resultado del procesamiento
 */
function procesarStripeWebhook(payload) {
  Logger.log('🔵 Procesando webhook de STRIPE');
  Logger.log('Tipo de evento: ' + payload.type);
  
  // Eventos soportados
  const eventosSoportados = [
    'checkout.session.completed',
    'payment_intent.succeeded'
  ];
  
  if (!eventosSoportados.includes(payload.type)) {
    Logger.log('⚠️ Evento no soportado: ' + payload.type);
    return { mensaje: 'Evento no soportado', evento: payload.type };
  }
  
  // Extraer datos del evento
  const eventData = payload.data.object;
  
  // Extraer información del cliente
  const clienteData = {
    nombre: eventData.customer_details?.name || eventData.billing_details?.name || 'Cliente Stripe',
    email: eventData.customer_details?.email || eventData.billing_details?.email || '',
    telefono: eventData.customer_details?.phone || eventData.billing_details?.phone || '',
    fuente: 'Stripe'
  };
  
  // Extraer información del producto
  const productoId = eventData.metadata?.product_id || 'carta-astral';
  const producto = CONFIG.PRODUCTOS[productoId] || CONFIG.PRODUCTOS['carta-astral'];
  
  const monto = eventData.amount_total ? eventData.amount_total / 100 : producto.precio;
  
  Logger.log('Cliente: ' + clienteData.nombre + ' (' + clienteData.email + ')');
  Logger.log('Producto: ' + producto.nombre + ' - $' + monto);
  
  // Procesar el pago
  return procesarPagoExitoso(clienteData, producto, monto, 'Stripe', eventData.id);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROCESAMIENTO DE PAYPAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Procesa webhooks de PayPal
 * 
 * @param {Object} payload - Datos del webhook de PayPal
 * @returns {Object} - Resultado del procesamiento
 */
function procesarPayPalWebhook(payload) {
  Logger.log('🟡 Procesando webhook de PAYPAL');
  Logger.log('Tipo de evento: ' + payload.event_type);
  
  // Eventos soportados
  if (payload.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
    Logger.log('⚠️ Evento no soportado: ' + payload.event_type);
    return { mensaje: 'Evento no soportado', evento: payload.event_type };
  }
  
  // Extraer datos del recurso
  const resource = payload.resource;
  
  // Extraer información del cliente
  const payer = resource.payer || {};
  const clienteData = {
    nombre: payer.name?.given_name + ' ' + payer.name?.surname || 'Cliente PayPal',
    email: payer.email_address || '',
    telefono: payer.phone?.phone_number?.national_number || '',
    fuente: 'PayPal'
  };
  
  // Extraer información del producto
  const productoId = resource.custom_id || 'carta-astral';
  const producto = CONFIG.PRODUCTOS[productoId] || CONFIG.PRODUCTOS['carta-astral'];
  
  const monto = parseFloat(resource.amount?.value) || producto.precio;
  
  Logger.log('Cliente: ' + clienteData.nombre + ' (' + clienteData.email + ')');
  Logger.log('Producto: ' + producto.nombre + ' - $' + monto);
  
  // Procesar el pago
  return procesarPagoExitoso(clienteData, producto, monto, 'PayPal', resource.id);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROCESAMIENTO DE PAGO EXITOSO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Procesa un pago exitoso: registra cliente, compra y envía notificaciones
 * 
 * @param {Object} clienteData - Datos del cliente
 * @param {Object} producto - Información del producto
 * @param {Number} monto - Monto del pago
 * @param {String} proveedor - Stripe o PayPal
 * @param {String} transactionId - ID de la transacción
 * @returns {Object} - Resultado del procesamiento
 */
function procesarPagoExitoso(clienteData, producto, monto, proveedor, transactionId) {
  Logger.log('💰 Procesando pago exitoso');
  
  try {
    // 1. Registrar cliente en CRM
    const clienteId = registrarCliente(clienteData);
    Logger.log('✅ Cliente registrado: ' + clienteId);
    
    // 2. Registrar compra en CRM
    const compraId = registrarCompra({
      clienteId: clienteId,
      producto: producto.nombre,
      monto: monto,
      proveedor: proveedor,
      transactionId: transactionId,
      sesionesRestantes: producto.sesiones
    });
    Logger.log('✅ Compra registrada: ' + compraId);
    
    // 3. Programar sesión inicial si es necesario
    let sesionId = null;
    if (producto.requiereSesion) {
      sesionId = programarSesionInicial(clienteId, producto.nombre);
      Logger.log('✅ Sesión programada: ' + sesionId);
    }
    
    // 4. Enviar notificaciones por email
    enviarNotificaciones({
      cliente: clienteData,
      producto: producto.nombre,
      monto: monto,
      proveedor: proveedor,
      sesionProgramada: producto.requiereSesion
    });
    Logger.log('✅ Notificaciones enviadas');
    
    return {
      clienteId: clienteId,
      compraId: compraId,
      sesionId: sesionId,
      mensaje: 'Pago procesado exitosamente'
    };
    
  } catch (error) {
    Logger.log('❌ ERROR en procesarPagoExitoso: ' + error.toString());
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRO EN CRM (GOOGLE SHEETS)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Registra un nuevo cliente en Google Sheets
 * 
 * @param {Object} clienteData - Datos del cliente
 * @returns {String} - ID del cliente generado
 */
function registrarCliente(clienteData) {
  Logger.log('📝 Registrando cliente en CRM');
  
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.CLIENTES);
  
  if (!sheet) {
    throw new Error('Hoja "' + CONFIG.SHEETS.CLIENTES + '" no encontrada');
  }
  
  const clienteId = generarId();
  const timestamp = new Date();
  
  // Estructura: ID | Nombre | Email | Teléfono | Fecha Registro | Estado | Fuente
  const fila = [
    clienteId,
    clienteData.nombre,
    clienteData.email,
    clienteData.telefono,
    timestamp,
    'Activo',
    clienteData.fuente
  ];
  
  sheet.appendRow(fila);
  Logger.log('✅ Cliente registrado en hoja: ' + CONFIG.SHEETS.CLIENTES);
  
  return clienteId;
}

/**
 * Registra una nueva compra en Google Sheets
 * 
 * @param {Object} compraData - Datos de la compra
 * @returns {String} - ID de la compra generado
 */
function registrarCompra(compraData) {
  Logger.log('📝 Registrando compra en CRM');
  
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.COMPRAS);
  
  if (!sheet) {
    throw new Error('Hoja "' + CONFIG.SHEETS.COMPRAS + '" no encontrada');
  }
  
  const compraId = generarId();
  const timestamp = new Date();
  
  // Estructura: ID | ID Cliente | Producto | Monto | Proveedor | Fecha | Estado | Transaction ID | Sesiones Restantes
  const fila = [
    compraId,
    compraData.clienteId,
    compraData.producto,
    compraData.monto,
    compraData.proveedor,
    timestamp,
    'Completado',
    compraData.transactionId,
    compraData.sesionesRestantes
  ];
  
  sheet.appendRow(fila);
  Logger.log('✅ Compra registrada en hoja: ' + CONFIG.SHEETS.COMPRAS);
  
  return compraId;
}

/**
 * Programa una sesión inicial en Google Sheets
 * 
 * @param {String} clienteId - ID del cliente
 * @param {String} tipoSesion - Tipo de sesión
 * @returns {String} - ID de la sesión generado
 */
function programarSesionInicial(clienteId, tipoSesion) {
  Logger.log('📅 Programando sesión inicial');
  
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.SESIONES);
  
  if (!sheet) {
    throw new Error('Hoja "' + CONFIG.SHEETS.SESIONES + '" no encontrada');
  }
  
  const sesionId = generarId();
  const timestamp = new Date();
  
  // Fecha sugerida: 3 días después de la compra
  const fechaSugerida = new Date();
  fechaSugerida.setDate(fechaSugerida.getDate() + 3);
  
  // Estructura: ID | ID Cliente | Fecha Sesión | Tipo | Estado | Notas | Creado
  const fila = [
    sesionId,
    clienteId,
    fechaSugerida,
    tipoSesion,
    'Pendiente Confirmación',
    'Sesión inicial - Contactar cliente para confirmar fecha',
    timestamp
  ];
  
  sheet.appendRow(fila);
  Logger.log('✅ Sesión programada en hoja: ' + CONFIG.SHEETS.SESIONES);
  
  return sesionId;
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICACIONES POR EMAIL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Envía notificaciones por email a admin y Rabbí
 * 
 * @param {Object} data - Datos para las notificaciones
 */
function enviarNotificaciones(data) {
  Logger.log('📧 Enviando notificaciones por email');
  
  // Email al administrador (Maor)
  enviarEmailAdmin(data);
  
  // Email al Rabbí Isaac
  enviarEmailRabbi(data);
  
  Logger.log('✅ Notificaciones enviadas exitosamente');
}

/**
 * Envía email de notificación al administrador
 * 
 * @param {Object} data - Datos de la compra
 */
function enviarEmailAdmin(data) {
  const asunto = '🎉 Nueva Compra en IKU Cábala Activa';
  
  const cuerpo = `
Hola Maor,

¡Excelentes noticias! Se ha registrado una nueva compra en IKU Cábala Activa.

═══════════════════════════════════════════════════════════
DETALLES DE LA COMPRA
═══════════════════════════════════════════════════════════

Cliente: ${data.cliente.nombre}
Email: ${data.cliente.email}
Teléfono: ${data.cliente.telefono}

Producto: ${data.producto}
Monto: $${data.monto} USD
Proveedor: ${data.proveedor}

Fecha: ${new Date().toLocaleString('es-ES')}

${data.sesionProgramada ? '✅ Sesión inicial programada (pendiente confirmación)' : ''}

═══════════════════════════════════════════════════════════

Próximos pasos:
1. Contactar al cliente para confirmar la sesión
2. Enviar materiales preparatorios si aplica
3. Coordinar con el Rabbí Isaac Benzaquén

Saludos,
Sistema CRM - IKU Cábala Activa
  `.trim();
  
  MailApp.sendEmail({
    to: CONFIG.EMAILS.ADMIN,
    subject: asunto,
    body: cuerpo
  });
  
  Logger.log('✅ Email enviado a: ' + CONFIG.EMAILS.ADMIN);
}

/**
 * Envía email de notificación al Rabbí Isaac
 * 
 * @param {Object} data - Datos de la compra
 */
function enviarEmailRabbi(data) {
  const asunto = '📅 Nueva Sesión Programada - IKU Cábala Activa';
  
  const cuerpo = `
Shalom Rabbí Isaac,

Se ha registrado una nueva compra y ${data.sesionProgramada ? 'se ha programado una sesión inicial' : 'el cliente está listo para comenzar'}.

═══════════════════════════════════════════════════════════
INFORMACIÓN DEL CLIENTE
═══════════════════════════════════════════════════════════

Nombre: ${data.cliente.nombre}
Email: ${data.cliente.email}
Teléfono: ${data.cliente.telefono}

Servicio Adquirido: ${data.producto}
Monto: $${data.monto} USD

Fecha de Compra: ${new Date().toLocaleString('es-ES')}

═══════════════════════════════════════════════════════════

${data.sesionProgramada ? 'La sesión inicial está pendiente de confirmación. Maor se pondrá en contacto con el cliente para coordinar la fecha y hora más conveniente.' : ''}

Bendiciones,
Sistema CRM - IKU Cábala Activa
  `.trim();
  
  MailApp.sendEmail({
    to: CONFIG.EMAILS.RABBI,
    subject: asunto,
    body: cuerpo
  });
  
  Logger.log('✅ Email enviado a: ' + CONFIG.EMAILS.RABBI);
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Identifica el origen del webhook (Stripe o PayPal)
 * 
 * @param {Object} payload - Datos del webhook
 * @returns {String} - 'STRIPE', 'PAYPAL' o 'DESCONOCIDO'
 */
function identificarOrigen(payload) {
  // Stripe tiene un campo 'type' con formato 'evento.subevent'
  if (payload.type && payload.type.includes('.')) {
    return 'STRIPE';
  }
  
  // PayPal tiene un campo 'event_type' con formato 'CATEGORIA.ACCION.ESTADO'
  if (payload.event_type && payload.event_type.includes('.')) {
    return 'PAYPAL';
  }
  
  return 'DESCONOCIDO';
}

/**
 * Genera un ID único para registros
 * 
 * @returns {String} - ID único
 */
function generarId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 10);
  return timestamp + '_' + random;
}

/**
 * Crea una respuesta de error HTTP
 * 
 * @param {String} mensaje - Mensaje de error
 * @param {Number} codigo - Código HTTP
 * @returns {ContentService.TextOutput} - Respuesta HTTP
 */
function crearRespuestaError(mensaje, codigo) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: mensaje,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setStatusCode(codigo || 500);
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN DE TESTING (OPCIONAL)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Función de testing para simular un webhook de Stripe
 * Ejecutar manualmente desde el editor de Google Apps Script
 */
function testStripeWebhook() {
  const mockPayload = {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123456',
        customer_details: {
          name: 'Cliente de Prueba',
          email: 'test@example.com',
          phone: '+1234567890'
        },
        amount_total: 9700, // $97.00 en centavos
        metadata: {
          product_id: 'carta-astral'
        }
      }
    }
  };
  
  const mockEvent = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify(mockPayload)
    }
  };
  
  const resultado = doPost(mockEvent);
  Logger.log('Resultado del test: ' + resultado.getContent());
}

/**
 * Función de testing para simular un webhook de PayPal
 * Ejecutar manualmente desde el editor de Google Apps Script
 */
function testPayPalWebhook() {
  const mockPayload = {
    event_type: 'PAYMENT.CAPTURE.COMPLETED',
    resource: {
      id: 'PAYPAL_TEST_123456',
      payer: {
        name: {
          given_name: 'Cliente',
          surname: 'de Prueba'
        },
        email_address: 'test@example.com',
        phone: {
          phone_number: {
            national_number: '1234567890'
          }
        }
      },
      amount: {
        value: '97.00',
        currency_code: 'USD'
      },
      custom_id: 'carta-astral'
    }
  };
  
  const mockEvent = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify(mockPayload)
    }
  };
  
  const resultado = doPost(mockEvent);
  Logger.log('Resultado del test: ' + resultado.getContent());
}

// ═══════════════════════════════════════════════════════════════════════════
// FIN DEL SCRIPT
// ═══════════════════════════════════════════════════════════════════════════
