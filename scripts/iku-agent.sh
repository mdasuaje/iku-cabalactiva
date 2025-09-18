#!/bin/bash
# iku-agent.sh - Script para interactuar con el agente IKU-CabalaActiva
# Autor: mdasuaje
# Proyecto: IKU-Cábala Activa

# Colores para mensajes
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
MAGENTA="\033[0;35m"
RED="\033[0;31m"
RESET="\033[0m"

# Función para mostrar el banner
show_banner() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${BLUE}║${CYAN}            IKU-CabalaActiva-Agent CLI Interface           ${BLUE}║${RESET}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${RESET}"
  echo -e "${YELLOW}Fecha: $(date +%Y-%m-%d) | Hora: $(date +%H:%M:%S)${RESET}"
  echo ""
}

# Función para mostrar ayuda
show_help() {
  echo -e "${CYAN}Uso:${RESET}"
  echo -e "  $0 [comando]"
  echo ""
  echo -e "${CYAN}Comandos disponibles:${RESET}"
  echo -e "  ${GREEN}diagnose${RESET}      - Ejecutar diagnóstico del proyecto"
  echo -e "  ${GREEN}implement${RESET}     - Obtener instrucciones para implementación"
  echo -e "  ${GREEN}optimize${RESET}      - Obtener recomendaciones de optimización"
  echo -e "  ${GREEN}help${RESET}          - Mostrar esta ayuda"
  echo ""
  echo -e "${CYAN}Ejemplos:${RESET}"
  echo -e "  $0 diagnose"
  echo -e "  $0 implement \"Componente de Hero Section\""
  echo ""
}

# Mostrar el banner
show_banner

# Verificar si node.js está disponible
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js no está instalado. Este script requiere Node.js para ejecutarse.${RESET}"
  exit 1
fi

# Verificar el comando pasado como argumento
if [ $# -eq 0 ]; then
  echo -e "${YELLOW}No se especificó ningún comando. Mostrando ayuda:${RESET}"
  echo ""
  show_help
  exit 0
fi

COMMAND=$1
AGENT_JS="/workspaces/iku-cabalactiva/.vscode/copilot-prompts/iku-cabala-agent.js"

# Verificar que el archivo del agente existe
if [ ! -f "$AGENT_JS" ]; then
  echo -e "${RED}Error: No se encontró el archivo del agente en $AGENT_JS${RESET}"
  exit 1
fi

# Ejecutar el comando correspondiente
case "$COMMAND" in
  "diagnose" | "diagnóstico")
    echo -e "${MAGENTA}Ejecutando diagnóstico del proyecto...${RESET}"
    echo ""
    node -e "const agent = require('$AGENT_JS'); console.log(agent.fases.diagnóstico);"
    ;;
    
  "implement" | "implementación")
    echo -e "${MAGENTA}Ejecutando fase de implementación...${RESET}"
    echo ""
    node -e "const agent = require('$AGENT_JS'); console.log(agent.fases.implementación);"
    ;;
    
  "optimize" | "optimización")
    echo -e "${MAGENTA}Ejecutando fase de optimización...${RESET}"
    echo ""
    node -e "const agent = require('$AGENT_JS'); console.log(agent.fases.optimización);"
    ;;
    
  "help" | "--help" | "-h")
    show_help
    ;;
    
  *)
    echo -e "${RED}Error: Comando desconocido '$COMMAND'${RESET}"
    echo ""
    show_help
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}Proceso completado.${RESET}"
exit 0