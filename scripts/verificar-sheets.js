#!/usr/bin/env node

// Verificar acceso a Google Sheets
console.log('🔍 VERIFICANDO GOOGLE SHEETS\n');

const SPREADSHEET_ID = '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY';
const SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

console.log('📋 ID del Spreadsheet:', SPREADSHEET_ID);
console.log('🔗 URL directa:', SHEETS_URL);
console.log('\n🔧 PASOS PARA VERIFICAR:');
console.log('1. Abrir URL en navegador');
console.log('2. Verificar que puedes acceder');
console.log('3. Si no existe, crear nuevo Google Sheets');
console.log('4. Compartir con tu email de Google Apps Script');
console.log('\n📝 Si necesitas crear nuevo:');
console.log('- Ir a: https://sheets.google.com');
console.log('- Crear hoja: "IKU CRM - Cábala Activa"');
console.log('- Copiar nuevo ID de la URL');
console.log('- Actualizar .env.local');