#!/bin/bash

# Gemini CLI Tools Registration Script
# Provides tools for commanding MCP agents through natural language

echo "🔧 Registrando herramientas de Gemini CLI para comandar Agentes MCP..."

# Verificar que jq esté disponible
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq no está instalado. Instalando..."
    sudo apt-get update && sudo apt-get install -y jq
fi

# Verificar que curl esté disponible
if ! command -v curl &> /dev/null; then
    echo "⚠️  curl no está instalado. Instalando..."
    sudo apt-get update && sudo apt-get install -y curl
fi

# Crear alias para Gemini CLI (asumiendo que está instalado como 'g')
alias g='gemini'

# Herramientas básicas del sistema
system_status() {
    echo "🖥️  Verificando estado del sistema..."
    echo "Fecha: $(date)"
    echo "Usuario: $(whoami)"
    echo "Directorio: $(pwd)"
    echo "Rama git: $(git branch --show-current 2>/dev/null || echo 'No git')"
}

# Herramientas para el TDD Agent (puerto 8080)
test_user_entity() {
    echo "🧪 Ejecutando pruebas de User Entity con el Agente TDD..."
    curl -s -X POST -H "Content-Type: application/json" \
         -d '{"filepath": "workspace/src-v3/1-Domain/Entities/User.test.js"}' \
         http://localhost:8080/run-test | jq .
}

test_register_usecase() {
    echo "🧪 Ejecutando pruebas de RegisterUserUseCase con el Agente TDD..."
    curl -s -X POST -H "Content-Type: application/json" \
         -d '{"filepath": "workspace/src-v3/2-Application/UseCases/RegisterUserUseCase.test.js"}' \
         http://localhost:8080/run-test | jq .
}

# HERRAMIENTAS DE PERSISTENCIA (puerto 8082)

# Herramienta para verificar si un email existe usando el agente de persistencia.
check_user_email() {
  local email="$1"
  echo "🤖 Verificando email '${email}' con el Agente de Persistencia Python..."
  curl -s -X POST -H "Content-Type: application/json" \
       -d "{\"email\": \"${email}\"}" \
       http://localhost:8082/users/exists-by-email | jq .
}

# Herramienta para guardar un nuevo usuario.
save_user() {
  local email="$1"
  echo "🤖 Guardando usuario '${email}' con el Agente de Persistencia Python..."
  curl -s -X POST -H "Content-Type: application/json" \
       -d "{\"email\": \"${email}\"}" \
       http://localhost:8082/users/save | jq .
}

# Exportar las funciones para que estén disponibles en la shell
export -f system_status
export -f test_user_entity
export -f test_register_usecase
export -f check_user_email
export -f save_user

echo "✅ Herramientas básicas 'system_status', 'test_user_entity', 'test_register_usecase' registradas."
echo "✅ Herramientas de persistencia 'check_user_email' y 'save_user' registradas."
echo ""
echo "🎯 Uso de herramientas con Gemini CLI:"
echo "   g, usando la herramienta system_status, muestra el estado del sistema"
echo "   g, usando la herramienta check_user_email, verifica si existe 'usuario@ejemplo.com'"
echo "   g, usando la herramienta save_user, guarda el usuario 'nuevo@ejemplo.com'"
echo ""
echo "🔗 Agentes MCP disponibles:"
echo "   - TDD Agent (puerto 8080): Para ejecutar pruebas"
echo "   - Persistence Agent (puerto 8082): Para operaciones de datos"