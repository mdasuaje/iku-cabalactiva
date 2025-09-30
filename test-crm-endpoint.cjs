#!/usr/bin/env node

/**
 * PRUEBA TÉCNICA DEL ENDPOINT CRM - VERIFICACIÓN ZERO TRUST
 * Este script envía una petición de prueba al nuevo endpoint de producción
 */

const https = require('https');
const http = require('http');

const CONFIG = {
  url: 'https://script.google.com/macros/s/AKfycbwZj6KlJZN5GyCwHzSv-kEBuqnG2TAZdfFaU8-QHA6_EAxJptTL3byy6f4C9mQAxAk-_g/exec',
  token: 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025',
  timeout: 15000
};

const testPayload = {
  action: 'test',
  token: CONFIG.token,
  timestamp: new Date().toISOString()
};

console.log('🔍 INICIANDO PRUEBA TÉCNICA DEL ENDPOINT CRM...');
console.log(`📡 Endpoint: ${CONFIG.url}`);
console.log(`⏰ Timeout: ${CONFIG.timeout}ms\n`);

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'IKU-CRM-Test-Agent/1.0'
      },
      timeout: CONFIG.timeout
    };

    const req = https.request(CONFIG.url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            jsonBody: null
          };
          
          try {
            result.jsonBody = JSON.parse(body);
          } catch (e) {
            // Si no es JSON válido, se mantiene como null
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
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

async function runTest() {
  try {
    console.log('📤 Enviando petición de prueba...');
    
    const startTime = Date.now();
    const response = await makeRequest(testPayload);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️  Tiempo de respuesta: ${duration}ms`);
    console.log(`📊 Código de estado HTTP: ${response.statusCode}`);
    
    // Verificar criterios de éxito
    const success = response.statusCode === 200 && 
                   response.jsonBody && 
                   response.jsonBody.success === true;
    
    if (success) {
      console.log('\n✅ PRUEBA TÉCNICA EXITOSA');
      console.log('🎯 El endpoint responde correctamente');
      console.log('📋 Respuesta JSON válida recibida');
      
      if (response.jsonBody.message) {
        console.log(`💬 Mensaje: ${response.jsonBody.message}`);
      }
      
      console.log('\n🚀 EL CRM ESTÁ VIVO Y FUNCIONAL');
      process.exit(0);
      
    } else {
      console.log('\n❌ PRUEBA TÉCNICA FALLIDA');
      console.log('⚠️  El endpoint no responde como se esperaba');
      
      if (response.statusCode !== 200) {
        console.log(`🔴 Código de estado incorrecto: ${response.statusCode}`);
      }
      
      if (!response.jsonBody) {
        console.log('🔴 La respuesta no es JSON válido');
        console.log(`📄 Respuesta cruda: ${response.body.substring(0, 200)}...`);
      } else if (response.jsonBody.success !== true) {
        console.log('🔴 La respuesta JSON no indica éxito');
        console.log(`📄 Respuesta: ${JSON.stringify(response.jsonBody, null, 2)}`);
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.log('\n💥 ERROR EN LA PRUEBA TÉCNICA');
    console.log(`❌ ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🌐 Error de conectividad - verifique la URL');
    } else if (error.message === 'Request timeout') {
      console.log('⏰ Timeout - el servidor tardó demasiado en responder');
    }
    
    process.exit(1);
  }
}

// Ejecutar la prueba
runTest();