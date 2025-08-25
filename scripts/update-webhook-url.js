#!/usr/bin/env node

// Script para actualizar URL del webhook si cambió
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 ACTUALIZAR URL DEL WEBHOOK\n');
console.log('Si obtuviste una nueva URL de Google Apps Script, ingrésala aquí:');
console.log('(Presiona Enter para mantener la actual)\n');

rl.question('Nueva URL del webhook: ', (nuevaUrl) => {
  if (nuevaUrl.trim()) {
    // Leer archivo .env.local
    let envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Actualizar URL
    envContent = envContent.replace(
      /VITE_WEB_APP_URL=.*/,
      `VITE_WEB_APP_URL=${nuevaUrl.trim()}`
    );
    
    // Guardar archivo
    fs.writeFileSync('.env.local', envContent);
    
    console.log('✅ URL actualizada en .env.local');
    console.log('🧪 Ejecuta: npm run diagnostico');
  } else {
    console.log('⏭️  Manteniendo URL actual');
  }
  
  rl.close();
});