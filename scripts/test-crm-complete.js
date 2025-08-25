#!/usr/bin/env node

// Sistema de testing completo para CRM
import crmService from '../src/services/crmService.js';
import emailService from '../src/services/emailService.js';

async function testCompleteSystem() {
  console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA CRM\n');

  try {
    // Test 1: Registrar cliente
    console.log('1. Probando registro de cliente...');
    const cliente = await crmService.registrarCliente({
      nombre: 'Cliente Prueba',
      email: 'test@iku-cabalactiva.com',
      telefono: '+1234567890'
    });
    console.log('   ✅ Cliente registrado:', cliente.id);

    // Test 2: Registrar compra
    console.log('2. Probando registro de compra...');
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
    console.log('3. Probando programación de sesión...');
    const fechaSesion = new Date();
    fechaSesion.setDate(fechaSesion.getDate() + 3);
    
    const sesion = await crmService.programarSesion({
      clienteId: cliente.id,
      fechaSesion: fechaSesion.toISOString(),
      tipoSesion: 'Carta Astral Cabalística',
      notas: 'Sesión de prueba'
    });
    console.log('   ✅ Sesión programada');

    // Test 4: Enviar emails
    console.log('4. Probando envío de emails...');
    await emailService.notificarNuevaCompra({
      cliente: cliente,
      producto: 'Carta Astral Cabalística',
      monto: 67,
      proveedor: 'Stripe'
    });
    console.log('   ✅ Email de compra enviado');

    await emailService.notificarNuevaSesion({
      cliente: cliente,
      tipoSesion: 'Carta Astral Cabalística',
      fechaSesion: fechaSesion.toISOString(),
      notas: 'Sesión de prueba'
    });
    console.log('   ✅ Email de sesión enviado');

    console.log('\n🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!');
    console.log('📊 Verificar Google Sheets para confirmar datos');
    console.log('📧 Verificar emails en maor@iku-cabalactiva.com y kabbalahuniversal@gmail.com');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    process.exit(1);
  }
}

testCompleteSystem();