#!/bin/bash

echo "🚀 CONTINUANDO CONFIGURACIÓN AWS INFRAESTRUCTURA"
echo "==============================================="

# Verificar credenciales
echo "🔍 Verificando credenciales AWS..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ Error: Credenciales AWS no configuradas correctamente"
    echo "Ejecuta: aws configure"
    exit 1
fi

echo "✅ Credenciales AWS verificadas"

# Crear política IAM
echo "📋 Creando política IAM..."
aws iam create-policy \
    --policy-name IKU-Contact-Service-Policy \
    --policy-document file://aws/iam-policy.json \
    --description "Política para el servicio de contacto IKU Cábala Activa"

# Crear usuario IAM
echo "👤 Creando usuario IAM..."
aws iam create-user \
    --user-name iku-cabalactiva-service \
    --path "/service-accounts/"

# Obtener ARN de la política
POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`IKU-Contact-Service-Policy`].Arn' --output text)

# Adjuntar política al usuario
echo "🔗 Adjuntando política al usuario..."
aws iam attach-user-policy \
    --user-name iku-cabalactiva-service \
    --policy-arn $POLICY_ARN

# Crear Dead Letter Queue
echo "📬 Creando Dead Letter Queue..."
aws sqs create-queue \
    --queue-name iku-contact-dlq \
    --attributes VisibilityTimeoutSeconds=300,MessageRetentionPeriod=1209600

# Obtener URL de DLQ
DLQ_URL=$(aws sqs get-queue-url --queue-name iku-contact-dlq --query 'QueueUrl' --output text)
DLQ_ARN=$(aws sqs get-queue-attributes --queue-url $DLQ_URL --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

# Crear cola principal con DLQ
echo "📮 Creando cola principal SQS..."
aws sqs create-queue \
    --queue-name iku-contact-queue \
    --attributes '{
        "VisibilityTimeoutSeconds": "300",
        "MessageRetentionPeriod": "1209600",
        "RedrivePolicy": "{\"deadLetterTargetArn\":\"'$DLQ_ARN'\",\"maxReceiveCount\":3}"
    }'

# Crear función Lambda
echo "⚡ Creando función Lambda..."
cd aws/lambda
zip -r iku-contact-processor.zip .
cd ../..

aws lambda create-function \
    --function-name iku-contact-processor \
    --runtime nodejs18.x \
    --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
    --handler index.handler \
    --zip-file fileb://aws/lambda/iku-contact-processor.zip \
    --timeout 30 \
    --memory-size 256

# Configurar trigger SQS para Lambda
QUEUE_URL=$(aws sqs get-queue-url --queue-name iku-contact-queue --query 'QueueUrl' --output text)
QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url $QUEUE_URL --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

aws lambda create-event-source-mapping \
    --function-name iku-contact-processor \
    --event-source-arn $QUEUE_ARN \
    --batch-size 10

echo "✅ Infraestructura AWS creada exitosamente"
echo ""
echo "📊 RECURSOS CREADOS:"
echo "- Usuario IAM: iku-cabalactiva-service"
echo "- Política IAM: IKU-Contact-Service-Policy"
echo "- Cola SQS: iku-contact-queue"
echo "- Dead Letter Queue: iku-contact-dlq"
echo "- Función Lambda: iku-contact-processor"
echo ""
echo "🔄 Siguiente paso: Configurar API Gateway"
echo "Ejecuta: ./scripts/setup-api-gateway.sh"