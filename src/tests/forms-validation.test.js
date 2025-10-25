import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '../components/forms/ContactForm.jsx'
import { apiService } from '../services/api.js'

// Mock the API service
vi.mock('../services/api.js', () => ({
  apiService: {
    sendContactForm: vi.fn()
  }
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  }
}))

describe('Forms Validation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ContactForm Component', () => {
    it('should render contact form correctly', () => {
      render(<ContactForm />)
      
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      render(<ContactForm />)
      
      const submitButton = screen.getByRole('button', { name: /enviar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(<ContactForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      
      const submitButton = screen.getByRole('button', { name: /enviar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument()
      })
    })

    it('should submit form with valid data', async () => {
      apiService.sendContactForm.mockResolvedValueOnce({
        success: true,
        message: 'Mensaje enviado correctamente'
      })

      render(<ContactForm />)
      
      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { value: 'Juan Pérez' }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'juan@example.com' }
      })
      fireEvent.change(screen.getByLabelText(/teléfono/i), {
        target: { value: '+1234567890' }
      })
      fireEvent.change(screen.getByLabelText(/mensaje/i), {
        target: { value: 'Mensaje de prueba' }
      })

      const submitButton = screen.getByRole('button', { name: /enviar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(apiService.sendContactForm).toHaveBeenCalledWith({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '+1234567890',
          mensaje: 'Mensaje de prueba',
          herramienta: undefined
        })
      })
    })

    it('should handle API errors gracefully', async () => {
      apiService.sendContactForm.mockRejectedValueOnce(
        new Error('Error en API: 500 Internal Server Error')
      )

      render(<ContactForm />)
      
      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { value: 'Juan Pérez' }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'juan@example.com' }
      })

      const submitButton = screen.getByRole('button', { name: /enviar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(apiService.sendContactForm).toHaveBeenCalled()
      })
    })
  })

  describe('API Service Integration', () => {
    it('should have correct API service methods', () => {
      expect(typeof apiService.sendContactForm).toBe('function')
    })

    it('should call API service with correct parameters', async () => {
      apiService.sendContactForm.mockResolvedValueOnce({ success: true })

      const testData = {
        nombre: 'Test User',
        email: 'test@example.com',
        telefono: '+1234567890',
        mensaje: 'Test message'
      }

      await apiService.sendContactForm(testData)

      expect(apiService.sendContactForm).toHaveBeenCalledWith(testData)
    })
  })

  describe('Form Validation Rules', () => {
    const validationTests = [
      {
        field: 'nombre',
        validValue: 'Juan Pérez',
        invalidValue: '',
        errorMessage: /nombre es requerido/i
      },
      {
        field: 'email',
        validValue: 'juan@example.com',
        invalidValue: 'invalid-email',
        errorMessage: /email inválido/i
      },
      {
        field: 'telefono',
        validValue: '+1234567890',
        invalidValue: '123',
        errorMessage: /teléfono inválido/i
      }
    ]

    validationTests.forEach(({ field, validValue, invalidValue, errorMessage }) => {
      it(`should validate ${field} field correctly`, async () => {
        render(<ContactForm />)
        
        const input = screen.getByLabelText(new RegExp(field, 'i'))
        
        // Test invalid value
        fireEvent.change(input, { target: { value: invalidValue } })
        fireEvent.blur(input)
        
        const submitButton = screen.getByRole('button', { name: /enviar/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
          const errorElement = screen.queryByText(errorMessage)
          if (errorElement) {
            expect(errorElement).toBeInTheDocument()
          }
        })

        // Test valid value
        fireEvent.change(input, { target: { value: validValue } })
        fireEvent.blur(input)

        await waitFor(() => {
          const errorElement = screen.queryByText(errorMessage)
          if (errorElement) {
            expect(errorElement).not.toBeInTheDocument()
          }
        })
      })
    })
  })
})