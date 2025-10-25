#!/bin/bash

echo "📊 CONFIGURANDO CLOUDWATCH MONITOREO"
echo "===================================="

# Crear dashboard
echo "📈 Creando dashboard CloudWatch..."
aws cloudwatch put-dashboard \
    --dashboard-name IKU-Contact-Dashboard \
    --dashboard-body '{
        "widgets": [
            {
                "type": "metric",
                "x": 0,
                "y": 0,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        ["AWS/Lambda", "Invocations", "FunctionName", "iku-contact-processor"],
                        [".", "Errors", ".", "."],
                        [".", "Duration", ".", "."]
                    ],
                    "period": 300,
                    "stat": "Sum",
                    "region": "us-east-1",
                    "title": "Lambda Metrics"
                }
            },
            {
                "type": "metric",
                "x": 0,
                "y": 6,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        ["AWS/SQS", "NumberOfMessagesSent", "QueueName", "iku-contact-queue"],
                        [".", "NumberOfMessagesReceived", ".", "."],
                        [".", "ApproximateNumberOfMessages", ".", "."]
                    ],
                    "period": 300,
                    "stat": "Sum",
                    "region": "us-east-1",
                    "title": "SQS Metrics"
                }
            },
            {
                "type": "metric",
                "x": 0,
                "y": 12,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        ["AWS/ApiGateway", "Count", "ApiName", "iku-contact-api"],
                        [".", "Latency", ".", "."],
                        [".", "4XXError", ".", "."],
                        [".", "5XXError", ".", "."]
                    ],
                    "period": 300,
                    "stat": "Sum",
                    "region": "us-east-1",
                    "title": "API Gateway Metrics"
                }
            }
        ]
    }'

# Crear alarma de errores Lambda
echo "🚨 Creando alarmas de error..."
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
    --evaluation-periods 1 \
    --alarm-actions "arn:aws:sns:us-east-1:$(aws sts get-caller-identity --query Account --output text):iku-alerts"

# Crear alarma de latencia API Gateway
aws cloudwatch put-metric-alarm \
    --alarm-name "IKU-API-High-Latency" \
    --alarm-description "API Gateway high latency" \
    --metric-name Latency \
    --namespace AWS/ApiGateway \
    --statistic Average \
    --period 300 \
    --threshold 1000 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=ApiName,Value=iku-contact-api \
    --evaluation-periods 2

# Crear alarma de mensajes en DLQ
aws cloudwatch put-metric-alarm \
    --alarm-name "IKU-DLQ-Messages" \
    --alarm-description "Messages in Dead Letter Queue" \
    --metric-name ApproximateNumberOfMessages \
    --namespace AWS/SQS \
    --statistic Average \
    --period 300 \
    --threshold 1 \
    --comparison-operator GreaterThanOrEqualToThreshold \
    --dimensions Name=QueueName,Value=iku-contact-dlq \
    --evaluation-periods 1

echo ""
echo "✅ CloudWatch configurado exitosamente"
echo ""
echo "📊 RECURSOS DE MONITOREO CREADOS:"
echo "- Dashboard: IKU-Contact-Dashboard"
echo "- Alarma: IKU-Lambda-Errors"
echo "- Alarma: IKU-API-High-Latency"
echo "- Alarma: IKU-DLQ-Messages"
echo ""
echo "🔗 Acceso al dashboard:"
echo "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=IKU-Contact-Dashboard"
echo ""
echo "✅ INFRAESTRUCTURA AWS COMPLETADA"
echo ""
echo "🔄 Siguiente paso: Actualizar frontend"
echo "Ejecuta: ./scripts/update-frontend.sh"