// GOOGLE APPS SCRIPT - VERSIÓN SIMPLIFICADA
// Copiar este código en Google Apps Script

function doPost(e) {
  try {
    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    
    if (!e || !e.postData) {
      return response.setContent(JSON.stringify({error: 'No data received'}));
    }

    const data = JSON.parse(e.postData.contents);
    
    switch (data.action) {
      case 'test':
        return response.setContent(JSON.stringify({
          success: true, 
          message: 'Conexión exitosa',
          timestamp: new Date().toISOString()
        }));
        
      case 'send-email':
        return enviarEmailSimple(data, response);
        
      case 'update-crm':
        return actualizarCRMSimple(data, response);
        
      default:
        return response.setContent(JSON.stringify({
          error: 'Acción no reconocida: ' + data.action
        }));
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    }));
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'IKU CRM Webhook funcionando',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function enviarEmailSimple(data, response) {
  try {
    // Email básico sin plantillas complejas
    const subject = data.subject || 'Notificación IKU Cábala Activa';
    const body = `
      Nueva notificación:
      ${JSON.stringify(data.data, null, 2)}
    `;
    
    GmailApp.sendEmail(data.to, subject, body);
    
    return response.setContent(JSON.stringify({
      success: true, 
      message: 'Email enviado'
    }));
  } catch (error) {
    return response.setContent(JSON.stringify({
      error: 'Error enviando email: ' + error.toString()
    }));
  }
}

function actualizarCRMSimple(data, response) {
  try {
    // Intentar crear/acceder a spreadsheet
    let sheet;
    
    try {
      // Intentar abrir spreadsheet existente
      sheet = SpreadsheetApp.openById('16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY');
    } catch (error) {
      // Si falla, crear nuevo spreadsheet
      sheet = SpreadsheetApp.create('IKU CRM - Cábala Activa');
      
      // Enviar ID del nuevo spreadsheet por email
      const newId = sheet.getId();
      GmailApp.sendEmail(
        'maor@iku-cabalactiva.com',
        'Nuevo Google Sheets CRM creado',
        `Nuevo ID del spreadsheet: ${newId}\nActualizar en .env.local: VITE_SPREADSHEET_ID=${newId}`
      );
    }
    
    // Obtener o crear hoja
    let worksheet = sheet.getSheetByName(data.sheetName);
    if (!worksheet) {
      worksheet = sheet.insertSheet(data.sheetName);
      
      // Agregar headers según el tipo de hoja
      const headers = getHeaders(data.sheetName);
      if (headers.length > 0) {
        worksheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }
    
    // Agregar datos
    worksheet.appendRow(data.values);
    
    return response.setContent(JSON.stringify({
      success: true,
      message: 'CRM actualizado',
      sheetId: sheet.getId()
    }));
    
  } catch (error) {
    return response.setContent(JSON.stringify({
      error: 'Error actualizando CRM: ' + error.toString()
    }));
  }
}

function getHeaders(sheetName) {
  const headers = {
    'Clientes': ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha_Registro', 'Estado', 'Prioridad'],
    'Compras': ['ID_Cliente', 'Producto', 'Monto', 'Proveedor', 'Fecha_Compra', 'Estado_Pago', 'Sesiones_Restantes'],
    'Sesiones': ['ID_Cliente', 'Fecha_Sesión', 'Tipo_Sesión', 'Estado', 'Notas', 'Próxima_Sesión'],
    'Reportes': ['Fecha', 'Ventas_Día', 'Nuevos_Clientes', 'Sesiones_Completadas']
  };
  
  return headers[sheetName] || [];
}

// Función de prueba simple
function testBasico() {
  try {
    console.log('Iniciando test básico...');
    
    // Test 1: Crear spreadsheet si no existe
    let sheet;
    try {
      sheet = SpreadsheetApp.openById('16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY');
      console.log('Spreadsheet existente encontrado');
    } catch (error) {
      sheet = SpreadsheetApp.create('IKU CRM - Cábala Activa TEST');
      console.log('Nuevo spreadsheet creado:', sheet.getId());
    }
    
    // Test 2: Enviar email de prueba
    GmailApp.sendEmail(
      'maor@iku-cabalactiva.com',
      'Test Google Apps Script',
      'Google Apps Script funcionando correctamente'
    );
    
    console.log('Test completado exitosamente');
    return 'Test exitoso';
    
  } catch (error) {
    console.error('Error en test:', error);
    throw error;
  }
}