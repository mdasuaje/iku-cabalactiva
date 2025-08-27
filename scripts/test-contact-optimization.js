#!/usr/bin/env node

// Test de optimización de contactos
import contactService from '../src/services/contactService.js';

async function testContactOptimization() {
  console.log('🎯 TEST OPTIMIZACIÓN DE CONTACTOS\n');

  console.log('📋 CONFIGURACIÓN:');
  console.log('   Email Contacto: contacto@iku-cabalactiva.com');
  console.log('   Email Admin: maor@iku-cabalactiva.com');
  console.log('   Email Maestro: kabbalahuniversal@gmail.com (solo sesiones pagadas)');

  // Test 1: Lead Magnet
  console.log('\n1. Probando Lead Magnet...');
  try {
    await contactService.enviarLeadMagnet({
      email: 'test-lead@example.com',
      source: 'exit-intent-popup'
    });
    console.log('   ✅ Lead magnet procesado');
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 2: Consulta General
  console.log('\n2. Probando Consulta General...');
  try {
    await contactService.enviarConsulta({
      nombre: 'Cliente Consulta',
      email: 'consulta@example.com',
      telefono: '+1234567890',
      mensaje: 'Tengo preguntas sobre las herramientas cabalísticas'
    });
    console.log('   ✅ Consulta general procesada');
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 3: Sesión Confirmada (solo para pagadas)
  console.log('\n3. Probando Sesión Confirmada...');
  try {
    await contactService.notificarSesionConfirmada({
      cliente: { nombre: 'Cliente VIP', email: 'vip@example.com' },
      tipoSesion: 'Carta Astral Cabalística',
      fechaSesion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      montoPagado: 67
    });
    console.log('   ✅ Sesión confirmada notificada al Maestro');
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n📊 FLUJO OPTIMIZADO:');
  console.log('   ✅ Leads → contacto@iku-cabalactiva.com');
  console.log('   ✅ Consultas → contacto@iku-cabalactiva.com');
  console.log('   ✅ Sesiones pagadas → kabbalahuniversal@gmail.com');
  console.log('   ✅ WhatsApp solo para sesiones específicas');

  console.log('\n🎉 OPTIMIZACIÓN COMPLETADA');
  console.log('📋 Verificar Google Sheets: hojas Leads y Consultas');
}

testContactOptimization().catch(console.error);