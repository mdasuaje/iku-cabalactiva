#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOMAIN = 'https://iku-cabalactiva.com';
const OUTPUT = path.join(__dirname, '../public/sitemap.xml');

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/#carta-astral', priority: '0.9', changefreq: 'monthly' },
  { loc: '/#constelacion-familiar', priority: '0.9', changefreq: 'monthly' },
  { loc: '/#limpieza-aurica', priority: '0.9', changefreq: 'monthly' },
  { loc: '/#meditacion-cabalistica', priority: '0.9', changefreq: 'monthly' }
];

const lastmod = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${DOMAIN}${url.loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(OUTPUT, sitemap);
console.log('✅ Sitemap generado:', OUTPUT);