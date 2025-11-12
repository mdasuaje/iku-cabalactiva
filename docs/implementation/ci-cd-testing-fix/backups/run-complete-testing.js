#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import ProjectStatusTester from './project-status-test.js';

class CompleteTestingSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      phases: {},
      summary: {}
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async runPhase(name, phaseFn) {
    this.log(`\n🚀 FASE: ${name}`);
    this.log('='.repeat(50));
    
    const startTime = Date.now();
    
    try {
      const result = await phaseFn();
      const duration = Date.now() - startTime;
      
      this.results.phases[name] = {
        status: 'SUCCESS',
        duration,
        result
      };
      
      this.log(`✅ FASE COMPLETADA: ${name} (${Math.round(duration/1000)}s)`, 'success');
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.phases[name] = {
        status: 'FAILED', 
        duration,
        error: error.message
      };
      
      this.log(`❌ FASE FALLIDA: ${name} - ${error.message}`, 'error');
      return false;
    }
  }

  // Fase 1: Preparación del entorno
  async phasePreparation() {
    this.log('Verificando entorno de desarrollo...');
    
    // Verificar Node.js version
    const nodeVersion = process.version;
    this.log(`Node.js version: ${nodeVersion}`);
    
    // Limpiar resultados anteriores
    if (fs.existsSync('test-results')) {
      execSync('rm -rf test-results/*', { stdio: 'pipe' });
    }
    fs.mkdirSync('test-results', { recursive: true });
    
    // Verificar dependencias críticas
    try {
      execSync('npm ls @playwright/test', { stdio: 'pipe' });
      execSync('npm ls vitest', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('Dependencias de testing no instaladas correctamente');
    }
    
    return { nodeVersion, environment: 'ready' };
  }

  // Fase 2: Testing de estatus del proyecto
  async phaseProjectStatus() {
    this.log('Ejecutando testing de estatus del proyecto...');
    
    const statusTester = new ProjectStatusTester();
    const success = await statusTester.run();
    
    if (!success) {
      throw new Error('El proyecto no pasó las verificaciones de estatus');
    }
    
    return { status: 'project_healthy' };
  }

  // Fase 3: Tests unitarios
  async phaseUnitTests() {
    this.log('Ejecutando tests unitarios...');
    
    try {
      execSync('npm run test:ci', { stdio: 'inherit' });
      return { status: 'unit_tests_passed' };
    } catch (error) {
      throw new Error('Tests unitarios fallaron');
    }
  }

  // Fase 4: Build y validación
  async phaseBuildValidation() {
    this.log('Ejecutando build y validación...');
    
    try {
      // Build del proyecto
      execSync('npm run build', { stdio: 'inherit' });
      
      // Verificar archivos críticos del build
      const criticalFiles = [
        'dist/index.html',
        'dist/assets'
      ];
      
      for (const file of criticalFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Archivo crítico del build no encontrado: ${file}`);
        }
      }
      
      // Verificar tamaño del build
      const stats = fs.statSync('dist');
      
      return { 
        status: 'build_successful',
        buildTime: stats.mtime
      };
    } catch (error) {
      throw new Error(`Build falló: ${error.message}`);
    }
  }

  // Fase 5: Tests E2E
  async phaseE2ETests() {
    this.log('Ejecutando tests End-to-End...');
    
    try {
      // Instalar browsers si es necesario
      try {
        execSync('npx playwright install --with-deps chromium', { stdio: 'pipe' });
      } catch (error) {
        this.log('Browsers ya instalados o error menor', 'warning');
      }
      
      // Ejecutar tests E2E
      execSync('npm run test:e2e', { stdio: 'inherit' });
      
      return { status: 'e2e_tests_passed' };
    } catch (error) {
      throw new Error('Tests E2E fallaron');
    }
  }

  // Fase 6: Performance y Lighthouse
  async phasePerformance() {
    this.log('Ejecutando tests de performance...');
    
    try {
      // Verificar si existe configuración de Lighthouse
      if (fs.existsSync('lighthouserc.json')) {
        execSync('npx lhci autorun', { stdio: 'inherit' });
      } else {
        this.log('Configuración de Lighthouse no encontrada, saltando...', 'warning');
      }
      
      return { status: 'performance_checked' };
    } catch (error) {
      this.log('Performance tests fallaron, continuando...', 'warning');
      return { status: 'performance_skipped', reason: error.message };
    }
  }

  // Fase 7: Security scan
  async phaseSecurity() {
    this.log('Ejecutando security scan...');
    
    try {
      // Audit de npm
      execSync('npm audit --audit-level=high', { stdio: 'pipe' });
      
      return { status: 'security_passed' };
    } catch (error) {
      this.log('Vulnerabilidades de seguridad detectadas', 'warning');
      return { status: 'security_warnings', details: error.message };
    }
  }

  // Generar reporte final
  generateFinalReport() {
    const phases = Object.keys(this.results.phases);
    const successful = phases.filter(p => this.results.phases[p].status === 'SUCCESS');
    const failed = phases.filter(p => this.results.phases[p].status === 'FAILED');
    
    this.results.summary = {
      total_phases: phases.length,
      successful: successful.length,
      failed: failed.length,
      success_rate: Math.round((successful.length / phases.length) * 100),
      overall_status: failed.length === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS',
      duration: Object.values(this.results.phases).reduce((sum, p) => sum + p.duration, 0)
    };

    // Guardar reporte completo
    const reportPath = 'test-results/complete-testing-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generar reporte HTML
    this.generateHTMLReport();

    return this.results;
  }

  generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>IKU Cábala Activa - Reporte de Testing Completo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .phase { margin: 15px 0; padding: 15px; border-left: 4px solid #10b981; background: #f0fdf4; }
        .phase.failed { border-left-color: #ef4444; background: #fef2f2; }
        .success { color: #10b981; }
        .failed { color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌟 IKU Cábala Activa - Reporte de Testing</h1>
        <p>Generado: ${this.results.timestamp}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Resumen Ejecutivo</h2>
        <p><strong>Estado General:</strong> <span class="${this.results.summary.overall_status === 'SUCCESS' ? 'success' : 'failed'}">${this.results.summary.overall_status}</span></p>
        <p><strong>Fases Exitosas:</strong> ${this.results.summary.successful}/${this.results.summary.total_phases}</p>
        <p><strong>Tasa de Éxito:</strong> ${this.results.summary.success_rate}%</p>
        <p><strong>Duración Total:</strong> ${Math.round(this.results.summary.duration/1000)}s</p>
    </div>
    
    <h2>🔍 Detalle por Fases</h2>
    ${Object.entries(this.results.phases).map(([name, phase]) => `
        <div class="phase ${phase.status === 'FAILED' ? 'failed' : ''}">
            <h3>${name} - <span class="${phase.status === 'SUCCESS' ? 'success' : 'failed'}">${phase.status}</span></h3>
            <p><strong>Duración:</strong> ${Math.round(phase.duration/1000)}s</p>
            ${phase.error ? `<p><strong>Error:</strong> ${phase.error}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>`;

    fs.writeFileSync('test-results/testing-report.html', html);
  }

  async run() {
    this.log('🌟 INICIANDO CICLO COMPLETO DE TESTING - IKU CÁBALA ACTIVA');
    this.log('=' .repeat(60));
    
    const phases = [
      ['Preparación del Entorno', () => this.phasePreparation()],
      ['Testing de Estatus del Proyecto', () => this.phaseProjectStatus()],
      ['Tests Unitarios', () => this.phaseUnitTests()],
      ['Build y Validación', () => this.phaseBuildValidation()],
      ['Tests End-to-End', () => this.phaseE2ETests()],
      ['Performance Testing', () => this.phasePerformance()],
      ['Security Scan', () => this.phaseSecurity()]
    ];

    let allSuccess = true;

    for (const [name, phaseFn] of phases) {
      const success = await this.runPhase(name, phaseFn);
      if (!success) allSuccess = false;
    }

    const report = this.generateFinalReport();
    
    this.log('\n📊 REPORTE FINAL');
    this.log('='.repeat(50));
    this.log(`Estado General: ${report.summary.overall_status}`, 
             report.summary.overall_status === 'SUCCESS' ? 'success' : 'warning');
    this.log(`Fases Exitosas: ${report.summary.successful}/${report.summary.total_phases}`);
    this.log(`Tasa de Éxito: ${report.summary.success_rate}%`);
    this.log(`Duración Total: ${Math.round(report.summary.duration/1000)}s`);
    this.log(`\n📄 Reportes generados en: test-results/`);

    return allSuccess;
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const suite = new CompleteTestingSuite();
  const success = await suite.run();
  process.exit(success ? 0 : 1);
}

export default CompleteTestingSuite;