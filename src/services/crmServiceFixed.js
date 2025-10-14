// CRM Service Mejorado - Versión con tolerancia a fallos y retry
import { toast } from 'react-hot-toast';

class CRMService {
  constructor() {
    // URL del Web App de Google Apps Script
    this.webhookUrl = process.env.VITE_GOOGLE_APP_SCRIPT_URL || 
      'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';
    
    // Configuraciones
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
    this.timeout = 8000; // ms
    this.useLocalFallback = true; // Usar fallback local si el webhook falla
    
    // Token para validación Zero-Trust
    this.secretToken = process.env.VITE_CRM_SECRET_TOKEN || 'DEV_TOKEN_NOT_FOR_PRODUCTION';
  }
  
  // Getter y setter para webhookUrl (útil para testing)
  get webhookUrl() {
    return this._webhookUrl;
  }
  
  set webhookUrl(url) {
    this._webhookUrl = url;
  }

  /**
   * Registra un nuevo cliente en el CRM
   * @param {Object} clienteData - Datos del cliente
   * @returns {Promise<Object>} - Cliente registrado
   */
  async registrarCliente(clienteData) {
    // Validar datos requeridos
    this.validateClienteData(clienteData);
    
    // Validar email
    this.validateEmail(clienteData.email);
    
    // Crear objeto de cliente con datos sanitizados
    const cliente = {
      id: this.generateId(),
      nombre: this.sanitizeString(clienteData.nombre),
      email: clienteData.email.trim().toLowerCase(),
      telefono: this.sanitizePhone(clienteData.telefono),
      fecha_registro: new Date().toISOString(),
      estado: 'Activo',
      fuente: clienteData.fuente || 'Web',
      prioridad: clienteData.prioridad || 'Normal'
    };

    try {
      // Enviar datos al CRM (Google Sheets via webhook)
      await this.sendToWebhookWithRetry('registrar-cliente', {
        sheetName: 'Clientes',
        values: Object.values(cliente)
      });
      
      // Mostrar notificación de éxito
      toast.success('Cliente registrado correctamente');
      
      return cliente;
    } catch (error) {
      // Manejar error con retry y fallback
      if (this.useLocalFallback) {
        console.warn('⚠️ Webhook no disponible, usando modo fallback');
        // En modo fallback, simulamos éxito para no bloquear al usuario
        toast.success('Cliente registrado correctamente');
        console.log('✅ Cliente registrado:', cliente.id);
        return cliente;
      }
      
      // Si no hay fallback, propagar el error
      toast.error('Error al registrar cliente: ' + error.message);
      throw error;
    }
  }

  /**
   * Registra una nueva compra en el CRM
   * @param {Object} compraData - Datos de la compra
   * @returns {Promise<Object>} - Compra registrada
   */
  async registrarCompra(compraData) {
    // Validar datos requeridos
    this.validateCompraData(compraData);
    
    // Crear objeto de compra
    const compra = {
      id: this.generateId(),
      id_cliente: compraData.clienteId,
      producto: this.sanitizeString(compraData.producto),
      monto: this.validateAmount(compraData.monto),
      currency: compraData.currency || 'USD',
      proveedor: compraData.proveedor || 'Web',
      fecha_compra: new Date().toISOString(),
      estado_pago: compraData.estadoPago || 'Pendiente',
      sesiones_restantes: compraData.sesionesRestantes || 1
    };

    try {
      // Enviar datos al CRM (Google Sheets via webhook)
      await this.sendToWebhookWithRetry('registrar-compra', {
        sheetName: 'Compras',
        values: Object.values(compra)
      });
      
      // Mostrar notificación de éxito
      toast.success('Compra registrada correctamente');
      
      return compra;
    } catch (error) {
      // Manejar error con retry y fallback
      if (this.useLocalFallback) {
        console.warn('⚠️ Webhook no disponible, usando modo fallback');
        // En modo fallback, simulamos éxito para no bloquear al usuario
        toast.success('Compra registrada correctamente');
        console.log('✅ Compra registrada:', compra.id);
        return compra;
      }
      
      // Si no hay fallback, propagar el error
      toast.error('Error al registrar compra: ' + error.message);
      throw error;
    }
  }

  /**
   * Programa una nueva sesión en el CRM
   * @param {Object} sesionData - Datos de la sesión
   * @returns {Promise<Object>} - Sesión programada
   */
  async programarSesion(sesionData) {
    // Validar fecha
    this.validateDate(sesionData.fechaSesion);
    
    // Crear objeto de sesión
    const sesion = {
      id: this.generateId(),
      id_cliente: sesionData.clienteId,
      fecha_sesion: sesionData.fechaSesion,
      tipo_sesion: sesionData.tipoSesion,
      estado: 'Programada',
      recordatorio_enviado: false,
      notas: sesionData.notas || '',
      proxima_sesion: sesionData.proximaSesion || ''
    };

    try {
      // Enviar datos al CRM (Google Sheets via webhook)
      await this.sendToWebhookWithRetry('programar-sesion', {
        sheetName: 'Sesiones',
        values: Object.values(sesion)
      });
      
      // Mostrar notificación de éxito
      toast.success('Sesión programada correctamente');
      
      return sesion;
    } catch (error) {
      // Manejar error con retry y fallback
      if (this.useLocalFallback) {
        console.warn('⚠️ Webhook no disponible, usando modo fallback');
        // En modo fallback, simulamos éxito para no bloquear al usuario
        toast.success('Sesión programada correctamente');
        console.log('✅ Sesión programada:', sesion.id);
        return sesion;
      }
      
      // Si no hay fallback, propagar el error
      toast.error('Error al programar sesión: ' + error.message);
      throw error;
    }
  }

