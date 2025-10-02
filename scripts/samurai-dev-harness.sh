#!/usr/bin/env bash

# Colores para la salida
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

AGENT_NAME=$2
AGENT_PATH="src-v3/3-Infrastructure/McpServers/${AGENT_NAME}"
CONTAINER_NAME="${AGENT_NAME}-agent"
IMAGE_NAME="iku-${AGENT_NAME}-agent:1.0"

# Validaciones iniciales
if [[ -z "$1" ]] || [[ -z "$2" ]]; then
  echo -e "${RED}Error: Se requieren dos argumentos: <comando> <nombre-agente>${NC}"
  echo "Uso: $0 {build|test|down} <nombre-agente>"
  exit 1
fi
if [ ! -d "$AGENT_PATH" ]; then
    echo -e "${RED}Error: El directorio del agente '${AGENT_PATH}' no existe.${NC}"
    exit 1
fi

# Función para construir el agente
build_agent() {
    echo -e "${YELLOW}Construyendo el agente '${AGENT_NAME}'...${NC}"
    docker build -t ${IMAGE_NAME} ${AGENT_PATH}
}

# Función para ejecutar pruebas usando el agente
test_agent() {
    local test_file=$1
    if [[ -z "$test_file" ]]; then
        echo -e "${RED}Error: El comando 'test' requiere la ruta del archivo de prueba.${NC}"
        exit 1
    fi

    echo -e "${YELLOW}Iniciando agente '${AGENT_NAME}' para pruebas...${NC}"
    docker run -d -p 8080:8080 --name ${CONTAINER_NAME} -v $(pwd):/workspace ${IMAGE_NAME}
    
    echo -e "${YELLOW}Esperando que el agente se estabilice...${NC}"
    sleep 4

    echo -e "${YELLOW}Ejecutando prueba: ${test_file}...${NC}"
    curl -s -X POST -H "Content-Type: application/json" \
         -d "{\"filepath\": \"${test_file}\"}" \
         http://localhost:8080/run-test | jq .
    
    echo -e "${YELLOW}Limpiando el agente de pruebas...${NC}"
    docker stop ${CONTAINER_NAME} >/dev/null && docker rm ${CONTAINER_NAME} >/dev/null
    echo -e "${GREEN}Ciclo de prueba completado.${NC}"
}

# Función para detener y eliminar el agente
down_agent() {
    echo -e "${YELLOW}Deteniendo y eliminando el agente '${AGENT_NAME}'...${NC}"
    docker stop ${CONTAINER_NAME} >/dev/null && docker rm ${CONTAINER_NAME} >/dev/null
    echo -e "${GREEN}Agente detenido.${NC}"
}

# Orquestador de comandos
case "$1" in
    build)
        build_agent
        ;;
    test)
        build_agent # Siempre construir la última versión antes de probar
        test_agent "$3"
        ;;
    down)
        down_agent
        ;;
    *)
        echo -e "${RED}Comando desconocido: $1${NC}"
        exit 1
        ;;
esac