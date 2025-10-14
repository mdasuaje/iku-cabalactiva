// Script para diagnosticar la conexión CRM
import CRMService from '../src/services/crmService.js';

/**
 * Ejecuta un diagnóstico de conexión del CRM
 */
async function testCRMConnection() {
  console.log('🔍 Iniciando diagnóstico de conexión CRM...');
  console.log('📊 URL de webhook configurada:', CRMService.webhookUrl);
  
  try {
    // Test de conexión básico
    console.log('🧪 Probando conexión básica...');
    const connectionResult = await CRMService.testConnection();
    console.log('✅ Resultado de conexión:', JSON.stringify(connectionResult, null, 2));
    
    // Verificar funcionalidad de webhook
    console.log('🧪 Verificando webhookUrl...');
    const webhookResult = await CRMService.verifyWebhookConnection();
    console.log('✅ Resultado de webhook:', JSON.stringify(webhookResult, null, 2));
    
    // Verificar variables de entorno
    console.log('🧪 Verificando variables de entorno...');
    let envStatus = 'No disponible';
    
    try {
      // Intentar acceder a variables de entorno
      const webhookEnv = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      envStatus = webhookEnv ? `Configurada: ${webhookEnv}` : 'No configurada';
    } catch (error) {
      envStatus = `Error accediendo a env: ${error.message}`;
    }
    
    console.log('📊 Estado de VITE_GOOGLE_APP_SCRIPT_URL:', envStatus);
    
    // Resultado final
    console.log('\n📝 RESUMEN DEL DIAGNÓSTICO:');
    console.log('=======================');
    console.log(`🔌 Conexión CRM: ${connectionResult.status === 'success' ? '✅ FUNCIONA' : '❌ FALLA'}`);
    console.log(`🌐 Webhook: ${webhookResult.success ? '✅ ACCESIBLE' : '❌ NO ACCESIBLE'}`);
    console.log(`🔑 Variables de entorno: ${envStatus === 'No configurada' ? '⚠️ NO CONFIGURADA' : '✅ OK'}`);
    console.log('=======================');
    
    return {
      connectionResult,
      webhookResult,
      envStatus
    };
  } catch (error) {
    console.error('❌ ERROR en diagnóstico CRM:', error);
    return {
      status: 'error',
      message: error.message,
      stack: error.stack
    };
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === import.meta.main) {
  testCRMConnection()
    .then(() => {
      console.log('🏁 Diagnóstico CRM completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error fatal en diagnóstico CRM:', error);
      process.exit(1);
    });
}

export default testCRMConnection;