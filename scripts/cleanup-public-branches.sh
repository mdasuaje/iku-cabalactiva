#!/bin/bash

# Script para limpiar ramas del repositorio público
# ADVERTENCIA: Este script elimina ramas permanentemente del repositorio público
# Solo debe ejecutarse después de verificar que todas las ramas están respaldadas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}========================================${NC}"
echo -e "${RED}  LIMPIEZA DE REPOSITORIO PÚBLICO${NC}"
echo -e "${RED}========================================${NC}"
echo ""
echo -e "${RED}⚠️  ADVERTENCIA ⚠️${NC}"
echo ""
echo -e "${YELLOW}Este script eliminará ramas del repositorio público.${NC}"
echo -e "${YELLOW}Asegúrese de que todas las ramas estén respaldadas en el repositorio privado.${NC}"
echo ""

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Este script debe ejecutarse desde un repositorio git${NC}"
    exit 1
fi

# Solicitar confirmación
read -p "¿Ha verificado que todas las ramas están respaldadas? (escriba 'SI' para continuar): " confirmation

if [ "$confirmation" != "SI" ]; then
    echo -e "${YELLOW}Operación cancelada.${NC}"
    echo "Por favor, ejecutar primero: ./scripts/verify-branches.sh"
    exit 0
fi

echo ""
read -p "¿Está COMPLETAMENTE SEGURO de que desea eliminar las ramas? (escriba 'ELIMINAR' para continuar): " final_confirmation

if [ "$final_confirmation" != "ELIMINAR" ]; then
    echo -e "${YELLOW}Operación cancelada.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Iniciando limpieza...${NC}"
echo ""

# Ramas que deben permanecer en el repositorio público
KEEP_BRANCHES=("main" "gh-pages")

# Obtener todas las ramas remotas
branches=$(git ls-remote --heads origin | awk '{print $2}' | sed 's|refs/heads/||')

deleted_count=0
kept_count=0
error_count=0

while IFS= read -r branch; do
    # Verificar si la rama debe mantenerse
    should_keep=false
    for keep in "${KEEP_BRANCHES[@]}"; do
        if [ "$branch" = "$keep" ]; then
            should_keep=true
            break
        fi
    done
    
    if [ "$should_keep" = true ]; then
        echo -e "  ✅ Manteniendo: ${branch}"
        kept_count=$((kept_count + 1))
        continue
    fi
    
    echo -e "  🗑️  Eliminando: ${branch}"
    
    # Eliminar la rama remota
    if git push origin --delete "$branch" 2>/dev/null; then
        echo -e "     ${GREEN}✅ Eliminada exitosamente${NC}"
        deleted_count=$((deleted_count + 1))
    else
        echo -e "     ${RED}❌ Error al eliminar (puede requerir permisos de administrador)${NC}"
        error_count=$((error_count + 1))
    fi
    
done <<< "$branches"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Limpieza completada${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Ramas eliminadas: ${GREEN}${deleted_count}${NC}"
echo -e "Ramas mantenidas: ${YELLOW}${kept_count}${NC}"
echo -e "Errores: ${RED}${error_count}${NC}"
echo ""

if [ $error_count -eq 0 ]; then
    echo -e "${GREEN}✅ Repositorio público limpiado exitosamente${NC}"
    echo ""
    echo -e "${YELLOW}El repositorio público ahora solo contiene:${NC}"
    git ls-remote --heads origin | awk '{print $2}' | sed 's|refs/heads/||' | while read -r b; do
        echo "  - $b"
    done
    echo ""
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo "1. Verificar que las GitHub Pages siguen funcionando"
    echo "2. Actualizar la configuración de protección de ramas en GitHub"
    echo "3. Actualizar la documentación del equipo"
else
    echo -e "${RED}⚠️  Hubo errores durante la limpieza${NC}"
    echo ""
    echo -e "${YELLOW}Posibles causas:${NC}"
    echo "  - Falta de permisos de administrador en el repositorio"
    echo "  - Protección de ramas configurada"
    echo "  - Problemas de conectividad"
    echo ""
    echo -e "${YELLOW}Solución:${NC}"
    echo "  - Verificar permisos en GitHub"
    echo "  - Eliminar manualmente las ramas con errores desde GitHub"
fi

echo ""
