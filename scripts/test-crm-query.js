#!/usr/bin/env node

/**
 * Script para probar el envío de consulta a través del servicio CRM
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import '../src/services/crmService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

async function importCRMService() {
  try {
    const module = await import('../src/services/crmService.js');
    return module.default;
  } catch (error) {
    console.error('❌ Error importando CRM Service:', error);
    return null;
  }
}

async function testCRMQuery() {
  console.log('🚀 Iniciando prueba de envío de consulta al CRM...');

  const crmService = await importCRMService();
  
  if (!crmService) {
    console.error('❌ No se pudo importar el servicio CRM');
    process.exit(1);
  }
  
  console.log('✅ Servicio CRM cargado correctamente');
  console.log(`📌 URL del webhook: ${crmService.webhookUrl}`);
  
  // Probar la conexión primero
  console.log('🔌 Probando conexión con el servidor CRM...');
  const connectionTest = await crmService.testConnection();
  
  console.log('📊 Resultado de la prueba de conexión:');
  console.log(JSON.stringify(connectionTest, null, 2));
  
  if (connectionTest.status !== 'success') {
    console.warn('⚠️ La conexión con el CRM no está disponible. Usando modo fallback para pruebas.');
  }
  
  // Datos de prueba para un cliente
  const clienteData = {
    nombre: 'Cliente Prueba E2E',
    email: 'test-e2e@ikucabalactiva.com',
    telefono: '+1 234-567-8900',
    fuente: 'Test E2E',
    prioridad: 'Alta',
    notas: 'Esta es una prueba automatizada de envío de consulta desde test-crm-query.js'
  };
  
  try {
    console.log('📧 Enviando datos de cliente de prueba...');
    console.log('📋 Datos:', JSON.stringify(clienteData, null, 2));
    
    const result = await crmService.registrarCliente(clienteData);
    
    console.log('✅ Registro completado');
    console.log('📊 Respuesta:');
    console.log(JSON.stringify(result, null, 2));
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('❌ Error durante el registro:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Si se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  testCRMQuery()
    .then(result => {
      console.log('\n📝 RESULTADO FINAL:');
      if (result.success) {
        console.log('✅ Prueba completada exitosamente');
        process.exit(0);
      } else {
        console.error('❌ Prueba fallida:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export default testCRMQuery;