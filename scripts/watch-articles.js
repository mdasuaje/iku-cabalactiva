#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads');

console.log('👀 Monitoreando nuevos artículos...');

// Ejecutar actualización cada 30 segundo24 horas 24*60*60*1000
setInterval(() => {
  try {
    execSync('npm run update-articles', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error actualizando artículos:', error.message);
  }
}, 86400000);

// Ejecutar una vez al inicio
execSync('npm run update-articles', { stdio: 'inherit' });