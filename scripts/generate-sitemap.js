#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITEMAP_CONFIG } from './sitemap-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateSitemap() {
  const OUTPUT = path.join(__dirname, '../public/sitemap.xml');
  const INDEX_OUTPUT = path.join(__dirname, '../public/sitemap-index.xml');
  
  // URLs activas (main + future habilitadas)
  const activeUrls = [
    ...SITEMAP_CONFIG.main,
    ...Object.values(SITEMAP_CONFIG.future)
      .filter(item => item.enabled)
      .map(item => ({ loc: item.path, priority: item.priority, changefreq: item.changefreq }))
  ];
  
  const lastmod = new Date().toISOString().split('T')[0];
  
  // Generar sitemap principal
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${activeUrls.map(url => `    <url>
        <loc>${SITEMAP_CONFIG.domain}${url.loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;
  
  // Actualizar sitemap-index
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${SITEMAP_CONFIG.domain}/sitemap.xml</loc>
        <lastmod>${lastmod}</lastmod>
    </sitemap>
</sitemapindex>`;
  
  fs.writeFileSync(OUTPUT, sitemap);
  fs.writeFileSync(INDEX_OUTPUT, sitemapIndex);
  
  console.log('✅ Sitemap generado:', OUTPUT);
  console.log('✅ Sitemap-index actualizado:', INDEX_OUTPUT);
  console.log(`📊 URLs incluidas: ${activeUrls.length}`);
}

generateSitemap();