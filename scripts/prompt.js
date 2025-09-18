#!/usr/bin/env node
/**
 * @name prompt.js
 * @description Script para simular el comando /prompt y activar el agente IKU-CabalaActiva
 * @usage node prompt.js iku-cabala-agent [comando]
 * @example node prompt.js iku-cabala-agent diagnose
 */

const fs = require('fs')
const path = require('path')

// Ruta base del proyecto
const BASE_PATH = path.join(__dirname, '..')

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2)
if (args.length < 1) {
  console.error('Error: Debes proporcionar al menos un argumento.')
  console.error('Uso: node prompt.js <agente> [comando]')
  console.error('Ejemplo: node prompt.js iku-cabala-agent diagnose')
  process.exit(1)
}

// Extraer nombre del agente y comando
const agentName = args[0]
const comando = args[1] || ''

// Verificar si existe el archivo del agente
const agentPath = path.join(BASE_PATH, '.vscode', 'copilot-prompts', `${agentName}.js`)
if (!fs.existsSync(agentPath)) {
  console.error(`Error: No se encontró el agente "${agentName}" en la ruta ${agentPath}`)
  process.exit(1)
}

try {
  // Importar el agente
  const agent = require(agentPath)

  // Procesar el comando
  switch (comando.toLowerCase()) {
    case 'diagnose':
    case 'diagnóstico':
      console.log(`# Ejecutando diagnóstico con ${agent.nombre} v${agent.versión}\n`)
      console.log(agent.fases.diagnóstico())
      break

    case 'implementacion':
    case 'implementación':
      console.log(`# Ejecutando fase de implementación con ${agent.nombre} v${agent.versión}\n`)
      console.log(agent.fases.implementación())
      break

    case 'optimizacion':
    case 'optimización':
      console.log(`# Ejecutando fase de optimización con ${agent.nombre} v${agent.versión}\n`)
      console.log(agent.fases.optimización())
      break

    default:
      // Si no hay comando específico, activar el agente completo
      console.log(`# Activando ${agent.nombre} v${agent.versión}\n`)
      console.log(agent.activar())
  }
} catch (error) {
  console.error(`Error al cargar o ejecutar el agente: ${error.message}`)
  console.error(error.stack)
  process.exit(1)
}
