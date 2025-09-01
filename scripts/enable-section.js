#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'sitemap-config.js');

const section = process.argv[2];
if (!section) {
  console.log('Uso: npm run enable-section <blog|about|testimonials>');
  process.exit(1);
}

// Leer configuración actual
let config = fs.readFileSync(CONFIG_PATH, 'utf8');

// Activar sección
config = config.replace(
  new RegExp(`${section}: { enabled: false`),
  `${section}: { enabled: true`
);

fs.writeFileSync(CONFIG_PATH, config);
console.log(`✅ Sección '${section}' activada en sitemap`);

// Regenerar sitemap
import('./generate-sitemap.js');