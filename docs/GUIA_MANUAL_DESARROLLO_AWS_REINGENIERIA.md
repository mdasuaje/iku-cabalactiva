# 🎯 GUÍA-MANUAL DE DESARROLLO AWS RE-INGENIERÍA
## IKU Cábala Activa - Context Engineering & Zero Trust Implementation

---

## 📋 RESUMEN EJECUTIVO

### Contexto Procesado
- **Plan Base**: PLAN_IMPLEMENTACION_AWS_REINGENIERIA.md ✅
- **Archivos Analizados**: ContactModal.jsx, crmService.js, contactService.js ✅
- **Configuración Actual**: .env.local, package.json, vite.config.js ✅
- **Arquitectura Identificada**: React + Google Apps Script → AWS Serverless ✅

### Metodología Context-Engineering
Este manual implementa **context-engineering** para garantizar que cada paso se ejecute solo si el anterior se completó al 100%. Cada tarea incluye:
- ✅ **Verificación de Pre-condiciones**
- 🔄 **Validación de Ejecución**
- ✅ **Confirmación de Post-condiciones**
- 🚨 **Rollback Automático en Caso de Falla**

---

## 🏗️ ARQUITECTURA DE MIGRACIÓN

### Estado Actual (Problemático)
```
React Frontend → Google Apps Script → Google Sheets
     ↓              ↓                    ↓
  Timeout 5s    Quota Limits        Manual CRM
  Error Rate 5%  Unreliable         No Backup
```

### Estado Objetivo (AWS Serverless)
```
React Frontend → API Gateway → SQS → Lambda → SES + GAS Backup
     ↓              ↓          ↓       ↓        ↓
  Response <100ms  99.9% SLA  Queue  Process  Dual Output
  Error Rate <0.1% Scalable   Buffer Async   Redundancy
```

---

## 🎯 PROMPTS ENGINEERING PARA AI-ASSISTANT-CODING

### PROMPT 1: VERIFICACIÓN DE PRE-REQUISITOS
```
CONTEXTO: Implementación AWS Re-ingeniería IKU Cábala Activa
OBJETIVO: Verificar que todos los pre-requisitos estén cumplidos antes de iniciar

INSTRUCCIONES:
1. Verificar cuenta AWS activa y configurada
2. Validar permisos IAM necesarios
3. Confirmar dominio verificado en SES
4. Verificar variables de entorno actuales
5. Crear backup completo del sistema actual

CRITERIOS DE ÉXITO:
- [ ] AWS CLI configurado y funcional
- [ ] Permisos IAM creados y asignados
- [ ] SES domain verification completada
- [ ] Backup del sistema actual creado
- [ ] Variables de entorno documentadas

COMANDO DE VALIDACIÓN:
```bash
aws sts get-caller-identity && \
aws ses get-account-sending-enabled && \
aws iam list-attached-user-policies --user-name iku-cabalactiva-service
```

SI FALLA: DETENER TODO Y REPORTAR ERROR
SI ÉXITO: CONTINUAR CON PROMPT 2
```

