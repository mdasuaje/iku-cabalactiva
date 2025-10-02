import { NextResponse } from 'next/server';
import { apiLogger } from '@/utils/logger';
import { businessAnalytics } from '@/utils/analytics';

// Importamos nuestra lógica v3 - ¡Aquí es donde la magia ocurre!
const { RegisterUserUseCase } = require('@/../src-v3/2-Application/UseCases/RegisterUserUseCase');
const { GoogleSheetsUserRepository } = require('@/../src-v3/3-Infrastructure/Persistence/GoogleSheetsUserRepository');

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { email, password } = body;

    apiLogger.info('Register request received', { 
      operation: 'register_user', 
      email: email ? '***@domain.com' : null, // Enmascarar email por privacidad
      request_id: requestId,
      has_password: !!password
    });

    // Validación básica
    if (!email || !password) {
      apiLogger.warning('Register validation failed - missing required fields', {
        operation: 'register_user',
        request_id: requestId,
        error: 'missing_fields',
        has_email: !!email,
        has_password: !!password
      });
      
      // Analítica: Validación fallida
      businessAnalytics.trackFormValidation('email_password', false, 'missing_required_fields');
      businessAnalytics.trackApiAccess('/api/register', 'POST', 400, Date.now() - startTime);
      
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Analítica: Validación exitosa
    businessAnalytics.trackFormValidation('email_password', true);

    // Instanciamos nuestro caso de uso, ¡conectando el frontend con el backend!
    const userRepository = new GoogleSheetsUserRepository();
    const registerUserUseCase = new RegisterUserUseCase({ userRepository });
    
    apiLogger.info('Executing RegisterUserUseCase', {
      operation: 'register_user',
      request_id: requestId,
      step: 'use_case_execution'
    });
    
    const result = await registerUserUseCase.execute({ email, password });
    
    apiLogger.info('Register operation completed successfully', {
      operation: 'register_user',
      request_id: requestId,
      step: 'success',
      result_keys: Object.keys(result || {})
    });
    
    // Analítica: Registro exitoso
    businessAnalytics.trackUserRegistration(true, undefined, requestId);
    businessAnalytics.trackApiAccess('/api/register', 'POST', 200, Date.now() - startTime);
    
    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    apiLogger.error('Register operation failed', {
      operation: 'register_user',
      request_id: requestId,
      step: 'error',
      error: error.message,
      error_type: error.constructor.name
    });
    
    // Analítica: Registro fallido
    businessAnalytics.trackUserRegistration(false, error.message, requestId);
    businessAnalytics.trackApiAccess('/api/register', 'POST', 400, Date.now() - startTime);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  apiLogger.info('API documentation accessed', {
    operation: 'api_docs',
    endpoint: '/api/register',
    method: 'GET'
  });
  
  // Analítica: Acceso a documentación
  businessAnalytics.trackApiAccess('/api/register', 'GET', 200);
  
  return NextResponse.json({ 
    message: 'API Register - Use POST method',
    endpoints: {
      POST: '/api/register - Registra un nuevo usuario'
    }
  });
}