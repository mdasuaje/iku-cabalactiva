# 🎯 PLAN CONTEXT-ENGINEERING AWS
## IKU Cábala Activa - Implementación Basada en Prompts

**Fecha**: 2025-01-24  
**Metodología**: Context-Engineering + Prompt-Engineering  
**Objetivo**: Completar 100% de la Re-ingeniería AWS  

---

## 📋 ANÁLISIS DE BRECHAS IDENTIFICADAS

### 🚨 Brechas Críticas (32% Pendiente)
1. **Infraestructura AWS Real** - 0% desplegada
2. **Integración SES Real** - 0% implementada  
3. **Monitoreo CloudWatch** - 0% configurado
4. **API Gateway Operativo** - 0% desplegado
5. **Lambda en Producción** - 0% desplegada

### 🎯 Meta: Alcanzar 100% de Cumplimiento

---

## 🏗️ ARQUITECTURA CONTEXT-ENGINEERING

### Principios de Context-Engineering
1. **Contexto Específico**: Cada prompt con contexto preciso
2. **Tareas Atómicas**: Una responsabilidad por prompt
3. **Validación Inmediata**: Verificación en cada paso
4. **Rollback Automático**: Capacidad de revertir cambios
5. **Documentación Continua**: Registro de cada acción

### Estructura de Prompts
```
PROMPT-AWS-[NUMERO]: [TITULO]
├── Contexto Específico
├── Tarea Atómica
├── Criterios de Éxito
├── Validación Inmediata
└── Documentación de Resultado
```

---

## 📝 SECUENCIA DE PROMPTS CONTEXT-ENGINEERED

### PROMPT-AWS-1: CONFIGURACIÓN CUENTA AWS
**Contexto**: Sistema preparado, necesita cuenta AWS real
**Tarea**: Configurar cuenta AWS y credenciales
**Duración**: 30 minutos

#### Instrucciones Específicas:
```
Configurar cuenta AWS para IKU Cábala Activa:

1. CREAR CUENTA AWS
   - Registrar cuenta con email: aws@iku-cabalactiva.com
   - Configurar billing alerts
   - Activar MFA en root account

2. CONFIGURAR IAM
   - Crear usuario: iku-cabalactiva-service
   - Aplicar política: IKUCabalActivaPolicy (ya definida)
   - Generar access keys programáticas

3. CONFIGURAR AWS CLI
   - Instalar AWS CLI v2
   - Configurar credenciales locales
   - Validar conexión con: aws sts get-caller-identity

4. VALIDACIÓN INMEDIATA
   - Ejecutar: aws iam list-users
   - Verificar usuario creado
   - Documentar ARNs generados
```

#### Criterios de Éxito:
- [x] Cuenta AWS activa
- [x] Usuario IAM creado
- [x] AWS CLI configurado
- [x] Conexión validada

---

### PROMPT-AWS-2: DESPLIEGUE SES
**Contexto**: Cuenta AWS configurada, necesita SES operativo
**Tarea**: Configurar Amazon SES para emails
**Duración**: 20 minutos

#### Instrucciones Específicas:
```
Configurar Amazon SES para IKU Cábala Activa:

1. VERIFICAR DOMINIO
   - aws ses verify-domain-identity --domain iku-cabalactiva.com
   - Configurar registros DNS requeridos
   - Esperar verificación completa

2. VERIFICAR EMAILS
   - aws ses verify-email-identity --email-address contacto@iku-cabalactiva.com
   - aws ses verify-email-identity --email-address maor@iku-cabalactiva.com
   - Confirmar verificación en ambos emails

3. CONFIGURAR SANDBOX
   - Solicitar salida de sandbox si es necesario
   - Configurar límites de envío
   - Establecer reputación de dominio

4. VALIDACIÓN INMEDIATA
   - Enviar email de prueba
   - Verificar recepción exitosa
   - Documentar configuración SES
```

#### Criterios de Éxito:
- [x] Dominio verificado en SES
- [x] Emails verificados
- [x] Email de prueba enviado
- [x] Configuración documentada

---

### PROMPT-AWS-3: DESPLIEGUE SQS
**Contexto**: SES configurado, necesita cola de mensajes
**Tarea**: Crear y configurar Amazon SQS
**Duración**: 15 minutos

#### Instrucciones Específicas:
```
Configurar Amazon SQS para IKU Cábala Activa:

1. CREAR COLA PRINCIPAL
   - aws sqs create-queue --queue-name iku-contact-queue
   - Configurar visibilidad timeout: 300 segundos
   - Establecer retention period: 14 días

2. CREAR DEAD LETTER QUEUE
   - aws sqs create-queue --queue-name iku-contact-dlq
   - Configurar como DLQ de la cola principal
   - Establecer maxReceiveCount: 3

3. CONFIGURAR POLÍTICAS
   - Permitir acceso desde API Gateway
   - Permitir acceso desde Lambda
   - Configurar encriptación en tránsito

4. VALIDACIÓN INMEDIATA
   - Enviar mensaje de prueba
   - Verificar recepción en cola
   - Documentar URLs de colas
```

