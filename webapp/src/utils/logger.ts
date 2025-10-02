/**
 * Logger estructurado compatible con Google Cloud Logging
 * Para producción en Cloud Run
 */

interface LogEntry {
  timestamp: string;
  severity: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  component: string;
  service: string;
  [key: string]: any;
}

class StructuredLogger {
  private component: string;
  private service: string;

  constructor(component: string = 'frontend', service: string = 'iku-frontend') {
    this.component = component;
    this.service = service;
  }

  private log(severity: LogEntry['severity'], message: string, extra: Record<string, any> = {}) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      component: this.component,
      service: this.service,
      ...extra
    };

    // En desarrollo, usar console.log formateado
    // En producción (Cloud Run), imprimir JSON estructurado
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${severity}] ${message}`, extra);
    }
  }

  debug(message: string, extra: Record<string, any> = {}) {
    this.log('DEBUG', message, extra);
  }

  info(message: string, extra: Record<string, any> = {}) {
    this.log('INFO', message, extra);
  }

  warning(message: string, extra: Record<string, any> = {}) {
    this.log('WARNING', message, extra);
  }

  error(message: string, extra: Record<string, any> = {}) {
    this.log('ERROR', message, extra);
  }
}

// Exportar instancia por defecto para API Routes
export const apiLogger = new StructuredLogger('api-route', 'iku-frontend');

// Exportar clase para crear loggers específicos
export { StructuredLogger };