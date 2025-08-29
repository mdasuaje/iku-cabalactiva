// Mocks para ejecución fuera de Google Apps Script
if (typeof ContentService === 'undefined') {
  global.ContentService = {
    createTextOutput: () => ({
      setMimeType: () => {},
      setContent: (c) => c
    }),
    MimeType: { JSON: 'application/json' }
  };
}
if (typeof GmailApp === 'undefined') {
  global.GmailApp = {
    sendEmail: () => {}
  };
}
if (typeof SpreadsheetApp === 'undefined') {
  global.SpreadsheetApp = {
    openById: () => ({
      getSheetByName: () => ({ appendRow: () => {} }),
      insertSheet: () => ({ getRange: () => ({ setValues: () => {}, setFontWeight: () => {}, setBackground: () => {}, setFontColor: () => {} }) })
    })
  };
}
// Google Apps Script - VERSIÓN CORREGIDA PARA PRODUCCIÓN
// Copiar este código completo en Google Apps Script

const CONFIG = {
  SPREADSHEET_ID: '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY',
  EMAIL_ADMIN: 'maor@iku-cabalactiva.com',
  EMAIL_MAESTRO: 'kabbalahuniversal@gmail.com'
};

function doPost(e) {
  try {
    // Permitir CORS
    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    
    if (!e || !e.postData) {
      return response.setContent(JSON.stringify({error: 'No data received'}));
    }

    const data = JSON.parse(e.postData.contents);
    console.log('Datos recibidos:', data);
    
    switch (data.action) {
      case 'send-email':
        return enviarEmail(data, response);
      case 'update-crm':
        return actualizarCRM(data, response);
      case 'test':
        return response.setContent(JSON.stringify({success: true, message: 'Conexión exitosa'}));
      default:
        return response.setContent(JSON.stringify({error: 'Acción no reconocida: ' + data.action}));
    }
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'IKU CRM Webhook funcionando correctamente',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
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
    return response.setContent(JSON.stringify({success: true, message: 'Email enviado'}));
  } catch (error) {
    console.error('Error enviando email:', error);
    return response.setContent(JSON.stringify({error: 'Error enviando email: ' + error.toString()}));
  }
}

function actualizarCRM(data, response) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const worksheet = sheet.getSheetByName(data.sheetName);
    
    if (!worksheet) {
      throw new Error(`Hoja ${data.sheetName} no encontrada`);
    }
    
    worksheet.appendRow(data.values);
    
    console.log('Datos agregados a:', data.sheetName);
    return response.setContent(JSON.stringify({success: true, message: 'CRM actualizado'}));
  } catch (error) {
    console.error('Error actualizando CRM:', error);
    return response.setContent(JSON.stringify({error: 'Error actualizando CRM: ' + error.toString()}));
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
    `,
    'recordatorio-sesion': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">⏰ Recordatorio: Sesión en 24 horas</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
          <p><strong>Cliente:</strong> ${data.cliente.nombre}</p>
          <p><strong>Tipo de Sesión:</strong> ${data.tipoSesion}</p>
          <p><strong>Fecha:</strong> ${new Date(data.fechaSesion).toLocaleDateString('es-ES')}</p>
          <p><strong>Enlace Zoom:</strong> ${data.enlaceZoom || 'Por definir'}</p>
        </div>
        <p style="margin-top: 20px;">Sesión programada para mañana.</p>
      </div>
    `
  };
  
  return plantillas[template] || '<p>Plantilla no encontrada</p>';
}

// función inicializarCRM eliminada: no usada en este script