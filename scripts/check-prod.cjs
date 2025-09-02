#!/usr/bin/env node

const https = require('https');

console.log('🌐 IKU Cábala Activa - Verificación de Producción\n');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        status: response.statusCode,
        headers: response.headers
      });
    });
    
    request.on('error', (error) => {
      resolve({ error: error.message });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({ error: 'Timeout' });
    });
  });
};

const runChecks = async () => {
  const results = {
    mainSite: false,
    sitemap: false,
    robots: false
  };

  // 1. Check main site
  console.log('🏠 Verificando sitio principal...');
  const mainCheck = await checkUrl('https://iku-cabalactiva.com');
  if (mainCheck.status === 200) {
    results.mainSite = true;
    console.log('✅ Sitio principal responde correctamente\n');
  } else {
    console.log(`❌ Sitio principal falló: ${mainCheck.error || mainCheck.status}\n`);
  }

  // 2. Check sitemap
  console.log('🗺️  Verificando sitemap...');
  const sitemapCheck = await checkUrl('https://iku-cabalactiva.com/sitemap.xml');
  if (sitemapCheck.status === 200) {
    results.sitemap = true;
    console.log('✅ Sitemap disponible\n');
  } else {
    console.log(`❌ Sitemap no disponible: ${sitemapCheck.error || sitemapCheck.status}\n`);
  }

  // 3. Check robots.txt
  console.log('🤖 Verificando robots.txt...');
  const robotsCheck = await checkUrl('https://iku-cabalactiva.com/robots.txt');
  if (robotsCheck.status === 200) {
    results.robots = true;
    console.log('✅ Robots.txt disponible\n');
  } else {
    console.log(`❌ Robots.txt no disponible: ${robotsCheck.error || robotsCheck.status}\n`);
  }

  // Resumen final
  console.log('📊 INFORME DE SALUD DE PRODUCCIÓN:');
  console.log('=================================');
  console.log(`Sitio Principal: ${results.mainSite ? '✅' : '❌'}`);
  console.log(`Sitemap:         ${results.sitemap ? '✅' : '❌'}`);
  console.log(`Robots.txt:      ${results.robots ? '✅' : '❌'}`);

  const allHealthy = Object.values(results).every(r => r);
  console.log(`\n${allHealthy ? '🎉 PRODUCCIÓN SALUDABLE' : '⚠️  HAY PROBLEMAS EN PRODUCCIÓN'}`);

  return allHealthy;
};

runChecks().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Error ejecutando checks:', error.message);
  process.exit(1);
});