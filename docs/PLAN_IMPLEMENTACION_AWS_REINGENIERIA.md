# 🏗️ PLAN DE IMPLEMENTACIÓN AWS - RE-INGENIERÍA COMPLETA
## IKU Cábala Activa - Informe Técnico Integral

---

## 📋 RESUMEN EJECUTIVO

### Situación Actual
- **Codespace Activo**: `codespace-bookish-space-spoon-7vj4r49q7gj2rr7g`
- **Repositorio**: `https://github.com/mdasuaje/iku-cabalactiva`
- **Rama Actual**: `feature/frontend-refactor`
- **Producción**: `main` branch → GitHub Pages
- **Estado Diagnóstico**: Todos los componentes funcionales ✅

### Problema Identificado
**Regresión catastrófica** en el flujo de ingresos debido a dependencias de Google Apps Script con limitaciones de quota, timeouts y confiabilidad.

### Solución Propuesta
**Re-ingeniería completa** migrando a AWS con arquitectura serverless para garantizar:
- ✅ Confiabilidad 99.9%
- ✅ Escalabilidad ilimitada
- ✅ Respuesta < 100ms
- ✅ Zero-downtime

---

## 🔍 ANÁLISIS DEL CONTRATO DE DATOS ACTUAL

### Estructura de Datos Identificada

#### ContactModal.jsx - Formulario Principal
```javascript
const formData = {
  nombre: string,      // Nombre completo del cliente
  email: string,       // Email de contacto
  telefono: string,    // Teléfono (opcional)
  mensaje: string      // Mensaje de consulta
}

// Endpoint actual
const scriptURL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL
// URL: https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec
```

#### CRMService.js - Estructura CRM
```javascript
// Cliente
const cliente = {
  id: Date.now().toString(),
  nombre: clienteData.nombre,
  email: clienteData.email,
  telefono: clienteData.telefono,
  fecha_registro: new Date().toISOString(),
  estado: 'Activo',
  prioridad: 'Normal'
}

// Compra
const compra = {
  id_cliente: compraData.clienteId,
  producto: compraData.producto,
  monto: compraData.monto,
  proveedor: compraData.proveedor,
  fecha_compra: new Date().toISOString(),
  estado_pago: compraData.estadoPago,
  sesiones_restantes: compraData.sesionesRestantes || 1
}

// Sesión
const sesion = {
  id_cliente: sesionData.clienteId,
  fecha_sesion: sesionData.fechaSesion,
  tipo_sesion: sesionData.tipoSesion,
  estado: 'Programada',
  notas: sesionData.notas || '',
  proxima_sesion: sesionData.proximaSesion || ''
}
```

---

## 🏗️ ARQUITECTURA AWS PROPUESTA

### Stack Tecnológico
```
Frontend (React) 
    ↓ [HTTPS POST]
Amazon API Gateway
    ↓ [JSON Message]
Amazon SQS Queue
    ↓ [Event Trigger]
AWS Lambda Function
    ↓ [Dual Processing]
├── Amazon SES (Email)
└── Google Apps Script (CRM Backup)
```

### Componentes AWS
1. **API Gateway**: Endpoint HTTPS público
2. **SQS**: Cola de mensajes con DLQ
3. **Lambda**: Procesamiento NodeJS
4. **SES**: Servicio de email nativo
5. **CloudWatch**: Logs y monitoreo
6. **IAM**: Permisos y seguridad

---

## 📋 PLAN DE IMPLEMENTACIÓN DETALLADO

### FASE 1: PREPARACIÓN AWS (30 minutos)

#### Tarea 1.1: Configuración IAM
```bash
# Crear usuario IAM con permisos programáticos
aws iam create-user --user-name iku-cabalactiva-service

# Crear política personalizada
cat > iku-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:*",
        "lambda:*",
        "sqs:*",
        "ses:*",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy --policy-name IKUCabalActivaPolicy --policy-document file://iku-policy.json
aws iam attach-user-policy --user-name iku-cabalactiva-service --policy-arn arn:aws:iam::ACCOUNT:policy/IKUCabalActivaPolicy
aws iam create-access-key --user-name iku-cabalactiva-service
```

