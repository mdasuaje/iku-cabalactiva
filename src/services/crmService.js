// CRM Service - Integración con Google Sheets (PRODUCCIÓN)
class CRMService {
  constructor() {
    this.webhookUrl = 'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';
  }

  async registrarCliente(clienteData) {
    const cliente = {
      id: Date.now().toString(),
      nombre: clienteData.nombre,
      email: clienteData.email,
      telefono: clienteData.telefono,
      fecha_registro: new Date().toISOString(),
      estado: 'Activo',
      prioridad: 'Normal'
    };

    await this.sendToWebhook('update-crm', {
      sheetName: 'Clientes',
      values: Object.values(cliente)
    });

    return cliente;
  }

  async registrarCompra(compraData) {
    const compra = {
      id_cliente: compraData.clienteId,
      producto: compraData.producto,
      monto: compraData.monto,
      proveedor: compraData.proveedor,
      fecha_compra: new Date().toISOString(),
      estado_pago: compraData.estadoPago,
      sesiones_restantes: compraData.sesionesRestantes || 1
    };

    await this.sendToWebhook('update-crm', {
      sheetName: 'Compras',
      values: Object.values(compra)
    });

    return compra;
  }

  async programarSesion(sesionData) {
    const sesion = {
      id_cliente: sesionData.clienteId,
      fecha_sesion: sesionData.fechaSesion,
      tipo_sesion: sesionData.tipoSesion,
      estado: 'Programada',
      notas: sesionData.notas || '',
      proxima_sesion: sesionData.proximaSesion || ''
    };

    await this.sendToWebhook('update-crm', {
      sheetName: 'Sesiones',
      values: Object.values(sesion)
    });

    return sesion;
  }

  async sendToWebhook(action, data) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });

    if (!response.ok) {
      throw new Error(`Error en webhook: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new CRMService();