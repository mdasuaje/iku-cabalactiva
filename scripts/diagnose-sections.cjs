#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const HOME_PATH = path.join(__dirname, '../src/components/pages/Home.jsx')

// Configuraciones de diagnóstico - una sección a la vez
const DIAGNOSTIC_CONFIGS = [
  {
    name: 'hero-only',
    sections: ['Hero']
  },
  {
    name: 'hero-herramientas',
    sections: ['Hero', 'Herramientas']
  },
  {
    name: 'hero-herramientas-philosophy',
    sections: ['Hero', 'Herramientas', 'Philosophy']
  },
  {
    name: 'hero-herramientas-philosophy-value',
    sections: ['Hero', 'Herramientas', 'Philosophy', 'ValueProposition']
  },
  {
    name: 'all-first-group',
    sections: ['Hero', 'Herramientas', 'Philosophy', 'ValueProposition', 'AboutMaestro', 'Pricing', 'Testimonios']
  },
  {
    name: 'all-sections',
    sections: ['Hero', 'Herramientas', 'Philosophy', 'ValueProposition', 'AboutMaestro', 'Pricing', 'Testimonios', 'SocialContent', 'SocialProof', 'CTA', 'FAQ', 'Contact']
  }
]

function generateHomeContent(activeSections) {
  const allSections = ['Hero', 'Herramientas', 'Philosophy', 'ValueProposition', 'AboutMaestro', 'Pricing', 'Testimonios', 'SocialContent', 'SocialProof', 'CTA', 'FAQ', 'Contact']
  
  let imports = `import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'

// Componentes con lazy loading para mejor performance`

  // Generar imports lazy solo para secciones activas
  allSections.forEach(section => {
    if (section !== 'Hero' && section !== 'Herramientas' && activeSections.includes(section)) {
      imports += `\nconst ${section} = lazy(() => import('@components/sections/${section}'))`
    }
  })

  let jsx = `\nconst Home = () => {
  return (
    <>
      {/* DIAGNÓSTICO ACTIVO - Solo secciones: ${activeSections.join(', ')} */}`

  // Generar JSX solo para secciones activas
  if (activeSections.includes('Hero')) {
    jsx += `\n      <Hero />`
  }
  
  if (activeSections.includes('Herramientas')) {
    jsx += `\n      <Herramientas />`
  }

  // Primer grupo lazy
  const firstGroupActive = activeSections.filter(s => ['Philosophy', 'ValueProposition', 'AboutMaestro', 'Pricing', 'Testimonios'].includes(s))
  if (firstGroupActive.length > 0) {
    jsx += `\n      
      {/* Secciones con lazy loading optimizado */}
      <Suspense fallback={<LoadingSpinner message="Cargando contenido..." />}>`
    firstGroupActive.forEach(section => {
      jsx += `\n        <${section} />`
    })
    jsx += `\n      </Suspense>`
  }

  // Segundo grupo lazy
  const secondGroupActive = activeSections.filter(s => ['SocialContent', 'SocialProof', 'CTA', 'FAQ', 'Contact'].includes(s))
  if (secondGroupActive.length > 0) {
    jsx += `\n      
      <Suspense fallback={<LoadingSpinner message="Cargando comunidad..." />}>`
    secondGroupActive.forEach(section => {
      jsx += `\n        <${section} />`
    })
    jsx += `\n      </Suspense>`
  }

  jsx += `\n    </>
  )
}

export default Home`

  return imports + jsx
}

function applyDiagnostic(configName) {
  const config = DIAGNOSTIC_CONFIGS.find(c => c.name === configName)
  if (!config) {
    console.error(`❌ Configuración '${configName}' no encontrada`)
    console.log('Configuraciones disponibles:', DIAGNOSTIC_CONFIGS.map(c => c.name).join(', '))
    process.exit(1)
  }

  // Backup del archivo original
  const originalContent = fs.readFileSync(HOME_PATH, 'utf8')
  fs.writeFileSync(HOME_PATH + '.backup', originalContent)

  // Generar nuevo contenido
  const newContent = generateHomeContent(config.sections)
  fs.writeFileSync(HOME_PATH, newContent)

  console.log(`✅ Diagnóstico aplicado: ${config.name}`)
  console.log(`📋 Secciones activas: ${config.sections.join(', ')}`)
  console.log(`💾 Backup guardado en: ${HOME_PATH}.backup`)
}

function restoreOriginal() {
  const backupPath = HOME_PATH + '.backup'
  if (fs.existsSync(backupPath)) {
    const originalContent = fs.readFileSync(backupPath, 'utf8')
    fs.writeFileSync(HOME_PATH, originalContent)
    fs.unlinkSync(backupPath)
    console.log('✅ Archivo original restaurado')
  } else {
    console.error('❌ No se encontró backup para restaurar')
  }
}

// CLI
const command = process.argv[2]
const config = process.argv[3]

if (command === 'apply' && config) {
  applyDiagnostic(config)
} else if (command === 'restore') {
  restoreOriginal()
} else if (command === 'list') {
  console.log('📋 Configuraciones de diagnóstico disponibles:')
  DIAGNOSTIC_CONFIGS.forEach(c => {
    console.log(`  ${c.name}: ${c.sections.join(', ')}`)
  })
} else {
  console.log(`
🔍 Script de Diagnóstico de Secciones

Uso:
  node scripts/diagnose-sections.cjs apply <config>  - Aplicar diagnóstico
  node scripts/diagnose-sections.cjs restore        - Restaurar original
  node scripts/diagnose-sections.cjs list          - Listar configuraciones

Ejemplos:
  node scripts/diagnose-sections.cjs apply hero-only
  node scripts/diagnose-sections.cjs apply all-first-group
  node scripts/diagnose-sections.cjs restore
`)
}