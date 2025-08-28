#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads');
const LEAD_MAGNETS_FILE = path.join(__dirname, '../src/data/leadMagnets.js');

// Generar configuración automática desde PDFs
function generateLeadMagnets() {
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    console.log('❌ Directorio /public/downloads no existe');
    return;
  }

  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(file => file.endsWith('.pdf'))
    .map(file => {
      const id = file.replace('.pdf', '');
      const title = id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      return {
        id,
        title,
        description: `Contenido exclusivo: ${title}`,
        file: `/downloads/${file}`,
        buttonText: 'Descargar Gratis',
        icon: '📜'
      };
    });

  const content = `export const leadMagnets = ${JSON.stringify(files, null, 2)};`;
  
  fs.writeFileSync(LEAD_MAGNETS_FILE, content);
  console.log(`✅ Actualizados ${files.length} artículos en leadMagnets.js`);
}

generateLeadMagnets();