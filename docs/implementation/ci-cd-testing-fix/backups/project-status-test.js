#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class ProjectStatusTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      status: 'RUNNING',
      tests: {},
      summary: {}
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async runTest(name, testFn) {
    this.log(`Ejecutando: ${name}`);
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      this.results.tests[name] = {
        status: 'PASSED',
        duration,
        result
      };
      
      this.log(`${name} - PASSED (${duration}ms)`, 'success');
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.tests[name] = {
        status: 'FAILED',
        duration,
        error: error.message
      };
      
      this.log(`${name} - FAILED: ${error.message}`, 'error');
      return false;
    }
  }

  // Test 1: Verificar estructura del proyecto
  async testProjectStructure() {
    const requiredFiles = [
      'package.json',
      'vite.config.js',
      'src/App.jsx',
      'src/main.jsx',
      'public/index.html'
    ];

    const requiredDirs = [
      'src/components',
      'src/data',
      'src/utils',
      'tests/e2e'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Archivo requerido no encontrado: ${file}`);
      }
    }

    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        throw new Error(`Directorio requerido no encontrado: ${dir}`);
      }
    }

    return { files: requiredFiles.length, directories: requiredDirs.length };
  }

  // Test 2: Verificar dependencias
  async testDependencies() {
    try {
      execSync('npm ls --depth=0', { stdio: 'pipe' });
      return { status: 'All dependencies installed' };
    } catch (error) {
      throw new Error('Dependencias faltantes o conflictos detectados');
    }
  }

  // Test 3: Lint del código
  async testCodeQuality() {
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      return { status: 'Code quality passed' };
    } catch (error) {
      throw new Error('Errores de linting detectados');
    }
  }

  // Test 4: Build del proyecto
  async testBuild() {
    try {
      execSync('npm run build', { stdio: 'pipe' });
      
      if (!fs.existsSync('dist/index.html')) {
        throw new Error('Build no generó index.html');
      }
      
      const stats = fs.statSync('dist');
      return { 
        status: 'Build successful',
        buildTime: stats.mtime
      };
    } catch (error) {
      throw new Error(`Build falló: ${error.message}`);
    }
  }

  // Test 5: Tests unitarios
  async testUnit() {
    try {
      execSync('npm run test:ci', { stdio: 'pipe' });
      return { status: 'Unit tests passed' };
    } catch (error) {
      throw new Error('Tests unitarios fallaron');
    }
  }

  // Test 6: Verificar configuración de deployment
  async testDeploymentConfig() {
    const requiredFiles = [
      '.github/workflows/static.yml',
      'public/CNAME'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Archivo de deployment no encontrado: ${file}`);
      }
    }

    // Verificar CNAME
    const cname = fs.readFileSync('public/CNAME', 'utf8').trim();
    if (cname !== 'iku-cabalactiva.com') {
      throw new Error(`CNAME incorrecto: ${cname}`);
    }

    return { domain: cname, workflows: requiredFiles.length };
  }

  // Generar reporte final
  generateReport() {
    const passed = Object.values(this.results.tests).filter(t => t.status === 'PASSED').length;
    const failed = Object.values(this.results.tests).filter(t => t.status === 'FAILED').length;
    const total = passed + failed;

    this.results.summary = {
      total,
      passed,
      failed,
      success_rate: Math.round((passed / total) * 100),
      status: failed === 0 ? 'SUCCESS' : 'FAILED'
    };

    this.results.status = this.results.summary.status;

    // Guardar reporte
    const reportPath = 'test-results/project-status.json';
    fs.mkdirSync('test-results', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    return this.results;
  }

  async run() {
    this.log('🚀 Iniciando testing de estatus del proyecto IKU Cábala Activa');
    
    const tests = [
      ['Estructura del Proyecto', () => this.testProjectStructure()],
      ['Dependencias', () => this.testDependencies()],
      ['Calidad de Código', () => this.testCodeQuality()],
      ['Build del Proyecto', () => this.testBuild()],
      ['Tests Unitarios', () => this.testUnit()],
      ['Configuración de Deployment', () => this.testDeploymentConfig()]
    ];

    for (const [name, testFn] of tests) {
      await this.runTest(name, testFn);
    }

    const report = this.generateReport();
    
    this.log('📊 Reporte Final:');
    this.log(`Total: ${report.summary.total} | Passed: ${report.summary.passed} | Failed: ${report.summary.failed}`);
    this.log(`Success Rate: ${report.summary.success_rate}%`);
    this.log(`Status: ${report.summary.status}`, report.summary.status === 'SUCCESS' ? 'success' : 'error');

    return report.summary.status === 'SUCCESS';
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ProjectStatusTester();
  const success = await tester.run();
  process.exit(success ? 0 : 1);
}

export default ProjectStatusTester;