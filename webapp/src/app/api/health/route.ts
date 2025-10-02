import { NextResponse } from 'next/server';
import { apiLogger } from '@/utils/logger';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    [key: string]: {
      status: 'up' | 'down' | 'unknown';
      response_time?: number;
      error?: string;
    }
  };
}

async function checkServiceHealth(url: string, timeout: number = 5000): Promise<{
  status: 'up' | 'down';
  response_time?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        status: 'up',
        response_time: responseTime
      };
    } else {
      return {
        status: 'down',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'down',
      response_time: responseTime,
      error: error.message
    };
  }
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    apiLogger.info('Health check requested', {
      operation: 'health_check',
      endpoint: '/api/health'
    });

    // Verificar servicios dependientes
    const [persistenceAgentHealth] = await Promise.all([
      checkServiceHealth('http://localhost:8082/health', 3000)
    ]);

    const services = {
      'persistence-agent': persistenceAgentHealth,
      'database': { status: 'up' as const }, // Simulado - en producción sería una verificación real
      'frontend': { status: 'up' as const, response_time: Date.now() - startTime }
    };

    // Determinar estado general del sistema
    const allServicesUp = Object.values(services).every(service => service.status === 'up');
    const anyServiceDown = Object.values(services).some(service => service.status === 'down');
    
    let systemStatus: HealthStatus['status'] = 'healthy';
    if (anyServiceDown) {
      systemStatus = 'unhealthy';
    } else if (!allServicesUp) {
      systemStatus = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status: systemStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services
    };

    apiLogger.info('Health check completed', {
      operation: 'health_check',
      system_status: systemStatus,
      services_count: Object.keys(services).length,
      response_time: Date.now() - startTime
    });

    // Devolver código de estado HTTP apropiado
    const httpStatus = systemStatus === 'healthy' ? 200 : 
                      systemStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: httpStatus });

  } catch (error: any) {
    apiLogger.error('Health check failed', {
      operation: 'health_check',
      error: error.message,
      error_type: error.constructor.name
    });

    const errorStatus: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services: {
        'system': { 
          status: 'down',
          error: error.message 
        }
      }
    };

    return NextResponse.json(errorStatus, { status: 503 });
  }
}