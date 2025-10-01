// ⚔️ GOOGLE APPS SCRIPT - PRODUCCIÓN CON ZERO TRUST
// Copiar este código COMPLETO en script.google.com

// ===== CONFIGURACIÓN ZERO TRUST =====
const CONFIG = {
  SPREADSHEET_ID: '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY', // ID real de Google Sheets
  EMAIL_ADMIN: 'maor@iku-cabalactiva.com',
  EMAIL_MAESTRO: 'kabbalahuniversal@gmail.com',
  SECRET_TOKEN: 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025',
  ALLOWED_ORIGINS: ['https://iku-cabalactiva.com', 'http://localhost:3000', 'https://localhost:3000']
};

// ===== FUNCIÓN PRINCIPAL POST =====
function doPost(e) {
  try {
    console.log('🔍 Petición POST recibida');
    
    // Configurar CORS headers
    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    
    // Validar que hay datos
    if (!e || !e.postData || !e.postData.contents) {
      console.error('❌ Sin datos POST');
      return response.setContent(JSON.stringify({
        success: false,
        error: 'Sin datos POST',
        code: 'NO_DATA'
      }));
    }

    // Parsear datos JSON
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      console.log('📦 Datos parseados:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ Error parsing JSON:', parseError);
      return response.setContent(JSON.stringify({
        success: false,
        error: 'JSON inválido',
        code: 'INVALID_JSON'
      }));
    }

    // ZERO TRUST: Validar token
    if (!data.token || data.token !== CONFIG.SECRET_TOKEN) {
      console.error('❌ Token inválido o faltante');
      return response.setContent(JSON.stringify({
        success: false,
        error: 'Token de autorización inválido',
        code: 'INVALID_TOKEN'
      }));
    }

    console.log('✅ Token válido, procesando acción:', data.action);

    // Procesar según acción
    switch (data.action) {
      case 'update-crm':
        return actualizarCRM(data, response);
      case 'send-email':
        return enviarEmail(data, response);
      case 'test':
        return response.setContent(JSON.stringify({
          success: true,
          message: 'Conexión Zero Trust exitosa',
          version: '2.0.0',
          timestamp: new Date().toISOString()
        }));
      default:
        console.error('❌ Acción no reconocida:', data.action);
        return response.setContent(JSON.stringify({
          success: false,
          error: 'Acción no reconocida: ' + (data.action || 'undefined'),
          code: 'INVALID_ACTION'
        }));
    }

  } catch (error) {
    console.error('💥 Error crítico en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Error del servidor: ' + error.toString(),
      code: 'SERVER_ERROR'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== FUNCIÓN GET (Healthcheck) =====
function doGet(e) {
  console.log('🔍 Petición GET recibida (healthcheck)');
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'IKU CRM Zero Trust Webhook - Arquitectura Refactorizada',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    actions: ['update-crm', 'send-email', 'test']
  })).setMimeType(ContentService.MimeType.JSON);
}

// ===== FUNCIONES DE NEGOCIO =====

