#!/bin/bash

# Script para verificar que todas las ramas del repositorio público
# están respaldadas en el repositorio privado antes de la limpieza

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Verificación de Migración de Ramas${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Este script debe ejecutarse desde un repositorio git${NC}"
    exit 1
fi

# Verificar que el remote 'public' existe
if ! git remote get-url public > /dev/null 2>&1; then
    echo -e "${RED}Error: Remote 'public' no encontrado${NC}"
    echo "Este script debe ejecutarse desde el repositorio PRIVADO."
    echo "Por favor, ejecutar primero desde el repositorio privado:"
    echo "  git remote add public <url-repositorio-público>"
    exit 1
fi

# Ramas que deben permanecer solo en el público
SKIP_BRANCHES=("main" "gh-pages")

echo -e "${YELLOW}Obteniendo ramas del repositorio público...${NC}"
git fetch public

echo -e "${YELLOW}Obteniendo ramas del repositorio privado (origin)...${NC}"
git fetch origin

echo ""
echo -e "${GREEN}Verificando migración...${NC}"
echo ""

# Obtener todas las ramas del repositorio público
public_branches=$(git ls-remote --heads public | awk '{print $2}' | sed 's|refs/heads/||')

# Obtener todas las ramas del repositorio privado
private_branches=$(git ls-remote --heads origin | awk '{print $2}' | sed 's|refs/heads/||')

missing_count=0
verified_count=0
skipped_count=0

while IFS= read -r branch; do
    # Verificar si la rama debe ser omitida
    should_skip=false
    for skip in "${SKIP_BRANCHES[@]}"; do
        if [ "$branch" = "$skip" ]; then
            should_skip=true
            break
        fi
    done
    
    if [ "$should_skip" = true ]; then
        echo -e "  ⏭️  ${branch} - (permanece en repositorio público)"
        skipped_count=$((skipped_count + 1))
        continue
    fi
    
    # Verificar si la rama existe en el repositorio privado
    if echo "$private_branches" | grep -q "^${branch}$"; then
        echo -e "  ✅ ${branch} - Respaldada en repositorio privado"
        verified_count=$((verified_count + 1))
    else
        echo -e "  ${RED}❌ ${branch} - NO ENCONTRADA en repositorio privado${NC}"
        missing_count=$((missing_count + 1))
    fi
    
done <<< "$public_branches"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Verificación completada${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Ramas verificadas: ${GREEN}${verified_count}${NC}"
echo -e "Ramas omitidas: ${YELLOW}${skipped_count}${NC}"
echo -e "Ramas faltantes: ${RED}${missing_count}${NC}"
echo ""

if [ $missing_count -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las ramas han sido respaldadas exitosamente${NC}"
    echo ""
    echo -e "${YELLOW}Es seguro proceder con la limpieza del repositorio público${NC}"
    echo "Ejecutar: ./scripts/cleanup-public-branches.sh"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  ADVERTENCIA: Hay ramas sin respaldar${NC}"
    echo ""
    echo -e "${YELLOW}NO es seguro proceder con la limpieza hasta que todas las ramas estén respaldadas${NC}"
    echo "Por favor, ejecutar nuevamente: ./scripts/migrate-branches-to-private.sh <url-repositorio-público>"
    echo ""
    exit 1
fi
