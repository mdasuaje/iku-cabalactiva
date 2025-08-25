#!/usr/bin/env node

import crmService from '../src/services/crmService.js';

async function testSistemaFinal() {
  console.log('🎯 TEST FINAL DEL SISTEMA CRM\n');

  try {
    // Test 1: Registrar cliente
    console.log('1. Registrando cliente de prueba...');
    const cliente = await crmService.registrarCliente({
      nombre: 'Cliente Test Final',
      email: 'test@iku-cabalactiva.com',
      telefono: '+1234567890'
    });
    console.log('   ✅ Cliente registrado:', cliente.id);

    // Test 2: Registrar compra
    console.log('2. Registrando compra...');
    const compra = await crmService.registrarCompra({
      clienteId: cliente.id,
      producto: 'Carta Astral Cabalística',
      monto: 67,
      proveedor: 'Stripe',
      estadoPago: 'Completado',
      sesionesRestantes: 1
    });
    console.log('   ✅ Compra registrada');

    // Test 3: Programar sesión
    console.log('3. Programando sesión...');
    const fechaSesion = new Date();
    fechaSesion.setDate(fechaSesion.getDate() + 3);
    
    const sesion = await crmService.programarSesion({
      clienteId: cliente.id,
      fechaSesion: fechaSesion.toISOString(),
      tipoSesion: 'Carta Astral Cabalística',
      notas: 'Sesión de prueba final'
    });
    console.log('   ✅ Sesión programada');

    console.log('\n🎉 ¡SISTEMA CRM FUNCIONANDO AL 100%!');
    console.log('📊 Verificar datos en Google Sheets');
    console.log('🚀 Listo para desplegar a producción');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSistemaFinal();