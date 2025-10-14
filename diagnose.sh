#!/bin/bash#!/usr/bin/env bash



# Script de diagnóstico en Bash (wrapper para diagnose.py)# Diagnóstico Completo del Sistema

# Utiliza el script de Python existente y añade verificación adicional# Este script ejecuta el diagnóstico completo E2E y muestra el resultado



echo "🔍 Iniciando diagnóstico completo del sistema IKU Cábala Activa..."# Colores para mejor legibilidad

GREEN='\033[0;32m'

# Ejecutar el diagnóstico PythonRED='\033[0;31m'

python diagnose.pyYELLOW='\033[1;33m'

BLUE='\033[0;34m'

# Verificar el resultadoNC='\033[0m' # No Color

PYTHON_STATUS=$?

echo -e "${BLUE}=========================================================${NC}"

# Ejecutar diagnósticos adicionalesecho -e "${YELLOW}🔍 DIAGNÓSTICO COMPREHENSIVO E2E - IKU CABALACTIVA${NC}"

echo -e "\n--- Diagnóstico adicional ---"echo -e "${BLUE}=========================================================${NC}"

echo ""

# Verificar configuración CRM

if [ -f "src/services/crmService.js" ]; then# Verificar que estamos en la raíz del proyecto

  echo "✅ Servicio CRM configurado"if [ ! -f "./package.json" ]; then

else  echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"

  echo "❌ Servicio CRM no encontrado"  echo "   Actualmente en: $(pwd)"

  ADDITIONAL_STATUS=1  exit 1

fifi



# Verificar configuraciones de pago# Crear directorios necesarios

if [ -f ".env" ] || [ -f ".env.production" ]; thenmkdir -p ./docs/diagnostics

  echo "✅ Configuraciones de entorno encontradas"

  # Generar .env.test si no existe

  # Verificar variables de entorno con el script existenteif [ ! -f "./.env" ] && [ ! -f "./.env.production" ] && [ ! -f "./.env.test" ]; then

  if [ -f "scripts/verify-env.js" ]; then  echo -e "${YELLOW}⚠️ No se encontró ningún archivo de variables de entorno${NC}"

    node scripts/verify-env.js  echo -e "${BLUE}ℹ️ Generando archivo .env.test para diagnóstico...${NC}"

    ENV_STATUS=$?  node ./scripts/verify-env.js --generate-test

  fifi

else

  echo "❌ Configuraciones de entorno no encontradas"# Ejecutar diagnóstico completo

  ADDITIONAL_STATUS=1echo -e "${YELLOW}📋 Ejecutando diagnóstico completo...${NC}"

finode ./scripts/diagnose-comprehensive-e2e.js



# Verificar estado de pruebas# Verificar el resultado

if [ -d "tests" ]; thenif [ $? -eq 0 ]; then

  echo "✅ Pruebas configuradas"  echo ""

else  echo -e "${GREEN}✅ Diagnóstico completado exitosamente${NC}"

  echo "❌ Pruebas no encontradas"  echo -e "${BLUE}ℹ️ Consulta el reporte en: docs/diagnostics/e2e-errors-analysis.md${NC}"

  ADDITIONAL_STATUS=1  echo -e "${BLUE}ℹ️ Resultados detallados en: docs/diagnostics/comprehensive-diagnosis.json${NC}"

fi  

  # Mostrar primeras líneas del reporte

# Verificar estado del repositorio Git  echo ""

if git rev-parse --git-dir > /dev/null 2>&1; then  echo -e "${YELLOW}📝 Resumen del diagnóstico:${NC}"

  echo "✅ Repositorio Git configurado"  echo -e "${BLUE}-----------------------------------------${NC}"

    head -n 15 ./docs/diagnostics/e2e-errors-analysis.md

  # Verificar cambios sin confirmar  echo "..."

  if [ -z "$(git status --porcelain)" ]; then  echo -e "${BLUE}-----------------------------------------${NC}"

    echo "✅ No hay cambios sin confirmar"  echo -e "${YELLOW}Ver el reporte completo para más detalles${NC}"

  elseelse

    echo "⚠️ Hay cambios sin confirmar"  echo ""

  fi  echo -e "${RED}❌ Error durante el diagnóstico${NC}"

else  echo "Revisa los mensajes de error anteriores"

  echo "❌ No es un repositorio Git"fi

  ADDITIONAL_STATUS=1

fiecho ""

echo -e "${BLUE}=========================================================${NC}"

# Estado finalecho -e "${YELLOW}🏁 FIN DEL DIAGNÓSTICO${NC}"

if [ $PYTHON_STATUS -eq 0 ] && [ -z "$ADDITIONAL_STATUS" ]; thenecho -e "${BLUE}=========================================================${NC}"
  echo -e "\n✅ DIAGNÓSTICO COMPLETO: Sistema en buen estado."
  exit 0
else
  echo -e "\n⚠️ DIAGNÓSTICO COMPLETO: Se encontraron problemas que requieren atención."
  exit 1
fi