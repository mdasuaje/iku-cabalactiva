#!/bin/bash

# 🚀 DEPLOYMENT FINAL - IKU Cábala Activa
# Script de deployment completo para producción

set -e

echo "🚀 INICIANDO DEPLOYMENT FINAL"
echo "================================"

# Validar entorno
echo "📋 Validando entorno..."
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production no encontrado"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar tests críticos
echo "🧪 Ejecutando tests críticos..."
npm run test:api
npm run test:validate

# Build del proyecto
echo "🔨 Construyendo proyecto..."
npm run build

# Validar build
echo "✅ Validando build..."
if [ ! -d "dist" ]; then
    echo "❌ Error: Build fallido"
    exit 1
fi

# Verificar archivos críticos
echo "🔍 Verificando archivos críticos..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: index.html no encontrado"
    exit 1
fi

# Deployment a GitHub Pages
echo "🌐 Desplegando a GitHub Pages..."
npm run deploy

echo "✅ DEPLOYMENT COMPLETADO EXITOSAMENTE"
echo "🌟 Sitio disponible en: https://iku-cabalactiva.com"