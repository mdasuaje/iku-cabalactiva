#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const HERRAMIENTAS_PATH = path.join(__dirname, '../src/components/sections/Herramientas.jsx')

// Configuraciones para diagnosticar componentes internos de Herramientas
const HERRAMIENTAS_CONFIGS = [
  {
    name: 'title-only',
    description: 'Solo título y estructura básica'
  },
  {
    name: 'with-cards',
    description: 'Título + tarjetas de herramientas'
  },
  {
    name: 'with-animations',
    description: 'Título + tarjetas + animaciones'
  },
  {
    name: 'full-section',
    description: 'Sección completa original'
  }
]

function generateHerramientasContent(config) {
  switch(config) {
    case 'title-only':
      return `import React from 'react'

const Herramientas = () => {
  return (
    <section id="herramientas" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Herramientas Espirituales
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            DIAGNÓSTICO ACTIVO: Solo título básico
          </p>
        </div>
      </div>
    </section>
  )
}

export default Herramientas`

    case 'with-cards':
      return `import React from 'react'

const Herramientas = () => {
  const herramientas = [
    {
      id: 'carta-astral',
      titulo: 'Carta Astral Cabalística',
      precio: '$67 USD',
      descripcion: 'Descubre tu propósito divino'
    },
    {
      id: 'constelacion-familiar',
      titulo: 'Constelación Familiar Cabalística',
      precio: '$97 USD', 
      descripcion: 'Sana patrones familiares'
    }
  ]

  return (
    <section id="herramientas" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Herramientas Espirituales
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            DIAGNÓSTICO ACTIVO: Título + tarjetas básicas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {herramientas.map((herramienta) => (
            <div key={herramienta.id} className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                {herramienta.titulo}
              </h3>
              <p className="text-2xl font-bold text-white mb-4">
                {herramienta.precio}
              </p>
              <p className="text-gray-300">
                {herramienta.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Herramientas`

    default:
      return null
  }
}

function applyHerramientasDiagnostic(configName) {
  const config = HERRAMIENTAS_CONFIGS.find(c => c.name === configName)
  if (!config) {
    console.error(`❌ Configuración '${configName}' no encontrada`)
    console.log('Configuraciones disponibles:', HERRAMIENTAS_CONFIGS.map(c => `${c.name}: ${c.description}`).join('\n  '))
    process.exit(1)
  }

  // Backup del archivo original
  const originalContent = fs.readFileSync(HERRAMIENTAS_PATH, 'utf8')
  fs.writeFileSync(HERRAMIENTAS_PATH + '.backup', originalContent)

  // Generar nuevo contenido
  const newContent = generateHerramientasContent(configName)
  if (newContent) {
    fs.writeFileSync(HERRAMIENTAS_PATH, newContent)
    console.log(`✅ Diagnóstico Herramientas aplicado: ${configName}`)
    console.log(`📋 Descripción: ${config.description}`)
  } else {
    console.log('❌ Configuración no implementada')
  }
}

function restoreHerramientas() {
  const backupPath = HERRAMIENTAS_PATH + '.backup'
  if (fs.existsSync(backupPath)) {
    const originalContent = fs.readFileSync(backupPath, 'utf8')
    fs.writeFileSync(HERRAMIENTAS_PATH, originalContent)
    fs.unlinkSync(backupPath)
    console.log('✅ Herramientas.jsx original restaurado')
  } else {
    console.error('❌ No se encontró backup de Herramientas.jsx')
  }
}

// CLI
const command = process.argv[2]
const config = process.argv[3]

if (command === 'apply' && config) {
  applyHerramientasDiagnostic(config)
} else if (command === 'restore') {
  restoreHerramientas()
} else if (command === 'list') {
  console.log('📋 Configuraciones de diagnóstico para Herramientas:')
  HERRAMIENTAS_CONFIGS.forEach(c => {
    console.log(`  ${c.name}: ${c.description}`)
  })
} else {
  console.log(`
🔍 Script de Diagnóstico de Herramientas

Uso:
  node scripts/diagnose-herramientas.cjs apply <config>
  node scripts/diagnose-herramientas.cjs restore
  node scripts/diagnose-herramientas.cjs list

Ejemplos:
  node scripts/diagnose-herramientas.cjs apply title-only
  node scripts/diagnose-herramientas.cjs apply with-cards
`)
}