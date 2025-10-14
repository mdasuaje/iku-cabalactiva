#!/usr/bin/env bash

# Diagnóstico Completo del Sistema
# Este script ejecuta el diagnóstico completo E2E y muestra el resultado

# Colores para mejor legibilidad
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${YELLOW}🔍 DIAGNÓSTICO COMPREHENSIVO E2E - IKU CABALACTIVA${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -f "./package.json" ]; then
  echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
  echo "   Actualmente en: $(pwd)"
  exit 1
fi

# Crear directorios necesarios
mkdir -p ./docs/diagnostics

# Generar .env.test si no existe
if [ ! -f "./.env" ] && [ ! -f "./.env.production" ] && [ ! -f "./.env.test" ]; then
  echo -e "${YELLOW}⚠️ No se encontró ningún archivo de variables de entorno${NC}"
  echo -e "${BLUE}ℹ️ Generando archivo .env.test para diagnóstico...${NC}"
  node ./scripts/verify-env.js --generate-test
fi

# Ejecutar diagnóstico completo
echo -e "${YELLOW}📋 Ejecutando diagnóstico completo...${NC}"
node ./scripts/diagnose-comprehensive-e2e.js

# Verificar el resultado
if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Diagnóstico completado exitosamente${NC}"
  echo -e "${BLUE}ℹ️ Consulta el reporte en: docs/diagnostics/e2e-errors-analysis.md${NC}"
  echo -e "${BLUE}ℹ️ Resultados detallados en: docs/diagnostics/comprehensive-diagnosis.json${NC}"
  
  # Mostrar primeras líneas del reporte
  echo ""
  echo -e "${YELLOW}📝 Resumen del diagnóstico:${NC}"
  echo -e "${BLUE}-----------------------------------------${NC}"
  head -n 15 ./docs/diagnostics/e2e-errors-analysis.md
  echo "..."
  echo -e "${BLUE}-----------------------------------------${NC}"
  echo -e "${YELLOW}Ver el reporte completo para más detalles${NC}"
else
  echo ""
  echo -e "${RED}❌ Error durante el diagnóstico${NC}"
  echo "Revisa los mensajes de error anteriores"
fi

echo ""
echo -e "${BLUE}=========================================================${NC}"
echo -e "${YELLOW}🏁 FIN DEL DIAGNÓSTICO${NC}"
echo -e "${BLUE}=========================================================${NC}"