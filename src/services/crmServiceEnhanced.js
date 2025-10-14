// Enhanced CRM Service Layer - Frontend Integration
// Provides additional utilities and UI integration helpers

import crmService from './crmService.js'
import { toast } from 'react-hot-toast'

/**
 * Enhanced CRM Service with UI integration helpers
 */
class CRMServiceEnhanced {
  constructor() {
    this.baseService = crmService
    this.cache = new Map()
    this.retryQueue = []
    this.isOnline = navigator.onLine
    
    // Setup online/offline listeners
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processRetryQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  /**
   * Register client with UI feedback and caching
   */
  async registrarClienteConUI(clienteData, showToast = true) {
    try {
      if (showToast) {
        toast.loading('Registrando cliente...', { id: 'register-client' })
      }

      const result = await this.baseService.registrarCliente(clienteData)
      
      // Cache the result
      this.cache.set(`cliente_${result.id}`, result)
      
      if (showToast) {
        toast.success('Cliente registrado exitosamente', { id: 'register-client' })
      }
      
      return result
    } catch (error) {
      if (showToast) {
        toast.error(`Error: ${error.message}`, { id: 'register-client' })
      }
      
      // Add to retry queue if offline
      if (!this.isOnline) {
        this.addToRetryQueue('registrarCliente', clienteData)
      }
      
      throw error
    }
  }

  /**
   * Register purchase with enhanced validation and UI feedback
   */
  async registrarCompraConUI(compraData, showToast = true) {
    try {
      if (showToast) {
        toast.loading('Procesando compra...', { id: 'register-purchase' })
      }

      // Enhanced validation
      this.validatePurchaseData(compraData)
      
      const result = await this.baseService.registrarCompra(compraData)
      
      // Cache the result
      this.cache.set(`compra_${result.id}`, result)
      
      if (showToast) {
        toast.success(`Compra registrada: ${compraData.producto}`, { id: 'register-purchase' })
      }
      
      // Trigger analytics event
      this.trackPurchaseEvent(result)
      
      return result
    } catch (error) {
      if (showToast) {
        toast.error(`Error en compra: ${error.message}`, { id: 'register-purchase' })
      }
      
      if (!this.isOnline) {
        this.addToRetryQueue('registrarCompra', compraData)
      }
      
      throw error
    }
  }

  /**
   * Schedule session with calendar integration
   */
  async programarSesionConUI(sesionData, showToast = true) {
    try {
      if (showToast) {
        toast.loading('Programando sesión...', { id: 'schedule-session' })
      }

      const result = await this.baseService.programarSesion(sesionData)
      
      // Cache the result
      this.cache.set(`sesion_${result.id}`, result)
      
      if (showToast) {
        toast.success('Sesión programada exitosamente', { id: 'schedule-session' })
      }
      
      return result
    } catch (error) {
      if (showToast) {
        toast.error(`Error programando sesión: ${error.message}`, { id: 'schedule-session' })
      }
      
      if (!this.isOnline) {
        this.addToRetryQueue('programarSesion', sesionData)
      }
      
      throw error
    }
  }

  /**
   * Enhanced purchase data validation
   */
  validatePurchaseData(data) {
    const errors = []
    
    if (!data.clienteId) errors.push('ID de cliente requerido')
    if (!data.producto?.trim()) errors.push('Producto requerido')
    if (!data.monto || data.monto <= 0) errors.push('Monto debe ser mayor a 0')
    if (data.monto > 10000) errors.push('Monto excede el límite máximo')
    
    // Validate currency
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD']
    if (data.currency && !validCurrencies.includes(data.currency)) {
      errors.push('Moneda no soportada')
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
  }

  /**
   * Add failed operations to retry queue
   */
  addToRetryQueue(method, data) {
    this.retryQueue.push({
      method,
      data,
      timestamp: Date.now(),
      attempts: 0
    })
    
    toast.info('Operación guardada para reintentar cuando vuelva la conexión')
  }

  /**
   * Process retry queue when back online
   */
  async processRetryQueue() {
    if (this.retryQueue.length === 0) return
    
    toast.info(`Procesando ${this.retryQueue.length} operaciones pendientes...`)
    
    const queue = [...this.retryQueue]
    this.retryQueue = []
    
    for (const item of queue) {
      try {
        await this.baseService[item.method](item.data)
        toast.success(`Operación ${item.method} completada`)
      } catch (error) {
        // Re-add to queue if still failing
        if (item.attempts < 3) {
          item.attempts++
          this.retryQueue.push(item)
        } else {
          toast.error(`Operación ${item.method} falló después de 3 intentos`)
        }
      }
    }
  }

  /**
   * Track purchase event for analytics
   */
  trackPurchaseEvent(purchaseData) {
    try {
      // Google Analytics 4 event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: purchaseData.id,
          value: purchaseData.monto,
          currency: purchaseData.currency || 'USD',
          items: [{
            item_id: purchaseData.producto,
            item_name: purchaseData.producto,
            category: 'Herramientas Espirituales',
            quantity: 1,
            price: purchaseData.monto
          }]
        })
      }
      
      // Facebook Pixel event
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          value: purchaseData.monto,
          currency: purchaseData.currency || 'USD',
          content_name: purchaseData.producto,
          content_type: 'product'
        })
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  /**
   * Get cached data
   */
  getCachedData(key) {
    return this.cache.get(key)
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.isOnline
  }

  /**
   * Get retry queue status
   */
  getRetryQueueStatus() {
    return {
      count: this.retryQueue.length,
      items: this.retryQueue.map(item => ({
        method: item.method,
        timestamp: item.timestamp,
        attempts: item.attempts
      }))
    }
  }

  /**
   * Test connection with UI feedback
   */
  async testConnectionWithUI() {
    try {
      toast.loading('Probando conexión...', { id: 'test-connection' })
      
      const result = await this.baseService.testConnection()
      
      if (result.status === 'success') {
        toast.success('Conexión exitosa', { id: 'test-connection' })
      } else {
        toast.error('Conexión falló', { id: 'test-connection' })
      }
      
      return result
    } catch (error) {
      toast.error(`Error de conexión: ${error.message}`, { id: 'test-connection' })
      throw error
    }
  }

  /**
   * Bulk operations with progress tracking
   */
  async processBulkOperations(operations, onProgress) {
    const results = []
    const total = operations.length
    
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      
      try {
        const result = await this.baseService[operation.method](operation.data)
        results.push({ success: true, result, operation })
        
        if (onProgress) {
          onProgress({
            completed: i + 1,
            total,
            percentage: Math.round(((i + 1) / total) * 100),
            current: operation
          })
        }
      } catch (error) {
        results.push({ success: false, error, operation })
      }
    }
    
    return results
  }
}

export default new CRMServiceEnhanced()