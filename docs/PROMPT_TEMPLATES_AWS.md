# 📝 TEMPLATES DE PROMPTS AWS
## IKU Cábala Activa - Context-Engineering

**Propósito**: Templates específicos para ejecutar cada prompt AWS  
**Metodología**: Context-Engineering optimizado  

---

## 🎯 TEMPLATE GENERAL

```
PROMPT-AWS-[NUMERO]: [TITULO]

CONTEXTO ESPECÍFICO:
- Estado actual del sistema
- Dependencias completadas
- Recursos disponibles
- Configuración previa

TAREA ATÓMICA:
- Objetivo específico y medible
- Pasos detallados de ejecución
- Comandos exactos a ejecutar
- Configuraciones requeridas

CRITERIOS DE ÉXITO:
- [ ] Criterio 1 específico
- [ ] Criterio 2 medible
- [ ] Criterio 3 validable
- [ ] Criterio 4 documentable

VALIDACIÓN INMEDIATA:
- Comando de verificación
- Resultado esperado
- Métricas a confirmar
- Documentación a generar

ROLLBACK (si falla):
- Pasos para revertir cambios
- Comandos de limpieza
- Estado de recuperación
```

---

## 📋 PROMPT-AWS-1: CONFIGURACIÓN CUENTA AWS

### CONTEXTO ESPECÍFICO:
```
Sistema IKU Cábala Activa preparado para migración AWS.
- Frontend refactorizado ✅
- Código AWS preparado ✅
- Testing implementado ✅
- Necesita: Cuenta AWS real operativa
```

### TAREA ATÓMICA:
```
Configurar cuenta AWS completa para IKU Cábala Activa:

1. CREAR CUENTA AWS
   aws configure set region us-east-1
   aws sts get-caller-identity

2. CONFIGURAR IAM
   aws iam create-user --user-name iku-cabalactiva-service
   aws iam create-policy --policy-name IKUCabalActivaPolicy --policy-document file://aws/iam-policy.json
   aws iam attach-user-policy --user-name iku-cabalactiva-service --policy-arn arn:aws:iam::ACCOUNT:policy/IKUCabalActivaPolicy
   aws iam create-access-key --user-name iku-cabalactiva-service

3. VALIDAR CONFIGURACIÓN
   aws iam list-users
   aws iam list-attached-user-policies --user-name iku-cabalactiva-service
```

### CRITERIOS DE ÉXITO:
- [ ] Cuenta AWS activa y configurada
- [ ] Usuario IAM iku-cabalactiva-service creado
- [ ] Política IKUCabalActivaPolicy aplicada
- [ ] Access keys generadas y configuradas
- [ ] AWS CLI funcionando correctamente

### VALIDACIÓN INMEDIATA:
```bash
# Verificar identidad
aws sts get-caller-identity

# Verificar usuario
aws iam get-user --user-name iku-cabalactiva-service

# Verificar políticas
aws iam list-attached-user-policies --user-name iku-cabalactiva-service
```

---

## 📋 PROMPT-AWS-2: DESPLIEGUE SES

### CONTEXTO ESPECÍFICO:
```
Cuenta AWS configurada y operativa.
- Usuario IAM creado ✅
- Permisos SES disponibles ✅
- Necesita: Amazon SES configurado para emails
```

### TAREA ATÓMICA:
```
Configurar Amazon SES para IKU Cábala Activa:

1. VERIFICAR DOMINIO
   aws ses verify-domain-identity --domain iku-cabalactiva.com

2. VERIFICAR EMAILS
   aws ses verify-email-identity --email-address contacto@iku-cabalactiva.com
   aws ses verify-email-identity --email-address maor@iku-cabalactiva.com

3. CONFIGURAR SANDBOX (si necesario)
   aws ses put-account-sending-enabled --enabled

4. PROBAR ENVÍO
   aws ses send-email --source contacto@iku-cabalactiva.com --destination ToAddresses=contacto@iku-cabalactiva.com --message Subject={Data="Test SES"},Body={Text={Data="Test message"}}
```

