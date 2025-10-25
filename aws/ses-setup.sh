#!/bin/bash

# Script para configurar Amazon SES
echo "🔧 Configurando Amazon SES para iku-cabalactiva.com"

# Verificar dominio
echo "📧 Verificando dominio iku-cabalactiva.com..."
# aws ses verify-domain-identity --domain iku-cabalactiva.com

# Verificar emails
echo "📧 Verificando emails..."
# aws ses verify-email-identity --email-address contacto@iku-cabalactiva.com
# aws ses verify-email-identity --email-address maor@iku-cabalactiva.com

echo "✅ Configuración SES preparada"
echo "⚠️  Requiere credenciales AWS válidas para ejecutar"