#!/usr/bin/env node

/**
 * Diagnóstico Comprehensivo E2E Maestro
 * Este script coordina la ejecución de todos los diagnósticos individuales
 * y genera un reporte unificado según el plan establecido.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyEnvironmentVars, generateTestEnv } from './verify-env.js';
import diagnosePayPal from './diagnose-paypal.js';
import diagnoseStripe from './diagnose-stripe.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIAGNOSTICS_DIR = path.join(ROOT_DIR, 'docs', 'diagnostics');
const RESULTS_FILE = path.join(DIAGNOSTICS_DIR, 'e2e-errors-analysis.md');

// Asegurar que existe el directorio de diagnósticos
if (!fs.existsSync(DIAGNOSTICS_DIR)) {
  fs.mkdirSync(DIAGNOSTICS_DIR, { recursive: true });
  console.log(`📁 Directorio de diagnósticos creado: ${DIAGNOSTICS_DIR}`);
}

/**
 * Importar dinámicamente el servicio CRM
 */
async function importCRMService() {
  try {
    const module = await import('../src/services/crmService.js');
    return module.default;
  } catch (error) {
    console.error('❌ Error importando CRM Service:', error);
    return null;
  }
}

/**
 * Analiza los resultados de pruebas E2E
 */
async function analyzeE2EResults() {
  console.log('🔍 Analizando resultados de pruebas E2E...');
  
  const testResultsDir = path.join(ROOT_DIR, 'test-results');
  const results = {
    testRuns: [],
    errorPatterns: {},
    timestamp: new Date().toISOString()
  };
  
  // Comprobar si existe el directorio de resultados
  if (!fs.existsSync(testResultsDir)) {
    console.warn('⚠️ No se encontró directorio de resultados de pruebas E2E');
    return results;
  }
  
  // Listar archivos en el directorio
  try {
    const files = fs.readdirSync(testResultsDir);
    const jsonResults = files.filter(f => f.endsWith('.json'));
    
    console.log(`📊 Encontrados ${jsonResults.length} archivos de resultados`);
    
    // Analizar cada archivo de resultados
    for (const file of jsonResults) {
      try {
        const content = fs.readFileSync(path.join(testResultsDir, file), 'utf8');
        const testData = JSON.parse(content);
        
        // Extraer información relevante
        const testRun = {
          file,
          timestamp: testData.timestamp || 'unknown',
          status: testData.status || 'unknown',
          errors: []
        };
        
        // Buscar patrones de error
        if (testData.errors && Array.isArray(testData.errors)) {
          testData.errors.forEach(error => {
            const errorType = error.type || 'unknown';
            const errorMessage = error.message || 'Sin mensaje';
            
            // Añadir a este test run
            testRun.errors.push({
              type: errorType,
              message: errorMessage,
              location: error.location || 'unknown'
            });
            
            // Contabilizar para patrones
            if (!results.errorPatterns[errorType]) {
              results.errorPatterns[errorType] = {
                count: 0,
                messages: []
              };
            }
            
            results.errorPatterns[errorType].count++;
            if (!results.errorPatterns[errorType].messages.includes(errorMessage)) {
              results.errorPatterns[errorType].messages.push(errorMessage);
            }
          });
        }
        
        results.testRuns.push(testRun);
      } catch (error) {
        console.error(`❌ Error analizando archivo ${file}:`, error.message);
      }
    }
    
    return results;
  } catch (error) {
    console.error('❌ Error listando archivos de resultados:', error);
    return results;
  }
}

/**
 * Diagnóstico del formulario de contacto
 */
