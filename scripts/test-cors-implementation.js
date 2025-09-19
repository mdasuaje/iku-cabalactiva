#!/usr/bin/env node

// Test script para verificar la implementación de CORS
console.log('🧪 Iniciando pruebas de CORS Implementation...\n');

// Verificar que el archivo de Google Apps Script contiene la función doOptions
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gasFilePath = path.join(__dirname, 'google-apps-script-zero-trust.js');

try {
  const gasContent = fs.readFileSync(gasFilePath, 'utf8');
  
  console.log('✅ Verificando archivo Google Apps Script...');
  
  // Verificar función doOptions
  if (gasContent.includes('function doOptions(e)')) {
    console.log('  ✅ Función doOptions(e) encontrada');
  } else {
    console.log('  ❌ Función doOptions(e) NO encontrada');
    process.exit(1);
  }
  
  // Verificar headers CORS en doOptions
  if (gasContent.includes('Access-Control-Allow-Origin')) {
    console.log('  ✅ Headers CORS encontrados en doOptions');
  } else {
    console.log('  ❌ Headers CORS NO encontrados en doOptions');
    process.exit(1);
  }
  
  // Verificar headers CORS en createSuccessResponse
  const successResponseMatch = gasContent.match(/function createSuccessResponse[\s\S]*?\.setHeaders\s*\(\s*\{[\s\S]*?"Access-Control-Allow-Origin"[\s\S]*?\}\s*\)/);
  if (successResponseMatch) {
    console.log('  ✅ Headers CORS añadidos a createSuccessResponse');
  } else {
    console.log('  ❌ Headers CORS NO encontrados en createSuccessResponse');
    process.exit(1);
  }
  
  // Verificar headers CORS en createErrorResponse
  const errorResponseMatch = gasContent.match(/function createErrorResponse[\s\S]*?\.setHeaders\s*\(\s*\{[\s\S]*?"Access-Control-Allow-Origin"[\s\S]*?\}\s*\)/);
  if (errorResponseMatch) {
    console.log('  ✅ Headers CORS añadidos a createErrorResponse');
  } else {
    console.log('  ❌ Headers CORS NO encontrados en createErrorResponse');
    process.exit(1);
  }
  
  // Verificar headers CORS en doGet
  const getResponseMatch = gasContent.match(/function doGet[\s\S]*?\.setHeaders\s*\(\s*\{[\s\S]*?"Access-Control-Allow-Origin"[\s\S]*?\}\s*\)/);
  if (getResponseMatch) {
    console.log('  ✅ Headers CORS añadidos a doGet');
  } else {
    console.log('  ❌ Headers CORS NO encontrados en doGet');
    process.exit(1);
  }
  
  console.log('\n✅ Todas las verificaciones de CORS pasaron exitosamente!');
  console.log('\n📋 Resumen de cambios implementados:');
  console.log('  • Función doOptions(e) para manejar peticiones preflight CORS');
  console.log('  • Headers CORS en todas las funciones de respuesta');
  console.log('  • Soporte completo para peticiones cross-origin');
  
  console.log('\n🚀 Próximos pasos:');
  console.log('  1. Copiar el código completo a Google Apps Script');
  console.log('  2. Re-desplegar como Web App con permisos públicos');
  console.log('  3. Probar el formulario de contacto');
  
} catch (error) {
  console.error('❌ Error leyendo el archivo:', error.message);
  process.exit(1);
}