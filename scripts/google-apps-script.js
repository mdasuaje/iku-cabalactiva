// Google Apps Script para automatización CRM
// Este script debe ser copiado a Google Apps Script

// Configuración
const CONFIG = {
  SPREADSHEET_ID: 'TU_SPREADSHEET_ID',
  EMAIL_ADMIN: 'maor@iku-cabalactiva.com',
  EMAIL_MAESTRO: 'kabbalahuniversal@gmail.com'
};

// Función principal para manejar webhooks
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    switch (data.action) {
      case 'send-email':
        return enviarEmail(data);
      case 'create-calendar-event':
        return crearEventoCalendario(data);
      case 'update-crm':
        return actualizarCRM(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({error: 'Acción no reconocida'}));
    }
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

// Enviar email
function enviarEmail(data) {
  try {
    const template = obtenerPlantillaEmail(data.template, data.data);
    
    GmailApp.sendEmail(
      data.to,
      data.subject,
      '',
      {
        htmlBody: template,
        cc: data.cc || '',
        attachments: data.attachments || []
      }
    );
    
    return ContentService.createTextOutput(JSON.stringify({success: true}));
  } catch (error) {
    console.error('Error enviando email:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

// Crear evento en calendario
function crearEventoCalendario(data) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    
    const event = calendar.createEvent(
      data.title,
      new Date(data.startTime),
      new Date(data.endTime),
      {
        description: data.description,
        guests: data.guests || '',
        sendInvites: true
      }
    );
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      eventId: event.getId()
    }));
  } catch (error) {
    console.error('Error creando evento:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

// Actualizar CRM
function actualizarCRM(data) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const worksheet = sheet.getSheetByName(data.sheetName);
    
    if (!worksheet) {
      throw new Error(`Hoja ${data.sheetName} no encontrada`);
    }
    
    worksheet.appendRow(data.values);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}));
  } catch (error) {
    console.error('Error actualizando CRM:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

// Plantillas de email
function obtenerPlantillaEmail(template, data) {
  const plantillas = {
    'nueva-compra': `
      <h2>🎉 Nueva Compra Registrada</h2>
      <p><strong>Cliente:</strong> ${data.cliente.nombre}</p>
      <p><strong>Email:</strong> ${data.cliente.email}</p>
      <p><strong>Producto:</strong> ${data.producto}</p>
      <p><strong>Monto:</strong> $${data.monto} USD</p>
      <p><strong>Proveedor:</strong> ${data.proveedor}</p>
      <p><strong>Fecha:</strong> ${data.fecha}</p>
      <hr>
      <p>Proceder con la confirmación vía WhatsApp.</p>
    `,
    'nueva-sesion': `
      <h2>📅 Nueva Sesión Programada</h2>
      <p><strong>Cliente:</strong> ${data.cliente.nombre}</p>
      <p><strong>Tipo de Sesión:</strong> ${data.tipoSesion}</p>
      <p><strong>Fecha Propuesta:</strong> ${new Date(data.fechaSesion).toLocaleDateString('es-ES')}</p>
      <p><strong>Notas:</strong> ${data.notas}</p>
      <hr>
      <p>Por favor confirmar disponibilidad para esta sesión.</p>
    `,
    'recordatorio-sesion': `
      <h2>⏰ Recordatorio: Sesión en 24 horas</h2>
      <p><strong>Cliente:</strong> ${data.cliente.nombre}</p>
      <p><strong>Tipo de Sesión:</strong> ${data.tipoSesion}</p>
      <p><strong>Fecha:</strong> ${new Date(data.fechaSesion).toLocaleDateString('es-ES')}</p>
      <p><strong>Enlace Zoom:</strong> ${data.enlaceZoom || 'Por definir'}</p>
      <hr>
      <p>Sesión programada para mañana.</p>
    `
  };
  
  return plantillas[template] || '<p>Plantilla no encontrada</p>';
}

// Función para inicializar el CRM
function inicializarCRM() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    
    // Crear hojas si no existen
    const hojas = ['Clientes', 'Compras', 'Sesiones', 'Reportes'];
    const headers = {
      'Clientes': ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha_Registro', 'Estado', 'Prioridad'],
      'Compras': ['ID_Cliente', 'Producto', 'Monto', 'Proveedor', 'Fecha_Compra', 'Estado_Pago', 'Sesiones_Restantes'],
      'Sesiones': ['ID_Cliente', 'Fecha_Sesión', 'Tipo_Sesión', 'Estado', 'Notas', 'Próxima_Sesión'],
      'Reportes': ['Fecha', 'Ventas_Día', 'Nuevos_Clientes', 'Sesiones_Completadas']
    };
    
    hojas.forEach(nombreHoja => {
      let hoja = sheet.getSheetByName(nombreHoja);
      if (!hoja) {
        hoja = sheet.insertSheet(nombreHoja);
        hoja.getRange(1, 1, 1, headers[nombreHoja].length).setValues([headers[nombreHoja]]);
        hoja.getRange(1, 1, 1, headers[nombreHoja].length).setFontWeight('bold');
      }
    });
    
    console.log('CRM inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando CRM:', error);
  }
}