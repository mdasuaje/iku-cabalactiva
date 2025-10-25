#!/bin/bash

echo "🌐 CONFIGURANDO API GATEWAY"
echo "=========================="

# Crear API Gateway
echo "📡 Creando API Gateway..."
API_ID=$(aws apigateway create-rest-api \
    --name iku-contact-api \
    --description "API para formulario de contacto IKU Cábala Activa" \
    --query 'id' --output text)

echo "✅ API Gateway creado: $API_ID"

# Obtener root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[?path==`/`].id' --output text)

# Crear recurso /contact
echo "📝 Creando recurso /contact..."
CONTACT_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part contact \
    --query 'id' --output text)

# Crear método POST
echo "🔧 Configurando método POST..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE

# Configurar CORS para OPTIONS
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE

# Obtener URL de la cola SQS
QUEUE_URL=$(aws sqs get-queue-url --queue-name iku-contact-queue --query 'QueueUrl' --output text)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Configurar integración con SQS
echo "🔗 Configurando integración con SQS..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method POST \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:sqs:path/$ACCOUNT_ID/iku-contact-queue" \
    --credentials "arn:aws:iam::$ACCOUNT_ID:role/api-gateway-sqs-role" \
    --request-parameters '{
        "integration.request.header.Content-Type": "'\''application/x-amz-json-1.0'\''"
    }' \
    --request-templates '{
        "application/json": "Action=SendMessage&MessageBody=$input.body"
    }'

# Configurar respuesta de integración
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method POST \
    --status-code 200 \
    --response-templates '{
        "application/json": "{\"message\": \"Mensaje enviado exitosamente\"}"
    }'

# Configurar respuesta del método
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method POST \
    --status-code 200 \
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Origin": false,
        "method.response.header.Access-Control-Allow-Headers": false,
        "method.response.header.Access-Control-Allow-Methods": false
    }'

# Configurar CORS para OPTIONS
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{
        "application/json": "{\"statusCode\": 200}"
    }'

aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Origin": false,
        "method.response.header.Access-Control-Allow-Headers": false,
        "method.response.header.Access-Control-Allow-Methods": false
    }'

aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $CONTACT_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Origin": "'\''*'\''",
        "method.response.header.Access-Control-Allow-Headers": "'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''",
        "method.response.header.Access-Control-Allow-Methods": "'\''POST,OPTIONS'\''"
    }'

# Desplegar API
echo "🚀 Desplegando API..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod

# Mostrar URL del endpoint
API_ENDPOINT="https://$API_ID.execute-api.us-east-1.amazonaws.com/prod/contact"

echo ""
echo "✅ API Gateway configurado exitosamente"
echo ""
echo "📊 INFORMACIÓN DEL ENDPOINT:"
echo "API ID: $API_ID"
echo "Endpoint URL: $API_ENDPOINT"
echo ""
echo "🔄 Siguiente paso: Configurar CloudWatch"
echo "Ejecuta: ./scripts/setup-cloudwatch.sh"

# Guardar información para uso posterior
echo "export API_ID=$API_ID" > aws/api-info.sh
echo "export API_ENDPOINT=$API_ENDPOINT" >> aws/api-info.sh