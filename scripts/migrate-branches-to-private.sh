#!/bin/bash

# Script para migrar ramas del repositorio público al repositorio privado
# Este script debe ejecutarse desde el directorio del repositorio privado

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Se requiere la URL del repositorio público${NC}"
    echo "Uso: $0 <url-repositorio-público>"
    echo "Ejemplo: $0 git@github.com:mdasuaje/iku-cabalactiva.git"
    exit 1
fi

PUBLIC_REPO_URL=$1

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Migración de Ramas${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Repositorio público:${NC} ${PUBLIC_REPO_URL}"
echo ""

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Este script debe ejecutarse desde un repositorio git${NC}"
    exit 1
fi

# Ramas que NO deben ser migradas (ya que deben permanecer en el público)
SKIP_BRANCHES=("main" "gh-pages")

# Verificar si el remote 'public' ya existe
if git remote get-url public > /dev/null 2>&1; then
    echo -e "${YELLOW}Remote 'public' ya existe. Actualizando...${NC}"
    git remote set-url public "$PUBLIC_REPO_URL"
else
    echo -e "${YELLOW}Agregando remote 'public'...${NC}"
    git remote add public "$PUBLIC_REPO_URL"
fi

echo -e "${YELLOW}Obteniendo ramas del repositorio público...${NC}"
git fetch public

echo ""
echo -e "${GREEN}Iniciando migración de ramas...${NC}"
echo ""

# Obtener todas las ramas del repositorio público
branches=$(git ls-remote --heads public | awk '{print $2}' | sed 's|refs/heads/||')

migrated_count=0
skipped_count=0
error_count=0

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
        echo -e "  ⏭️  Omitiendo: ${branch} (debe permanecer en repositorio público)"
        skipped_count=$((skipped_count + 1))
        continue
    fi
    
    echo -e "  🔄 Migrando: ${branch}"
    
    # Verificar si la rama ya existe localmente
    if git show-ref --verify --quiet "refs/heads/$branch"; then
        echo -e "     ${YELLOW}La rama ya existe localmente, actualizando...${NC}"
        git checkout "$branch"
        # Fetch y reset para asegurar que coincida exactamente con la remota
        git fetch public "$branch" || {
            echo -e "     ${RED}Error al obtener la rama${NC}"
            error_count=$((error_count + 1))
            continue
        }
        git reset --hard "public/$branch" || {
            echo -e "     ${RED}Error al actualizar la rama${NC}"
            error_count=$((error_count + 1))
            continue
        }
    else
        # Crear la rama local desde la rama remota del repositorio público
        git checkout -b "$branch" "public/$branch" || {
            echo -e "     ${RED}Error al crear la rama${NC}"
            error_count=$((error_count + 1))
            continue
        }
    fi
    
    # Push la rama al repositorio privado (origin)
    git push origin "$branch" || {
        echo -e "     ${RED}Error al hacer push de la rama${NC}"
        error_count=$((error_count + 1))
        continue
    }
    
    echo -e "     ${GREEN}✅ Migrada exitosamente${NC}"
    migrated_count=$((migrated_count + 1))
    
done <<< "$branches"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Migración completada${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Ramas migradas: ${GREEN}${migrated_count}${NC}"
echo -e "Ramas omitidas: ${YELLOW}${skipped_count}${NC}"
echo -e "Errores: ${RED}${error_count}${NC}"
echo ""

if [ $error_count -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las ramas fueron migradas exitosamente${NC}"
    echo ""
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo "1. Verificar que todas las ramas están en el repositorio privado"
    echo "2. Ejecutar: ./scripts/verify-branches.sh"
    echo "3. Una vez verificado, limpiar el repositorio público: ./scripts/cleanup-public-branches.sh"
else
    echo -e "${RED}⚠️  Hubo errores durante la migración. Por favor, revisar los mensajes anteriores.${NC}"
fi

echo ""