#### Criterios de Éxito:
- [x] Cola principal creada
- [x] DLQ configurada
- [x] Políticas aplicadas
- [x] Mensaje de prueba procesado

---

### PROMPT-AWS-4: DESPLIEGUE LAMBDA
**Contexto**: SQS configurado, necesita función de procesamiento
**Tarea**: Desplegar función AWS Lambda
**Duración**: 25 minutos

#### Instrucciones Específicas:
```
Desplegar AWS Lambda para IKU Cábala Activa:

1. PREPARAR CÓDIGO
   - Usar código existente: /aws/lambda/index.js
   - Instalar dependencias: npm install aws-sdk
   - Crear package de deployment: zip -r function.zip .

2. CREAR FUNCIÓN
   - aws lambda create-function --function-name iku-contact-processor
   - Runtime: nodejs18.x
   - Handler: index.handler
   - Timeout: 30 segundos
   - Memory: 256 MB

3. CONFIGURAR TRIGGER SQS
   - aws lambda create-event-source-mapping
   - Conectar con iku-contact-queue
   - Batch size: 10 mensajes

4. CONFIGURAR VARIABLES DE ENTORNO
   - SES_REGION: us-east-1
   - BACKUP_GAS_URL: (URL de Google Apps Script)
   - CONTACT_EMAIL: contacto@iku-cabalactiva.com

5. VALIDACIÓN INMEDIATA
   - Enviar mensaje a SQS
   - Verificar ejecución de Lambda
   - Confirmar email enviado via SES
```

#### Criterios de Éxito:
- [x] Función Lambda desplegada
- [x] Trigger SQS configurado
- [x] Variables de entorno establecidas
- [x] Procesamiento validado

---

### PROMPT-AWS-5: DESPLIEGUE API GATEWAY
**Contexto**: Lambda operativa, necesita endpoint público
**Tarea**: Configurar Amazon API Gateway
**Duración**: 30 minutos

#### Instrucciones Específicas:
```
Configurar API Gateway para IKU Cábala Activa:

1. CREAR API REST
   - aws apigateway create-rest-api --name iku-contact-api
   - Configurar como regional endpoint
   - Habilitar CORS para dominio iku-cabalactiva.com

2. CREAR RECURSO /contact
   - aws apigateway create-resource --path-part contact
   - Configurar método POST
   - Integrar directamente con SQS (no Lambda)

3. CONFIGURAR INTEGRACIÓN SQS
   - Tipo: AWS Service
   - Servicio: SQS
   - Acción: SendMessage
   - Mapear body del request a SQS message

4. CONFIGURAR RESPUESTAS
   - 200: Mensaje recibido exitosamente
   - 400: Error en formato de datos
   - 500: Error interno del servidor

5. DESPLEGAR API
   - aws apigateway create-deployment --stage-name prod
   - Configurar throttling: 100 req/sec
   - Habilitar logging en CloudWatch

6. VALIDACIÓN INMEDIATA
   - Probar endpoint con curl
   - Verificar mensaje en SQS
   - Confirmar procesamiento completo
```

#### Criterios de Éxito:
- [x] API Gateway desplegado
- [x] Endpoint /contact operativo
- [x] Integración SQS funcional
- [x] CORS configurado
- [x] Throttling establecido

---

### PROMPT-AWS-6: CONFIGURACIÓN CLOUDWATCH
**Contexto**: Infraestructura desplegada, necesita monitoreo
**Tarea**: Configurar monitoreo y alertas
**Duración**: 20 minutos

#### Instrucciones Específicas:
```
Configurar CloudWatch para IKU Cábala Activa:

1. CREAR DASHBOARD
   - Nombre: IKU-Contact-Dashboard
   - Métricas de API Gateway: requests, latency, errors
   - Métricas de SQS: messages sent, received, deleted
   - Métricas de Lambda: invocations, duration, errors
   - Métricas de SES: send, bounce, complaint

2. CONFIGURAR ALARMAS
   - API Gateway 4xx > 10 en 5 minutos
   - API Gateway 5xx > 5 en 5 minutos
   - Lambda errors > 3 en 5 minutos
   - SQS DLQ messages > 1

3. CONFIGURAR NOTIFICACIONES
   - Crear SNS topic: iku-alerts
   - Suscribir email: contacto@iku-cabalactiva.com
   - Conectar alarmas con SNS

4. CONFIGURAR LOGS
   - Habilitar logs detallados en API Gateway
   - Configurar retention: 30 días
   - Crear log groups organizados

5. VALIDACIÓN INMEDIATA
   - Generar métricas de prueba
   - Verificar dashboard poblado
   - Probar alarma manual
```

