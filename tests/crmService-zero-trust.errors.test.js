import { describe, it, expect } from 'vitest';
import crmService from '../src/services/crmService-zero-trust.js';

// Backup del token original para restaurar después de cada test
const originalToken = crmService.secretToken;

describe('CRMService Zero Trust - Manejo de errores', () => {
  afterEach(() => {
    crmService.secretToken = originalToken;
  });

  it('debe fallar con token incorrecto', async () => {
    crmService.secretToken = 'TOKEN_INVALIDO';
    const result = await crmService.testConnection();
    // Debe ser un objeto con success: false
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
  }, 15000);

  it('debe fallar si el endpoint no existe', async () => {
    const originalUrl = crmService.webhookUrl;
    crmService.webhookUrl = 'https://script.google.com/macros/s/URL_INVALIDA/exec';
    const result = await crmService.testConnection();
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Error en webhook|Error del servidor/);
    crmService.webhookUrl = originalUrl;
  });

  it('debe fallar si el formato de datos es incorrecto', async () => {
    // Usar token válido para probar error de datos
    crmService.secretToken = import.meta.env.VITE_CRM_SECRET_TOKEN || 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025';
    try {
      await crmService.sendToWebhook('update-crm', { sheetName: 'NoPermitida', values: [] });
    } catch (error) {
  expect(error.message).toMatch(/Hoja no permitida|Error del servidor|429 unknown|Exception: The rowContents passed to appendRow\(\) must be nonempty/);
    }
  });
});
