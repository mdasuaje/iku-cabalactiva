#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const agent = require('../.vscode/copilot-prompts/iku-cabalactiva-agent-enhanced.js');

console.log('\n🚀 IKU-CABALACTIVA AGENT TESTER 🚀\n');

// Mostrar versión y nombre del agente
console.log(`Nombre: ${agent.nombre}`);
console.log(`Versión: ${agent.versión}`);
console.log('\n-----------------------------------\n');

// Probar detección de contexto
console.log('📁 PRUEBA DE DETECCIÓN DE CONTEXTO:');
const mockFilePath = '/workspaces/iku-cabalactiva/src/components/HerramientasSection.jsx';
const detectedContext = agent.detectarContexto(mockFilePath);
console.log(JSON.stringify(detectedContext, null, 2));
console.log('\n-----------------------------------\n');

// Probar recomendaciones contextuales
console.log('💡 PRUEBA DE RECOMENDACIONES CONTEXTUALES:');
const contextRecommendations = agent.recomendacionesContextuales(detectedContext);
console.log(JSON.stringify(contextRecommendations, null, 2));
console.log('\n-----------------------------------\n');

// Probar generación de patrón de workflow
console.log('🔄 PRUEBA DE GENERACIÓN DE PATRÓN DE WORKFLOW:');
const analyzePattern = agent.patrones().analyze(detectedContext);
console.log(analyzePattern);
console.log('\n-----------------------------------\n');

// Probar ejecución de comando
console.log('⚙️ PRUEBA DE EJECUCIÓN DE COMANDO:');
const componentResult = agent.ejecutarComando('crearComponente', 'TestComponent', {
  tipo: 'funcional',
  conEstado: true,
  conProps: true,
  descripcion: 'Componente de prueba para demostración del agente',
  props: [
    { nombre: 'title', tipo: 'string', descripcion: 'Título del componente' },
    { nombre: 'active', tipo: 'boolean', descripcion: 'Estado de activación' }
  ]
});

console.log('Componente generado JSX:');
console.log('------------------------');
console.log(componentResult['TestComponent.jsx']);
console.log('\n-----------------------------------\n');

console.log('✅ TODAS LAS PRUEBAS COMPLETADAS\n');
