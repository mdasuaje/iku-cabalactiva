#!/usr/bin/env node

/**
 * Diagnóstico Completo del Sistema
 * Este script ejecuta un diagnóstico comprehensivo de todos los componentes
 * del sistema según el plan establecido en PLAN_DIAGNOSTICO_COMPREHENSIVO_E2E.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyEnvironmentVars, generateTestEnv } from './verify-env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Establecer directorios importantes
const ROOT_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const DIAGNOSTICS_DIR = path.join(DOCS_DIR, 'diagnostics');

// Crear el directorio de diagnósticos si no existe
if (!fs.existsSync(DIAGNOSTICS_DIR)) {
  fs.mkdirSync(DIAGNOSTICS_DIR, { recursive: true });
  console.log(`📁 Directorio de diagnósticos creado: ${DIAGNOSTICS_DIR}`);
}

// Importar servicios y componentes necesarios (usando dynamic import)
async function importServices() {
  try {
    const crmService = await import('../src/services/crmService.js');
    return { crmService: crmService.default };
  } catch (error) {
    console.error('❌ Error importando servicios:', error);
    return { crmService: null };
  }
}

/**
 * Ejecuta un diagnóstico completo del sistema
 */
async function runFullDiagnostic() {
  console.log('🔍 INICIANDO DIAGNÓSTICO COMPREHENSIVO DEL SISTEMA');
  console.log('================================================');
  
  // 1. Verificar variables de entorno
  console.log('\n📋 FASE 1: VERIFICACIÓN DE VARIABLES DE ENTORNO');
  console.log('---------------------------------------------');
  
  let envOk = verifyEnvironmentVars();
  
  if (!envOk) {
    console.log('⚠️ Generando variables de entorno de prueba para continuar diagnóstico...');
    generateTestEnv();
    envOk = verifyEnvironmentVars(path.join(ROOT_DIR, '.env.test'));
  }
  
  if (!envOk) {
    console.error('❌ No se pudo continuar sin variables de entorno correctas');
    process.exit(1);
  }
  
  // 2. Diagnóstico de servicios
  console.log('\n📋 FASE 2: DIAGNÓSTICO DE SERVICIOS');
  console.log('----------------------------------');
  
  const { crmService } = await importServices();
  
  if (!crmService) {
    console.error('❌ No se pudieron cargar los servicios necesarios');
  } else {
    console.log('✅ Servicios cargados correctamente');
    
    // 2.1 Diagnóstico de CRM
    console.log('\n🔍 Diagnóstico de CRM');
    console.log('-------------------');
    
    console.log(`🌐 URL del webhook: ${crmService.webhookUrl}`);
    
    try {
      const connectionTest = await crmService.testConnection();
      console.log(`🔌 Test de conexión: ${connectionTest.status === 'success' ? '✅ OK' : '❌ FALLIDO'}`);
      console.log('📊 Detalles:', JSON.stringify(connectionTest, null, 2));
      
      // Guardar resultados de diagnóstico CRM
      const crmDiagnostic = {
        timestamp: new Date().toISOString(),
        webhookUrl: crmService.webhookUrl,
        connectionTest,
        environment: process.env.NODE_ENV || 'development'
      };
      
      fs.writeFileSync(
        path.join(DIAGNOSTICS_DIR, 'crm-integration-diagnosis.json'), 
        JSON.stringify(crmDiagnostic, null, 2)
      );
      console.log(`📄 Resultados guardados en: ${path.join(DIAGNOSTICS_DIR, 'crm-integration-diagnosis.json')}`);
    } catch (error) {
      console.error('❌ Error en diagnóstico CRM:', error);
    }
  }
  
  // 3. Diagnóstico de estructura
  console.log('\n📋 FASE 3: DIAGNÓSTICO DE ESTRUCTURA');
  console.log('----------------------------------');
  
  // Verificar archivos clave
  const keyFiles = [
    'src/services/crmService.js',
    'src/components/payments/PayPalButton.jsx',
    'src/components/payments/StripeCheckout.jsx',
    'src/components/ContactForm.jsx'
  ];
  
  let missingFiles = [];
  
  keyFiles.forEach(filePath => {
    const fullPath = path.join(ROOT_DIR, filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filePath}: Encontrado`);
    } else {
      console.error(`❌ ${filePath}: NO ENCONTRADO`);
      missingFiles.push(filePath);
    }
  });
  
  // 4. Resumen de diagnóstico
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO');
  console.log('========================');
  console.log(`✅ Variables de entorno: ${envOk ? 'OK' : 'Con errores'}`);
  console.log(`✅ Servicios: ${crmService ? 'Cargados' : 'Error al cargar'}`);
  console.log(`✅ Archivos clave: ${missingFiles.length === 0 ? 'Todos encontrados' : `Faltan ${missingFiles.length} archivos`}`);
  
  // Guardar resumen completo
  const fullDiagnostic = {
    timestamp: new Date().toISOString(),
    environmentOk: envOk,
    servicesLoaded: crmService !== null,
    missingFiles: missingFiles.length > 0 ? missingFiles : null,
    system: {
      node: process.version,
      platform: process.platform
    }
  };
  
  fs.writeFileSync(
    path.join(DIAGNOSTICS_DIR, 'system-diagnosis.json'), 
    JSON.stringify(fullDiagnostic, null, 2)
  );
  
  console.log(`\n📄 Resultados completos guardados en: ${path.join(DIAGNOSTICS_DIR, 'system-diagnosis.json')}`);
  console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
}

// Ejecutar diagnóstico
runFullDiagnostic().catch(error => {
  console.error('💥 Error fatal en diagnóstico:', error);
  process.exit(1);
});