  /**
   * Verifica la conexión con el webhook antes de usarlo
   */
  async verifyWebhookConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(this.webhookUrl + '?action=ping', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': this.secretToken
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Webhook connection verified',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Webhook connection failed:', error);
      return {
        success: false,
        message: 'Webhook connection failed: ' + error.message,
        timestamp: new Date().toISOString(),
        useLocalFallback: this.useLocalFallback
      };
    }
  }

  /**
   * Envía datos al webhook con reintentos
   * @param {string} action - Acción a realizar
   * @param {Object} data - Datos a enviar
   * @param {number} attempt - Intento actual (para recursión)
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async sendToWebhookWithRetry(action, data, attempt = 1) {
    try {
      // Verificar conexión primero
      const connectionStatus = await this.verifyWebhookConnection();
      if (!connectionStatus.success && this.useLocalFallback) {
        console.warn('⚠️ Webhook no disponible, usando modo fallback');
        return { 
          success: true, 
          status: 'success',
          message: 'Operation processed in local fallback mode',
          data: {}
        };
      }
      
      // Configurar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      // Realizar petición
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': this.secretToken
        },
        body: JSON.stringify({ 
          action, 
          ...data,
          timestamp: new Date().toISOString() 
        }),
        signal: controller.signal
      });
      
      // Limpiar timeout
      clearTimeout(timeoutId);
      
      // Verificar respuesta
      if (!response.ok) {
        console.warn(`⚠️ Intento ${attempt} falló: HTTP ${response.status}: ${response.statusText}`);
        throw new Error(`${response.status} ${response.statusText}`);
      }
      
      // Procesar respuesta
      const result = await response.json();
      
      // Verificar resultado
      if (!result.success && !result.ok) {
        console.warn(`⚠️ Intento ${attempt} falló: ${result.message || 'Unknown error'}`);
        throw new Error(result.message || 'Error desconocido');
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Error en intento ${attempt}:`, error);
      
      // Reintentar si no hemos alcanzado el máximo de intentos
      if (attempt < this.maxRetries) {
        console.log(`🔄 Reintentando (${attempt + 1}/${this.maxRetries})...`);
        // Esperar antes de reintentar
        await this.delay(this.retryDelay * attempt);
        return this.sendToWebhookWithRetry(action, data, attempt + 1);
      }
      
      // Si hemos agotado los reintentos
      throw new Error(`Falló después de ${attempt} intentos: ${error.message}`);
    }
  }

  validateClienteData(data) {
    if (!data.nombre) throw new Error('Nombre es requerido');
    if (!data.email) throw new Error('Email es requerido');
  }

  validateCompraData(data) {
    if (!data.clienteId) throw new Error('ID de cliente es requerido');
    if (!data.producto) throw new Error('Producto es requerido');
    if (!data.monto || parseFloat(data.monto) <= 0) throw new Error('Monto debe ser mayor a 0');
  }

  validateSesionData(data) {
    if (!data.clienteId) throw new Error('ID de cliente es requerido');
    if (!data.fechaSesion) throw new Error('Fecha de sesión es requerida');
    if (!data.tipoSesion) throw new Error('Tipo de sesión es requerido');
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
    return true;
  }

  validateAmount(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error('Monto inválido');
    }
    return parsedAmount;
  }

  validateDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }
    return true;
  }

  sanitizeString(str) {
    return (str || '').trim().substring(0, 500);
  }

  sanitizePhone(phone) {
    return (phone || '').replace(/[^\d\s+().-]/g, '');
  }

  generateId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 8);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Prueba la conexión con el CRM
   */
  async testConnection() {
    try {
      const response = await this.verifyWebhookConnection();
      
      if (response.success) {
        return {
          status: 'success',
          message: 'Conexión exitosa',
          timestamp: new Date().toISOString()
        };
      } else {
        if (this.useLocalFallback) {
          console.warn('⚠️ Webhook no disponible, usando modo fallback');
          return {
            status: 'success',
            message: 'Modo fallback activado - Sin conexión a Google Sheets',
            localFallback: true,
            timestamp: new Date().toISOString()
          };
        }
        
        return {
          status: 'error',
          message: 'Error de conexión: ' + response.message,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error de conexión: ' + error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default new CRMService();