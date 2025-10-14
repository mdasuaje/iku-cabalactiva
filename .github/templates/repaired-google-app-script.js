/**
 * Google Apps Script - CRM Integration (Production Template)
 * Handles HTTP POST requests to log sales data to Google Sheet
 * Version: 2.0 - Enhanced with error handling and validation
 */

function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Enhanced data validation
    if (!validateRequestData(data)) {
      throw new Error("Invalid or incomplete request data");
    }

    // Get spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId());
    const sheet = getTargetSheet(spreadsheet, data.action);
    
    // Process based on action type
    let result;
    switch (data.action) {
      case 'registrar-cliente':
        result = processClientRegistration(sheet, data);
        break;
      case 'registrar-compra':
        result = processPurchaseRegistration(sheet, data);
        break;
      case 'programar-sesion':
        result = processSessionScheduling(sheet, data);
        break;
      default:
        throw new Error(`Unknown action: ${data.action}`);
    }

    // Log successful operation
    console.log(`Operation successful: ${data.action}`, result);
    
    return createSuccessResponse(result);

  } catch (error) {
    // Enhanced error logging
    console.error('CRM Operation Failed:', {
      error: error.toString(),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      requestData: e.postData ? e.postData.contents : 'No data'
    });
    
    return createErrorResponse(error.toString());
  }
}

/**
 * Validate incoming request data
 */
function validateRequestData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  if (!data.action) {
    return false;
  }
  
  // Action-specific validation
  switch (data.action) {
    case 'registrar-cliente':
      return data.nombre && data.email && data.telefono;
    case 'registrar-compra':
      return data.clienteId && data.producto && data.monto;
    case 'programar-sesion':
      return data.clienteId && data.fechaSesion && data.tipoSesion;
    default:
      return false;
  }
}

/**
 * Get spreadsheet ID from script properties
 */
function getSpreadsheetId() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID not configured in script properties');
  }
  return spreadsheetId;
}

/**
 * Get target sheet based on action
 */
function getTargetSheet(spreadsheet, action) {
  let sheetName;
  switch (action) {
    case 'registrar-cliente':
      sheetName = 'Clientes';
      break;
    case 'registrar-compra':
      sheetName = 'Compras';
      break;
    case 'programar-sesion':
      sheetName = 'Sesiones';
      break;
    default:
      throw new Error(`No sheet mapping for action: ${action}`);
  }
  
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found`);
  }
  
  return sheet;
}

/**
 * Process client registration
 */
function processClientRegistration(sheet, data) {
  const cliente = {
    id: generateId(),
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    fecha_registro: new Date().toISOString(),
    estado: 'Activo',
    prioridad: data.prioridad || 'Normal',
    notas: data.notas || ''
  };
  
  sheet.appendRow([
    cliente.id,
    cliente.nombre,
    cliente.email,
    cliente.telefono,
    cliente.fecha_registro,
    cliente.estado,
    cliente.prioridad,
    cliente.notas
  ]);
  
  return cliente;
}

/**
 * Process purchase registration
 */
function processPurchaseRegistration(sheet, data) {
  const compra = {
    id: generateId(),
    id_cliente: data.clienteId,
    producto: data.producto,
    monto: parseFloat(data.monto),
    proveedor: data.proveedor || 'PayPal',
    fecha_compra: new Date().toISOString(),
    estado_pago: data.estadoPago || 'Completado',
    sesiones_restantes: parseInt(data.sesionesRestantes) || 1,
    transaction_id: data.transactionId || ''
  };
  
  sheet.appendRow([
    compra.id,
    compra.id_cliente,
    compra.producto,
    compra.monto,
    compra.proveedor,
    compra.fecha_compra,
    compra.estado_pago,
    compra.sesiones_restantes,
    compra.transaction_id
  ]);
  
  return compra;
}

/**
 * Process session scheduling
 */
function processSessionScheduling(sheet, data) {
  const sesion = {
    id: generateId(),
    id_cliente: data.clienteId,
    fecha_sesion: data.fechaSesion,
    tipo_sesion: data.tipoSesion,
    estado: 'Programada',
    notas: data.notas || '',
    proxima_sesion: data.proximaSesion || '',
    recordatorio_enviado: false
  };
  
  sheet.appendRow([
    sesion.id,
    sesion.id_cliente,
    sesion.fecha_sesion,
    sesion.tipo_sesion,
    sesion.estado,
    sesion.notas,
    sesion.proxima_sesion,
    sesion.recordatorio_enviado
  ]);
  
  return sesion;
}

/**
 * Generate unique ID
 */
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

/**
 * Create success response
 */
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Operation completed successfully',
      data: data,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create error response
 */
function createErrorResponse(errorMessage) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function - Run once to configure script properties
 */
function setupScript() {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with actual ID
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheetId);
  console.log('Script configured with spreadsheet ID:', spreadsheetId);
}