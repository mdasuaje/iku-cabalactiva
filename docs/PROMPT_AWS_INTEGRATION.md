# 🚀 PROMPT-AWS-6: INTEGRACIÓN COMPLETA
## IKU Cábala Activa - Finalización del Sistema

---

## 📊 ESTADO ACTUAL CONFIRMADO

```
✅ Account ID: 533267221285
✅ SES Token: QMj2PnBsT4y3aSVURsMhjiug2ZPdP69o6Pyhj6ql6YY=
✅ SQS Queue: https://sqs.us-east-1.amazonaws.com/533267221285/iku-contact-queue
✅ API Gateway: https://b83zea5u0e.execute-api.us-east-1.amazonaws.com/prod/contact
⚠️ Pendiente: Integración completa API Gateway → SQS → Email
```

---

## 🎯 TAREA ATÓMICA: COMPLETAR INTEGRACIÓN

### 1. CONFIGURAR CORS EN API GATEWAY
```bash
# Habilitar OPTIONS para CORS
aws apigateway put-method \
  --rest-api-id b83zea5u0e \
  --resource-id pqe9fd \
  --http-method OPTIONS \
  --authorization-type NONE

# Configurar response headers para CORS
aws apigateway put-method-response \
  --rest-api-id b83zea5u0e \
  --resource-id pqe9fd \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true,method.response.header.Access-Control-Allow-Origin=true

# Configurar integration response para POST
aws apigateway put-integration-response \
  --rest-api-id b83zea5u0e \
  --resource-id pqe9fd \
  --http-method POST \
  --status-code 200 \
  --response-parameters method.response.header.Access-Control-Allow-Origin="'*'"

# Redesplegar API
aws apigateway create-deployment --rest-api-id b83zea5u0e --stage-name prod
```

### 2. ACTUALIZAR CONFIGURACIÓN FRONTEND
```javascript
// src/config/aws.js
export const AWS_CONFIG = {
  API_ENDPOINT: 'https://b83zea5u0e.execute-api.us-east-1.amazonaws.com/prod/contact',
  SQS_QUEUE_URL: 'https://sqs.us-east-1.amazonaws.com/533267221285/iku-contact-queue',
  REGION: 'us-east-1'
};
```

### 3. CREAR PROCESADOR DE COLA
```javascript
// aws/scripts/process-queue.js
const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: 'us-east-1' });
const ses = new AWS.SES({ region: 'us-east-1' });

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/533267221285/iku-contact-queue';

async function processMessages() {
  try {
    const messages = await sqs.receiveMessage({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20
    }).promise();

    if (messages.Messages) {
      for (const message of messages.Messages) {
        const contactData = JSON.parse(message.Body);
        
        await ses.sendEmail({
          Source: 'contacto@iku-cabalactiva.com',
          Destination: {
            ToAddresses: ['contacto@iku-cabalactiva.com'],
            CcAddresses: ['maor@iku-cabalactiva.com']
          },
          Message: {
            Subject: { Data: `Nuevo contacto: ${contactData.nombre}` },
            Body: {
              Text: { Data: `Nombre: ${contactData.nombre}\nEmail: ${contactData.email}\nMensaje: ${contactData.mensaje}` }
            }
          }
        }).promise();

        await sqs.deleteMessage({
          QueueUrl: QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle
        }).promise();

        console.log(`Procesado: ${contactData.nombre}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

processMessages();
```

### 4. AUTOMATIZAR PROCESAMIENTO
```bash
# Crear cron job para ejecutar cada 5 minutos
echo "*/5 * * * * cd /workspaces/iku-cabalactiva && node aws/scripts/process-queue.js" | crontab -
```

---

## ✅ CRITERIOS DE ÉXITO

- [ ] CORS configurado correctamente
- [ ] Frontend conectado al endpoint AWS
- [ ] Mensajes llegando a SQS
- [ ] Emails enviándose automáticamente
- [ ] Procesamiento automatizado funcionando

---

## 🔍 VALIDACIÓN INMEDIATA

```bash
# 1. Probar CORS
curl -X OPTIONS https://b83zea5u0e.execute-api.us-east-1.amazonaws.com/prod/contact \
  -H "Origin: https://iku-cabalactiva.com" \
  -H "Access-Control-Request-Method: POST"

# 2. Probar envío de mensaje
curl -X POST https://b83zea5u0e.execute-api.us-east-1.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test Integration","email":"test@example.com","mensaje":"Test completo"}'

# 3. Verificar mensajes en cola
aws sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/533267221285/iku-contact-queue

# 4. Verificar cron job
crontab -l | grep iku
```

---

## 🎯 EJECUCIÓN INMEDIATA

**ESTADO**: Listo para ejecutar
**TIEMPO ESTIMADO**: 15 minutos
**DEPENDENCIAS**: Todas las configuraciones AWS previas completadas

**COMANDO DE INICIO**:
```bash
# Ejecutar configuración CORS
aws apigateway put-method --rest-api-id b83zea5u0e --resource-id pqe9fd --http-method OPTIONS --authorization-type NONE
```