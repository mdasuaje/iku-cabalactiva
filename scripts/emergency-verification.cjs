#!/usr/bin/env node

// SCRIPT DE VERIFICACIÓN DE EMERGENCIA POST-DESPLIEGUE
// Verifica que el endpoint esté funcionando correctamente

const https = require('https');

const CONFIG = {
  timeout: 15000,
  token: process.env.VITE_CRM_SECRET_TOKEN || '***SET_IN_ENV***'
};

async function testEndpoint(url) {
  console.log('🔍 INICIANDO VERIFICACIÓN DE EMERGENCIA...');
  console.log(`📡 Endpoint: ${url}`);
  console.log('⏰ Timeout: 15 segundos\n');

  try {
    // Test 1: GET Request (Health Check)
    console.log('📤 Test 1: GET Request (Health Check)...');
    const getResult = await makeRequest(url, 'GET');
    
    if (getResult.statusCode === 200) {
      console.log('✅ GET Request: ÉXITO');
      console.log(`📊 Response: ${JSON.stringify(getResult.data, null, 2)}`);
    } else {
      console.log(`❌ GET Request: FALLÓ - Status ${getResult.statusCode}`);
      return false;
    }

    // Test 2: POST Request (Zero Trust Test)
    console.log('\n📤 Test 2: POST Request (Zero Trust Test)...');
    const payload = {
      action: 'test',
      token: CONFIG.token,
      timestamp: new Date().toISOString()
    };

    const postResult = await makeRequest(url, 'POST', payload);
    
    if (postResult.statusCode === 200 && postResult.data.success === true) {
      console.log('✅ POST Request: ÉXITO');
      console.log(`📊 Response: ${JSON.stringify(postResult.data, null, 2)}`);
      console.log('\n🎉 ¡VERIFICACIÓN COMPLETADA CON ÉXITO!');
      console.log('🔒 Zero Trust funcionando correctamente');
      return true;
    } else {
      console.log(`❌ POST Request: FALLÓ`);
      console.log(`📊 Status: ${postResult.statusCode}`);
      console.log(`📄 Response: ${JSON.stringify(postResult.data, null, 2)}`);
      return false;
    }

  } catch (error) {
    console.error('💥 ERROR CRÍTICO:', error.message);
    return false;
  }
}

function makeRequest(url, method, payload = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': 'IKU-CRM-Emergency-Verification/1.0'
      }
    };

    if (method === 'POST' && payload) {
      const postData = JSON.stringify(payload);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        try {
          const data = responseBody ? JSON.parse(responseBody) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        } catch (parseError) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: { raw: responseBody, parseError: parseError.message }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (method === 'POST' && payload) {
      req.write(JSON.stringify(payload));
    }

    req.end();
  });
}

// Verificar si se proporcionó URL como argumento
if (process.argv.length < 3) {
  console.error('❌ Error: URL requerida');
  console.error('💡 Uso: node emergency-verification.cjs <URL_DEL_ENDPOINT>');
  process.exit(1);
}

const endpointUrl = process.argv[2];

// Ejecutar verificación
testEndpoint(endpointUrl)
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error.message);
    process.exit(1);
  });