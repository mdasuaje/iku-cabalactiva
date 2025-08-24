#!/usr/bin/env node

// Script para verificar que el número de WhatsApp sea correcto en todo el proyecto
import fs from 'fs'
import path from 'path'

const CORRECT_NUMBER = '19298336069'
const CORRECT_DISPLAY = '+1 (929) 833-6069'

console.log('🔍 VERIFICANDO NÚMEROS DE WHATSAPP EN EL PROYECTO\n')

// Archivos a verificar
const filesToCheck = [
  'src/utils/constants.js',
  'src/components/sections/Contact.jsx',
  'src/components/sections/Pricing.jsx',
  'src/components/common/ExitIntentPopup.jsx',
  '.env.local'
]

let allCorrect = true

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')
    
    // Buscar números incorrectos (evitando falsos positivos)
    const incorrectPatterns = [
      /\+1\s*\(298\)/g,     // (298) en lugar de (929)
      /^298.*833.*6069/gm,  // Línea que empiece con 298
      /\b1298833/g,         // 1298 como palabra completa
      /298.*833.*6069/g     // 298 seguido de 833 y 6069 (pero no 19298)
    ]
    
    // Verificar que no sea el número correcto
    const correctNumber = '19298336069'
    let hasIncorrectNumber = false
    
    incorrectPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        // Verificar que no sea parte del número correcto
        matches.forEach(match => {
          if (!correctNumber.includes(match.replace(/\D/g, ''))) {
            hasIncorrectNumber = true
          }
        })
      }
    })
    
    if (hasIncorrectNumber) {
      console.log(`❌ ${file}: Número incorrecto encontrado`)
      allCorrect = false
    } else {
      console.log(`✅ ${file}: Número correcto`)
    }
  } else {
    console.log(`⚠️  ${file}: Archivo no encontrado`)
  }
})

console.log('\n📋 RESUMEN:')
console.log(`Número correcto: ${CORRECT_DISPLAY}`)
console.log(`Formato WhatsApp: ${CORRECT_NUMBER}`)

if (allCorrect) {
  console.log('✅ Todos los números están correctos')
} else {
  console.log('❌ Se encontraron números incorrectos')
  process.exit(1)
}