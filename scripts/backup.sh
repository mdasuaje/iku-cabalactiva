#!/bin/bash

# IKU Cábala Activa - Sistema de Respaldo Profesional
# Autor: Sistema Automatizado
# Fecha: $(date +%Y-%m-%d)

set -e

# Configuración
PROJECT_NAME="iku-cabalactiva"
BACKUP_DIR="$HOME/backups/$PROJECT_NAME"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${PROJECT_NAME}_backup_${TIMESTAMP}"
CURRENT_DIR=$(pwd)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Iniciando respaldo completo de $PROJECT_NAME${NC}"

# Crear directorio de respaldos
mkdir -p "$BACKUP_DIR"

# 1. Git - Verificar estado y crear respaldo
echo -e "${YELLOW}📋 Verificando estado de Git...${NC}"
git status --porcelain > /dev/null 2>&1 || { echo -e "${RED}❌ No es un repositorio Git${NC}"; exit 1; }

if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  Hay cambios sin commit. Creando stash...${NC}"
    git stash push -m "Backup stash $TIMESTAMP"
fi

# 2. Crear archivo comprimido del proyecto
echo -e "${YELLOW}📦 Creando archivo comprimido...${NC}"
cd ..
tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env.local' \
    "$PROJECT_NAME"

# 3. Respaldo de Git (bundle)
echo -e "${YELLOW}🔗 Creando bundle de Git...${NC}"
cd "$CURRENT_DIR"
git bundle create "$BACKUP_DIR/${BACKUP_NAME}.bundle" --all

# 4. Exportar configuraciones importantes
echo -e "${YELLOW}⚙️  Exportando configuraciones...${NC}"
cat > "$BACKUP_DIR/${BACKUP_NAME}_info.txt" << EOF
# IKU Cábala Activa - Información del Respaldo
Fecha: $(date)
Commit: $(git rev-parse HEAD)
Branch: $(git branch --show-current)
Node Version: $(node --version)
NPM Version: $(npm --version)
Sistema: $(uname -a)

# Dependencias principales:
$(npm list --depth=0 2>/dev/null | head -20)

# Estado del repositorio:
$(git log --oneline -5)
EOF

# 5. Respaldo de variables de entorno (sin valores sensibles)
if [[ -f ".env.local" ]]; then
    echo -e "${YELLOW}🔐 Respaldando estructura de variables de entorno...${NC}"
    grep -E '^[A-Z_]+=.*' .env.local | sed 's/=.*/=***HIDDEN***/' > "$BACKUP_DIR/${BACKUP_NAME}_env_structure.txt"
fi

# 6. Crear checksum
echo -e "${YELLOW}🔍 Generando checksums...${NC}"
cd "$BACKUP_DIR"
sha256sum "${BACKUP_NAME}.tar.gz" > "${BACKUP_NAME}.sha256"
sha256sum "${BACKUP_NAME}.bundle" >> "${BACKUP_NAME}.sha256"

# 7. Limpiar respaldos antiguos (mantener últimos 5)
echo -e "${YELLOW}🧹 Limpiando respaldos antiguos...${NC}"
ls -t ${PROJECT_NAME}_backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm -f
ls -t ${PROJECT_NAME}_backup_*.bundle 2>/dev/null | tail -n +6 | xargs -r rm -f
ls -t ${PROJECT_NAME}_backup_*.txt 2>/dev/null | tail -n +6 | xargs -r rm -f
ls -t ${PROJECT_NAME}_backup_*.sha256 2>/dev/null | tail -n +6 | xargs -r rm -f

# 8. Mostrar resumen
BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}✅ Respaldo completado exitosamente${NC}"
echo -e "${BLUE}📁 Ubicación: $BACKUP_DIR${NC}"
echo -e "${BLUE}📦 Archivo: ${BACKUP_NAME}.tar.gz ($BACKUP_SIZE)${NC}"
echo -e "${BLUE}🔗 Git Bundle: ${BACKUP_NAME}.bundle${NC}"
echo -e "${BLUE}📋 Info: ${BACKUP_NAME}_info.txt${NC}"

# 9. Opcional: Subir a repositorio remoto
read -p "¿Deseas hacer push al repositorio remoto? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⬆️  Subiendo cambios al repositorio remoto...${NC}"
    git push origin $(git branch --show-current)
    echo -e "${GREEN}✅ Push completado${NC}"
fi

echo -e "${GREEN}🎉 Respaldo completo finalizado: $BACKUP_NAME${NC}"