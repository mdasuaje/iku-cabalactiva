#!/bin/bash
# save_chat.sh - Script para guardar el chat actual en formato Markdown
# Autor: mdasuaje
# Proyecto: IKU-Cábala Activa
# Fecha: $(date +%Y-%m-%d)

# Definición de variables
CHAT_DIR="/workspaces/iku-cabalactiva/docs/chats"
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
CHAT_FILE="$CHAT_DIR/chat-sesion-$TIMESTAMP.md"

# Colores para mensajes
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo -e "${BLUE}=== IKU-Cábala Activa - Guardado de Chat ===${RESET}"
echo -e "${YELLOW}Fecha y hora: $(date)${RESET}\n"

# Verificar que el directorio existe o crearlo
if [ ! -d "$CHAT_DIR" ]; then
  echo -e "${YELLOW}Creando directorio para archivos de chat...${RESET}"
  mkdir -p "$CHAT_DIR"
  
  if [ $? -ne 0 ]; then
    echo -e "\033[0;31mError: No se pudo crear el directorio $CHAT_DIR${RESET}"
    exit 1
  fi
  
  echo -e "${GREEN}Directorio creado exitosamente.${RESET}"
else
  echo -e "${GREEN}El directorio de chats existe.${RESET}"
fi

# Solicitar al usuario que introduzca el contenido
echo -e "\n${YELLOW}Pega el contenido del chat a continuación.${RESET}"
echo -e "${YELLOW}Cuando termines, presiona Ctrl+D para guardar:${RESET}"
echo -e "${BLUE}-------------------------------------------${RESET}"

# Capturar la entrada del usuario hasta Ctrl+D
cat > "$CHAT_FILE"

# Verificar si el archivo fue creado correctamente
if [ -f "$CHAT_FILE" ]; then
  # Obtener información del archivo
  FILESIZE=$(du -h "$CHAT_FILE" | cut -f1)
  LINECOUNT=$(wc -l < "$CHAT_FILE")
  
  echo -e "\n${GREEN}✓ Chat guardado exitosamente${RESET}"
  echo -e "${BLUE}-------------------------------------------${RESET}"
  echo -e "${YELLOW}Detalles del archivo:${RESET}"
  echo -e "  - Ruta: ${GREEN}$CHAT_FILE${RESET}"
  echo -e "  - Tamaño: ${GREEN}$FILESIZE${RESET}"
  echo -e "  - Líneas: ${GREEN}$LINECOUNT${RESET}"
  echo -e "${BLUE}-------------------------------------------${RESET}"
else
  echo -e "\033[0;31mError: No se pudo guardar el archivo${RESET}"
  exit 1
fi

# Mensaje final
echo -e "\n${GREEN}Proceso completado.${RESET}"
echo -e "${YELLOW}El chat ha sido archivado para futura referencia.${RESET}"