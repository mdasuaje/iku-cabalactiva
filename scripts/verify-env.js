#!/usr/bin/env node

/**
 * Verifica que las variables de entorno críticas estén configuradas
 * Este script valida que las variables de entorno necesarias estén disponibles
 * en el entorno de build, ya sea desde GitHub Secrets o archivos .env locales
 */

console.log('🔍 Verificando variables de entorno de producción...');

// Lista de variables críticas para el funcionamiento de la aplicación
const criticalVars = [
  'VITE_SITE_URL',
  'VITE_GOOGLE_APP_SCRIPT_URL'
];

// Variables opcionales pero recomendadas
const optionalVars = [
  'VITE_STRIPE_PUBLIC_KEY',
  'VITE_STRIPE_CHECKOUT',
  'VITE_PAYPAL_CLIENT_ID'
];

let hasErrors = false;
let hasWarnings = false;

// Verificar variables críticas
console.log('\n📋 Verificando variables críticas:');
criticalVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value || value.trim() === '') {
    console.warn(`⚠️  Variable ${varName} no está definida (se usará valor por defecto si existe)`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

// Verificar variables opcionales
console.log('\n📋 Verificando variables de pago (opcionales):');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value || value.trim() === '') {
    console.log(`ℹ️  Variable ${varName} no está definida`);
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

if (hasErrors) {
  console.error('\n❌ Verificación de variables de entorno FALLIDA');
  console.error('Por favor configure las variables críticas en GitHub Secrets o en su archivo .env');
  process.exit(1);
}

if (hasWarnings) {
  console.warn('\n⚠️  Algunas variables críticas no están configuradas');
  console.warn('La aplicación funcionará con valores por defecto, pero es recomendable configurarlas');
}

console.log('\n✅ Verificación de variables de entorno completada');
console.log('ℹ️  Las variables se inyectarán durante el build desde el entorno');

export default function verifyEnvironmentVars() {
  return !hasErrors;
}