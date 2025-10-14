#!/bin/bash

# Script para verificar el despliegue en producción
# Ejecuta comprobaciones básicas para asegurar que el sitio está disponible y funcional

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}🔍 VERIFICACIÓN POST-DESPLIEGUE - IKU CABALACTIVA${NC}"
echo -e "${BLUE}==========================================================${NC}"

# Verificamos las dependencias necesarias
echo -e "${BLUE}Verificando dependencias...${NC}"
npm list node-fetch chalk 2>/dev/null || npm install --no-save node-fetch chalk

# Ejecutar script de verificación en Node
echo -e "${BLUE}Iniciando verificación...${NC}"
node --experimental-modules --es-module-specifier-resolution=node scripts/verify-deployment.js

# Comprobación de sitio básica con curl como respaldo
echo -e "${BLUE}Realizando verificación básica con curl...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://iku-cabalactiva.com)

if [ $HTTP_CODE -ge 200 ] && [ $HTTP_CODE -lt 300 ]; then
  echo -e "${GREEN}✅ El sitio está respondiendo con código HTTP: $HTTP_CODE ${NC}"
else
  echo -e "${RED}❌ El sitio NO está respondiendo correctamente. Código HTTP: $HTTP_CODE ${NC}"
fi

echo -e "${BLUE}==========================================================${NC}"
echo -e "${GREEN}✅ VERIFICACIÓN COMPLETA${NC}"
echo -e "${BLUE}==========================================================${NC}"
echo -e "${YELLOW}ℹ️  Recuerda monitorizar el rendimiento durante las próximas 48 horas${NC}"