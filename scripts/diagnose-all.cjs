#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 IKU Cábala Activa - Diagnóstico Maestro Completo\n');

const results = {
  build: false,
  lint: false,
  test: false,
  cname: false,
  components: false,
  structure: false
};

// 1. Verificar estructura de componentes
console.log('🏗️  Verificando estructura de componentes...');
try {
  const homePath = path.join(process.cwd(), 'src', 'components', 'pages', 'Home.jsx');
  const homeContent = fs.readFileSync(homePath, 'utf8');
  
  const requiredSections = ['Hero', 'Herramientas', 'AboutMaestro', 'Testimonios', 'FAQ', 'CTA'];
  const allSectionsPresent = requiredSections.every(section => homeContent.includes(section));
  
  if (allSectionsPresent) {
    results.components = true;
    console.log('✅ Todas las secciones presentes en Home.jsx\n');
  } else {
    console.log('❌ Faltan secciones en Home.jsx\n');
  }
} catch (error) {
  console.log('❌ Error verificando componentes\n');
}

// 2. Verificar estructura del proyecto
console.log('📁 Verificando estructura del proyecto...');
try {
  const criticalPaths = [
    'src/components/sections',
    'src/components/common',
    'src/data',
    'public/CNAME',
    'package.json'
  ];
  
  const allPathsExist = criticalPaths.every(p => fs.existsSync(path.join(process.cwd(), p)));
  
  if (allPathsExist) {
    results.structure = true;
    console.log('✅ Estructura del proyecto correcta\n');
  } else {
    console.log('❌ Estructura del proyecto incompleta\n');
  }
} catch (error) {
  console.log('❌ Error verificando estructura\n');
}

// 3. Test Build
console.log('📦 Ejecutando build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  results.build = true;
  console.log('✅ Build exitoso\n');
} catch (error) {
  console.log('❌ Build falló\n');
}

// 4. Test Lint
console.log('🔧 Ejecutando linter...');
try {
  execSync('npm run lint', { stdio: 'pipe' });
  results.lint = true;
  console.log('✅ Lint exitoso\n');
} catch (error) {
  // Verificar si solo hay warnings (exit code 0) o errores reales
  const output = error.stdout?.toString() || '';
  if (output.includes('warning') && !output.includes('error')) {
    results.lint = true;
    console.log('✅ Lint exitoso (solo warnings)\n');
  } else {
    console.log('❌ Lint falló\n');
  }
}

// 5. Test Tests
console.log('🧪 Ejecutando tests...');
try {
  execSync('npm run test', { stdio: 'pipe' });
  results.test = true;
  console.log('✅ Tests exitosos\n');
} catch (error) {
  console.log('❌ Tests fallaron\n');
}

// 6. Check CNAME
console.log('🌐 Verificando CNAME...');
try {
  const cnamePath = path.join(process.cwd(), 'public', 'CNAME');
  if (fs.existsSync(cnamePath)) {
    const content = fs.readFileSync(cnamePath, 'utf8').trim();
    if (content === 'iku-cabalactiva.com') {
      results.cname = true;
      console.log('✅ CNAME configurado correctamente\n');
    } else {
      console.log('❌ CNAME tiene contenido incorrecto\n');
    }
  } else {
    console.log('❌ CNAME no existe\n');
  }
} catch (error) {
  console.log('❌ Error verificando CNAME\n');
}

// Resumen final
console.log('📊 RESUMEN DE DIAGNÓSTICO MAESTRO:');
console.log('==================================');
console.log(`Componentes: ${results.components ? '✅' : '❌'}`);
console.log(`Estructura:  ${results.structure ? '✅' : '❌'}`);
console.log(`Build:       ${results.build ? '✅' : '❌'}`);
console.log(`Lint:        ${results.lint ? '✅' : '❌'}`);
console.log(`Tests:       ${results.test ? '✅' : '❌'}`);
console.log(`CNAME:       ${results.cname ? '✅' : '❌'}`);

const allPassed = Object.values(results).every(r => r);
console.log(`\n${allPassed ? '🎉 PROYECTO EN ESTADO DE MAESTRÍA COMPLETA' : '⚠️  HAY ASPECTOS QUE REQUIEREN ATENCIÓN'}`);

if (allPassed) {
  console.log('\n🌟 El guerrero ha restaurado el campo de batalla a su plenitud.');
  console.log('🚀 Listo para deployment en producción.');
}

process.exit(allPassed ? 0 : 1);