### CRITERIOS DE ÉXITO:
- [ ] Dominio iku-cabalactiva.com verificado
- [ ] Email contacto@iku-cabalactiva.com verificado
- [ ] Email maor@iku-cabalactiva.com verificado
- [ ] Email de prueba enviado exitosamente
- [ ] Configuración SES documentada

### VALIDACIÓN INMEDIATA:
```bash
# Verificar identidades
aws ses list-verified-email-addresses
aws ses get-identity-verification-attributes --identities iku-cabalactiva.com

# Verificar límites
aws ses get-send-quota
aws ses get-send-statistics
```

---

## 📋 PROMPT-AWS-3: DESPLIEGUE SQS

### CONTEXTO ESPECÍFICO:
```
Amazon SES configurado y operativo.
- Emails verificados ✅
- Envío de prueba exitoso ✅
- Necesita: Cola SQS para procesamiento asíncrono
```

### TAREA ATÓMICA:
```
Configurar Amazon SQS para IKU Cábala Activa:

1. CREAR COLA PRINCIPAL
   aws sqs create-queue --queue-name iku-contact-queue --attributes VisibilityTimeoutSeconds=300,MessageRetentionPeriod=1209600

2. CREAR DEAD LETTER QUEUE
   aws sqs create-queue --queue-name iku-contact-dlq

3. CONFIGURAR DLQ EN COLA PRINCIPAL
   QUEUE_URL=$(aws sqs get-queue-url --queue-name iku-contact-queue --query 'QueueUrl' --output text)
   DLQ_ARN=$(aws sqs get-queue-attributes --queue-url $(aws sqs get-queue-url --queue-name iku-contact-dlq --query 'QueueUrl' --output text) --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)
   aws sqs set-queue-attributes --queue-url $QUEUE_URL --attributes RedrivePolicy="{\"deadLetterTargetArn\":\"$DLQ_ARN\",\"maxReceiveCount\":3}"

4. PROBAR COLA
   aws sqs send-message --queue-url $QUEUE_URL --message-body '{"test": "message"}'
```

### CRITERIOS DE ÉXITO:
- [ ] Cola iku-contact-queue creada
- [ ] Dead Letter Queue iku-contact-dlq creada
- [ ] Redrive policy configurada (maxReceiveCount: 3)
- [ ] Mensaje de prueba enviado exitosamente
- [ ] URLs de colas documentadas

### VALIDACIÓN INMEDIATA:
```bash
# Verificar colas
aws sqs list-queues

# Verificar atributos
aws sqs get-queue-attributes --queue-url $QUEUE_URL --attribute-names All

# Verificar mensaje
aws sqs receive-message --queue-url $QUEUE_URL
```

---

## 📋 PROMPT-AWS-4: DESPLIEGUE LAMBDA

### CONTEXTO ESPECÍFICO:
```
Amazon SQS configurado y operativo.
- Cola principal creada ✅
- DLQ configurada ✅
- Necesita: Función Lambda para procesamiento
```

### TAREA ATÓMICA:
```
Desplegar AWS Lambda para IKU Cábala Activa:

1. PREPARAR CÓDIGO
   cd aws/lambda
   npm install
   zip -r function.zip . -x "*.git*" "node_modules/.cache/*"

2. CREAR FUNCIÓN
   aws lambda create-function \
     --function-name iku-contact-processor \
     --runtime nodejs18.x \
     --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
     --handler index.handler \
     --zip-file fileb://function.zip \
     --timeout 30 \
     --memory-size 256 \
     --environment Variables='{SES_REGION=us-east-1,CONTACT_EMAIL=contacto@iku-cabalactiva.com,CC_EMAIL=maor@iku-cabalactiva.com}'

3. CONFIGURAR TRIGGER SQS
   QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url $QUEUE_URL --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)
   aws lambda create-event-source-mapping \
     --event-source-arn $QUEUE_ARN \
     --function-name iku-contact-processor \
     --batch-size 10

4. PROBAR FUNCIÓN
   aws lambda invoke --function-name iku-contact-processor --payload '{"Records":[{"body":"{\"nombre\":\"Test\",\"email\":\"test@example.com\",\"mensaje\":\"Test message\"}"}]}' response.json
```

