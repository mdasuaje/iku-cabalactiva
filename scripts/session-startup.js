#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import CompleteTestingSuite from './run-complete-testing.js';

class SessionStartup {
  constructor() {
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  displayWelcome() {
    console.clear();
    console.log(`
🌟 ═══════════════════════════════════════════════════════════════════════════════
                        IKU CÁBALA ACTIVA - DESARROLLO
                     Herramientas Espirituales del Maestro Isaac Benzaquén
🌟 ═══════════════════════════════════════════════════════════════════════════════

🚀 INICIO DE SESIÓN DE DESARROLLO
📅 ${new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}
⏰ ${new Date().toLocaleTimeString('es-ES')}

`);
  }

  async checkEnvironment() {
    this.log('🔍 Verificando entorno de desarrollo...');
    
    // Verificar Node.js
    const nodeVersion = process.version;
    this.log(`Node.js: ${nodeVersion}`);
    
    // Verificar npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`npm: v${npmVersion}`);
    } catch (error) {
      throw new Error('npm no está disponible');
    }
    
    // Verificar Git
    try {
      const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      this.log(`Git branch: ${gitBranch}`);
    } catch (error) {
      this.log('Git no disponible o no es un repositorio', 'warning');
    }
    
    // Verificar dependencias críticas
    const criticalDeps = ['react', 'vite', '@playwright/test', 'vitest'];
    for (const dep of criticalDeps) {
      try {
        execSync(`npm ls ${dep}`, { stdio: 'pipe' });
        this.log(`✓ ${dep} instalado`);
      } catch (error) {
        throw new Error(`Dependencia crítica faltante: ${dep}`);
      }
    }
  }

  async runQuickHealthCheck() {
    this.log('🏥 Ejecutando verificación rápida de salud del proyecto...');
    
    // Verificar archivos críticos
    const criticalFiles = [
      'package.json',
      'vite.config.js', 
      'src/App.jsx',
      'src/main.jsx',
      'public/index.html'
    ];
    
    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Archivo crítico faltante: ${file}`);
      }
    }
    
    // Verificar que el proyecto puede hacer build
    try {
      this.log('🏗️ Verificando capacidad de build...');
      execSync('npm run build', { stdio: 'pipe' });
      this.log('✓ Build exitoso');
    } catch (error) {
      throw new Error('El proyecto no puede hacer build correctamente');
    }
  }

  async runCompleteTestingSuite() {
    this.log('🧪 Iniciando suite completa de testing...');
    
    const testingSuite = new CompleteTestingSuite();
    const success = await testingSuite.run();
    
    if (!success) {
      this.log('⚠️ Algunos tests fallaron, revisa los reportes', 'warning');
    } else {
      this.log('✅ Todos los tests pasaron exitosamente', 'success');
    }
    
    return success;
  }

  displayProjectStatus() {
    this.log('\n📊 ESTADO ACTUAL DEL PROYECTO:');
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│                        PROYECTO STATUS                          │
├─────────────────────────────────────────────────────────────────┤
│ 🌐 Sitio Web: https://iku-cabalactiva.com                      │
│ 🛠️ Tecnologías: React 18 + Vite + Tailwind CSS                │
│ 🎨 Tema: Cabalístico (Dorado/Púrpura)                          │
│ 📱 Responsive: ✅ Mobile-First Design                           │
│ 🔒 Seguridad: ✅ HTTPS + Security Headers                      │
│ 🚀 Deploy: ✅ GitHub Pages + Actions                           │
├─────────────────────────────────────────────────────────────────┤
│                     HERRAMIENTAS DISPONIBLES                    │
├─────────────────────────────────────────────────────────────────┤
│ 💫 Carta Astral Cabalística ($67 USD)                          │
│ 🌟 Constelación Familiar Cabalística ($97 USD)                 │
│ ✨ Limpieza Áurica Cabalística ($150 USD)                      │
│ 🧘 Meditación Cabalística ($67 USD)                            │
└─────────────────────────────────────────────────────────────────┘
`);
  }

  displayAvailableCommands() {
    console.log(`
🛠️ COMANDOS DISPONIBLES:

📦 DESARROLLO:
  npm run dev              - Servidor de desarrollo
  npm run build            - Build para producción  
  npm run preview          - Preview del build

🧪 TESTING:
  npm run test:status      - Test de estatus del proyecto
  npm run test:complete    - Suite completa de testing
  npm run test:e2e         - Tests End-to-End
  npm run test:ci          - Tests unitarios con coverage

🚀 DEPLOYMENT:
  npm run deploy           - Deploy manual a GitHub Pages
  git push origin main     - Deploy automático via Actions

🔧 UTILIDADES:
  npm run lint             - Linting del código
  npm run format           - Formatear código
  npm run diagnostico      - Diagnóstico del sistema

📊 REPORTES:
  Revisa: test-results/ para reportes detallados
`);
  }

  displaySessionSummary(testingSuccess) {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    console.log(`
🌟 ═══════════════════════════════════════════════════════════════════════════════
                            RESUMEN DE SESIÓN
🌟 ═══════════════════════════════════════════════════════════════════════════════

⏱️ Duración de inicio: ${duration}s
🧪 Testing completo: ${testingSuccess ? '✅ EXITOSO' : '⚠️ CON ADVERTENCIAS'}
🚀 Estado del proyecto: ${testingSuccess ? '✅ LISTO PARA DESARROLLO' : '⚠️ REQUIERE ATENCIÓN'}

${testingSuccess ? 
  '🎉 ¡Todo listo! Puedes comenzar a desarrollar con confianza.' :
  '⚠️ Revisa los reportes en test-results/ antes de continuar.'
}

🌟 ¡Que tengas una sesión de desarrollo productiva! 🌟
`);
  }

  async run() {
    try {
      this.displayWelcome();
      
      await this.checkEnvironment();
      this.log('✅ Entorno verificado correctamente', 'success');
      
      await this.runQuickHealthCheck();
      this.log('✅ Verificación rápida completada', 'success');
      
      const testingSuccess = await this.runCompleteTestingSuite();
      
      this.displayProjectStatus();
      this.displayAvailableCommands();
      this.displaySessionSummary(testingSuccess);
      
      return testingSuccess;
      
    } catch (error) {
      this.log(`❌ Error durante el inicio de sesión: ${error.message}`, 'error');
      console.log(`
⚠️ INICIO DE SESIÓN INCOMPLETO

El proyecto tiene problemas que requieren atención:
${error.message}

🔧 Acciones recomendadas:
1. Ejecuta: npm install
2. Verifica: npm run test:status  
3. Revisa: test-results/ para más detalles
4. Contacta al equipo si persisten los problemas
`);
      return false;
    }
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const startup = new SessionStartup();
  const success = await startup.run();
  process.exit(success ? 0 : 1);
}

export default SessionStartup;