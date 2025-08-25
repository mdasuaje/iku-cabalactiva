// GOOGLE APPS SCRIPT - VERSIÓN MÍNIMA SIN GMAIL
// Copiar este código en Google Apps Script

function doPost(e) {
  try {
    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    
    if (!e || !e.postData) {
      return response.setContent(JSON.stringify({
        success: false,
        error: 'No data received'
      }));
    }

    const data = JSON.parse(e.postData.contents);
    
    switch (data.action) {
      case 'test':
        return response.setContent(JSON.stringify({
          success: true, 
          message: 'Webhook funcionando correctamente',
          timestamp: new Date().toISOString(),
          received_data: data
        }));
        
      case 'update-crm':
        return actualizarCRM(data, response);
        
      case 'send-email':
        // Por ahora solo log, sin enviar email
        console.log('Email request:', data);
        return response.setContent(JSON.stringify({
          success: true,
          message: 'Email logged (Gmail disabled temporarily)'
        }));
        
      default:
        return response.setContent(JSON.stringify({
          success: false,
          error: 'Acción no reconocida: ' + data.action
        }));
    }
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'IKU CRM Webhook funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0'
  })).setMimeType(ContentService.MimeType.JSON);
}

function actualizarCRM(data, response) {
  try {
    // Usar spreadsheet específico
    const SPREADSHEET_ID = '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY';
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let worksheet = sheet.getSheetByName(data.sheetName);
    
    // Si la hoja no existe, crearla
    if (!worksheet) {
      worksheet = sheet.insertSheet(data.sheetName);
      
      // Agregar headers
      const headers = getHeaders(data.sheetName);
      if (headers.length > 0) {
        worksheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        worksheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      }
    }
    
    // Agregar datos
    worksheet.appendRow(data.values);
    
    return response.setContent(JSON.stringify({
      success: true,
      message: `Datos agregados a ${data.sheetName}`,
      timestamp: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('Error actualizando CRM:', error);
    return response.setContent(JSON.stringify({
      success: false,
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

// Test básico solo con Sheets
function testSheetsOnly() {
  try {
    console.log('Test básico - solo Sheets...');
    
    const SPREADSHEET_ID = '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    console.log('Spreadsheet encontrado:', sheet.getName());
    
    // Crear hoja de prueba
    let testSheet = sheet.getSheetByName('Test');
    if (!testSheet) {
      testSheet = sheet.insertSheet('Test');
    }
    
    // Agregar datos de prueba
    testSheet.appendRow(['Test', new Date().toISOString(), 'Funcionando']);
    
    console.log('Test completado exitosamente');
    return 'Test exitoso - Sheets funcionando';
    
  } catch (error) {
    console.error('Error en test:', error);
    throw error;
  }
}