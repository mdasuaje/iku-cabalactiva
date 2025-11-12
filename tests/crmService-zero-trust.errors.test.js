import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import crmService from '../src/services/crmService-zero-trust.js';

// Backup del token original para restaurar después de cada test
const originalToken = crmService.secretToken;
const originalUrl = crmService.webhookUrl;

describe('CRMService Zero Trust - Manejo de errores', () => {
  beforeAll(() => {
    // Asegurar que las variables de entorno estén configuradas para testing
    if (!crmService.webhookUrl) {
      crmService.webhookUrl = 'https://script.google.com/macros/s/AKfycbwZj6KlJZN5GyCwHzSv-kEBuqnG2TAZdfFaU8-QHA6_EAxJptTL3byy6f4C9mQAxAk-_g/exec';
    }
    if (!crmService.secretToken) {
      crmService.secretToken = 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025';
    }
  });

  afterEach(() => {
    crmService.secretToken = originalToken;
    crmService.webhookUrl = originalUrl;
  });

  it('debe fallar con token incorrecto', async () => {
    crmService.secretToken = 'TOKEN_INVALIDO';
    const result = await crmService.testConnection();
    // Debe ser un objeto con success: false o con mensaje de error
    expect(result).toBeDefined();
    
    // El resultado puede ser success: false O puede tener un mensaje de error
    if (result.success !== undefined) {
      expect(result.success).toBe(false);
    } else {
      expect(result.message || result.error).toBeDefined();
    }
  }, 15000);

  it('debe fallar si el endpoint no existe', async () => {
    crmService.webhookUrl = 'https://script.google.com/macros/s/URL_INVALIDA/exec';
    const result = await crmService.testConnection();
    expect(result.success).toBe(false);
    // Verificar que el error existe antes de hacer match
    if (result.error) {
      expect(result.error).toMatch(/Error en webhook|Error del servidor|Endpoint no disponible|Error de conexión/);
    } else {
      // Si no hay propiedad error, verificar el mensaje
      expect(result.message).toMatch(/Error en webhook|Error del servidor|Endpoint no disponible|Error de conexión/);
    }
  });

  it('debe fallar si el formato de datos es incorrecto', async () => {
    // Usar token válido para probar error de datos
    crmService.secretToken = import.meta.env.VITE_CRM_SECRET_TOKEN || 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025';
    try {
      await crmService.sendToWebhook('update-crm', { sheetName: 'NoPermitida', values: [] });
      // Si no lanza error, fallar el test
      expect(true).toBe(false);
    } catch (error) {
      // Aceptar varios tipos de errores posibles
      expect(error.message).toMatch(/Hoja no permitida|Error del servidor|Error en webhook|429|Exception: The rowContents passed to appendRow\(\) must be nonempty/);
    }
  });
});

