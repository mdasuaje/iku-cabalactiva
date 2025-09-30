// Diagnóstico del CRM - Verificación del Endpoint Zero Trust
// Este script verifica que el nuevo endpoint responde correctamente

const https = require('https');
const http = require('http');

const NEW_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwZj6KlJZN5GyCwHzSv-kEBuqnG2TAZdfFaU8-QHA6_EAxJptTL3byy6f4C9mQAxAk-_g/exec';
const SECRET_TOKEN = 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025';

console.log('🔍 INICIANDO DIAGNÓSTICO DEL ENDPOINT CRM...\n');

// Función para realizar petición POST
function makePostRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObject = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObject.hostname,
      port: urlObject.port || (urlObject.protocol === 'https:' ? 443 : 80),
      path: urlObject.pathname + urlObject.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'IKU-CRM-Diagnostic/1.0'
      },
      timeout: 15000 // 15 segundos timeout
    };

    const client = urlObject.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Test del endpoint con petición de prueba
async function testEndpoint() {
  try {
    console.log('📡 Enviando petición de prueba...');
    console.log(`🎯 Endpoint: ${NEW_ENDPOINT}`);
    console.log('⏱️  Timeout: 15 segundos\n');

    const testData = {
      action: 'test',
      token: SECRET_TOKEN,
      timestamp: new Date().toISOString()
    };

    const response = await makePostRequest(NEW_ENDPOINT, testData);
    
    console.log('📊 RESULTADO DEL DIAGNÓSTICO:');
    console.log('─'.repeat(50));
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Content-Type: ${response.headers['content-type'] || 'N/A'}`);
    
    // Verificar si es una respuesta exitosa
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('✅ HTTP Status: OK');
      
      // Intentar parsear JSON
      try {
        const jsonResponse = JSON.parse(response.body);
        console.log('✅ JSON Response: Válido');
        console.log('📄 Contenido:');
        console.log(JSON.stringify(jsonResponse, null, 2));
        
        // Verificar si contiene success: true
        if (jsonResponse.success === true) {
          console.log('\n🎉 ¡DIAGNÓSTICO EXITOSO!');
          console.log('✅ El endpoint responde correctamente');
          console.log('✅ JSON válido recibido');
          console.log('✅ Respuesta contiene success: true');
          return true;
        } else {
          console.log('\n⚠️  DIAGNÓSTICO PARCIAL');
          console.log('✅ Endpoint responde');
          console.log('✅ JSON válido');
          console.log('❌ Respuesta no contiene success: true');
          return false;
        }
      } catch (parseError) {
        console.log('❌ JSON Response: Inválido');
        console.log('📄 Raw Response:');
        console.log(response.body.substring(0, 500));
        console.log('\n⚠️  DIAGNÓSTICO FALLIDO: Respuesta no es JSON válido');
        return false;
      }
    } else {
      console.log('❌ HTTP Status: Error');
      console.log('📄 Raw Response:');
      console.log(response.body.substring(0, 500));
      console.log('\n❌ DIAGNÓSTICO FALLIDO: Error HTTP');
      return false;
    }
    
  } catch (error) {
    console.log('❌ ERROR EN LA CONEXIÓN:');
    console.log(error.message);
    console.log('\n💥 DIAGNÓSTICO FALLIDO: Error de red o timeout');
    return false;
  }
}

// Ejecutar diagnóstico
(async () => {
  const success = await testEndpoint();
  process.exit(success ? 0 : 1);
})();