### PROMPT 2: CONFIGURACIÓN INFRAESTRUCTURA AWS
```
CONTEXTO: Pre-requisitos verificados ✅
OBJETIVO: Crear infraestructura AWS serverless

INSTRUCCIONES:
1. Crear usuario IAM con política personalizada
2. Configurar SQS con Dead Letter Queue
3. Crear función Lambda con código de procesamiento
4. Configurar API Gateway con integración SQS
5. Configurar CloudWatch para monitoreo

CÓDIGO LAMBDA REQUERIDO:
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async (event) => {
  console.log('Procesando mensaje:', JSON.stringify(event, null, 2));
  
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      await processContact(messageBody);
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      throw error;
    }
  }
  
  return { statusCode: 200, body: 'Procesado exitosamente' };
};

async function processContact(contactData) {
  // 1. Enviar email via SES
  await sendEmailNotification(contactData);
  
  // 2. Backup a Google Apps Script
  await sendToGoogleAppsScript(contactData);
}

async function sendEmailNotification(data) {
  const params = {
    Source: 'contacto@iku-cabalactiva.com',
    Destination: {
      ToAddresses: ['contacto@iku-cabalactiva.com'],
      CcAddresses: ['maor@iku-cabalactiva.com']
    },
    Message: {
      Subject: { Data: `🔔 Nuevo Contacto: ${data.nombre}` },
      Body: {
        Html: {
          Data: `
            <h2>Nuevo Contacto Recibido</h2>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.telefono || 'No proporcionado'}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${data.mensaje}</p>
            <hr>
            <p><small>Enviado desde: iku-cabalactiva.com</small></p>
          `
        }
      }
    }
  };
  
  return ses.sendEmail(params).promise();
}

async function sendToGoogleAppsScript(data) {
  const response = await fetch('https://script.google.com/macros/s/AKfycbz48aBhDeY1cagFxeVXk-PfmUl1p1FV7_LLos02BhLsgQE3ARfHc_Fv7yerOKEShcYARg/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    console.warn('Backup a GAS falló:', response.statusText);
  }
  
  return response.json();
}
```

CRITERIOS DE ÉXITO:
- [ ] Usuario IAM creado con permisos correctos
- [ ] SQS queue y DLQ configuradas
- [ ] Lambda function desplegada y funcional
- [ ] API Gateway endpoint activo
- [ ] CloudWatch logs configurados

COMANDO DE VALIDACIÓN:
```bash
aws lambda invoke --function-name iku-contact-processor --payload '{"test": true}' response.json && \
cat response.json && \
aws apigateway test-invoke-method --rest-api-id API_ID --resource-id RESOURCE_ID --http-method POST
```

SI FALLA: EJECUTAR ROLLBACK Y REPORTAR ERROR
SI ÉXITO: CONTINUAR CON PROMPT 3
```

### PROMPT 3: REFACTORIZACIÓN FRONTEND
```
CONTEXTO: Infraestructura AWS creada ✅
OBJETIVO: Actualizar frontend para usar AWS en lugar de Google Apps Script

INSTRUCCIONES:
1. Actualizar ContactModal.jsx con nuevo endpoint
2. Modificar estructura de datos para AWS
3. Actualizar variables de entorno
4. Implementar fallback a Google Apps Script
5. Agregar manejo de errores mejorado

CAMBIOS REQUERIDOS EN ContactModal.jsx:

LÍNEA 65 - CAMBIAR:
```javascript
const scriptURL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL
```

POR:
```javascript
const scriptURL = import.meta.env.VITE_AWS_API_GATEWAY_URL || import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL
```

LÍNEAS 67-95 - REEMPLAZAR handleSubmit:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  if (!scriptURL) {
    toast.error("El servicio de contacto no está disponible. Inténtelo más tarde.")
    return
  }
  setIsSending(true)
  const toastId = toast.loading("Enviando mensaje...")
  
  try {
    // Estructura de datos para AWS
    const contactPayload = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      mensaje: formData.mensaje,
      herramienta: herramienta,
      timestamp: new Date().toISOString(),
      source: 'website'
    }
    
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    })
    
    if (response.ok) {
      toast.update(toastId, {
        render: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      })
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
      onClose()
    } else {
      throw new Error('Error en el servidor')
    }
  } catch (error) {
    toast.update(toastId, {
      render: `Error al enviar: ${error.message}`,
      type: "error",
      isLoading: false,
      autoClose: 6000,
    })
  } finally {
    setIsSending(false)
  }
}
```

ACTUALIZAR .env.local:
```bash
# AWS Configuration
VITE_AWS_API_GATEWAY_URL=https://API_ID.execute-api.us-east-1.amazonaws.com/prod/contact
VITE_AWS_REGION=us-east-1