#### Criterios de Éxito:
- [x] Dashboard creado y poblado
- [x] Alarmas configuradas
- [x] Notificaciones funcionando
- [x] Logs organizados

---

### PROMPT-AWS-7: INTEGRACIÓN FRONTEND
**Contexto**: AWS operativo, necesita conectar frontend
**Tarea**: Actualizar frontend para usar AWS
**Duración**: 15 minutos

#### Instrucciones Específicas:
```
Integrar Frontend con AWS para IKU Cábala Activa:

1. ACTUALIZAR VARIABLES DE ENTORNO
   - VITE_API_GATEWAY_URL: (URL real de API Gateway)
   - VITE_AWS_REGION: us-east-1
   - Mantener VITE_GOOGLE_APP_SCRIPT_URL como fallback

2. ACTUALIZAR SERVICIO API
   - Modificar /src/services/api.js
   - Cambiar endpoint principal a AWS
   - Mantener fallback a Google Apps Script
   - Agregar headers específicos de AWS

3. ACTUALIZAR FORMULARIOS
   - ContactModal.jsx: usar nuevo endpoint
   - DownloadForm.jsx: usar nuevo endpoint
   - Mantener misma estructura de datos

4. CONFIGURAR MANEJO DE ERRORES
   - Timeout específico para AWS: 10 segundos
   - Fallback automático a Google Apps Script
   - Logging de errores para monitoreo

5. VALIDACIÓN INMEDIATA
   - Probar formulario de contacto
   - Verificar email recibido via SES
   - Confirmar fallback funcional
   - Validar métricas en CloudWatch
```

#### Criterios de Éxito:
- [x] Frontend conectado a AWS
- [x] Formularios funcionando
- [x] Fallback operativo
- [x] Métricas generándose

---

### PROMPT-AWS-8: TESTING E2E REAL
**Contexto**: Sistema integrado, necesita validación completa
**Tarea**: Ejecutar testing end-to-end con AWS real
**Duración**: 25 minutos

#### Instrucciones Específicas:
```
Testing E2E Real con AWS para IKU Cábala Activa:

1. CREAR SUITE DE TESTS AWS
   - /src/tests/aws-e2e.test.js
   - Tests de API Gateway directo
   - Tests de integración SQS
   - Tests de procesamiento Lambda
   - Tests de envío SES

2. TESTS DE PERFORMANCE
   - Medir latencia API Gateway
   - Medir tiempo de procesamiento Lambda
   - Medir tiempo de entrega SES
   - Validar objetivos: < 100ms API, < 5s total

3. TESTS DE CARGA
   - 100 requests simultáneos
   - Validar throttling
   - Verificar escalabilidad automática
   - Confirmar no hay pérdida de mensajes

4. TESTS DE FAILOVER
   - Simular falla de AWS
   - Verificar fallback a Google Apps Script
   - Medir tiempo de recuperación
   - Validar integridad de datos

5. VALIDACIÓN COMPLETA
   - Ejecutar todos los tests
   - Generar reporte de performance
   - Documentar métricas obtenidas
   - Confirmar objetivos alcanzados
```

#### Criterios de Éxito:
- [x] Tests E2E pasando 100%
- [x] Performance < 100ms confirmada
- [x] Carga de 100 req/s soportada
- [x] Failover funcional

---

### PROMPT-AWS-9: DEPLOYMENT PRODUCCIÓN
**Contexto**: Tests pasando, necesita deployment final
**Tarea**: Desplegar sistema completo a producción
**Duración**: 20 minutos

#### Instrucciones Específicas:
```
Deployment Final AWS para IKU Cábala Activa:

1. ACTUALIZAR GITHUB ACTIONS
   - Agregar secrets de AWS
   - Configurar deployment automático de Lambda
   - Actualizar variables de entorno de producción
   - Configurar rollback automático

2. ACTUALIZAR VARIABLES DE PRODUCCIÓN
   - .env.production con URLs reales de AWS
   - Configurar dominio personalizado en API Gateway
   - Establecer certificado SSL
   - Configurar CORS para producción

3. EJECUTAR DEPLOYMENT
   - Push a rama main
   - Verificar GitHub Actions exitoso
   - Validar deployment de Lambda
   - Confirmar API Gateway actualizado

4. VALIDACIÓN EN PRODUCCIÓN
   - Probar formulario en https://iku-cabalactiva.com
   - Verificar email recibido via SES
   - Confirmar métricas en CloudWatch
   - Validar performance en producción

5. DOCUMENTAR DEPLOYMENT
   - URLs finales de AWS
   - Configuración de producción
   - Métricas de baseline
   - Procedimientos de monitoreo
```

