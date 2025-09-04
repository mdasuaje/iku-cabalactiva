// Prueba automatizada para testear la conexión del servicio CRM (Zero Trust)
import { describe, it, expect } from 'vitest';
import crmService from '../src/services/crmService-zero-trust.js';

describe('CRMService Zero Trust Integration', () => {
  it('debe validar la conexión con el backend (Google Apps Script)', async () => {
    const result = await crmService.testConnection();
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });
});