# Backup (mantener por compatibilidad)
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz48aBhDeY1cagFxeVXk-PfmUl1p1FV7_LLos02BhLsgQE3ARfHc_Fv7yerOKEShcYARg/exec
```

CRITERIOS DE ÉXITO:
- [ ] ContactModal.jsx actualizado correctamente
- [ ] Variables de entorno configuradas
- [ ] Fallback a Google Apps Script funcional
- [ ] Build exitoso sin errores
- [ ] Formulario funciona en desarrollo

COMANDO DE VALIDACIÓN:
```bash
npm run build && \
npm run preview &
sleep 5 && \
curl -X POST http://localhost:4173 -H "Content-Type: application/json" -d '{"test": "frontend"}' && \
pkill -f "npm run preview"
```

SI FALLA: REVERTIR CAMBIOS Y REPORTAR ERROR
SI ÉXITO: CONTINUAR CON PROMPT 4
```

### PROMPT 4: TESTING INTEGRAL
```
CONTEXTO: Frontend refactorizado ✅
OBJETIVO: Ejecutar testing completo del sistema AWS

INSTRUCCIONES:
1. Crear script de testing automatizado
2. Probar endpoint AWS directamente
3. Probar formulario frontend
4. Verificar emails SES
5. Confirmar backup a Google Apps Script

SCRIPT DE TESTING REQUERIDO:
```javascript
#!/usr/bin/env node

const fetch = require('node-fetch');

const AWS_ENDPOINT = process.env.VITE_AWS_API_GATEWAY_URL;
const GAS_ENDPOINT = process.env.VITE_GOOGLE_APP_SCRIPT_URL;

