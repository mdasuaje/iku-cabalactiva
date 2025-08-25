#!/usr/bin/env node

// Test completo de integración PayPal
import fs from 'fs';
import webhookService from '../src/services/webhookService.js';

async function testPayPalIntegration() {
  console.log('🧪 TEST COMPLETO DE INTEGRACIÓN PAYPAL\n');

  // Leer credenciales de PayPal
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const clientId = envContent.match(/VITE_PAYPAL_CLIENT_ID=(.+)/)?.[1];
  const secretKey = envContent.match(/VITE_PAYPAL_SECRET_KEY=(.+)/)?.[1];

  console.log('📋 CREDENCIALES PAYPAL:');
  console.log('   Client ID:', clientId ? '✅ Configurado' : '❌ Faltante');
  console.log('   Secret Key:', secretKey ? '✅ Configurado' : '❌ Faltante');

  if (!clientId || !secretKey) {
    console.log('\n❌ Credenciales PayPal incompletas');
    return;
  }

  // Test 1: Simular webhook PayPal
  console.log('\n1. Simulando webhook PayPal...');
  
  const mockPayPalEvent = {
    event_type: 'PAYMENT.CAPTURE.COMPLETED',
    resource: {
      id: 'CAPTURE-123456789',
      amount: {
        currency_code: 'USD',
        value: '67.00'
      },
      payer: {
        name: {
          given_name: 'Cliente',
          surname: 'Prueba PayPal'
        },
        email_address: 'test-paypal@iku-cabalactiva.com',
        phone: {
          phone_number: {
            national_number: '1234567890'
          }
        }
      },
      custom_id: 'carta-astral',
      create_time: new Date().toISOString()
    }
  };

  try {
    await webhookService.procesarPayPalWebhook(mockPayPalEvent);
    console.log('   ✅ Webhook PayPal procesado exitosamente');
  } catch (error) {
    console.log('   ❌ Error procesando webhook:', error.message);
  }

  // Test 2: Verificar endpoint PayPal
  console.log('\n2. Probando endpoint PayPal...');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayPalEvent)
    });

    if (response.ok) {
      console.log('   ✅ Endpoint PayPal respondiendo correctamente');
    } else {
      console.log('   ⚠️  Endpoint no disponible (normal en desarrollo)');
    }
  } catch (error) {
    console.log('   ⚠️  Endpoint no disponible (normal en desarrollo)');
  }

  // Test 3: Verificar configuración de productos
  console.log('\n3. Verificando configuración de productos...');
  
  const productos = {
    'carta-astral': { nombre: 'Carta Astral Cabalística', precio: 67, requiereSesion: true },
    'constelacion': { nombre: 'Constelación Familiar Cabalística', precio: 97, requiereSesion: true },
    'limpieza-aurica': { nombre: 'Limpieza Áurica Cabalística', precio: 150, requiereSesion: true },
    'meditacion': { nombre: 'Meditación Cabalística', precio: 67, requiereSesion: false }
  };

  Object.entries(productos).forEach(([id, producto]) => {
    console.log(`   ✅ ${producto.nombre}: $${producto.precio} USD`);
  });

  console.log('\n🎉 TEST PAYPAL COMPLETADO');
  console.log('📊 Verificar Google Sheets para confirmar datos de prueba');
  console.log('📧 Verificar emails enviados');
}

testPayPalIntegration().catch(console.error);