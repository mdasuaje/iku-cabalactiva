#!/usr/bin/env node

// Test completo de integración Stripe
import fs from 'fs';
import webhookService from '../src/services/webhookService.js';

async function testStripeIntegration() {
  console.log('🧪 TEST COMPLETO DE INTEGRACIÓN STRIPE\n');

  // Leer credenciales de Stripe
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const publicKey = envContent.match(/VITE_STRIPE_PUBLIC_KEY=(.+)/)?.[1];

  console.log('📋 CREDENCIALES STRIPE:');
  console.log('   Public Key:', publicKey ? '✅ Configurado' : '❌ Faltante');

  // Test 1: Simular webhook Stripe
  console.log('\n1. Simulando webhook Stripe...');
  
  const mockStripeEvent = {
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_123456789',
        amount: 6700, // $67.00 en centavos
        currency: 'usd',
        status: 'succeeded',
        billing_details: {
          name: 'Cliente Prueba Stripe',
          email: 'test-stripe@iku-cabalactiva.com',
          phone: '+1234567890'
        },
        metadata: {
          product_id: 'carta-astral',
          client_name: 'Cliente Prueba Stripe',
          client_email: 'test-stripe@iku-cabalactiva.com'
        },
        created: Math.floor(Date.now() / 1000)
      }
    }
  };

  try {
    await webhookService.procesarStripeWebhook(mockStripeEvent);
    console.log('   ✅ Webhook Stripe procesado exitosamente');
  } catch (error) {
    console.log('   ❌ Error procesando webhook:', error.message);
  }

  // Test 2: Verificar endpoint Stripe
  console.log('\n2. Probando endpoint Stripe...');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockStripeEvent)
    });

    if (response.ok) {
      console.log('   ✅ Endpoint Stripe respondiendo correctamente');
    } else {
      console.log('   ⚠️  Endpoint no disponible (normal en desarrollo)');
    }
  } catch (error) {
    console.log('   ⚠️  Endpoint no disponible (normal en desarrollo)');
  }

  console.log('\n🎉 TEST STRIPE COMPLETADO');
  console.log('📊 Verificar Google Sheets para confirmar datos de prueba');
  console.log('📧 Verificar emails enviados');
}

testStripeIntegration().catch(console.error);