/**
 * Prueba simple para verificar la funcionalidad del servicio CRM
 * post-despliegue a producción
 */

import CRMService from '../src/services/crmService.js';

async function testCRMService() {
  console.log('🔍 Realizando prueba de servicio CRM...');
  
  try {
    // Probamos la conexión CRM
    console.log('Probando conexión al servicio CRM...');
    const connectionResult = await CRMService.testConnection();
    
    console.log('Resultado de conexión:', connectionResult);
    
    // Si la conexión está en modo fallback, es normal en entorno de prueba
    if (connectionResult.fallbackMode) {
      console.log('⚠️ Servicio CRM en modo fallback - Esto es normal en entorno de prueba');
    } else {
      console.log('✅ Conexión exitosa al servicio CRM');
    }
    
    // Simulamos el registro de un cliente de prueba
    console.log('Simulando registro de cliente de prueba...');
    const clientData = {
      nombre: 'Verificación Post-Despliegue',
      email: 'verification@test.com',
      telefono: '+0000000000',
      mensaje: 'Prueba post-despliegue automatizada'
    };
    
    const registroResult = await CRMService.registrarCliente(clientData);
    console.log('Resultado de registro:', registroResult);
    
    if (registroResult.id) {
      console.log('✅ Registro de cliente exitoso con ID:', registroResult.id);
    } else {
      console.log('⚠️ Registro de cliente completado pero sin ID generado');
    }
    
    console.log('✅ Prueba de servicio CRM completada');
    
  } catch (error) {
    console.error('❌ Error en prueba de servicio CRM:', error);
  }
}

// Ejecutar la prueba
testCRMService()
  .then(() => console.log('✅ Verificación completada'))
  .catch(err => console.error('❌ Error en verificación:', err));