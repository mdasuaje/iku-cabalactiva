#!/usr/bin/env node

import agentConfig from '../.vscode/copilot-prompts/iku-cabalactiva-agent-enhanced.mjs'

console.log('\n🚀 IKU-CABALACTIVA AGENT TESTER 🚀\n')

// Mostrar versión y nombre del agente
console.log(`Nombre: ${agentConfig.nombre}`)
console.log(`Versión: ${agentConfig.versión}`)
console.log('\n-----------------------------------\n')

// Probar detección de contexto
console.log('📁 PRUEBA DE DETECCIÓN DE CONTEXTO:')
const mockFilePath = '/workspaces/iku-cabalactiva/src/components/HerramientasSection.jsx'
const detectedContext = agentConfig.detectarContexto(mockFilePath)
console.log(JSON.stringify(detectedContext, null, 2))
console.log('\n-----------------------------------\n')

// Probar recomendaciones contextuales
console.log('💡 PRUEBA DE RECOMENDACIONES CONTEXTUALES:')
const contextRecommendations = agentConfig.recomendacionesContextuales(detectedContext)
console.log(JSON.stringify(contextRecommendations, null, 2))
console.log('\n-----------------------------------\n')

// Probar generación de patrón de workflow
console.log('🔄 PRUEBA DE GENERACIÓN DE PATRÓN DE WORKFLOW:')
const analyzePattern = agentConfig.patrones().analyze(detectedContext)
console.log(analyzePattern)
console.log('\n-----------------------------------\n')

// Probar ejecución de comando
console.log('⚙️ PRUEBA DE EJECUCIÓN DE COMANDO:')
const componentResult = agentConfig.ejecutarComando('crearComponente', 'TestComponent', {
  tipo: 'funcional',
  conEstado: true,
  conProps: true,
  descripcion: 'Componente de prueba para demostración del agente',
  props: [
    { nombre: 'title', tipo: 'string', descripcion: 'Título del componente' },
    { nombre: 'active', tipo: 'boolean', descripcion: 'Estado de activación' },
  ],
})

console.log('Componente generado JSX:')
console.log('------------------------')
console.log(componentResult['TestComponent.jsx'])
console.log('\n-----------------------------------\n')

console.log('✅ TODAS LAS PRUEBAS COMPLETADAS\n')
