// CRM Service - Integración con Google Sheets
class CRMService {
  constructor() {
    this.spreadsheetId = process.env.VITE_GOOGLE_SHEETS_ID;
    this.apiKey = process.env.VITE_GOOGLE_API_KEY;
  }

  // Registrar nuevo cliente
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

    await this.appendToSheet('Clientes', Object.values(cliente));
    return cliente;
  }

  // Registrar compra
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

    await this.appendToSheet('Compras', Object.values(compra));
    return compra;
  }

  // Programar sesión
  async programarSesion(sesionData) {
    const sesion = {
      id_cliente: sesionData.clienteId,
      fecha_sesion: sesionData.fechaSesion,
      tipo_sesion: sesionData.tipoSesion,
      estado: 'Programada',
      notas: sesionData.notas || '',
      proxima_sesion: sesionData.proximaSesion || ''
    };

    await this.appendToSheet('Sesiones', Object.values(sesion));
    return sesion;
  }

  // Método genérico para agregar datos a una hoja
  async appendToSheet(sheetName, values) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${sheetName}:append?valueInputOption=RAW&key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values]
      })
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar ${sheetName}: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new CRMService();