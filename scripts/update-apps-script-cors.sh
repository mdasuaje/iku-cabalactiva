#!/bin/bash

# Script para actualizar la versión de Google Apps Script con soporte CORS
# Este script reemplaza el archivo existente en Google Apps Script con la versión corregida

# Colores para mensajes
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
AZUL='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${AZUL}============================================${NC}"
echo -e "${VERDE}🔄 Actualizando Google Apps Script con CORS${NC}"
echo -e "${AZUL}============================================${NC}"

# Verificar que existe el archivo fuente
ARCHIVO_FUENTE="/workspaces/iku-cabalactiva/scripts/google-apps-script-cors-fixed.js"
if [ ! -f "$ARCHIVO_FUENTE" ]; then
  echo -e "${ROJO}❌ Error: No se encuentra el archivo fuente: $ARCHIVO_FUENTE${NC}"
  exit 1
fi

# Verificar que existe el archivo destino
ARCHIVO_DESTINO="/workspaces/iku-cabalactiva/scripts/google-apps-script-zero-trust.js"
if [ ! -f "$ARCHIVO_DESTINO" ]; then
  echo -e "${AMARILLO}⚠️ Advertencia: No se encuentra el archivo destino. Se creará uno nuevo.${NC}"
fi

# Realizar copia de seguridad
if [ -f "$ARCHIVO_DESTINO" ]; then
  BACKUP_FILE="$ARCHIVO_DESTINO.backup-$(date +%Y%m%d%H%M%S)"
  cp "$ARCHIVO_DESTINO" "$BACKUP_FILE"
  echo -e "${VERDE}✅ Copia de seguridad creada: $BACKUP_FILE${NC}"
fi

# Actualizar el archivo
cp "$ARCHIVO_FUENTE" "$ARCHIVO_DESTINO"
echo -e "${VERDE}✅ Archivo actualizado exitosamente${NC}"

# Mostrar diferencias para verificación
echo -e "${AZUL}📊 Diferencias entre archivos:${NC}"
if [ -f "$BACKUP_FILE" ]; then
  diff --color=auto -u "$BACKUP_FILE" "$ARCHIVO_DESTINO" | head -n 50
else
  echo -e "${AMARILLO}⚠️ No hay archivo previo para comparar${NC}"
fi

echo -e "${AZUL}============================================${NC}"
echo -e "${VERDE}✅ Actualización completada${NC}"
echo -e "${AMARILLO}⚠️ IMPORTANTE: Debe implementar manualmente el script actualizado en Google Apps Script:${NC}"
echo -e "1. Abra el proyecto en Google Apps Script: https://script.google.com/home"
echo -e "2. Reemplace todo el código con el contenido del archivo $ARCHIVO_DESTINO"
echo -e "3. Implemente el script con permisos para 'Cualquiera, incluso anónimo'"
echo -e "${AZUL}============================================${NC}"

exit 0