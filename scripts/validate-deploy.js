#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

const SITE_URL = 'https://iku-cabalactiva.com';
const TIMEOUT = 30000;

async function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: TIMEOUT }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ url, status: res.statusCode, success: true });
      } else {
        resolve({ url, status: res.statusCode, success: false });
      }
    });
    
    req.on('error', (err) => {
      resolve({ url, error: err.message, success: false });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function validateDeploy() {
  console.log('🔍 Validating deployment...');
  
  const urls = [
    SITE_URL,
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/robots.txt`
  ];
  
  const results = await Promise.all(urls.map(checkUrl));
  
  let allPassed = true;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.url} - Status: ${result.status}`);
    } else {
      console.log(`❌ ${result.url} - Error: ${result.error || result.status}`);
      allPassed = false;
    }
  });
  
  // Check GitHub Pages deployment status
  try {
    const gitStatus = execSync('git log -1 --pretty=format:"%H %s"', { encoding: 'utf8' });
    console.log(`📝 Latest commit: ${gitStatus}`);
  } catch (error) {
    console.log('⚠️  Could not get git status');
  }
  
  if (allPassed) {
    console.log('🎉 Deployment validation successful!');
    process.exit(0);
  } else {
    console.log('💥 Deployment validation failed!');
    process.exit(1);
  }
}

validateDeploy().catch(console.error);