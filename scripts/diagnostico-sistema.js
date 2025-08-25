#!/usr/bin/env node

// Diagnóstico completo del sistema CRM
import fs from 'fs';

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA CRM\n');

  // 1. Verificar archivos críticos
  console.log('📁 1. VERIFICANDO ARCHIVOS CRÍTICOS:');
  const archivosCriticos = [
    'src/services/crmService.js',
    'src/services/emailService.js', 
    'src/services/webhookService.js',
    'api/webhooks/stripe.js',
    'api/webhooks/paypal.js',
    'scripts/google-apps-script.js',
    '.env.local'
  ];

  archivosCriticos.forEach(archivo => {
    const existe = fs.existsSync(archivo);
    console.log(`   ${existe ? '✅' : '❌'} ${archivo}`);
  });

  // 2. Verificar variables de entorno
  console.log('\n🔧 2. VERIFICANDO VARIABLES DE ENTORNO:');
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const variables = [
      'VITE_SPREADSHEET_ID',
      'VITE_WEB_APP_URL', 
      'VITE_STRIPE_PUBLIC_KEY',
      'VITE_PAYPAL_CLIENT_ID',
      'VITE_EMAIL_ADMIN',
      'VITE_EMAIL_MAESTRO'
    ];

    variables.forEach(variable => {
      const configurada = envContent.includes(`${variable}=`) && !envContent.includes(`${variable}=your_`);
      console.log(`   ${configurada ? '✅' : '❌'} ${variable}`);
    });
  }

  // 3. Probar conectividad con Google Apps Script
  console.log('\n🔗 3. PROBANDO CONECTIVIDAD:');
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const webhookUrlMatch = envContent.match(/VITE_WEB_APP_URL=(.+)/);
    
    if (webhookUrlMatch) {
      const webhookUrl = webhookUrlMatch[1];
      console.log(`   🎯 URL del webhook: ${webhookUrl}`);
      
      // Probar conexión
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', message: 'Diagnóstico' })
      });

      if (response.ok) {
        console.log('   ✅ Conexión con Google Apps Script exitosa');
      } else {
        console.log(`   ❌ Error de conexión: ${response.status} ${response.statusText}`);
        console.log('   🔧 SOLUCIÓN: Re-desplegar Google Apps Script con permisos correctos');
      }
    } else {
      console.log('   ❌ URL del webhook no configurada');
    }
  } catch (error) {
    console.log(`   ❌ Error de conectividad: ${error.message}`);
  }

  // 4. Verificar Google Sheets
  console.log('\n📊 4. VERIFICANDO GOOGLE SHEETS:');
  const spreadsheetId = '16I11Nkg2g_XZIEj6_1RDFQ-vbsCFTHPAad0iHog-oXY';
  console.log(`   📋 ID de la hoja: ${spreadsheetId}`);
  console.log('   🔗 URL: https://docs.google.com/spreadsheets/d/' + spreadsheetId);
  console.log('   ⚠️  Verificar manualmente que las hojas existen: Clientes, Compras, Sesiones, Reportes');

  // 5. Estado de webhooks
  console.log('\n🔗 5. ESTADO DE WEBHOOKS:');
  console.log('   📍 Stripe: https://iku-cabalactiva.com/api/webhooks/stripe');
  console.log('   📍 PayPal: https://iku-cabalactiva.com/api/webhooks/paypal');
  console.log('   ⚠️  Configurar manualmente en dashboards de Stripe y PayPal');

  // 6. Próximos pasos
  console.log('\n🎯 6. PRÓXIMOS PASOS CRÍTICOS:');
  console.log('   1. 🔧 Configurar permisos Google Apps Script');
  console.log('   2. 🧪 Ejecutar: npm run test-crm');
  console.log('   3. 🚀 Ejecutar: npm run deploy');
  console.log('   4. 🔗 Configurar webhooks Stripe/PayPal');
  console.log('   5. ✅ Realizar primera venta de prueba');

  console.log('\n🎉 DIAGNÓSTICO COMPLETADO');
  console.log('📖 Ver docs/PLAN_IMPLEMENTACION_INMEDIATA.md para pasos detallados');
}

diagnosticoCompleto().catch(console.error);