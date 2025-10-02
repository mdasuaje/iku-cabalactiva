/**
 * Analytics helper para rastrear eventos de negocio importantes
 * Compatible con múltiples proveedores de analítica
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
  user_id?: string;
  session_id?: string;
}

class BusinessAnalytics {
  private enabled: boolean;
  private provider: string;

  constructor(provider: string = 'vercel') {
    this.enabled = process.env.NODE_ENV === 'production';
    this.provider = provider;
  }

  /**
   * Rastrea eventos de registro de usuario
   */
  trackUserRegistration(success: boolean, error?: string, requestId?: string) {
    this.track('user_registration', {
      success,
      error: error || null,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      flow: 'web_form'
    });
  }

  /**
   * Rastrea validaciones de formulario
   */
  trackFormValidation(field: string, isValid: boolean, error?: string) {
    this.track('form_validation', {
      field,
      is_valid: isValid,
      error: error || null,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Rastrea accesos a endpoints de API
   */
  trackApiAccess(endpoint: string, method: string, statusCode: number, duration?: number) {
    this.track('api_access', {
      endpoint,
      method,
      status_code: statusCode,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
  }

  private track(event: string, properties: Record<string, any>) {
    if (!this.enabled) {
      // En desarrollo, solo logear
      console.log(`[ANALYTICS] ${event}:`, properties);
      return;
    }

    // En producción, enviar a los proveedores configurados
    try {
      // Vercel Analytics automáticamente captura pageviews
      // Para eventos personalizados, usaríamos su API
      
      // Para otros proveedores (Google Analytics, Mixpanel, etc.)
      // this.sendToProvider(event, properties);
      
      console.log(`[ANALYTICS] ${event}:`, properties);
    } catch (error) {
      console.error('[ANALYTICS] Error tracking event:', error);
    }
  }
}

// Exportar instancia para usar en API Routes
export const businessAnalytics = new BusinessAnalytics();

// Exportar clase para crear instancias específicas
export { BusinessAnalytics };