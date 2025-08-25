#!/bin/bash

# IKU Cábala Activa - Sistema de Restauración
# Restaura un respaldo específico del proyecto

set -e

BACKUP_DIR="$HOME/backups/iku-cabalactiva"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Sistema de Restauración - IKU Cábala Activa${NC}"

# Verificar si existe directorio de respaldos
if [[ ! -d "$BACKUP_DIR" ]]; then
    echo -e "${RED}❌ No se encontró directorio de respaldos: $BACKUP_DIR${NC}"
    exit 1
fi

# Listar respaldos disponibles
echo -e "${YELLOW}📋 Respaldos disponibles:${NC}"
ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null | awk '{print NR". "$9" ("$5" bytes) - "$6" "$7" "$8}' || {
    echo -e "${RED}❌ No se encontraron respaldos${NC}"
    exit 1
}

# Seleccionar respaldo
read -p "Ingresa el número del respaldo a restaurar: " backup_num
backup_file=$(ls "$BACKUP_DIR"/*.tar.gz 2>/dev/null | sed -n "${backup_num}p")

if [[ -z "$backup_file" ]]; then
    echo -e "${RED}❌ Selección inválida${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Restaurando: $(basename "$backup_file")${NC}"

# Verificar checksum
checksum_file="${backup_file%.tar.gz}.sha256"
if [[ -f "$checksum_file" ]]; then
    echo -e "${YELLOW}🔍 Verificando integridad...${NC}"
    cd "$BACKUP_DIR"
    sha256sum -c "$checksum_file" --ignore-missing || {
        echo -e "${RED}❌ Checksum inválido${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Integridad verificada${NC}"
fi

# Crear directorio de restauración
restore_dir="$HOME/restored_$(basename "$backup_file" .tar.gz)"
mkdir -p "$restore_dir"

# Extraer respaldo
echo -e "${YELLOW}📂 Extrayendo respaldo...${NC}"
tar -xzf "$backup_file" -C "$restore_dir"

echo -e "${GREEN}✅ Respaldo restaurado en: $restore_dir${NC}"
echo -e "${BLUE}💡 Para usar el proyecto restaurado:${NC}"
echo -e "   cd $restore_dir/iku-cabalactiva"
echo -e "   npm install"
echo -e "   npm run dev"