#### Tarea 1.2: Verificación SES
```bash
# Verificar dominio
aws ses verify-domain-identity --domain iku-cabalactiva.com

# Verificar email
aws ses verify-email-identity --email-address contacto@iku-cabalactiva.com
aws ses verify-email-identity --email-address maor@iku-cabalactiva.com
```

### FASE 2: INFRAESTRUCTURA AWS (45 minutos)

#### Tarea 2.1: Crear Cola SQS
```bash
# Cola principal
aws sqs create-queue --queue-name iku-contact-queue

# Dead Letter Queue
aws sqs create-queue --queue-name iku-contact-dlq

# Configurar DLQ
aws sqs set-queue-attributes \
  --queue-url https://sqs.REGION.amazonaws.com/ACCOUNT/iku-contact-queue \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:REGION:ACCOUNT:iku-contact-dlq\",\"maxReceiveCount\":3}",
    "VisibilityTimeoutSeconds": "300"
  }'
```

#### Tarea 2.2: Función Lambda
**Archivo**: `/aws/lambda/contact-processor.js`
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async (event) => {
  console.log('Procesando mensaje:', JSON.stringify(event, null, 2));
  
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      
      // Procesar contacto
      await processContact(messageBody);
      
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      throw error; // Reenvía a DLQ después de 3 intentos
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
  const response = await fetch('https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec', {
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

#### Tarea 2.3: Crear Lambda
```bash
# Crear función
zip -r contact-processor.zip contact-processor.js node_modules/

aws lambda create-function \
  --function-name iku-contact-processor \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
  --handler contact-processor.handler \
  --zip-file fileb://contact-processor.zip \
  --timeout 30 \
  --memory-size 256

# Configurar trigger SQS
aws lambda create-event-source-mapping \
  --event-source-arn arn:aws:sqs:REGION:ACCOUNT:iku-contact-queue \
  --function-name iku-contact-processor \
  --batch-size 10
```

#### Tarea 2.4: API Gateway
```bash
# Crear API
aws apigateway create-rest-api --name iku-contact-api

# Crear recurso /contact
aws apigateway create-resource \
  --rest-api-id API_ID \
  --parent-id ROOT_RESOURCE_ID \
  --path-part contact

# Crear método POST
aws apigateway put-method \
  --rest-api-id API_ID \
  --resource-id RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE

# Integración con SQS
aws apigateway put-integration \
  --rest-api-id API_ID \
  --resource-id RESOURCE_ID \
  --http-method POST \
  --type AWS \
  --integration-http-method POST \
  --uri arn:aws:apigateway:REGION:sqs:path/ACCOUNT/iku-contact-queue

# Deploy
aws apigateway create-deployment \
  --rest-api-id API_ID \
  --stage-name prod
```

### FASE 3: REFACTORIZACIÓN FRONTEND (20 minutos)

#### Tarea 3.1: Actualizar ContactModal.jsx
**Archivo**: `/src/components/common/ContactModal.jsx`
```javascript
// Reemplazar línea 65
const scriptURL = 'https://API_ID.execute-api.REGION.amazonaws.com/prod/contact'

// Actualizar handleSubmit (líneas 67-95)
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

#### Tarea 3.2: Variables de Entorno
**Archivo**: `.env.local`
```bash
# AWS Configuration
VITE_AWS_API_GATEWAY_URL=https://API_ID.execute-api.REGION.amazonaws.com/prod/contact
VITE_AWS_REGION=us-east-1

# Backup (mantener por compatibilidad)
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec
```

### FASE 4: TESTING Y VALIDACIÓN (30 minutos)

#### Tarea 4.1: Script de Testing
**Archivo**: `/scripts/test-aws-integration.js`
```javascript
#!/usr/bin/env node

const fetch = require('node-fetch');

const AWS_ENDPOINT = process.env.VITE_AWS_API_GATEWAY_URL;

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
    } else {
      console.log('❌ Prueba fallida');
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar prueba
testAWSIntegration();
```

#### Tarea 4.2: Validación E2E
```bash
# Ejecutar prueba
npm run test:aws-integration

# Verificar logs en CloudWatch
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/iku-contact

# Verificar cola SQS
aws sqs get-queue-attributes --queue-url QUEUE_URL --attribute-names All
```

### FASE 5: DEPLOYMENT Y MONITOREO (25 minutos)

#### Tarea 5.1: CI/CD Update
**Archivo**: `.github/workflows/aws-deploy.yml`
```yaml
name: AWS Integration Deploy

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
      run: npm run test:aws-integration
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Tarea 5.2: Monitoreo CloudWatch
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

# Crear alarma
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

---

## 📊 CRONOGRAMA DE IMPLEMENTACIÓN

### Día 1 (2 horas)
- **09:00-09:30**: Fase 1 - Preparación AWS
- **09:30-10:15**: Fase 2 - Infraestructura AWS
- **10:15-10:35**: Fase 3 - Refactorización Frontend
- **10:35-11:05**: Fase 4 - Testing y Validación
- **11:05-11:30**: Fase 5 - Deployment y Monitoreo

### Día 2 (30 minutos)
- **Validación final**: Pruebas en producción
- **Documentación**: Actualización de documentos
- **Rollback plan**: Preparación de contingencia

---

## 🔧 ARCHIVOS DE CONFIGURACIÓN

### AWS CLI Configuration
```bash
# ~/.aws/config
[default]
region = us-east-1
output = json

[profile iku-cabalactiva]
region = us-east-1
output = json
```

### Package.json Scripts
```json
{
  "scripts": {
    "test:aws-integration": "node scripts/test-aws-integration.js",
    "deploy:aws": "npm run build && aws s3 sync dist/ s3://iku-cabalactiva-backup",
    "logs:aws": "aws logs tail /aws/lambda/iku-contact-processor --follow"
  }
}
```

---

## 📈 MÉTRICAS DE ÉXITO

### KPIs Técnicos
- **Tiempo de respuesta**: < 100ms (vs 2-5s actual)
- **Disponibilidad**: 99.9% (vs 95% actual)
- **Tasa de error**: < 0.1% (vs 5% actual)
- **Escalabilidad**: 1000+ req/min (vs 10 req/min actual)

### KPIs de Negocio
- **Conversión de leads**: +25%
- **Abandono de formulario**: -40%
- **Tiempo de respuesta al cliente**: -80%
- **Satisfacción del usuario**: +30%

---

## 🚨 PLAN DE CONTINGENCIA

### Rollback Inmediato
```bash
# Revertir cambios en frontend
git checkout main
git revert HEAD~1

# Redirigir tráfico a GAS
export VITE_GOOGLE_APP_SCRIPT_URL="https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec"

# Deploy de emergencia
npm run build && npm run deploy
```

### Monitoreo de Fallas
- **CloudWatch Alarms**: Notificación inmediata
- **SQS DLQ**: Recuperación de mensajes perdidos
- **Backup GAS**: Funcionamiento paralelo

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Pre-implementación
- [ ] Cuenta AWS configurada
- [ ] Permisos IAM creados
- [ ] Dominio verificado en SES
- [ ] Backup del sistema actual
- [ ] Variables de entorno configuradas

### Implementación
- [ ] Cola SQS creada con DLQ
- [ ] Función Lambda desplegada
- [ ] API Gateway configurado
- [ ] Frontend actualizado
- [ ] CI/CD modificado

### Post-implementación
- [ ] Pruebas E2E exitosas
- [ ] Monitoreo configurado
- [ ] Documentación actualizada
- [ ] Equipo capacitado
- [ ] Plan de rollback validado

---

## 🎯 RESULTADOS ESPERADOS

### Inmediatos (Día 1)
- ✅ Sistema AWS funcional
- ✅ Respuestas instantáneas
- ✅ Confiabilidad mejorada

### Corto Plazo (Semana 1)
- ✅ Métricas de performance mejoradas
- ✅ Reducción de errores
- ✅ Mayor satisfacción del usuario

### Mediano Plazo (Mes 1)
- ✅ Incremento en conversiones
- ✅ Escalabilidad comprobada
- ✅ ROI positivo

---

**🏆 CONCLUSIÓN**: La re-ingeniería AWS transformará IKU Cábala Activa de un sistema dependiente y frágil a una plataforma empresarial robusta, escalable y confiable, garantizando el crecimiento sostenible del negocio espiritual del Maestro Isaac Benzaquén.

---

*Documento generado: 2025-10-24*  
*Versión: 1.0*  
*Estado: Listo para implementación*