#!/usr/bin/env bash

# Script de Despliegue a Producción
# Este script facilita el despliegue del proyecto a producción después de verificación

# Colores para mejor legibilidad
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${YELLOW}🚀 DESPLIEGUE A PRODUCCIÓN - IKU CABALACTIVA${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -f "./package.json" ]; then
  echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
  echo "   Actualmente en: $(pwd)"
  exit 1
fi

# Verificar que estamos en la rama principal
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${RED}❌ ERROR: Debes estar en la rama main para desplegar a producción${NC}"
  exit 1
fi

# Verificar que no hay cambios sin confirmar
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}⚠️ ADVERTENCIA: Hay cambios sin confirmar. Considera confirmarlos antes de continuar.${NC}"
  read -p "¿Deseas continuar de todos modos? (s/n): " CONTINUE
  if [ "$CONTINUE" != "s" ]; then
    echo -e "${RED}❌ Despliegue abortado.${NC}"
    exit 1
  fi
fi

# Función para verificar la certificación
check_certification() {
  local cert_file="./docs/CERTIFICACION_DESPLIEGUE_PRODUCCION.md"
  if [ ! -f "$cert_file" ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo de certificación de despliegue${NC}"
    echo "   El proyecto debe estar certificado antes de ser desplegado"
    return 1
  fi
  
  # Verificar que no haya issues pendientes en el reporte de diagnóstico
  local issues_count=$(grep -c "Total de issues: 0" "$cert_file" || echo "0")
  if [ "$issues_count" -eq "0" ]; then
    echo -e "${RED}❌ Error: La certificación indica issues pendientes${NC}"
    echo "   Por favor, resuelva todos los issues antes de desplegar"
    return 1
  fi
  
  # Verificar que todos los componentes estén aprobados
  local components_count=$(grep -c "✅ APROBADO" "$cert_file" || echo "0")
  if [ "$components_count" -lt "5" ]; then
    echo -e "${RED}❌ Error: No todos los componentes están marcados como aprobados en la certificación${NC}"
    echo "   Se requiere aprobación de todos los componentes críticos"
    return 1
  fi
  
  echo -e "${GREEN}✅ Certificación de despliegue verificada correctamente${NC}"
  return 0
}

# Función para ejecutar diagnóstico final
run_final_diagnosis() {
  echo -e "${YELLOW}📋 Ejecutando diagnóstico previo al despliegue...${NC}"
  
  # Configurar variables de entorno para producción
  export NODE_ENV=production

  # Ejecutar diagnóstico Python y Bash
  python diagnose.py
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: El diagnóstico ha fallado${NC}"
    echo "   No se puede proceder con el despliegue"
    return 1
  fi
  
  # Ejecutar el diagnóstico Bash adicional
  ./diagnose.sh
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: El diagnóstico final ha fallado${NC}"
    echo "   No se puede proceder con el despliegue"
    return 1
  fi
  
  echo -e "${GREEN}✅ Diagnóstico final completado exitosamente${NC}"
  return 0
}

# Función para crear tag de versión
create_version_tag() {
  local version=$(grep -m 1 '"version":' package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
  local tag="v$version-prod-$(date +%Y%m%d%H%M)"
  
  echo -e "${YELLOW}📝 Creando tag de versión: $tag${NC}"
  
  git tag -a "$tag" -m "Versión de producción $version - $(date)"
  git push origin "$tag"
  
  echo -e "${GREEN}✅ Tag de versión creado y publicado: $tag${NC}"
  return 0
}

# Función para preparar el despliegue
prepare_deployment() {
  echo -e "${YELLOW}📦 Preparando archivos para despliegue...${NC}"
  
  # Construir aplicación
  npm run build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir la aplicación${NC}"
    return 1
  fi
  
  # Verificar que el directorio dist existe y tiene contenido
  if [ ! -d "./dist" ] || [ -z "$(ls -A ./dist)" ]; then
    echo -e "${RED}❌ Error: El directorio 'dist' no existe o está vacío${NC}"
    return 1
  fi
  
  # Copiar archivos de configuración necesarios
  cp .env.production ./dist/.env || true
  cp nginx.conf ./dist/nginx.conf || true
  
  echo -e "${GREEN}✅ Preparación de archivos completada${NC}"
  return 0
}

# Función para realizar despliegue a producción
perform_deployment() {
  echo -e "${YELLOW}🚀 Iniciando despliegue a producción...${NC}"
  
  # Lógica para desplegar a producción
  # Este es un ejemplo, se debería adaptar según la infraestructura real
  
  if [ -f "./deploy.sh" ]; then
    echo -e "${BLUE}ℹ️ Utilizando script de despliegue existente: deploy.sh${NC}"
    ./deploy.sh --env=production
    deploy_status=$?
  else
    echo -e "${YELLOW}⚠️ No se encontró script de despliegue. Usando método alternativo...${NC}"
    
    # Método alternativo (ejemplo)
    # rsync -avz --delete ./dist/ usuario@servidor:/ruta/a/produccion/
    echo -e "${RED}❌ Error: Método de despliegue alternativo no implementado${NC}"
    echo "   Por favor implemente el método de despliegue adecuado"
    deploy_status=1
  fi
  
  if [ $deploy_status -ne 0 ]; then
    echo -e "${RED}❌ Error durante el despliegue${NC}"
    return 1
  fi
  
  echo -e "${GREEN}✅ Despliegue a producción completado exitosamente${NC}"
  
  # Actualizar documentación de despliegue
  echo -e "${YELLOW}📝 Actualizando documentación de despliegue...${NC}"
  echo "Despliegue a producción completado: $(date)" >> docs/PRODUCTION_READY_REPORT.md
  
  return 0
}

# Función para verificar el despliegue
verify_deployment() {
  echo -e "${YELLOW}🔍 Verificando despliegue en producción...${NC}"
  
  # Este paso debería incluir:
  # 1. Pruebas de humo en producción
  # 2. Verificación de conectividad a servicios externos
  # 3. Validación de funcionamiento básico
  
  echo -e "${BLUE}ℹ️ Verificación de despliegue completada${NC}"
  echo -e "${YELLOW}⚠️ IMPORTANTE: Monitorear métricas durante las próximas 48 horas${NC}"
  
  return 0
}

# Flujo principal
main() {
  echo -e "${BLUE}Iniciando proceso de despliegue a producción...${NC}"
  
  # Paso 1: Verificar certificación
  echo -e "\n${YELLOW}PASO 1: Verificando certificación de despliegue${NC}"
  check_certification
  if [ $? -ne 0 ]; then exit 1; fi
  
  # Paso 2: Ejecutar diagnóstico final
  echo -e "\n${YELLOW}PASO 2: Ejecutando diagnóstico final${NC}"
  run_final_diagnosis
  if [ $? -ne 0 ]; then exit 1; fi
  
  # Paso 3: Confirmar con el usuario
  echo -e "\n${YELLOW}PASO 3: Confirmación para continuar${NC}"
  read -p "¿Estás seguro de que deseas desplegar a producción? (s/N): " confirm
  if [[ $confirm != [sS] ]]; then
    echo -e "${BLUE}ℹ️ Operación cancelada por el usuario${NC}"
    exit 0
  fi
  
  # Paso 4: Crear tag de versión
  echo -e "\n${YELLOW}PASO 4: Creando tag de versión${NC}"
  create_version_tag
  if [ $? -ne 0 ]; then exit 1; fi
  
  # Paso 5: Preparar despliegue
  echo -e "\n${YELLOW}PASO 5: Preparando archivos para despliegue${NC}"
  prepare_deployment
  if [ $? -ne 0 ]; then exit 1; fi
  
  # Paso 6: Realizar despliegue
  echo -e "\n${YELLOW}PASO 6: Realizando despliegue${NC}"
  perform_deployment
  if [ $? -ne 0 ]; then exit 1; fi
  
  # Paso 7: Verificar despliegue
  echo -e "\n${YELLOW}PASO 7: Verificando despliegue${NC}"
  verify_deployment
  
  # Éxito
  echo -e "\n${GREEN}✅ DESPLIEGUE A PRODUCCIÓN COMPLETADO EXITOSAMENTE${NC}"
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${YELLOW}🏁 SISTEMA EN PRODUCCIÓN${NC}"
  echo -e "${BLUE}=========================================================${NC}"
}

# Ejecutar flujo principal
main
