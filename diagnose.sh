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

# Ejecutar diagnóstico Python
echo -e "${YELLOW}📋 Ejecutando diagnóstico Python...${NC}"
python diagnose.py
PYTHON_STATUS=$?

# Ejecutar diagnóstico completo E2E
echo -e "${YELLOW}📋 Ejecutando diagnóstico completo E2E...${NC}"
node ./scripts/diagnose-comprehensive-e2e.js
E2E_STATUS=$?

# Ejecutar diagnósticos adicionales
echo -e "\n${YELLOW}--- Diagnóstico adicional ---${NC}"

# Verificar configuración CRM
if [ -f "src/services/crmService.js" ]; then
  echo -e "${GREEN}✅ Servicio CRM configurado${NC}"
else
  echo -e "${RED}❌ Servicio CRM no encontrado${NC}"
  ADDITIONAL_STATUS=1
fi

# Verificar configuraciones de pago
if [ -f ".env" ] || [ -f ".env.production" ]; then
  echo -e "${GREEN}✅ Configuraciones de entorno encontradas${NC}"
  
  # Verificar variables de entorno con el script existente
  if [ -f "scripts/verify-env.js" ]; then
    node scripts/verify-env.js
    ENV_STATUS=$?
  fi
else
  echo -e "${RED}❌ Configuraciones de entorno no encontradas${NC}"
  ADDITIONAL_STATUS=1
fi

# Verificar estado de pruebas
if [ -d "tests" ]; then
  echo -e "${GREEN}✅ Pruebas configuradas${NC}"
else
  echo -e "${RED}❌ Pruebas no encontradas${NC}"
  ADDITIONAL_STATUS=1
fi

# Verificar estado del repositorio Git
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Repositorio Git configurado${NC}"
  
  # Verificar cambios sin confirmar
  if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ No hay cambios sin confirmar${NC}"
  else
    echo -e "${YELLOW}⚠️ Hay cambios sin confirmar${NC}"
  fi
else
  echo -e "${RED}❌ No es un repositorio Git${NC}"
  ADDITIONAL_STATUS=1
fi

# Verificar resultados del diagnóstico
if [ $E2E_STATUS -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Diagnóstico E2E completado exitosamente${NC}"
  echo -e "${BLUE}ℹ️ Consulta el reporte en: docs/diagnostics/e2e-errors-analysis.md${NC}"
  echo -e "${BLUE}ℹ️ Resultados detallados en: docs/diagnostics/comprehensive-diagnosis.json${NC}"
  
  # Mostrar primeras líneas del reporte
  if [ -f "./docs/diagnostics/e2e-errors-analysis.md" ]; then
    echo ""
    echo -e "${YELLOW}📝 Resumen del diagnóstico:${NC}"
    echo -e "${BLUE}-----------------------------------------${NC}"
    head -n 15 ./docs/diagnostics/e2e-errors-analysis.md
    echo "..."
    echo -e "${BLUE}-----------------------------------------${NC}"
    echo -e "${YELLOW}Ver el reporte completo para más detalles${NC}"
  fi
else
  echo ""
  echo -e "${RED}❌ Error durante el diagnóstico E2E${NC}"
  echo "Revisa los mensajes de error anteriores"
fi

echo ""
echo -e "${BLUE}=========================================================${NC}"

# Estado final
if [ $PYTHON_STATUS -eq 0 ] && [ $E2E_STATUS -eq 0 ] && [ -z "$ADDITIONAL_STATUS" ]; then
  echo -e "${GREEN}✅ DIAGNÓSTICO COMPLETO: Sistema en buen estado.${NC}"
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${YELLOW}🏁 FIN DEL DIAGNÓSTICO${NC}"
  echo -e "${BLUE}=========================================================${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️ DIAGNÓSTICO COMPLETO: Se encontraron problemas que requieren atención.${NC}"
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${YELLOW}🏁 FIN DEL DIAGNÓSTICO${NC}"
  echo -e "${BLUE}=========================================================${NC}"
  exit 1
fi
