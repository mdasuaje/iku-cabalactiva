import { NextResponse } from 'next/server';

// Importamos nuestra lógica v3 - ¡Aquí es donde la magia ocurre!
const { RegisterUserUseCase } = require('@/../src-v3/2-Application/UseCases/RegisterUserUseCase');
const { GoogleSheetsUserRepository } = require('@/../src-v3/3-Infrastructure/Persistence/GoogleSheetsUserRepository');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('📧 API Route - Datos recibidos:', { email, password: '***' });

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Instanciamos nuestro caso de uso, ¡conectando el frontend con el backend!
    const userRepository = new GoogleSheetsUserRepository();
    const registerUserUseCase = new RegisterUserUseCase({ userRepository });
    
    console.log('🔥 API Route - Ejecutando RegisterUserUseCase...');
    const result = await registerUserUseCase.execute({ email, password });
    
    console.log('✅ API Route - Éxito:', result);
    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error('❌ API Route - Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'API Register - Use POST method',
    endpoints: {
      POST: '/api/register - Registra un nuevo usuario'
    }
  });
}