#!/bin/bash

# Script para listar las ramas que deben ser migradas del repositorio público al privado
# Solo main y gh-pages deben permanecer en el repositorio público

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Análisis de Ramas en Repositorio${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Ramas que deben permanecer en el repositorio público
ALLOWED_BRANCHES=("main" "gh-pages")

echo -e "${GREEN}Ramas que DEBEN permanecer en el repositorio público:${NC}"
for branch in "${ALLOWED_BRANCHES[@]}"; do
    echo -e "  ✅ ${branch}"
done
echo ""

echo -e "${YELLOW}Obteniendo lista de ramas remotas...${NC}"
echo ""

# Obtener todas las ramas remotas
branches=$(git ls-remote --heads origin | awk '{print $2}' | sed 's|refs/heads/||')

echo -e "${RED}Ramas que DEBEN ser migradas al repositorio privado:${NC}"
echo ""

migrate_count=0
while IFS= read -r branch; do
    # Verificar si la rama está en la lista de permitidas
    is_allowed=false
    for allowed in "${ALLOWED_BRANCHES[@]}"; do
        if [ "$branch" = "$allowed" ]; then
            is_allowed=true
            break
        fi
    done
    
    # Si no está permitida, debe ser migrada
    if [ "$is_allowed" = false ]; then
        echo -e "  ❌ ${branch}"
        migrate_count=$((migrate_count + 1))
    fi
done <<< "$branches"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}Total de ramas a migrar: ${migrate_count}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $migrate_count -gt 0 ]; then
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo "1. Ejecutar desde el REPOSITORIO PRIVADO:"
    echo "   ./scripts/migrate-branches-to-private.sh git@github.com:mdasuaje/iku-cabalactiva.git"
    echo "2. Verificar la migración: ./scripts/verify-branches.sh"
    echo "3. Limpiar repositorio público: ./scripts/cleanup-public-branches.sh"
    echo ""
else
    echo -e "${GREEN}✅ El repositorio solo contiene las ramas permitidas.${NC}"
    echo ""
fi