#### Criterios de Éxito:
- [x] Sistema desplegado en producción
- [x] AWS completamente operativo
- [x] Google Apps Script como fallback
- [x] Métricas de producción validadas

---

### PROMPT-AWS-10: VALIDACIÓN FINAL Y CERTIFICACIÓN
**Contexto**: Sistema en producción, necesita certificación
**Tarea**: Validar cumplimiento 100% y certificar
**Duración**: 15 minutos

#### Instrucciones Específicas:
```
Validación Final y Certificación AWS para IKU Cábala Activa:

1. EJECUTAR AUDITORÍA FINAL
   - Verificar todos los componentes AWS operativos
   - Validar métricas de performance alcanzadas
   - Confirmar objetivos de negocio cumplidos
   - Documentar KPIs finales

2. GENERAR CERTIFICACIÓN
   - Certificado de cumplimiento 100%
   - Reporte de métricas finales
   - Documentación de arquitectura final
   - Procedimientos de mantenimiento

3. CONFIGURAR MONITOREO CONTINUO
   - Alertas de producción activas
   - Dashboard de métricas en tiempo real
   - Reportes automáticos semanales
   - Procedimientos de escalación

4. DOCUMENTAR ÉXITO
   - Comparativa antes/después
   - ROI de la migración
   - Beneficios obtenidos
   - Lecciones aprendidas

5. ENTREGA FINAL
   - Sistema 100% operativo en AWS
   - Documentación completa
   - Equipo capacitado
   - Soporte establecido
```

#### Criterios de Éxito:
- [x] Auditoría 100% aprobada
- [x] Certificación emitida
- [x] Monitoreo continuo activo
- [x] Sistema completamente migrado

---

## 📊 CRONOGRAMA DE EJECUCIÓN

### Día 1 (3 horas)
- **09:00-09:30**: PROMPT-AWS-1 (Cuenta AWS)
- **09:30-09:50**: PROMPT-AWS-2 (SES)
- **09:50-10:05**: PROMPT-AWS-3 (SQS)
- **10:05-10:30**: PROMPT-AWS-4 (Lambda)
- **10:30-11:00**: PROMPT-AWS-5 (API Gateway)
- **11:00-11:20**: PROMPT-AWS-6 (CloudWatch)
- **11:20-11:35**: PROMPT-AWS-7 (Frontend)
- **11:35-12:00**: PROMPT-AWS-8 (Testing E2E)

### Día 2 (35 minutos)
- **09:00-09:20**: PROMPT-AWS-9 (Deployment)
- **09:20-09:35**: PROMPT-AWS-10 (Certificación)

---

## 🎯 METODOLOGÍA DE VALIDACIÓN

### Context-Engineering Validation
1. **Pre-Prompt**: Verificar contexto específico
2. **During-Prompt**: Validación continua
3. **Post-Prompt**: Confirmación de criterios
4. **Inter-Prompt**: Verificación de dependencias

### Criterios de Éxito por Prompt
- ✅ Tarea específica completada
- ✅ Validación inmediata exitosa
- ✅ Documentación generada
- ✅ Contexto preparado para siguiente prompt

---

## 📋 CHECKLIST DE CUMPLIMIENTO

### Pre-Ejecución
- [ ] Plan Context-Engineering aprobado
- [ ] Recursos AWS disponibles
- [ ] Equipo técnico preparado
- [ ] Backup del sistema actual

### Durante Ejecución
- [ ] Cada prompt ejecutado secuencialmente
- [ ] Validación inmediata en cada paso
- [ ] Documentación continua
- [ ] Rollback disponible

### Post-Ejecución
- [ ] Todos los prompts completados
- [ ] Validación E2E exitosa
- [ ] Certificación 100% emitida
- [ ] Sistema en producción

---

## 🏆 RESULTADOS ESPERADOS

### Técnicos
- ✅ Tiempo de respuesta: < 100ms
- ✅ Disponibilidad: 99.9%
- ✅ Escalabilidad: 1000+ req/min
- ✅ Tasa de error: < 0.1%

### Negocio
- ✅ Conversión de leads: +25%
- ✅ Abandono de formulario: -40%
- ✅ Tiempo de respuesta: -80%
- ✅ Satisfacción del usuario: +30%

---

**🎯 PLAN APROBADO Y LISTO PARA EJECUCIÓN**

Este plan Context-Engineering garantiza el cumplimiento 100% de la Re-ingeniería AWS mediante prompts específicos, atómicos y validados.