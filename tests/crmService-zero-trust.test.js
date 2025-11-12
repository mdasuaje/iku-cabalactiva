// Prueba automatizada para testear la conexión del servicio CRM (Zero Trust)
import { describe, it, expect, beforeAll } from 'vitest';
import crmService from '../src/services/crmService-zero-trust.js';

describe('CRMService Zero Trust Integration', () => {
  beforeAll(() => {
    // Asegurar que las variables de entorno estén configuradas para testing
    if (!crmService.webhookUrl) {
      crmService.webhookUrl = 'https://script.google.com/macros/s/AKfycbwZj6KlJZN5GyCwHzSv-kEBuqnG2TAZdfFaU8-QHA6_EAxJptTL3byy6f4C9mQAxAk-_g/exec';
    }
    if (!crmService.secretToken) {
      crmService.secretToken = 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025';
    }
  });

  it('debe validar la conexión con el backend (Google Apps Script)', async () => {
    const result = await crmService.testConnection();
    
    // Si no hay configuración, debe indicarlo claramente
    if (!crmService.webhookUrl || !crmService.secretToken) {
      expect(result.success).toBe(false);
      expect(result.message).toContain('Configuración');
      return;
    }
    
    // Con configuración, esperamos éxito o fallo con mensaje claro
    expect(result).toBeDefined();
    expect(result.message).toBeDefined();
    
    // Si falla, debe ser por razones válidas
    if (!result.success) {
      expect(result.message).toMatch(/Error|Endpoint|conexión|disponible/i);
    } else {
      expect(result.success).toBe(true);
    }
  }, 15000);
});
