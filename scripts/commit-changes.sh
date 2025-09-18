#!/bin/bash

# Script para guardar los cambios en la rama feature/ai-assistant-tooling

# Añadir todos los archivos nuevos y modificados relacionados con la implementación del agente
echo "Agregando archivos al commit..."

# Añadir archivos del agente mejorado (forzando la adición de archivos ignorados)
git add -f .vscode/copilot-prompts/iku-cabalactiva-agent-enhanced.js
git add -f .vscode/copilot-prompts/iku-cabalactiva-agent-enhanced.mjs
git add -f .vscode/copilot-prompts/iku-cabala-assistant-prompt.md

# Añadir scripts de prueba
git add scripts/test-iku-cabalactiva-agent.js
git add scripts/test-iku-cabalactiva-agent.mjs

# Añadir documentación y chats
git add docs/chats/chat-2025-09-17-2120.md
git add docs/chats/chat-2025-09-17.md
git add docs/chats/chat-sesion-2025-09-17-2337.md

# Añadir este script
git add scripts/commit-changes.sh

# Crear commit atómico con mensaje descriptivo
echo "Creando commit..."
git commit -m "feat: Mejorar agente IKU-CabalActiva con nuevas capacidades

- Refactorizar agente para incluir detección de contexto
- Implementar sistema de recomendaciones contextuales
- Añadir generación de patrones de workflow
- Crear comandos para generación de código
- Convertir agente a formato ES Module
- Añadir script de prueba para demostrar capacidades
- Documentar mejoras y resultados de pruebas"

# Sincronizar con el repositorio remoto
echo "Sincronizando con repositorio remoto..."
git push origin feature/ai-assistant-tooling

echo "¡Cambios sincronizados correctamente!"