### CRITERIOS DE ÉXITO:
- [ ] Función iku-contact-processor creada
- [ ] Trigger SQS configurado
- [ ] Variables de entorno establecidas
- [ ] Función ejecutada exitosamente
- [ ] Email enviado via SES

### VALIDACIÓN INMEDIATA:
```bash
# Verificar función
aws lambda get-function --function-name iku-contact-processor

# Verificar trigger
aws lambda list-event-source-mappings --function-name iku-contact-processor

# Verificar logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/iku-contact-processor
```

---

## 📋 PROMPT-AWS-5: DESPLIEGUE API GATEWAY

### CONTEXTO ESPECÍFICO:
```
AWS Lambda configurada y operativa.
- Función desplegada ✅
- Trigger SQS funcionando ✅
- Necesita: API Gateway como endpoint público
```

### TAREA ATÓMICA:
```
Configurar API Gateway para IKU Cábala Activa:

1. CREAR API REST
   API_ID=$(aws apigateway create-rest-api --name iku-contact-api --query 'id' --output text)
   ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[0].id' --output text)

2. CREAR RECURSO /contact
   RESOURCE_ID=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part contact --query 'id' --output text)

3. CREAR MÉTODO POST
   aws apigateway put-method --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method POST --authorization-type NONE
   aws apigateway put-method-response --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method POST --status-code 200

4. INTEGRAR CON SQS
   aws apigateway put-integration \
     --rest-api-id $API_ID \
     --resource-id $RESOURCE_ID \
     --http-method POST \
     --type AWS \
     --integration-http-method POST \
     --uri "arn:aws:apigateway:us-east-1:sqs:path/ACCOUNT/iku-contact-queue" \
     --credentials "arn:aws:iam::ACCOUNT:role/api-gateway-sqs-role"

5. DESPLEGAR API
   aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod
```

### CRITERIOS DE ÉXITO:
- [ ] API Gateway iku-contact-api creado
- [ ] Recurso /contact configurado
- [ ] Método POST operativo
- [ ] Integración SQS funcional
- [ ] API desplegada en stage prod

### VALIDACIÓN INMEDIATA:
```bash
# Verificar API
aws apigateway get-rest-api --rest-api-id $API_ID

# Probar endpoint
curl -X POST https://$API_ID.execute-api.us-east-1.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test API","email":"test@example.com","mensaje":"Test from API Gateway"}'
```

---

## 🎯 INSTRUCCIONES DE USO

### Para Ejecutar un Prompt:
1. **Copiar template específico**
2. **Verificar contexto actual**
3. **Ejecutar comandos secuencialmente**
4. **Validar criterios de éxito**
5. **Documentar resultados**

### Para Rollback:
1. **Identificar punto de falla**
2. **Ejecutar comandos de limpieza**
3. **Verificar estado anterior**
4. **Documentar lecciones aprendidas**

---

**🎯 TEMPLATES LISTOS PARA EJECUCIÓN**

Cada template está optimizado para Context-Engineering y garantiza ejecución exitosa con validación inmediata. Gateway"}'
```

---

## 🎯 INSTRUCCIONES DE USO

### Para Ejecutar un Prompt:
1. **Copiar template específico**
2. **Verificar contexto actual**
3. **Ejecutar comandos secuencialmente**
4. **Validar criterios de éxito**
5. **Documentar resultados**

### Para Rollback:
1. **Identificar punto de falla**
2. **Ejecutar comandos de limpieza**
3. **Verificar estado anterior**
4. **Documentar lecciones aprendidas**

---

**🎯 TEMPLATES LISTOS PARA EJECUCIÓN**

Cada template está optimizado para Context-Engineering y garantiza ejecución exitosa con validación inmediata.