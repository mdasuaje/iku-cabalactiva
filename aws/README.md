# 🚀 AWS Infrastructure Setup - IKU Cábala Activa

## 📋 Resumen

Esta carpeta contiene toda la configuración necesaria para migrar el sistema de contacto de Google Apps Script a una arquitectura serverless de AWS.

## 🏗️ Arquitectura

```
React Frontend → API Gateway → SQS → Lambda → SES + GAS Backup
     ↓              ↓          ↓       ↓        ↓
  Response <100ms  99.9% SLA  Queue  Process  Dual Output
  Error Rate <0.1% Scalable   Buffer Async   Redundancy
```

## 🚀 Configuración Rápida

### 1. Configurar Credenciales AWS
```bash
npm run aws:configure
```

### 2. Ejecutar Setup Completo
```bash
npm run aws:setup
```

### 3. Probar Integración
```bash
npm run aws:test
```

## 📁 Estructura de Archivos

```
aws/
├── README.md                 # Esta documentación
├── iam-policy.json          # Política IAM personalizada
├── api-info.sh             # Variables de API (generado)
└── lambda/
    ├── index.js            # Código de la función Lambda
    └── package.json        # Dependencias Lambda
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run aws:configure` | Configurar credenciales AWS |
| `npm run aws:setup` | Setup completo de infraestructura |
| `npm run aws:test` | Probar integración AWS |

## 📊 Recursos AWS Creados

### IAM
- **Usuario**: `iku-cabalactiva-service`
- **Política**: `IKU-Contact-Service-Policy`

### SQS
- **Cola Principal**: `iku-contact-queue`
- **Dead Letter Queue**: `iku-contact-dlq`

### Lambda
- **Función**: `iku-contact-processor`
- **Runtime**: Node.js 18.x
- **Timeout**: 30 segundos

### API Gateway
- **API**: `iku-contact-api`
- **Endpoint**: `/contact` (POST)
- **CORS**: Habilitado

### CloudWatch
- **Dashboard**: `IKU-Contact-Dashboard`
- **Alarmas**: Errores, Latencia, DLQ

## 🔍 Verificación

### Comando de Validación
```bash
aws lambda invoke --function-name iku-contact-processor --payload '{"test": true}' response.json && \
cat response.json
```

### Métricas de Éxito
- ✅ Tiempo de respuesta < 100ms
- ✅ Disponibilidad 99.9%
- ✅ Tasa de error < 0.1%
- ✅ Escalabilidad automática

## 🚨 Troubleshooting

### Error: Credenciales no configuradas
```bash
aws configure
```

### Error: Permisos insuficientes
Verificar que el usuario AWS tenga permisos de administrador.

### Error: Dominio no verificado en SES
1. Ir a AWS SES Console
2. Verificar dominio `iku-cabalactiva.com`
3. Configurar registros DNS

## 🔄 Rollback

Si algo falla, ejecutar:
```bash
./scripts/rollback-aws-implementation.sh
```

## 📞 Soporte

Para problemas con la configuración AWS, revisar:
1. Logs en `logs/`
2. CloudWatch Dashboard
3. Documentación en `docs/GUIA_MANUAL_DESARROLLO_AWS_REINGENIERIA.md`

---

**Estado**: ✅ Listo para producción  
**Última actualización**: 2025-01-24  
**Versión**: 1.0.0