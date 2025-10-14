// Diagnóstico de integración PayPal
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIAGNOSTICS_DIR = path.join(ROOT_DIR, 'docs', 'diagnostics');

// Crear directorio de diagnósticos si no existe
if (!fs.existsSync(DIAGNOSTICS_DIR)) {
  fs.mkdirSync(DIAGNOSTICS_DIR, { recursive: true });
}

/**
 * Diagnóstico de configuración de PayPal
 */
async function diagnosePayPal() {
  console.log('🔍 Iniciando diagnóstico de integración PayPal...');
  
  const diagnosticResults = {
    timestamp: new Date().toISOString(),
    componentStatus: 'unknown',
    environmentVars: {},
    sdkStatus: 'unknown',
    issues: []
  };
  
  // 1. Verificar variables de entorno
  try {
    // En un entorno real estas variables vendrían de import.meta.env
    // Para el diagnóstico usamos un enfoque diferente
    let env = {};
    
    // Intentar leer del archivo .env
    try {
      const envContent = fs.readFileSync(path.join(ROOT_DIR, '.env'), 'utf8');
      
      ['VITE_PAYPAL_CLIENT_ID', 'VITE_PAYPAL_CLIENT_TOKEN', 
       'VITE_PAYPAL_SINGLE_SESSION', 'VITE_PAYPAL_FULL_PACKAGE'].forEach(key => {
        const match = envContent.match(new RegExp(`${key}=(.+)`));
        if (match) {
          env[key] = match[1].trim();
          diagnosticResults.environmentVars[key] = {
            exists: true,
            valid: match[1].trim().length > 0 && !match[1].includes('placeholder')
          };
        } else {
          diagnosticResults.environmentVars[key] = {
            exists: false,
            valid: false
          };
          diagnosticResults.issues.push(`Variable ${key} no encontrada`);
        }
      });
    } catch (error) {
      console.error('❌ Error leyendo archivo .env:', error.message);
      diagnosticResults.issues.push(`Error leyendo .env: ${error.message}`);
    }
    
    // 2. Verificar componentes PayPal
    try {
      const paypalComponent = path.join(ROOT_DIR, 'src', 'components', 'payments', 'PayPalButton.jsx');
      const paypalProvider = path.join(ROOT_DIR, 'src', 'components', 'payments', 'PayPalProvider.jsx');
      
      // Verificar si existe el componente principal
      if (fs.existsSync(paypalComponent)) {
        const componentContent = fs.readFileSync(paypalComponent, 'utf8');
        
        // Analizar el componente para verificar integración correcta
        const usesPayPalSDK = componentContent.includes('@paypal/react-paypal-js');
        const usesCreateOrder = componentContent.includes('createOrder');
        const usesOnApprove = componentContent.includes('onApprove');
        
        // Verificar si el ClientID está en el Provider (patrón recomendado)
        let usesClientID = componentContent.includes('VITE_PAYPAL_CLIENT_ID');
        let providerConfiguresClientID = false;
        
        // Verificar si existe el provider y si usa el ClientID
        if (fs.existsSync(paypalProvider)) {
          const providerContent = fs.readFileSync(paypalProvider, 'utf8');
          providerConfiguresClientID = providerContent.includes('VITE_PAYPAL_CLIENT_ID');
          
          // Si el provider configura el ClientID, consideramos que está bien implementado
          if (providerConfiguresClientID) {
            usesClientID = true;
          }
        }
        
        diagnosticResults.componentStatus = {
          exists: true,
          usesPayPalSDK,
          usesClientID,
          hasCreateOrder: usesCreateOrder,
          hasOnApprove: usesOnApprove,
          providerConfiguresClientID,
          analysis: usesPayPalSDK && (usesClientID || providerConfiguresClientID) && usesCreateOrder && usesOnApprove
            ? 'OK' : 'Configuración incompleta'
        };
        
        if (!usesPayPalSDK) {
          diagnosticResults.issues.push('Componente no usa @paypal/react-paypal-js');
        }
        if (!usesClientID && !providerConfiguresClientID) {
          diagnosticResults.issues.push('No se encontró configuración de VITE_PAYPAL_CLIENT_ID en ningún componente');
        }
        if (!usesCreateOrder) {
          diagnosticResults.issues.push('Componente no implementa createOrder');
        }
        if (!usesOnApprove) {
          diagnosticResults.issues.push('Componente no implementa onApprove');
        }
      } else {
        diagnosticResults.componentStatus = {
          exists: false
        };
        diagnosticResults.issues.push('Componente PayPalButton.jsx no encontrado');
      }
    } catch (error) {
      console.error('❌ Error analizando componente PayPal:', error.message);
      diagnosticResults.issues.push(`Error analizando componente: ${error.message}`);
    }
    
    // Guardar resultados del diagnóstico
    fs.writeFileSync(
      path.join(DIAGNOSTICS_DIR, 'paypal-diagnosis.json'), 
      JSON.stringify(diagnosticResults, null, 2)
    );
    
    console.log('📊 RESUMEN DE DIAGNÓSTICO PAYPAL:');
    console.log('===============================');
    console.log(`🧩 Componente: ${diagnosticResults.componentStatus.exists ? '✅ Encontrado' : '❌ No encontrado'}`);
    
    if (diagnosticResults.componentStatus.exists) {
      console.log(`🔧 Integración: ${diagnosticResults.componentStatus.analysis}`);
    }
    
    console.log('🔑 Variables de entorno:');
    Object.entries(diagnosticResults.environmentVars).forEach(([key, status]) => {
      console.log(`   ${key}: ${status.exists ? '✅' : '❌'} ${status.valid ? 'Válida' : 'Inválida'}`);
    });
    
    console.log(`\n❓ Issues encontrados: ${diagnosticResults.issues.length}`);
    if (diagnosticResults.issues.length > 0) {
      diagnosticResults.issues.forEach((issue, i) => {
        console.log(`   ${i+1}. ${issue}`);
      });
    }
    
    console.log(`\n📄 Resultados guardados en: ${path.join(DIAGNOSTICS_DIR, 'paypal-diagnosis.json')}`);
    
    return diagnosticResults;
  } catch (error) {
    console.error('❌ Error en diagnóstico PayPal:', error);
    return {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Ejecutar si se llama directamente
if (import.meta.url.endsWith('diagnose-paypal.js')) {
  diagnosePayPal()
    .then(() => {
      console.log('🏁 Diagnóstico PayPal completado');
    })
    .catch(error => {
      console.error('💥 Error fatal en diagnóstico PayPal:', error);
      process.exit(1);
    });
}

export default diagnosePayPal;