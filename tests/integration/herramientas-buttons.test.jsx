import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WhatsAppFloat from '../../src/components/common/WhatsAppFloat'
import Herramientas from '../../src/components/sections/Herramientas'
import ContactModal from '../../src/components/common/ContactModal'

// Mock window.open
const mockOpen = vi.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen
})

describe('Herramientas Buttons Integration', () => {
  beforeEach(() => {
    mockOpen.mockClear()
  })

  it('WhatsApp float button redirects to correct channel', () => {
    render(<WhatsAppFloat />)
    
    const whatsappButton = screen.getByRole('button')
    fireEvent.click(whatsappButton)
    
    expect(mockOpen).toHaveBeenCalledWith('https://tr.ee/WhatsAppChannel-iku-cabalactiva', '_blank')
  })

  it('Herramientas "Iniciar mi Camino" button opens ContactModal', () => {
    render(<Herramientas />)
    
    const iniciarButtons = screen.getAllByText(/Iniciar mi Camino/i)
    expect(iniciarButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(iniciarButtons[0])
    
    // Verificar que el modal se abre
    expect(screen.getByText(/Contacto -/)).toBeInTheDocument()
  })

  it('ContactModal renders PricingSection when "Ver Precios" is clicked', () => {
    render(<ContactModal isOpen={true} onClose={() => {}} herramienta="Test" />)
    
    const verPreciosButton = screen.getByText(/Ver Precios/i)
    fireEvent.click(verPreciosButton)
    
    // Verificar que la sección de precios se muestra
    expect(screen.getByText(/Opciones de Pago Directo/i)).toBeInTheDocument()
    expect(screen.getByText(/Sesión Única/i)).toBeInTheDocument()
    expect(screen.getByText(/Programa Completo/i)).toBeInTheDocument()
  })

  it('PricingSection PayPal buttons work correctly', () => {
    render(<ContactModal isOpen={true} onClose={() => {}} herramienta="Test" />)
    
    // Abrir sección de precios
    const verPreciosButton = screen.getByText(/Ver Precios/i)
    fireEvent.click(verPreciosButton)
    
    // Buscar botones de PayPal
    const paypalButtons = screen.getAllByText(/Pagar con PayPal/i)
    expect(paypalButtons.length).toBe(2)
    
    // Simular click en el primer botón
    fireEvent.click(paypalButtons[0])
    
    // Verificar que window.open fue llamado
    expect(mockOpen).toHaveBeenCalled()
  })
})