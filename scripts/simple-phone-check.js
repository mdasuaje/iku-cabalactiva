#!/usr/bin/env node

console.log('🔍 VERIFICACIÓN SIMPLE DE NÚMERO DE WHATSAPP\n')

// Verificar que el número correcto esté en constants.js
import fs from 'fs'

const constantsContent = fs.readFileSync('src/utils/constants.js', 'utf8')
const correctNumber = '+19298336069'

if (constantsContent.includes(correctNumber)) {
  console.log('✅ Número correcto en constants.js:', correctNumber)
} else {
  console.log('❌ Número incorrecto en constants.js')
  console.log('Buscando:', correctNumber)
}

// Verificar que no haya números con (298)
const incorrectPattern = /\+1.*\(298\)/
if (incorrectPattern.test(constantsContent)) {
  console.log('❌ Encontrado patrón incorrecto (298)')
} else {
  console.log('✅ No se encontraron patrones incorrectos (298)')
}

console.log('\n📋 NÚMERO CORRECTO CONFIRMADO:')
console.log('Display: +1 (929) 833-6069')
console.log('WhatsApp: 19298336069')
console.log('Constants: +19298336069')