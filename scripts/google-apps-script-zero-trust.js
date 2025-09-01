// Google Apps Script - VERSIÓN ZERO TRUST
// Copiar este código completo en Google Apps Script

const CONFIG = {
  SPREADSHEET_ID: '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY',
  EMAIL_ADMIN: 'maor@iku-cabalactiva.com',
  EMAIL_MAESTRO: 'kabbalahuniversal@gmail.com',
  // Token secreto - CAMBIAR por uno único generado
  SECRET_TOKEN: 'IKU_CRM_2025_SECURE_TOKEN_CHANGE_ME'
};

// Validaciones Zero Trust
const VALIDATORS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  nombre: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/,
  mensaje: /^.{10,500}$/
};

function doPost(e) {
  try {
    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    
    // 1. Validar que hay datos
    if (!e || !e.postData) {
      return response.setContent(JSON.stringify({
        error: 'Datos incompletos',
        code: 'NO_DATA'
      }));
    }

    const data = JSON.parse(e.postData.contents);
    
    // 2. Autenticación Zero Trust
    const authResult = validateAuth(data, e);
    if (!authResult.valid) {
      return response.setContent(JSON.stringify({
        error: 'Acceso no autorizado',
        code: 'UNAUTHORIZED'
      }));
    }
    
    // 3. Validación de datos según acción
    const validationResult = validateData(data);
    if (!validationResult.valid) {
      return response.setContent(JSON.stringify({
        error: validationResult.message,
        code: validationResult.code
      }));
    }
    
    // 4. Procesar acción
    switch (data.action) {
      case 'send-email':
        return enviarEmail(data, response);
      case 'update-crm':
        return actualizarCRM(data, response);
      case 'test':
        return response.setContent(JSON.stringify({
          success: true, 
          message: 'Conexión Zero Trust exitosa'
        }));
      default:
        return response.setContent(JSON.stringify({
          error: 'Acción no reconocida',
          code: 'INVALID_ACTION'
        }));
    }
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    }));
  }
}

// Validación de autenticación Zero Trust
function validateAuth(data, e) {
  // Verificar token en headers o body
  const tokenFromHeader = e.parameter?.token;
  const tokenFromBody = data.token;
  const providedToken = tokenFromHeader || tokenFromBody;
  
  if (!providedToken) {
    return { valid: false, reason: 'Token no proporcionado' };
  }
  
  if (providedToken !== CONFIG.SECRET_TOKEN) {
    return { valid: false, reason: 'Token inválido' };
  }
  
  return { valid: true };
}

// Validación de datos de entrada
function validateData(data) {
  if (!data.action) {
    return { 
      valid: false, 
      message: 'Acción requerida', 
      code: 'MISSING_ACTION' 
    };
  }
  
  // Validaciones específicas por acción
  switch (data.action) {
    case 'send-email':
      return validateEmailData(data);
    case 'update-crm':
      return validateCRMData(data);
    case 'test':
      return { valid: true };
    default:
      return { 
        valid: false, 
        message: 'Acción no válida', 
        code: 'INVALID_ACTION' 
      };
  }
}

// Validar datos de email
function validateEmailData(data) {
  if (!data.to || !VALIDATORS.email.test(data.to)) {
    return { 
      valid: false, 
      message: 'Email destinatario inválido', 
      code: 'INVALID_EMAIL' 
    };
  }
  
  if (!data.subject || data.subject.length < 5) {
    return { 
      valid: false, 
      message: 'Asunto requerido (mín. 5 caracteres)', 
      code: 'INVALID_SUBJECT' 
    };
  }
  
  if (data.data && data.data.cliente) {
    const cliente = data.data.cliente;
    
    if (cliente.nombre && !VALIDATORS.nombre.test(cliente.nombre)) {
      return { 
        valid: false, 
        message: 'Nombre inválido (solo letras, 2-50 caracteres)', 
        code: 'INVALID_NAME' 
      };
    }
    
    if (cliente.email && !VALIDATORS.email.test(cliente.email)) {
      return { 
        valid: false, 
        message: 'Email cliente inválido', 
        code: 'INVALID_CLIENT_EMAIL' 
      };
    }
  }
  
  return { valid: true };
}

