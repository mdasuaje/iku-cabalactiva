// Diagnóstico de integración Stripe
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
 * Diagnóstico de configuración de Stripe
 */
async function diagnoseStripe() {
  console.log('🔍 Iniciando diagnóstico de integración Stripe...');
  
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
      
      ['VITE_STRIPE_PUBLISHABLE_KEY', 'VITE_STRIPE_CHECKOUT'].forEach(key => {
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
    
    // 2. Verificar componente StripeCheckout.jsx
    try {
      const stripeComponent = path.join(ROOT_DIR, 'src', 'components', 'payments', 'StripeCheckout.jsx');
      
      if (fs.existsSync(stripeComponent)) {
        const componentContent = fs.readFileSync(stripeComponent, 'utf8');
        
        // Analizar el componente para verificar integración correcta
        const usesStripeJS = componentContent.includes('@stripe/react-stripe-js');
        const usesStripeElements = componentContent.includes('Elements') || componentContent.includes('useStripe');
        const usesPublishableKey = componentContent.includes('VITE_STRIPE_PUBLISHABLE_KEY');
        const usesCardElement = componentContent.includes('CardElement') || componentContent.includes('CardNumberElement');
        
        diagnosticResults.componentStatus = {
          exists: true,
          usesStripeJS,
          usesStripeElements,
          usesPublishableKey,
          usesCardElement,
          analysis: usesStripeJS && usesStripeElements && usesPublishableKey && usesCardElement
            ? 'OK' : 'Configuración incompleta'
        };
        
        if (!usesStripeJS) {
          diagnosticResults.issues.push('Componente no usa @stripe/react-stripe-js');
        }
        if (!usesStripeElements) {
          diagnosticResults.issues.push('Componente no usa Elements/useStripe');
        }
        if (!usesPublishableKey) {
          diagnosticResults.issues.push('Componente no usa VITE_STRIPE_PUBLISHABLE_KEY');
        }
        if (!usesCardElement) {
          diagnosticResults.issues.push('Componente no implementa CardElement');
        }
      } else {
        diagnosticResults.componentStatus = {
          exists: false
        };
        diagnosticResults.issues.push('Componente StripeCheckout.jsx no encontrado');
      }
    } catch (error) {
      console.error('❌ Error analizando componente Stripe:', error.message);
      diagnosticResults.issues.push(`Error analizando componente: ${error.message}`);
    }
    
    // 3. Verificar componente UnifiedPaymentModal (que debería contener ambos medios de pago)
    try {
      const unifiedComponent = path.join(ROOT_DIR, 'src', 'components', 'payments', 'UnifiedPaymentModal.jsx');
      
      if (fs.existsSync(unifiedComponent)) {
        const componentContent = fs.readFileSync(unifiedComponent, 'utf8');
        
        // Analizar si importa los componentes de pago
        const importStripe = componentContent.includes('StripeCheckout') || componentContent.includes('./StripeCheckout');
        const importPayPal = componentContent.includes('PayPalButton') || componentContent.includes('./PayPalButton');
        
        diagnosticResults.unifiedComponent = {
          exists: true,
          importStripe,
          importPayPal,
          analysis: importStripe && importPayPal 
            ? 'OK' : 'Integración incompleta'
        };
        
        if (!importStripe) {
          diagnosticResults.issues.push('UnifiedPaymentModal no importa StripeCheckout');
        }
        if (!importPayPal) {
          diagnosticResults.issues.push('UnifiedPaymentModal no importa PayPalButton');
        }
      } else {
        diagnosticResults.unifiedComponent = {
          exists: false
        };
        diagnosticResults.issues.push('Componente UnifiedPaymentModal.jsx no encontrado');
      }
    } catch (error) {
      console.error('❌ Error analizando componente UnifiedPaymentModal:', error.message);
      diagnosticResults.issues.push(`Error analizando componente unificado: ${error.message}`);
    }
    
    // Guardar resultados del diagnóstico
    fs.writeFileSync(
      path.join(DIAGNOSTICS_DIR, 'stripe-diagnosis.json'), 
      JSON.stringify(diagnosticResults, null, 2)
    );
    
    console.log('📊 RESUMEN DE DIAGNÓSTICO STRIPE:');
    console.log('===============================');
    console.log(`🧩 Componente principal: ${diagnosticResults.componentStatus.exists ? '✅ Encontrado' : '❌ No encontrado'}`);
    
    if (diagnosticResults.componentStatus.exists) {
      console.log(`🔧 Integración: ${diagnosticResults.componentStatus.analysis}`);
    }
    
    if (diagnosticResults.unifiedComponent) {
      console.log(`🧩 Componente unificado: ${diagnosticResults.unifiedComponent.exists ? '✅ Encontrado' : '❌ No encontrado'}`);
      
      if (diagnosticResults.unifiedComponent.exists) {
        console.log(`🔧 Integración unificada: ${diagnosticResults.unifiedComponent.analysis}`);
      }
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
    
    console.log(`\n📄 Resultados guardados en: ${path.join(DIAGNOSTICS_DIR, 'stripe-diagnosis.json')}`);
    
    return diagnosticResults;
  } catch (error) {
    console.error('❌ Error en diagnóstico Stripe:', error);
    return {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Ejecutar si se llama directamente
if (import.meta.url.endsWith('diagnose-stripe.js')) {
  diagnoseStripe()
    .then(() => {
      console.log('🏁 Diagnóstico Stripe completado');
    })
    .catch(error => {
      console.error('💥 Error fatal en diagnóstico Stripe:', error);
      process.exit(1);
    });
}

export default diagnoseStripe;