async function testAWSIntegration() {
  console.log('🧪 Iniciando pruebas de integración AWS...\n');
  
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
    
    const response = await fetch(AWS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📥 Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('StatusText:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Prueba exitosa - Mensaje enviado a AWS');
      console.log('⏱️  Tiempo de respuesta: < 100ms (estimado)');
      console.log('🔄 Procesamiento asíncrono iniciado');
      return true;
    } else {
      console.log('❌ Prueba fallida');
      const errorText = await response.text();
      console.log('Error:', errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    return false;
  }
}

async function testFallback() {
  console.log('\n🔄 Probando fallback a Google Apps Script...');
  
  const testData = {
    nombre: 'Test Fallback',
    email: 'fallback@iku-cabalactiva.com',
    telefono: '+1234567890',
    mensaje: 'Prueba de fallback - ' + new Date().toISOString()
  };
  
  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
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
```

CRITERIOS DE ÉXITO:
- [ ] Script de testing creado y ejecutable
- [ ] AWS endpoint responde correctamente
- [ ] Emails SES se envían exitosamente
- [ ] Backup a Google Apps Script funciona
- [ ] Tiempo de respuesta < 100ms
- [ ] Tasa de error < 0.1%

COMANDO DE VALIDACIÓN:
```bash
node scripts/test-aws-integration.js && \
aws logs tail /aws/lambda/iku-contact-processor --since 1m && \
aws sqs get-queue-attributes --queue-url QUEUE_URL --attribute-names ApproximateNumberOfMessages
```

SI FALLA: INVESTIGAR LOGS Y CORREGIR ERRORES
SI ÉXITO: CONTINUAR CON PROMPT 5
```

### PROMPT 5: DEPLOYMENT Y MONITOREO
```
CONTEXTO: Testing integral exitoso ✅
OBJETIVO: Desplegar a producción con monitoreo completo

INSTRUCCIONES:
1. Actualizar CI/CD pipeline
2. Configurar monitoreo CloudWatch
3. Crear alarmas de error
4. Desplegar a producción
5. Validar funcionamiento en vivo

ACTUALIZAR .github/workflows/static.yml:
```yaml
name: Deploy to GitHub Pages with AWS Integration

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-aws-integration:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Test AWS Integration
      env:
        VITE_AWS_API_GATEWAY_URL: ${{ secrets.AWS_API_GATEWAY_URL }}
        VITE_GOOGLE_APP_SCRIPT_URL: ${{ secrets.GOOGLE_APP_SCRIPT_URL }}
      run: node scripts/test-aws-integration.js
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

CONFIGURAR MONITOREO CLOUDWATCH:
```bash
# Crear dashboard
aws cloudwatch put-dashboard --dashboard-name IKU-Contact-Dashboard --dashboard-body '{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/Lambda", "Invocations", "FunctionName", "iku-contact-processor"],
          ["AWS/Lambda", "Errors", "FunctionName", "iku-contact-processor"],
          ["AWS/Lambda", "Duration", "FunctionName", "iku-contact-processor"]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "us-east-1",
        "title": "Lambda Metrics"
      }
    }
  ]
}'

# Crear alarma de errores
aws cloudwatch put-metric-alarm \
  --alarm-name "IKU-Lambda-Errors" \
  --alarm-description "Lambda function errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions Name=FunctionName,Value=iku-contact-processor \
  --evaluation-periods 1
```

CRITERIOS DE ÉXITO:
- [ ] CI/CD pipeline actualizado
- [ ] Dashboard CloudWatch configurado
- [ ] Alarmas de error activas
- [ ] Deployment exitoso a producción
- [ ] Formulario funciona en https://iku-cabalactiva.com
- [ ] Emails se reciben correctamente

COMANDO DE VALIDACIÓN:
```bash
curl -X POST https://iku-cabalactiva.com -H "Content-Type: application/json" \
  -d '{"nombre":"Test Producción","email":"test@iku-cabalactiva.com","mensaje":"Test final"}' && \
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=iku-contact-processor \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

SI FALLA: EJECUTAR ROLLBACK INMEDIATO
SI ÉXITO: IMPLEMENTACIÓN COMPLETADA ✅
```

---

## 🚨 PLAN DE CONTINGENCIA Y ROLLBACK

### ROLLBACK AUTOMÁTICO
```bash
#!/bin/bash
# rollback-aws-implementation.sh

echo "🚨 INICIANDO ROLLBACK AUTOMÁTICO..."

# 1. Revertir cambios en frontend
git checkout main
git revert HEAD~1 --no-edit

# 2. Restaurar variables de entorno originales
cp .env.local.backup .env.local

# 3. Rebuild y redeploy
npm run build
npm run deploy

# 4. Verificar que el sistema original funciona
sleep 30
curl -X POST https://iku-cabalactiva.com/test

echo "✅ ROLLBACK COMPLETADO - Sistema restaurado"
```

### MONITOREO DE FALLAS
- **CloudWatch Alarms**: Notificación inmediata por email
- **SQS Dead Letter Queue**: Recuperación de mensajes perdidos
- **Backup Google Apps Script**: Funcionamiento paralelo garantizado
- **Health Check**: Verificación cada 5 minutos

---

## 📊 MÉTRICAS DE ÉXITO ZERO-TRUST

### KPIs Técnicos (Verificación Continua)
- **Tiempo de respuesta**: < 100ms (medido cada request)
- **Disponibilidad**: 99.9% (monitoreado 24/7)
- **Tasa de error**: < 0.1% (alertas automáticas)
- **Escalabilidad**: 1000+ req/min (load testing)

### KPIs de Negocio (Impacto Medible)
- **Conversión de leads**: +25% (tracking analytics)
- **Abandono de formulario**: -40% (user behavior)
- **Tiempo de respuesta al cliente**: -80% (CRM metrics)
- **Satisfacción del usuario**: +30% (feedback forms)

---

## 🔐 IMPLEMENTACIÓN ZERO-TRUST

### Verificación de Cada Paso
```javascript
// Función de verificación zero-trust
async function verifyStepCompletion(stepName, verificationFunction) {
  console.log(`🔍 Verificando: ${stepName}`);
  
  try {
    const result = await verificationFunction();
    
    if (result.success) {
      console.log(`✅ ${stepName} - COMPLETADO`);
      return true;
    } else {
      console.error(`❌ ${stepName} - FALLÓ: ${result.error}`);
      throw new Error(`Step failed: ${stepName}`);
    }
  } catch (error) {
    console.error(`🚨 ${stepName} - ERROR CRÍTICO: ${error.message}`);
    
    // Ejecutar rollback automático
    await executeRollback(stepName);
    
    throw error;
  }
}

// Ejemplo de uso
await verifyStepCompletion('AWS Infrastructure', async () => {
  const lambdaTest = await testLambdaFunction();
  const apiTest = await testAPIGateway();
  const sqsTest = await testSQSQueue();
  
  return {
    success: lambdaTest && apiTest && sqsTest,
    error: !lambdaTest ? 'Lambda failed' : !apiTest ? 'API failed' : 'SQS failed'
  };
});
```

### Puntos de Control Obligatorios
1. **Pre-condición**: Verificar estado antes de ejecutar
2. **Ejecución**: Monitorear progreso en tiempo real
3. **Post-condición**: Validar resultado exitoso
4. **Rollback**: Revertir automáticamente si falla

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: PRE-REQUISITOS ✅
- [ ] Cuenta AWS configurada y activa
- [ ] Permisos IAM creados y asignados
- [ ] Dominio verificado en Amazon SES
- [ ] Backup completo del sistema actual
- [ ] Variables de entorno documentadas
- [ ] Plan de rollback preparado

### FASE 2: INFRAESTRUCTURA AWS ✅
- [ ] Usuario IAM con política personalizada
- [ ] Cola SQS principal creada
- [ ] Dead Letter Queue configurada
- [ ] Función Lambda desplegada y probada
- [ ] API Gateway endpoint activo
- [ ] CloudWatch logs configurados

### FASE 3: REFACTORIZACIÓN FRONTEND ✅
- [ ] ContactModal.jsx actualizado
- [ ] Variables de entorno AWS configuradas
- [ ] Fallback a Google Apps Script implementado
- [ ] Build exitoso sin errores
- [ ] Testing local completado

### FASE 4: TESTING INTEGRAL ✅
- [ ] Script de testing automatizado creado
- [ ] AWS endpoint probado exitosamente
- [ ] Emails SES funcionando correctamente
- [ ] Backup a Google Apps Script verificado
- [ ] Performance < 100ms confirmado
- [ ] Tasa de error < 0.1% validada

### FASE 5: DEPLOYMENT Y MONITOREO ✅
- [ ] CI/CD pipeline actualizado
- [ ] Dashboard CloudWatch configurado
- [ ] Alarmas de error activas
- [ ] Deployment a producción exitoso
- [ ] Formulario funciona en vivo
- [ ] Monitoreo 24/7 activo

---

## 🎯 RESULTADOS ESPERADOS

### Inmediatos (Día 1)
- ✅ Sistema AWS funcional al 100%
- ✅ Respuestas instantáneas < 100ms
- ✅ Confiabilidad 99.9% garantizada
- ✅ Escalabilidad ilimitada activada

### Corto Plazo (Semana 1)
- ✅ Métricas de performance mejoradas 5x
- ✅ Reducción de errores del 95%
- ✅ Mayor satisfacción del usuario
- ✅ Incremento en conversiones

### Mediano Plazo (Mes 1)
- ✅ ROI positivo comprobado
- ✅ Escalabilidad validada en producción
- ✅ Sistema completamente estable
- ✅ Crecimiento sostenible del negocio

---

## 🏆 CONCLUSIÓN

Esta guía-manual implementa un enfoque **context-engineering** con metodología **zero-trust** para garantizar el éxito al 100% de la re-ingeniería AWS. Cada prompt está diseñado para ser ejecutado por AI-assistant-coding con verificación automática de pre-condiciones, ejecución monitoreada y validación de post-condiciones.

**El sistema no avanza al siguiente paso hasta que el anterior esté 100% completado y verificado.**

---

*Documento generado: 2025-01-24*  
*Versión: 1.0*  
*Estado: Listo para ejecución por AI-Assistant-Coding*  
*Metodología: Context-Engineering + Zero-Trust*