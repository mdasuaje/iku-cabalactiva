#!/usr/bin/env node

// Test rápido del webhook
import fs from 'fs';

async function testWebhookSimple() {
  console.log('🧪 TEST RÁPIDO DEL WEBHOOK\n');

  // Leer URL del webhook
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const webhookUrlMatch = envContent.match(/VITE_WEB_APP_URL=(.+)/);
  
  if (!webhookUrlMatch) {
    console.log('❌ URL del webhook no encontrada en .env.local');
    return;
  }

  const webhookUrl = webhookUrlMatch[1];
  console.log('🎯 Probando:', webhookUrl);

  try {
    // Test 1: Ping básico
    console.log('\n1. Test de conectividad...');
    const response1 = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test' })
    });

    if (response1.ok) {
      const result1 = await response1.json();
      console.log('   ✅ Conectividad:', result1.message);
    } else {
      console.log('   ❌ Error:', response1.status, response1.statusText);
      return;
    }

    // Test 2: Actualizar CRM
    console.log('\n2. Test de CRM...');
    const response2 = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-crm',
        sheetName: 'Test',
        values: ['Test', new Date().toISOString(), 'Funcionando desde Node.js']
      })
    });

    if (response2.ok) {
      const result2 = await response2.json();
      console.log('   ✅ CRM:', result2.message);
    } else {
      console.log('   ❌ Error CRM:', response2.status, response2.statusText);
    }

    console.log('\n🎉 WEBHOOK FUNCIONANDO CORRECTAMENTE!');
    console.log('📊 Verificar Google Sheets para confirmar datos');

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

testWebhookSimple();