async function diagnoseContactForm() {
  console.log('🔍 Iniciando diagnóstico del formulario de contacto...');
  
  const results = {
    component: 'unknown',
    functionality: 'unknown',
    issues: []
  };
  
  // Verificar existencia del componente (buscar en varias ubicaciones posibles)
  const contactFormPaths = [
    path.join(ROOT_DIR, 'src', 'components', 'ContactForm.jsx'),
    path.join(ROOT_DIR, 'src', 'components', 'forms', 'ContactForm.jsx'),
    path.join(ROOT_DIR, 'src', 'components', 'common', 'ContactForm.jsx')
  ];
  
  let contactFormPath = null;
  
  // Verificar cada posible ubicación
  for (const possiblePath of contactFormPaths) {
    if (fs.existsSync(possiblePath)) {
      contactFormPath = possiblePath;
      break;
    }
  }
  
  if (!contactFormPath) {
    console.error('❌ No se encontró el componente ContactForm.jsx');
    results.component = 'not_found';
    results.issues.push('Componente ContactForm.jsx no encontrado');
    return results;
  }
  
  try {
    // Leer el contenido del componente
    const content = fs.readFileSync(contactFormPath, 'utf8');
    results.component = 'found';
    
    // Verificar si usa variables de entorno
    if (content.includes('import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL')) {
      results.usesEnvVar = true;
    } else {
      results.usesEnvVar = false;
      results.issues.push('No usa la variable de entorno VITE_GOOGLE_APP_SCRIPT_URL');
    }
    
    // Verificar manejo de errores
    if (content.includes('catch') && content.includes('error')) {
      results.hasErrorHandling = true;
    } else {
      results.hasErrorHandling = false;
      results.issues.push('No implementa manejo de errores adecuado');
    }
    
    // Verificar si usa fetch para enviar datos
    if (content.includes('fetch(') && (content.includes('method: "POST"') || content.includes("method: 'POST'"))) {
      results.usesFetch = true;
    } else {
      results.usesFetch = false;
      results.issues.push('No usa fetch para enviar datos al backend');
    }
    
    // Verificar validación de formulario
    if ((content.includes('validate') || content.includes('validation')) && content.includes('email')) {
      results.hasValidation = true;
    } else {
      results.hasValidation = false;
      results.issues.push('No implementa validación de formulario');
    }
    
    // Evaluación general
    if (results.usesEnvVar && results.hasErrorHandling && results.usesFetch && results.hasValidation) {
      results.functionality = 'ok';
    } else {
      results.functionality = 'issues';
    }
    
    return results;
  } catch (error) {
    console.error('❌ Error analizando formulario de contacto:', error);
    results.issues.push(`Error en análisis: ${error.message}`);
    return results;
  }
}

/**
 * Diagnóstico de integración CRM
 */
async function diagnoseCRMIntegration() {
  console.log('🔍 Iniciando diagnóstico de integración CRM...');
  
  const results = {
    service: 'unknown',
    webhookUrl: 'unknown',
    connectivity: 'unknown',
    issues: []
  };
  
  // Importar servicio CRM
  const crmService = await importCRMService();
  
  if (!crmService) {
    console.error('❌ No se pudo importar el servicio CRM');
    results.service = 'import_failed';
    results.issues.push('No se pudo importar el servicio CRM');
    return results;
  }
  
  results.service = 'loaded';
  results.webhookUrl = crmService.webhookUrl || 'no_url';
  
  if (!crmService.webhookUrl) {
    results.issues.push('URL del webhook no configurada');
  }
  
  // Probar conectividad
  try {
    console.log('🧪 Probando conexión CRM...');
    const testResult = await crmService.testConnection();
    
    results.connectionTest = testResult;
    
    if (testResult.status === 'success') {
      results.connectivity = 'success';
      // Si es modo diagnóstico, agregar esta información
      if (testResult.diagnosticMode) {
        console.log('ℹ️ CRM en modo diagnóstico: simulación de conexión exitosa');
      }
    } else {
      results.connectivity = 'failed';
      results.issues.push(`Error de conexión: ${testResult.message}`);
    }
  } catch (error) {
    console.error('❌ Error probando conexión CRM:', error);
    results.connectivity = 'error';
    results.issues.push(`Error en test: ${error.message}`);
  }
  
  return results;
}

/**
 * Ejecuta el diagnóstico completo según el plan E2E
 */
