// Email Service - Versión de respaldo usando console.log
class EmailService {
  constructor() {
    this.webhookUrl = process.env.VITE_WEB_APP_URL || import.meta.env.VITE_WEB_APP_URL;
  }

  async notificarNuevaCompra(compraData) {
    console.log('📧 NUEVA COMPRA - Email que se enviaría:');
    console.log('Para:', 'maor@iku-cabalactiva.com');
    console.log('Asunto:', `🎉 Nueva Compra: ${compraData.producto}`);
    console.log('Datos:', compraData);
    
    // Por ahora solo registrar en consola
    return { success: true, method: 'console_log' };
  }

  async notificarNuevaSesion(sesionData) {
    console.log('📧 NUEVA SESIÓN - Email que se enviaría:');
    console.log('Para:', 'kabbalahuniversal@gmail.com');
    console.log('CC:', 'maor@iku-cabalactiva.com');
    console.log('Asunto:', `📅 Nueva Sesión: ${sesionData.tipoSesion}`);
    console.log('Datos:', sesionData);
    
    return { success: true, method: 'console_log' };
  }

  async recordatorioProximaSesion(sesionData) {
    console.log('📧 RECORDATORIO - Email que se enviaría:');
    console.log('Para:', 'kabbalahuniversal@gmail.com');
    console.log('Datos:', sesionData);
    
    return { success: true, method: 'console_log' };
  }
}

export default new EmailService();