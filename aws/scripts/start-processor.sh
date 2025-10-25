#!/bin/bash
# Script para iniciar procesador automático
# IKU Cábala Activa - AWS Integration

echo "🚀 Iniciando procesador automático IKU Cábala Activa..."

while true; do
    echo "⏰ $(date): Procesando cola SQS..."
    cd /workspaces/iku-cabalactiva
    node aws/scripts/process-queue.js
    echo "⏳ Esperando 5 minutos..."
    sleep 300
done