async function runComprehensiveDiagnostic() {
  console.log('\n🚀 INICIANDO DIAGNÓSTICO COMPREHENSIVO E2E');
  console.log('===========================================\n');
  
  const startTime = Date.now();
  const allResults = {};
  
  // 1. Verificar variables de entorno
  console.log('\n📋 FASE 1: VERIFICACIÓN DE ENTORNO');
  console.log('-----------------------------------');
  
  let envOk = verifyEnvironmentVars();
  
  if (!envOk && !process.argv.includes('--no-generate')) {
    console.log('⚠️ Generando variables de entorno de prueba para continuar diagnóstico...');
    generateTestEnv();
    envOk = verifyEnvironmentVars(path.join(ROOT_DIR, '.env.test'));
  }
  
  allResults.environment = { status: envOk ? 'ok' : 'issues' };
  
  // 2. Analizar errores E2E
  console.log('\n📋 FASE 2: ANÁLISIS DE ERRORES E2E');
  console.log('----------------------------------');
  
  const e2eResults = await analyzeE2EResults();
  allResults.e2eAnalysis = e2eResults;
  
  // 3. Diagnóstico de componentes principales
  console.log('\n📋 FASE 3: DIAGNÓSTICO DE COMPONENTES');
  console.log('-------------------------------------');
  
  // 3.1 Formulario de contacto
  console.log('\n🧩 Diagnóstico de Formulario de Contacto');
  allResults.contactForm = await diagnoseContactForm();
  
  // 3.2 Integración CRM
  console.log('\n🧩 Diagnóstico de Integración CRM');
  allResults.crmIntegration = await diagnoseCRMIntegration();
  
  // 3.3 Diagnóstico PayPal
  console.log('\n🧩 Diagnóstico de Integración PayPal');
  allResults.paypalIntegration = await diagnosePayPal();
  
  // 3.4 Diagnóstico Stripe
  console.log('\n🧩 Diagnóstico de Integración Stripe');
  allResults.stripeIntegration = await diagnoseStripe();
  
  // Guardar todos los resultados
  const resultsJSON = path.join(DIAGNOSTICS_DIR, 'comprehensive-diagnosis.json');
  fs.writeFileSync(resultsJSON, JSON.stringify(allResults, null, 2));
  
  // Generar reporte en formato Markdown
  generateReport(allResults);
  
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Diagnóstico completo finalizado en ${elapsedTime} segundos`);
  console.log(`📊 Resultados JSON: ${resultsJSON}`);
  console.log(`📄 Reporte MD: ${RESULTS_FILE}`);
}

/**
 * Genera un reporte en formato Markdown basado en los resultados
 */
function generateReport(results) {
  console.log('📝 Generando reporte de diagnóstico...');
  
  let report = `# 📊 Análisis de Errores E2E y Diagnóstico Comprehensivo
  
**Fecha:** ${new Date().toLocaleString()}
**Generado por:** Diagnóstico Comprehensivo E2E Automatizado v1.0

## 🔍 Resumen Ejecutivo

`;

  // Análisis general
  const issues = [
    ...(results.contactForm?.issues || []),
    ...(results.crmIntegration?.issues || []),
    ...(results.paypalIntegration?.issues || []),
    ...(results.stripeIntegration?.issues || [])
  ];
  
  report += `- **Estado del entorno:** ${results.environment.status === 'ok' ? '✅ OK' : '❌ Con problemas'}\n`;
  report += `- **Formulario de contacto:** ${results.contactForm?.functionality === 'ok' ? '✅ Funcional' : '❌ Con problemas'}\n`;
  report += `- **Integración CRM:** ${results.crmIntegration?.connectivity === 'success' ? '✅ Conectado' : '❌ Problemas de conexión'}\n`;
  report += `- **Integración PayPal:** ${(results.paypalIntegration?.issues || []).length === 0 ? '✅ OK' : '❌ Con problemas'}\n`;
  report += `- **Integración Stripe:** ${(results.stripeIntegration?.issues || []).length === 0 ? '✅ OK' : '❌ Con problemas'}\n`;
  report += `- **Total de issues:** ${issues.length}\n\n`;
  
  // Detalles de errores E2E
  report += `## 🚨 Patrones de Error E2E\n\n`;
  
  if (results.e2eAnalysis?.errorPatterns && Object.keys(results.e2eAnalysis.errorPatterns).length > 0) {
    Object.entries(results.e2eAnalysis.errorPatterns).forEach(([errorType, data]) => {
      report += `### ${errorType} (${data.count} ocurrencias)\n\n`;
      data.messages.forEach((message, i) => {
        report += `${i+1}. ${message}\n`;
      });
      report += '\n';
    });
  } else {
    report += `No se encontraron patrones de error en los resultados E2E analizados.\n\n`;
  }
  
  // Detalles por componente
  report += `## 📋 Diagnóstico por Componente\n\n`;
  
  // Formulario de contacto
  report += `### Formulario de Contacto\n\n`;
  report += `- **Estado:** ${results.contactForm?.component === 'found' ? 'Encontrado' : 'No encontrado'}\n`;
  report += `- **Funcionalidad:** ${results.contactForm?.functionality === 'ok' ? 'Correcta' : 'Con problemas'}\n`;
  
  if (results.contactForm?.issues?.length > 0) {
    report += `\n**Issues detectados:**\n\n`;
    results.contactForm.issues.forEach((issue, i) => {
      report += `${i+1}. ${issue}\n`;
    });
  }
  
  report += `\n`;
  
  // Integración CRM
  report += `### Integración CRM\n\n`;
  report += `- **Estado del servicio:** ${results.crmIntegration?.service === 'loaded' ? 'Cargado correctamente' : 'Error al cargar'}\n`;
  report += `- **URL del webhook:** \`${results.crmIntegration?.webhookUrl || 'No configurada'}\`\n`;
  report += `- **Conectividad:** ${results.crmIntegration?.connectivity === 'success' ? 'Exitosa' : 'Fallida'}\n`;
  
  if (results.crmIntegration?.issues?.length > 0) {
    report += `\n**Issues detectados:**\n\n`;
    results.crmIntegration.issues.forEach((issue, i) => {
      report += `${i+1}. ${issue}\n`;
    });
  }
  
  report += `\n`;
  
  // PayPal Integration
  report += `### Integración PayPal\n\n`;
  
  if (results.paypalIntegration?.componentStatus?.exists) {
    report += `- **Estado del componente:** Encontrado\n`;
    report += `- **Configuración:** ${results.paypalIntegration.componentStatus.analysis}\n`;
  } else {
    report += `- **Estado del componente:** No encontrado\n`;
  }
  
  if (results.paypalIntegration?.issues?.length > 0) {
    report += `\n**Issues detectados:**\n\n`;
    results.paypalIntegration.issues.forEach((issue, i) => {
      report += `${i+1}. ${issue}\n`;
    });
  }
  
  report += `\n`;
  
  // Stripe Integration
  report += `### Integración Stripe\n\n`;
  
  if (results.stripeIntegration?.componentStatus?.exists) {
    report += `- **Estado del componente:** Encontrado\n`;
    report += `- **Configuración:** ${results.stripeIntegration.componentStatus.analysis}\n`;
  } else {
    report += `- **Estado del componente:** No encontrado\n`;
  }
  
  if (results.stripeIntegration?.unifiedComponent?.exists) {
    report += `- **Componente unificado:** Encontrado\n`;
    report += `- **Integración en componente unificado:** ${results.stripeIntegration.unifiedComponent.analysis}\n`;
  } else {
    report += `- **Componente unificado:** No encontrado\n`;
  }
  
  if (results.stripeIntegration?.issues?.length > 0) {
    report += `\n**Issues detectados:**\n\n`;
    results.stripeIntegration.issues.forEach((issue, i) => {
      report += `${i+1}. ${issue}\n`;
    });
  }
  
  report += `\n`;
  
  // Plan de acción recomendado
  report += `## 🛠️ Plan de Acción Recomendado\n\n`;
  
  if (issues.length === 0) {
    report += `No se detectaron problemas. El sistema parece estar funcionando correctamente.\n`;
  } else {
    // Agrupar issues por prioridad
    const criticalIssues = [];
    const highIssues = [];
    const mediumIssues = [];
    
    // Clasificar issues
    issues.forEach(issue => {
      if (issue.includes('CRM') || issue.includes('webhook') || issue.includes('conectividad')) {
        criticalIssues.push(issue);
      } else if (issue.includes('PayPal') || issue.includes('Stripe') || issue.includes('pago')) {
        highIssues.push(issue);
      } else {
        mediumIssues.push(issue);
      }
    });
    
    // Críticos
    if (criticalIssues.length > 0) {
      report += `### Críticos (Resolver inmediatamente)\n\n`;
      criticalIssues.forEach((issue, i) => {
        report += `${i+1}. ${issue}\n`;
      });
      report += '\n';
    }
    
    // Altos
    if (highIssues.length > 0) {
      report += `### Altos (Resolver en las próximas 24 horas)\n\n`;
      highIssues.forEach((issue, i) => {
        report += `${i+1}. ${issue}\n`;
      });
      report += '\n';
    }
    
    // Medios
    if (mediumIssues.length > 0) {
      report += `### Medios (Resolver cuando sea conveniente)\n\n`;
      mediumIssues.forEach((issue, i) => {
        report += `${i+1}. ${issue}\n`;
      });
      report += '\n';
    }
  }
  
  // Conclusiones
  report += `## 📝 Conclusiones\n\n`;
  
  if (issues.length === 0) {
    report += `El sistema ha pasado todos los diagnósticos satisfactoriamente. No se requieren acciones correctivas inmediatas.\n`;
  } else if (issues.length <= 3) {
    report += `Se han detectado algunos problemas menores que deben ser corregidos, pero el sistema parece estar mayormente funcional.\n`;
  } else if (issues.length <= 7) {
    report += `Se han detectado varios problemas que necesitan atención. Es recomendable resolver estos issues antes de proceder a producción.\n`;
  } else {
    report += `Se han detectado múltiples problemas críticos que requieren atención inmediata. El sistema no está listo para producción.\n`;
  }
  
  // Escribir el archivo
  fs.writeFileSync(RESULTS_FILE, report);
}

// Ejecutar diagnóstico completo
runComprehensiveDiagnostic().catch(error => {
  console.error('💥 Error fatal en diagnóstico:', error);
  process.exit(1);
});