// Validar datos de CRM
function validateCRMData(data) {
  if (!data.sheetName) {
    return { 
      valid: false, 
      message: 'Nombre de hoja requerido', 
      code: 'MISSING_SHEET' 
    };
  }
  
  if (!data.values || !Array.isArray(data.values)) {
    return { 
      valid: false, 
      message: 'Valores requeridos como array', 
      code: 'INVALID_VALUES' 
    };
  }
  
  // Validar hojas permitidas
  const allowedSheets = ['Clientes', 'Compras', 'Sesiones', 'Reportes'];
  if (!allowedSheets.includes(data.sheetName)) {
    return { 
      valid: false, 
      message: 'Hoja no permitida', 
      code: 'FORBIDDEN_SHEET' 
    };
  }
  
  return { valid: true };
}

function enviarEmail(data, response) {
  try {
    const template = obtenerPlantillaEmail(data.template, data.data);
    
    const emailOptions = {
      htmlBody: template
    };
    
    if (data.cc) emailOptions.cc = data.cc;
    if (data.attachments) emailOptions.attachments = data.attachments;
    
    GmailApp.sendEmail(data.to, data.subject, '', emailOptions);
    
    console.log('Email enviado a:', data.to);
    return response.setContent(JSON.stringify({
      success: true, 
      message: 'Email enviado correctamente'
    }));
  } catch (error) {
    console.error('Error enviando email:', error);
    return response.setContent(JSON.stringify({
      error: 'Error enviando email',
      code: 'EMAIL_SEND_ERROR'
    }));
  }
}

function actualizarCRM(data, response) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const worksheet = sheet.getSheetByName(data.sheetName);
    
    if (!worksheet) {
      return response.setContent(JSON.stringify({
        error: `Hoja ${data.sheetName} no encontrada`,
        code: 'SHEET_NOT_FOUND'
      }));
    }
    
    worksheet.appendRow(data.values);
    
    console.log('Datos agregados a:', data.sheetName);
    return response.setContent(JSON.stringify({
      success: true, 
      message: 'CRM actualizado correctamente'
    }));
  } catch (error) {
    console.error('Error actualizando CRM:', error);
    return response.setContent(JSON.stringify({
      error: 'Error actualizando CRM',
      code: 'CRM_UPDATE_ERROR'
    }));
  }
}

function obtenerPlantillaEmail(template, data) {
  const plantillas = {
    'nueva-compra': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">🎉 Nueva Compra Registrada</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Cliente:</strong> ${data.cliente.nombre}</p>
          <p><strong>Email:</strong> ${data.cliente.email}</p>
          <p><strong>Producto:</strong> ${data.producto}</p>
          <p><strong>Monto:</strong> $${data.monto} USD</p>
          <p><strong>Proveedor:</strong> ${data.proveedor}</p>
          <p><strong>Fecha:</strong> ${data.fecha}</p>
        </div>
        <p style="margin-top: 20px;">Proceder con la confirmación vía WhatsApp.</p>
      </div>
    `,
    'nueva-sesion': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">📅 Nueva Sesión Programada</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Cliente:</strong> ${data.cliente.nombre}</p>
          <p><strong>Tipo de Sesión:</strong> ${data.tipoSesion}</p>
          <p><strong>Fecha Propuesta:</strong> ${new Date(data.fechaSesion).toLocaleDateString('es-ES')}</p>
          <p><strong>Notas:</strong> ${data.notas}</p>
        </div>
        <p style="margin-top: 20px;">Por favor confirmar disponibilidad para esta sesión.</p>
      </div>
    `
  };
  
  return plantillas[template] || '<p>Plantilla no encontrada</p>';
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'IKU CRM Zero Trust Webhook funcionando',
    timestamp: new Date().toISOString(),
    security: 'Zero Trust enabled'
  })).setMimeType(ContentService.MimeType.JSON);
}