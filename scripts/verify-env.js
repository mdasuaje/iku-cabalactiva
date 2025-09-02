#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ENV_PRODUCTION = path.join(__dirname, '../.env.production');

console.log('🔍 Verificando variables de entorno de producción...');

if (!fs.existsSync(ENV_PRODUCTION)) {
  console.error('❌ Archivo .env.production no encontrado');
  process.exit(1);
}

const envContent = fs.readFileSync(ENV_PRODUCTION, 'utf8');

const requiredVars = [
  'VITE_STRIPE_CHECKOUT',
  'VITE_PAYPAL_SINGLE_SESSION',
  'VITE_PAYPAL_FULL_PACKAGE'
];

const placeholders = [
  'test_placeholder',
  'placeholder',
  'your_',
  'pk_test_'
];

let hasErrors = false;

requiredVars.forEach(varName => {
  const match = envContent.match(new RegExp(`${varName}=(.+)`));
  
  if (!match) {
    console.error(`❌ Variable ${varName} no encontrada`);
    hasErrors = true;
    return;
  }
  
  const value = match[1].trim();
  
  if (placeholders.some(placeholder => value.includes(placeholder))) {
    console.error(`❌ Variable ${varName} contiene placeholder: ${value}`);
    hasErrors = true;
    return;
  }
  
  console.log(`✅ ${varName}: OK`);
});

if (hasErrors) {
  console.error('\n❌ Verificación de variables de entorno FALLIDA');
  process.exit(1);
}

console.log('\n✅ Todas las variables de entorno verificadas correctamente');