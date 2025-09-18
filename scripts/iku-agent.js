#!/usr/bin/env node
/**
 * @name iku-agent.js
 * @description Script para interactuar con el agente IKU-CabalaActiva desde la línea de comandos
 * @author mdasuaje
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const agentPath = path.join(__dirname, '..', '.vscode', 'copilot-prompts', 'iku-cabala-agent.js');/env node
/**
 * @name iku-agent.js
 * @description Script para interactuar con el agente IKU-CabalaActiva desde la línea de comandos
 * @author mdasuaje
 */

const fs = require('fs')
const path = require('path')
const agentPath = path.join(__dirname, '..', '.vscode', 'copilot-prompts', 'iku-cabala-agent.js')

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

// Función para mostrar un mensaje con color
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`
}

// Función para mostrar el banner
function showBanner() {
  console.log(colorize('╔════════════════════════════════════════════════════════╗', 'blue'))
  console.log(
    colorize('║', 'blue') +
      colorize('            IKU-CabalaActiva-Agent CLI Interface           ', 'cyan') +
      colorize('║', 'blue')
  )
  console.log(colorize('╚════════════════════════════════════════════════════════╝', 'blue'))

  const now = new Date()
  const date = now.toLocaleDateString()
  const time = now.toLocaleTimeString()
  console.log(colorize(`Fecha: ${date} | Hora: ${time}`, 'yellow'))
  console.log('')
}

// Función para mostrar ayuda
function showHelp() {
  console.log(colorize('Uso:', 'cyan'))
  console.log(`  node ${path.basename(__filename)} [comando]`)
  console.log('')
  console.log(colorize('Comandos disponibles:', 'cyan'))
  console.log(`  ${colorize('diagnose', 'green')}      - Ejecutar diagnóstico del proyecto`)
  console.log(`  ${colorize('implement', 'green')}     - Obtener instrucciones para implementación`)
  console.log(`  ${colorize('optimize', 'green')}      - Obtener recomendaciones de optimización`)
  console.log(`  ${colorize('help', 'green')}          - Mostrar esta ayuda`)
  console.log('')
}

// Mostrar el banner
showBanner()

// Verificar si el archivo del agente existe
if (!fs.existsSync(agentPath)) {
  console.error(colorize(`Error: No se encontró el archivo del agente en ${agentPath}`, 'red'))
  process.exit(1)
}

// Cargar el archivo de instrucciones del agente como texto
const agentContent = fs.readFileSync(agentPath, 'utf8')

// Función para extraer contenido entre funciones
function extractFunction(name) {
  const pattern = new RegExp(
    `function ${name}\\(\\)\\s*{[\\s\\S]*?return \`([\\s\\S]*?)\`;[\\s\\S]*?}`,
    'gm'
  )
  const match = pattern.exec(agentContent)
  return match ? match[1] : null
}

// Procesar comandos
const command = process.argv[2] || 'help'

switch (command.toLowerCase()) {
  case 'diagnose':
  case 'diagnóstico':
    console.log(colorize('Ejecutando diagnóstico del proyecto...', 'magenta'))
    console.log('')
    const diagnostico = extractFunction('FASE_DIAGNÓSTICO')
    if (diagnostico) {
      console.log(diagnostico)
    } else {
      console.error(colorize('Error: No se pudo extraer las instrucciones de diagnóstico.', 'red'))
    }
    break

  case 'implement':
  case 'implementación':
    console.log(colorize('Ejecutando fase de implementación...', 'magenta'))
    console.log('')
    const implementacion = extractFunction('FASE_IMPLEMENTACIÓN')
    if (implementacion) {
      console.log(implementacion)
    } else {
      console.error(
        colorize('Error: No se pudo extraer las instrucciones de implementación.', 'red')
      )
    }
    break

  case 'optimize':
  case 'optimización':
    console.log(colorize('Ejecutando fase de optimización...', 'magenta'))
    console.log('')
    const optimizacion = extractFunction('FASE_OPTIMIZACIÓN')
    if (optimizacion) {
      console.log(optimizacion)
    } else {
      console.error(colorize('Error: No se pudo extraer las instrucciones de optimización.', 'red'))
    }
    break

  case 'help':
  case '--help':
  case '-h':
    showHelp()
    break

  default:
    console.error(colorize(`Error: Comando desconocido '${command}'`, 'red'))
    console.log('')
    showHelp()
    process.exit(1)
}

console.log('')
console.log(colorize('Proceso completado.', 'green'))
