import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../services/api.js'

// Mock fetch
global.fetch = vi.fn()

describe('Integration Tests - AWS API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API Service Basic Functionality', () => {
    it('should make API calls with correct structure', async () => {
      const mockResponse = {
        success: true,
        message: 'Test successful'
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const result = await apiService.sendContactForm({
        nombre: 'Test User',
        email: 'test@example.com'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should handle network errors with retries', async () => {
      // Mock 2 failures, then success
      fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        })

      const result = await apiService.sendContactForm({
        nombre: 'Test User',
        email: 'test@example.com'
      })

      expect(fetch).toHaveBeenCalledTimes(3)
      expect(result).toEqual({ success: true })
    })

    it('should handle HTTP errors correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(apiService.sendContactForm({
        nombre: 'Test User',
        email: 'test@example.com'
      })).rejects.toThrow('Error en API: 500 Internal Server Error')
    })

    it('should include correct headers and body structure', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })

      await apiService.sendContactForm({
        nombre: 'Test User',
        email: 'test@example.com',
        mensaje: 'Test message'
      })

      const [url, options] = fetch.mock.calls[0]
      
      expect(url).toContain('/contact')
      expect(options.method).toBe('POST')
      expect(options.headers['Content-Type']).toBe('application/json')
      
      const body = JSON.parse(options.body)
      expect(body.type).toBe('contact')
      expect(body.nombre).toBe('Test User')
      expect(body.email).toBe('test@example.com')
      expect(body.timestamp).toBeDefined()
    })
  })

  describe('Service Methods', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })
    })

    it('should have sendContactForm method', async () => {
      expect(typeof apiService.sendContactForm).toBe('function')
      
      const result = await apiService.sendContactForm({
        nombre: 'Test',
        email: 'test@example.com'
      })
      
      expect(result.success).toBe(true)
    })

    it('should have sendDownloadRequest method', async () => {
      expect(typeof apiService.sendDownloadRequest).toBe('function')
      
      const result = await apiService.sendDownloadRequest({
        nombre: 'Test',
        email: 'test@example.com',
        herramienta: 'carta-astral'
      })
      
      expect(result.success).toBe(true)
    })

    it('should have checkApiHealth method', async () => {
      expect(typeof apiService.checkApiHealth).toBe('function')
      
      const result = await apiService.checkApiHealth()
      
      expect(result.success).toBe(true)
    })

    it('should have sendServiceRequest method', async () => {
      expect(typeof apiService.sendServiceRequest).toBe('function')
      
      const result = await apiService.sendServiceRequest({
        servicio: 'consulta',
        cliente: 'test@example.com'
      })
      
      expect(result.success).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle timeout errors', async () => {
      fetch.mockImplementationOnce(() => 
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 100)
        })
      )

      await expect(apiService.sendContactForm({
        nombre: 'Test',
        email: 'test@example.com'
      })).rejects.toThrow()
    })

    it('should handle malformed responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => { throw new Error('Invalid JSON') }
      })

      await expect(apiService.sendContactForm({
        nombre: 'Test',
        email: 'test@example.com'
      })).rejects.toThrow('Invalid JSON')
    })
  })
})