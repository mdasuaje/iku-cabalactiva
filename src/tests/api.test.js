/**
 * Tests para integración con AWS API Gateway
 * IKU Cábala Activa
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '../services/api';

// Mock fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('sendContactForm', () => {
    it('should send contact form successfully', async () => {
      const mockResponse = { success: true, messageId: 'test-123' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const formData = {
        nombre: 'Test User',
        email: 'test@example.com',
        mensaje: 'Test message'
      };

      const result = await apiService.sendContactForm(formData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contact'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Test User')
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors with retries', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(
        apiService.sendContactForm({
          nombre: 'Test',
          email: 'test@example.com'
        })
      ).rejects.toThrow('Network error');

      expect(fetch).toHaveBeenCalledTimes(3);
    }, 10000);
  });

  describe('sendServiceRequest', () => {
    it('should send service request successfully', async () => {
      const mockResponse = { success: true, requestId: 'req-123' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const serviceData = {
        service: 'Carta Astral',
        email: 'test@example.com',
        amount: 67
      };

      const result = await apiService.sendServiceRequest(serviceData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/service-request'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('service_request')
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});