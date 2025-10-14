#!/bin/bash

# Script para limpiar archivos temporales y de registro que no deberían estar en el repositorio
# Este script elimina archivos físicamente, pero no los elimina del control de versiones
# Para eliminarlos del control de versiones, ejecutar: git rm --cached [archivos]

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}🧹 LIMPIEZA DE ARCHIVOS TEMPORALES - IKU CABALACTIVA${NC}"
echo -e "${BLUE}==========================================================${NC}"

# Directorio raíz del proyecto
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Función para eliminar archivos según un patrón
clean_files() {
  local pattern="$1"
  local description="$2"
  local exclude_pattern="${3:-none}"
  
  echo -e "${BLUE}Buscando ${description}...${NC}"
  
  if [ "$exclude_pattern" = "none" ]; then
    files_found=$(find . -name "$pattern" -type f | grep -v "node_modules" | grep -v ".git")
  else
    files_found=$(find . -name "$pattern" -type f | grep -v "node_modules" | grep -v ".git" | grep -v "$exclude_pattern")
  fi
  
  if [ -n "$files_found" ]; then
    echo -e "${YELLOW}Encontrados $(echo "$files_found" | wc -l) archivos:${NC}"
    echo "$files_found"
    
    # Preguntar antes de eliminar
    read -p "¿Deseas eliminar estos archivos? (s/n): " confirm
    if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
      echo "$files_found" | xargs rm -f
      echo -e "${GREEN}✅ Archivos eliminados${NC}"
    else
      echo -e "${YELLOW}⚠️ No se eliminaron los archivos${NC}"
    fi
  else
    echo -e "${GREEN}✓ No se encontraron archivos${NC}"
  fi
  
  echo ""
}

# Limpiar archivos de registro
clean_files "*.log" "archivos de registro"

# Limpiar archivos temporales
clean_files "*.tmp" "archivos temporales"

# Limpiar archivos de diagnóstico
clean_files "diagnose-*.json" "resultados de diagnóstico" "scripts/"

# Limpiar resultados de pruebas
clean_files "test-results/*.json" "resultados de pruebas"
clean_files "test-results/*.xml" "resultados de pruebas XML"

# Limpiar archivos de respaldo
clean_files "*-backup.*" "archivos de respaldo" "scripts/"
clean_files "*.bak" "archivos de respaldo"

# Limpiar archivos de caché
clean_files ".eslintcache" "archivos de caché de ESLint"

# Limpiar archivos de cobertura temporales
clean_files "coverage-temp/*" "archivos de cobertura temporales"

echo -e "${BLUE}==========================================================${NC}"
echo -e "${GREEN}✅ LIMPIEZA COMPLETADA${NC}"
echo -e "${BLUE}==========================================================${NC}"