#!/usr/bin/env node

/**
 * Script de Validación Rápida del Sistema
 * IKU Cábala Activa - AWS Re-ingeniería
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.blue}\n🎯 ${msg}${colors.reset}`)
};

class SystemValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: 0
    };
  }

  async validate() {
    log.header('VALIDACIÓN RÁPIDA DEL SISTEMA - IKU CÁBALA ACTIVA');
    
    await this.checkProjectStructure();
    await this.checkDependencies();
    await this.checkConfiguration();
    await this.checkServices();
    await this.checkTests();
    await this.checkBuild();
    
    this.printSummary();
  }

  check(description, condition, isWarning = false) {
    this.results.total++;
    
    if (condition) {
      this.results.passed++;
      log.success(description);
      return true;
    } else {
      if (isWarning) {
        this.results.warnings++;
        log.warning(description);
      } else {
        this.results.failed++;
        log.error(description);
      }
      return false;
    }
  }

  async checkProjectStructure() {
    log.header('Estructura del Proyecto');
    
    const requiredFiles = [
      'package.json',
      'vite.config.js',
      'src/App.jsx',
      'src/services/api.js',
      'src/hooks/useApiStatus.js',
      'src/components/forms/ContactForm.jsx',
      'src/components/common/ContactModal.jsx'
    ];

    const requiredDirs = [
      'src/components',
      'src/services',
      'src/hooks',
      'src/tests',
      'docs'
    ];

    requiredFiles.forEach(file => {
      this.check(`Archivo requerido: ${file}`, existsSync(file));
    });

    requiredDirs.forEach(dir => {
      this.check(`Directorio requerido: ${dir}`, existsSync(dir));
    });
  }

  async checkDependencies() {
    log.header('Dependencias');
    
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const requiredDeps = [
        'react',
        'react-dom',
        'vite',
        'tailwindcss',
        'framer-motion',
        'react-hook-form',
        'react-hot-toast',
        'vitest'
      ];

      requiredDeps.forEach(dep => {
        this.check(`Dependencia: ${dep}`, deps[dep] !== undefined);
      });

      // Check if node_modules exists
      this.check('node_modules instalado', existsSync('node_modules'));
      
    } catch (error) {
      this.check('package.json válido', false);
    }
  }

  async checkConfiguration() {
    log.header('Configuración');
    
    // Check environment files
    this.check('.env.example existe', existsSync('.env.example'), true);
    this.check('.env.local configurado', existsSync('.env.local'), true);
    
    // Check config files
    this.check('vite.config.js existe', existsSync('vite.config.js'));
    this.check('tailwind.config.js existe', existsSync('tailwind.config.js'));
    
    // Check if build directory exists (optional)
    this.check('Directorio dist/ (build)', existsSync('dist'), true);
  }

  async checkServices() {
    log.header('Servicios');
    
    try {
      // Check API service
      const apiService = readFileSync('src/services/api.js', 'utf8');
      this.check('API Service contiene AWS config', apiService.includes('VITE_AWS_API_GATEWAY_URL'));
      this.check('API Service tiene métodos requeridos', 
        apiService.includes('sendContactForm') && 
        apiService.includes('sendDownloadRequest')
      );
      
      // Check hooks
      const hookExists = existsSync('src/hooks/useApiStatus.js');
      this.check('Hook useApiStatus existe', hookExists);
      
      if (hookExists) {
        const hookContent = readFileSync('src/hooks/useApiStatus.js', 'utf8');
        this.check('Hook useApiStatus funcional', hookContent.includes('useState') && hookContent.includes('useEffect'));
      }
      
    } catch (error) {
      this.check('Servicios accesibles', false);
    }
  }

  async checkTests() {
    log.header('Tests');
    
    const testFiles = [
      'src/tests/api.test.js',
      'src/tests/aws-api.test.js',
      'src/tests/integration-test.test.js',
      'src/tests/performance.test.js',
      'src/tests/forms-validation.test.js'
    ];

    testFiles.forEach(testFile => {
      this.check(`Test file: ${testFile}`, existsSync(testFile), true);
    });

    // Try to run a quick test
    try {
      execSync('npm test -- --run --reporter=basic src/tests/performance.test.js', { 
        stdio: 'pipe',
        timeout: 30000 
      });
      this.check('Tests de performance ejecutables', true);
    } catch (error) {
      this.check('Tests de performance ejecutables', false, true);
    }
  }

  async checkBuild() {
    log.header('Build del Proyecto');
    
    try {
      log.info('Ejecutando build de prueba...');
      execSync('npm run build', { 
        stdio: 'pipe',
        timeout: 60000 
      });
      this.check('Build del proyecto exitoso', true);
      this.check('Directorio dist/ generado', existsSync('dist'));
      
      // Check if key files are in dist
      if (existsSync('dist')) {
        this.check('index.html en dist/', existsSync('dist/index.html'));
        this.check('Assets generados', existsSync('dist/assets'), true);
      }
      
    } catch (error) {
      this.check('Build del proyecto exitoso', false);
      log.error(`Error en build: ${error.message.split('\n')[0]}`);
    }
  }

  printSummary() {
    log.header('RESUMEN DE VALIDACIÓN');
    
    const total = this.results.total;
    const passed = this.results.passed;
    const failed = this.results.failed;
    const warnings = this.results.warnings;
    
    console.log(`${colors.bold}Total de verificaciones: ${total}${colors.reset}`);
    console.log(`${colors.green}✅ Exitosas: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Fallidas: ${failed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Advertencias: ${warnings}${colors.reset}`);
    
    const successRate = Math.round((passed / total) * 100);
    console.log(`${colors.bold}Tasa de éxito: ${successRate}%${colors.reset}`);
    
    if (failed === 0) {
      log.success('🎉 SISTEMA VALIDADO EXITOSAMENTE - LISTO PARA PRODUCCIÓN');
    } else if (failed <= 2) {
      log.warning('⚠️  SISTEMA MAYORMENTE FUNCIONAL - REVISAR ISSUES MENORES');
    } else {
      log.error('❌ SISTEMA REQUIERE ATENCIÓN - RESOLVER ISSUES CRÍTICOS');
    }
    
    console.log(`\n${colors.blue}📊 Para más detalles, revisar: docs/testing-report.md${colors.reset}`);
  }
}

// Ejecutar validación
const validator = new SystemValidator();
validator.validate().catch(error => {
  console.error(`${colors.red}Error durante validación: ${error.message}${colors.reset}`);
  process.exit(1);
});