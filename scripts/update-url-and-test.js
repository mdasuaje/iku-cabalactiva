#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 ACTUALIZAR URL DEL WEB APP\n');
console.log('Después de implementar como Web App, pega la nueva URL aquí:\n');

rl.question('Nueva URL: ', async (nuevaUrl) => {
  if (nuevaUrl.trim()) {
    // Actualizar .env.local
    let envContent = fs.readFileSync('.env.local', 'utf8');
    envContent = envContent.replace(
      /VITE_WEB_APP_URL=.*/,
      `VITE_WEB_APP_URL=${nuevaUrl.trim()}`
    );
    fs.writeFileSync('.env.local', envContent);
    
    console.log('✅ URL actualizada');
    
    // Probar inmediatamente
    console.log('\n🧪 Probando nueva URL...');
    
    try {
      const response = await fetch(nuevaUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('🎉 ¡ÉXITO!', result.message);
        console.log('\n🚀 SISTEMA LISTO PARA PRODUCCIÓN');
        console.log('Ejecutar: npm run test-crm');
      } else {
        console.log('❌ Error:', response.status);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  rl.close();
});