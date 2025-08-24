#!/usr/bin/env node

// Script de configuración automática del CRM
import fs from 'fs';
import path from 'path';

const CONFIG = {
  SHEETS_TEMPLATE: {
    'Clientes': ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha_Registro', 'Estado', 'Prioridad'],
    'Compras': ['ID_Cliente', 'Producto', 'Monto', 'Proveedor', 'Fecha_Compra', 'Estado_Pago', 'Sesiones_Restantes'],
    'Sesiones': ['ID_Cliente', 'Fecha_Sesión', 'Tipo_Sesión', 'Estado', 'Notas', 'Próxima_Sesión'],
    'Reportes': ['Fecha', 'Ventas_Día', 'Nuevos_Clientes', 'Sesiones_Completadas']
  }
};

async function setupCRM() {
  console.log('🚀 Configurando CRM IKU Cábala Activa...\n');

  // 1. Verificar archivos necesarios
  console.log('✅ Verificando estructura de archivos...');
  const requiredFiles = [
    'src/services/crmService.js',
    'src/services/emailService.js',
    'src/services/webhookService.js',
    'api/webhooks/stripe.js',
    'api/webhooks/paypal.js',
    'scripts/google-apps-script.js'
  ];

  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.log(`❌ Archivo faltante: ${file}`);
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    console.log('\n❌ Algunos archivos necesarios no existen. Ejecuta la implementación completa primero.');
    process.exit(1);
  }

  // 2. Verificar variables de entorno
  console.log('✅ Verificando variables de entorno...');
  if (!fs.existsSync('.env.local')) {
    console.log('⚠️  Archivo .env.local no encontrado. Copiando desde .env.example...');
    fs.copyFileSync('.env.example', '.env.local');
    console.log('📝 Edita .env.local con tus credenciales reales.');
  }

  // 3. Mostrar instrucciones de Google Apps Script
  console.log('\n📋 PRÓXIMOS PASOS MANUALES:\n');
  
  console.log('1. 🔧 GOOGLE CLOUD CONSOLE:');
  console.log('   - Crear proyecto: iku-cabalactiva-crm');
  console.log('   - Habilitar APIs: Sheets, Drive, Calendar, Gmail');
  console.log('   - Crear cuenta de servicio con permisos de editor\n');

  console.log('2. 📊 GOOGLE SHEETS:');
  console.log('   - Crear hoja: "IKU CRM - Cábala Activa"');
  console.log('   - Compartir con email de cuenta de servicio');
  console.log('   - Copiar ID de la hoja a .env.local\n');

  console.log('3. 🔗 GOOGLE APPS SCRIPT:');
  console.log('   - Ir a https://script.google.com/');
  console.log('   - Crear proyecto: "IKU CRM Automation"');
  console.log('   - Copiar código de scripts/google-apps-script.js');
  console.log('   - Configurar SPREADSHEET_ID');
  console.log('   - Implementar como Web App');
  console.log('   - Copiar URL del webhook a .env.local\n');

  console.log('4. 💳 WEBHOOKS:');
  console.log('   - Stripe: Configurar webhook para payment_intent.succeeded');
  console.log('   - PayPal: Configurar webhook para PAYMENT.CAPTURE.COMPLETED\n');

  console.log('5. 🧪 PRUEBAS:');
  console.log('   - npm run dev');
  console.log('   - Simular compra de prueba');
  console.log('   - Verificar emails y datos en CRM\n');

  // 4. Generar template de Google Sheets
  console.log('📄 Generando template de Google Sheets...');
  const csvContent = Object.entries(CONFIG.SHEETS_TEMPLATE)
    .map(([sheetName, headers]) => `${sheetName}:\n${headers.join(',')}\n`)
    .join('\n');
  
  fs.writeFileSync('docs/sheets-template.csv', csvContent);
  console.log('✅ Template guardado en docs/sheets-template.csv\n');

  console.log('🎉 Configuración inicial completada!');
  console.log('📖 Ver docs/SETUP_GUIDE.md para instrucciones detalladas.');
}

setupCRM().catch(console.error);