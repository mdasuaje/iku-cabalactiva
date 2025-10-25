import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../services/api.js'

// Mock fetch
global.fetch = vi.fn()

describe('AWS API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment variables
    vi.stubEnv('VITE_AWS_API_GATEWAY_URL', 'https://test-api.execute-api.us-east-1.amazonaws.com/prod')
    vi.stubEnv('VITE_AWS_API_KEY', 'test-api-key')
  })

  describe('sendContactForm', () => {
    it('should send contact form successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Email enviado correctamente',
        data: { messageId: 'test-message-id' }
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const formData = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '+1234567890',
        mensaje: 'Test message',
        herramienta: 'carta-astral'
      }

      const result = await apiService.sendContactForm(formData)

      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.execute-api.us-east-1.amazonaws.com/prod/contact',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key'
          },
          body: JSON.stringify(formData)
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      const formData = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com'
      }

      await expect(apiService.sendContactForm(formData))
        .rejects.toThrow('Error en API: 500 Internal Server Error')
    })

    it('should retry on network failures', async () => {
      // First two calls fail, third succeeds
      fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        })

      const formData = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com'
      }

      const result = await apiService.sendContactForm(formData)

      expect(fetch).toHaveBeenCalledTimes(3)
      expect(result).toEqual({ success: true })
    })
  })

  describe('sendDownloadRequest', () => {
    it('should send download request successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Solicitud procesada',
        downloadUrl: 'https://example.com/download/test.pdf'
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const requestData = {
        nombre: 'María García',
        email: 'maria@example.com',
        herramienta: 'meditacion'
      }

      const result = await apiService.sendDownloadRequest(requestData)

      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.execute-api.us-east-1.amazonaws.com/prod/download',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key'
          },
          body: JSON.stringify(requestData)
        })
      )

      expect(result).toEqual(mockResponse)
    })
  })

  describe('checkApiHealth', () => {
    it('should check API health successfully', async () => {
      const mockResponse = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          lambda: 'ok',
          ses: 'ok'
        }
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const result = await apiService.checkApiHealth()

      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.execute-api.us-east-1.amazonaws.com/prod/health',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key'
          }
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle health check failures', async () => {
      fetch.mockRejectedValueOnce(new Error('Service unavailable'))

      await expect(apiService.checkApiHealth())
        .rejects.toThrow('Service unavailable')
    })
  })

  describe('Configuration', () => {
    it('should throw error if API Gateway URL is not configured', async () => {
      vi.stubEnv('VITE_AWS_API_GATEWAY_URL', '')

      await expect(apiService.sendContactForm({}))
        .rejects.toThrow('AWS API Gateway URL no configurada')
    })

    it('should work without API key if not required', async () => {
      vi.stubEnv('VITE_AWS_API_KEY', '')

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })

      await apiService.sendContactForm({ nombre: 'Test' })

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
    })
  })
})