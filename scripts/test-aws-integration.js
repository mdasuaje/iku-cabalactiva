#!/usr/bin/env node

const https = require('https');

const AWS_ENDPOINT = process.env.VITE_AWS_API_GATEWAY_URL;
const GAS_ENDPOINT = process.env.VITE_GOOGLE_APP_SCRIPT_URL;

async function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testAWSIntegration() {
  console.log('🧪 Iniciando pruebas de integración AWS...\n');
  
  if (!AWS_ENDPOINT) {
    console.log('❌ AWS_ENDPOINT no configurado');
    return false;
  }
  
  const testData = {
    nombre: 'Test Usuario AWS',
    email: 'test@iku-cabalactiva.com',
    telefono: '+1234567890',
    mensaje: 'Prueba de integración AWS - ' + new Date().toISOString(),
    herramienta: 'Test Integration',
    source: 'test-script'
  };
  
  try {
    console.log('📤 Enviando datos de prueba...');
    console.log('Endpoint:', AWS_ENDPOINT);
    console.log('Payload:', JSON.stringify(testData, null, 2));
    
    const startTime = Date.now();
    const response = await makeRequest(AWS_ENDPOINT, testData);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log('\n📥 Respuesta recibida:');
    console.log('Status:', response.statusCode);
    console.log('StatusText:', response.statusMessage);
    console.log('Response Time:', responseTime + 'ms');
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('✅ Prueba exitosa - Mensaje enviado a AWS');
      console.log('⏱️  Tiempo de respuesta:', responseTime + 'ms');
      console.log('🔄 Procesamiento asíncrono iniciado');
      return true;
    } else {
      console.log('❌ Prueba fallida');
      console.log('Error:', response.data);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    return false;
  }
}

async function testFallback() {
  console.log('\n🔄 Probando fallback a Google Apps Script...');
  
  if (!GAS_ENDPOINT) {
    console.log('❌ GAS_ENDPOINT no configurado');
    return false;
  }
  
  const testData = {
    nombre: 'Test Fallback',
    email: 'fallback@iku-cabalactiva.com',
    telefono: '+1234567890',
    mensaje: 'Prueba de fallback - ' + new Date().toISOString()
  };
  
  try {
    const response = await makeRequest(GAS_ENDPOINT, testData);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('✅ Fallback funcional');
      return true;
    } else {
      console.log('❌ Fallback falló');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en fallback:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 INICIANDO TESTING INTEGRAL\n');
  
  const awsTest = await testAWSIntegration();
  const fallbackTest = await testFallback();
  
  console.log('\n📊 RESULTADOS:');
  console.log('AWS Integration:', awsTest ? '✅ PASS' : '❌ FAIL');
  console.log('Fallback Test:', fallbackTest ? '✅ PASS' : '❌ FAIL');
  
  if (awsTest && fallbackTest) {
    console.log('\n🎉 TODOS LOS TESTS PASARON - SISTEMA LISTO');
    process.exit(0);
  } else {
    console.log('\n🚨 ALGUNOS TESTS FALLARON - REVISAR CONFIGURACIÓN');
    process.exit(1);
  }
}

runAllTests();