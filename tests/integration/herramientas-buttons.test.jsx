import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WhatsAppFloat from '../../src/components/common/WhatsAppFloat'
import ContactModal from '../../src/components/common/ContactModal'

// Mock window.open
const mockOpen = vi.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen
})

// Mock herramientas data
vi.mock('../../src/data/herramientas', () => ({
  herramientasCabalisticas: [
    {
      id: 'test-1',
      nombre: 'Test Herramienta',
      descripcion: 'Test description',
      precio: 100,
      moneda: 'USD',
      duracion: '1 hora',
      paypalLink: 'https://paypal.com/test'
    }
  ]
}))

describe('Herramientas Buttons Integration', () => {
  beforeEach(() => {
    mockOpen.mockClear()
  })

  it('WhatsApp float button opens ContactModal', () => {
    render(<WhatsAppFloat />)
    
    const whatsappButtons = screen.getAllByRole('button')
    const mainWhatsappButton = whatsappButtons.find(btn => 
      btn.className.includes('bg-yellow-500')
    )
    
    fireEvent.click(mainWhatsappButton)
    
    expect(screen.getByText(/Contacto - Consulta General/)).toBeInTheDocument()
  })

  it('ContactModal renders correctly', () => {
    render(<ContactModal isOpen={true} onClose={() => {}} herramienta="Test" />)
    
    expect(screen.getByText(/Contacto - Test/)).toBeInTheDocument()
    expect(screen.getByText(/Ver Precios/i)).toBeInTheDocument()
  })

  it('ContactModal renders PricingSection when "Ver Precios" is clicked', () => {
    render(<ContactModal isOpen={true} onClose={() => {}} herramienta="Test" />)
    
    const verPreciosButton = screen.getByText(/Ver Precios/i)
    fireEvent.click(verPreciosButton)
    
    expect(screen.getByText(/Opciones de Pago Directo/i)).toBeInTheDocument()
    expect(screen.getByText(/Sesión Única/i)).toBeInTheDocument()
  })

  it('PricingSection PayPal buttons work correctly', () => {
    render(<ContactModal isOpen={true} onClose={() => {}} herramienta="Test" />)
    
    const verPreciosButton = screen.getByText(/Ver Precios/i)
    fireEvent.click(verPreciosButton)
    
    const paypalButtons = screen.getAllByText(/Pagar con PayPal/i)
    expect(paypalButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(paypalButtons[0])
    expect(mockOpen).toHaveBeenCalled()
  })
})