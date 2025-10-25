#!/bin/bash

echo "🚀 CONFIGURACIÓN COMPLETA INFRAESTRUCTURA AWS"
echo "============================================="
echo ""

# Verificar credenciales
echo "🔍 Verificando credenciales AWS..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ Error: Credenciales AWS no configuradas"
    echo ""
    echo "Para configurar credenciales, ejecuta:"
    echo "./scripts/setup-aws-credentials.sh"
    exit 1
fi

echo "✅ Credenciales AWS verificadas"
echo ""

# Crear directorio para logs
mkdir -p logs

# Ejecutar configuración paso a paso
echo "📋 PASO 1: Configurando IAM y SQS..."
./scripts/continue-aws-setup.sh 2>&1 | tee logs/aws-setup.log

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ Error en configuración IAM/SQS"
    exit 1
fi

echo ""
echo "📋 PASO 2: Configurando API Gateway..."
./scripts/setup-api-gateway.sh 2>&1 | tee logs/api-gateway.log

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ Error en configuración API Gateway"
    exit 1
fi

echo ""
echo "📋 PASO 3: Configurando CloudWatch..."
./scripts/setup-cloudwatch.sh 2>&1 | tee logs/cloudwatch.log

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ Error en configuración CloudWatch"
    exit 1
fi

echo ""
echo "🎉 INFRAESTRUCTURA AWS COMPLETADA EXITOSAMENTE"
echo ""
echo "📊 RECURSOS CREADOS:"
echo "- ✅ Usuario IAM: iku-cabalactiva-service"
echo "- ✅ Política IAM: IKU-Contact-Service-Policy"
echo "- ✅ Cola SQS: iku-contact-queue"
echo "- ✅ Dead Letter Queue: iku-contact-dlq"
echo "- ✅ Función Lambda: iku-contact-processor"
echo "- ✅ API Gateway: iku-contact-api"
echo "- ✅ Dashboard CloudWatch: IKU-Contact-Dashboard"
echo "- ✅ Alarmas de monitoreo configuradas"
echo ""

# Cargar información de la API
source aws/api-info.sh

echo "🔗 ENDPOINT CONFIGURADO:"
echo "$API_ENDPOINT"
echo ""
echo "🔄 SIGUIENTE PASO:"
echo "Actualizar variables de entorno en .env.local:"
echo "VITE_AWS_API_GATEWAY_URL=$API_ENDPOINT"
echo ""
echo "Luego ejecutar: npm run test:aws"