function actualizarCRM(data, response) {
  try {
    console.log('📊 Actualizando CRM - Hoja:', data.sheetName);

    // Validar datos requeridos
    if (!data.sheetName || !data.values || !Array.isArray(data.values)) {
      console.error('❌ Datos CRM inválidos:', data);
      return response.setContent(JSON.stringify({
        success: false,
        error: 'Datos CRM inválidos: sheetName y values (array) son requeridos',
        code: 'INVALID_CRM_DATA'
      }));
    }

    // Abrir Google Sheets
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let worksheet = sheet.getSheetByName(data.sheetName);
    
    // Crear hoja si no existe
    if (!worksheet) {
      console.log('📋 Creando nueva hoja:', data.sheetName);
      worksheet = sheet.insertSheet(data.sheetName);
      
      // Agregar headers según el tipo de hoja
      let headers = [];
      switch (data.sheetName) {
        case 'Clientes':
          headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha Registro', 'Estado', 'Prioridad'];
          break;
        case 'Compras':
          headers = ['ID Cliente', 'Producto', 'Monto', 'Proveedor', 'Fecha Compra', 'Estado Pago', 'Sesiones Restantes'];
          break;
        case 'Sesiones':
          headers = ['ID Cliente', 'Fecha Sesión', 'Tipo Sesión', 'Estado', 'Notas', 'Próxima Sesión'];
          break;
        default:
          headers = ['Datos'];
      }
      
      if (headers.length > 0) {
        worksheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        worksheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        worksheet.getRange(1, 1, 1, headers.length).setBackground('#4285F4');
        worksheet.getRange(1, 1, 1, headers.length).setFontColor('white');
      }
    }
    
    // Agregar datos
    worksheet.appendRow(data.values);
    
    console.log('✅ CRM actualizado exitosamente - Hoja:', data.sheetName);
    console.log('📝 Valores agregados:', data.values.length, 'columnas');

    // Enviar notificación por email si es un cliente nuevo
    if (data.sheetName === 'Clientes') {
      try {
        enviarNotificacionNuevoCliente(data.values);
      } catch (emailError) {
        console.error('⚠️ Error enviando notificación email:', emailError);
        // No fallar la operación por un error de email
      }
    }

    return response.setContent(JSON.stringify({
      success: true,
      message: 'CRM actualizado exitosamente',
      sheetName: data.sheetName,
      rowsAdded: 1,
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('💥 Error actualizando CRM:', error);
    return response.setContent(JSON.stringify({
      success: false,
      error: 'Error actualizando CRM: ' + error.toString(),
      code: 'CRM_UPDATE_ERROR'
    }));
  }
}

function enviarEmail(data, response) {
  try {
    console.log('📧 Enviando email a:', data.to);

    // Validar datos requeridos
    if (!data.to || !data.subject || !data.template) {
      console.error('❌ Datos email inválidos:', data);
      return response.setContent(JSON.stringify({
        success: false,
        error: 'Datos email inválidos: to, subject y template son requeridos',
        code: 'INVALID_EMAIL_DATA'
      }));
    }

    // Generar template
    const htmlBody = obtenerPlantillaEmail(data.template, data.data || {});
    
    const emailOptions = {
      htmlBody: htmlBody,
      name: 'IKU - Cábala Activa'
    };
    
    // Opciones adicionales
    if (data.cc) emailOptions.cc = data.cc;
    if (data.bcc) emailOptions.bcc = data.bcc;
    if (data.attachments) emailOptions.attachments = data.attachments;
    
    // Enviar email
    GmailApp.sendEmail(data.to, data.subject, '', emailOptions);
    
    console.log('✅ Email enviado exitosamente a:', data.to);
    
    return response.setContent(JSON.stringify({
      success: true,
      message: 'Email enviado exitosamente',
      to: data.to,
      template: data.template,
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('💥 Error enviando email:', error);
    return response.setContent(JSON.stringify({
      success: false,
      error: 'Error enviando email: ' + error.toString(),
      code: 'EMAIL_SEND_ERROR'
    }));
  }
}

// ===== FUNCIONES DE UTILIDAD =====

function enviarNotificacionNuevoCliente(datosCliente) {
  try {
    const [id, nombre, email, telefono, fechaRegistro, estado, prioridad] = datosCliente;
    
    const subject = `🎯 Nuevo Cliente Registrado - ${nombre}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7C3AED, #3B82F6); padding: 20px; border-radius: 10px; color: white; text-align: center;">
          <h2 style="margin: 0;">🎉 Nuevo Cliente Registrado</h2>
        </div>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Nombre:</td><td style="padding: 8px;">${nombre}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${telefono}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Fecha:</td><td style="padding: 8px;">${new Date(fechaRegistro).toLocaleString('es-ES')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Prioridad:</td><td style="padding: 8px;"><span style="background: #FEF3C7; padding: 4px 8px; border-radius: 4px;">${prioridad}</span></td></tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #6B7280;">🚀 <strong>Acción sugerida:</strong> Contactar vía WhatsApp dentro de las próximas 2 horas.</p>
          <a href="https://wa.me/${telefono.replace(/\D/g, '')}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">📱 Contactar por WhatsApp</a>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 15px; text-align: center; color: #6B7280; font-size: 12px;">
          <p>IKU - Cábala Activa | Sistema CRM Automatizado</p>
        </div>
      </div>
    `;

    // Enviar a admin y maestro
    GmailApp.sendEmail(CONFIG.EMAIL_ADMIN, subject, '', { htmlBody: htmlBody, name: 'IKU CRM Sistema' });
    GmailApp.sendEmail(CONFIG.EMAIL_MAESTRO, subject, '', { htmlBody: htmlBody, name: 'IKU CRM Sistema' });
    
    console.log('✅ Notificaciones enviadas para nuevo cliente:', nombre);
    
  } catch (error) {
    console.error('❌ Error enviando notificación nuevo cliente:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
}

function obtenerPlantillaEmail(template, data) {
  const plantillas = {
    'nueva-compra': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">🎉 Nueva Compra Registrada</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Cliente:</strong> ${data.cliente?.nombre || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.cliente?.email || 'N/A'}</p>
          <p><strong>Producto:</strong> ${data.producto || 'N/A'}</p>
          <p><strong>Monto:</strong> $${data.monto || '0'} USD</p>
          <p><strong>Proveedor:</strong> ${data.proveedor || 'N/A'}</p>
          <p><strong>Fecha:</strong> ${data.fecha || new Date().toLocaleDateString('es-ES')}</p>
        </div>
        <p style="margin-top: 20px;">Proceder con la confirmación vía WhatsApp.</p>
      </div>
    `,
    'nueva-sesion': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">📅 Nueva Sesión Programada</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Cliente:</strong> ${data.cliente?.nombre || 'N/A'}</p>
          <p><strong>Tipo de Sesión:</strong> ${data.tipoSesion || 'N/A'}</p>
          <p><strong>Fecha Propuesta:</strong> ${data.fechaSesion ? new Date(data.fechaSesion).toLocaleDateString('es-ES') : 'N/A'}</p>
          <p><strong>Notas:</strong> ${data.notas || 'Sin notas'}</p>
        </div>
        <p style="margin-top: 20px;">Por favor confirmar disponibilidad para esta sesión.</p>
      </div>
    `,
    'contacto-general': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">📧 Nuevo Mensaje de Contacto</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Nombre:</strong> ${data.nombre || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> ${data.telefono || 'N/A'}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${data.mensaje || 'Sin mensaje'}
          </div>
        </div>
        <p style="margin-top: 20px;">Responder lo antes posible para mantener el engagement.</p>
      </div>
    `
  };
  
  return plantillas[template] || `<p>Plantilla "${template}" no encontrada</p>`;
}