/**
 * Google Apps Script - CRM Integration (Production v2.0)
 * Enhanced version with robust error handling and validation
 * Compatible with new CRMService frontend implementation
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
      case 'test-connection':
        result = processTestConnection();
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
      return data.id_cliente && data.producto && data.monto;
    case 'programar-sesion':
      return data.id_cliente && data.fecha_sesion && data.tipo_sesion;
    case 'test-connection':
      return true; // Test connection doesn't need specific data
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
    // Fallback to hardcoded ID if not set in properties
    return '1YourSpreadsheetIdHere'; // Replace with actual ID
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
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    fecha_registro: data.fecha_registro,
    estado: data.estado || 'Activo',
    prioridad: data.prioridad || 'Normal',
    notas: data.notas || ''
  };
  
  // Check if headers exist, if not create them
  ensureHeaders(sheet, [
    'ID', 'Nombre', 'Email', 'Teléfono', 'Fecha Registro', 
    'Estado', 'Prioridad', 'Notas'
  ]);
  
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
    id: data.id,
    id_cliente: data.id_cliente,
    producto: data.producto,
    monto: parseFloat(data.monto),
    proveedor: data.proveedor || 'PayPal',
    fecha_compra: data.fecha_compra,
    estado_pago: data.estado_pago || 'Completado',
    sesiones_restantes: parseInt(data.sesiones_restantes) || 1,
    transaction_id: data.transaction_id || '',
    currency: data.currency || 'USD'
  };
  
  // Check if headers exist
  ensureHeaders(sheet, [
    'ID', 'ID Cliente', 'Producto', 'Monto', 'Proveedor', 
    'Fecha Compra', 'Estado Pago', 'Sesiones Restantes', 
    'Transaction ID', 'Moneda'
  ]);
  
  sheet.appendRow([
    compra.id,
    compra.id_cliente,
    compra.producto,
    compra.monto,
    compra.proveedor,
    compra.fecha_compra,
    compra.estado_pago,
    compra.sesiones_restantes,
    compra.transaction_id,
    compra.currency
  ]);
  
  return compra;
}

/**
 * Process session scheduling
 */
function processSessionScheduling(sheet, data) {
  const sesion = {
    id: data.id,
    id_cliente: data.id_cliente,
    fecha_sesion: data.fecha_sesion,
    tipo_sesion: data.tipo_sesion,
    estado: data.estado || 'Programada',
    notas: data.notas || '',
    proxima_sesion: data.proxima_sesion || '',
    recordatorio_enviado: data.recordatorio_enviado || false,
    created_at: data.created_at
  };
  
  // Check if headers exist
  ensureHeaders(sheet, [
    'ID', 'ID Cliente', 'Fecha Sesión', 'Tipo Sesión', 'Estado', 
    'Notas', 'Próxima Sesión', 'Recordatorio Enviado', 'Creado'
  ]);
  
  sheet.appendRow([
    sesion.id,
    sesion.id_cliente,
    sesion.fecha_sesion,
    sesion.tipo_sesion,
    sesion.estado,
    sesion.notas,
    sesion.proxima_sesion,
    sesion.recordatorio_enviado,
    sesion.created_at
  ]);
  
  return sesion;
}

/**
 * Process test connection
 */
function processTestConnection() {
  return {
    status: 'success',
    message: 'Connection test successful',
    timestamp: new Date().toISOString(),
    version: '2.0'
  };
}

/**
 * Ensure sheet has proper headers
 */
function ensureHeaders(sheet, headers) {
  const range = sheet.getRange(1, 1, 1, headers.length);
  const existingHeaders = range.getValues()[0];
  
  // If first row is empty or doesn't match expected headers, set them
  if (existingHeaders.every(cell => cell === '') || 
      !arraysEqual(existingHeaders, headers)) {
    range.setValues([headers]);
    
    // Format headers
    range.setFontWeight('bold');
    range.setBackground('#f0f0f0');
  }
}

/**
 * Compare two arrays for equality
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

/**
 * Test function - Run to test the script functionality
 */
function testScript() {
  const testData = {
    action: 'test-connection',
    test: true
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}