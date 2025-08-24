import { SOCIAL_LINKS } from './constants'

// Función centralizada para generar enlaces de WhatsApp
export const createWhatsAppLink = (message = '') => {
  const phoneNumber = SOCIAL_LINKS.whatsapp.number.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}${message ? `?text=${encodedMessage}` : ''}`
}

// Función para abrir WhatsApp con manejo de errores
export const openWhatsApp = (message = '') => {
  try {
    const link = createWhatsAppLink(message)
    const whatsappWindow = window.open(link, '_blank')
    
    if (!whatsappWindow) {
      window.location.href = link
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error)
    // Fallback directo
    window.location.href = `https://wa.me/19298336069${message ? `?text=${encodeURIComponent(message)}` : ''}`
  }
}

// Mensajes predefinidos
export const WHATSAPP_MESSAGES = {
  general: 'Hola, quiero información sobre Cábala Activa. ¿Podrías guiarme?',
  herramienta: (nombre) => `Hola, me interesa la herramienta: ${nombre}. ¿Podrías darme más información?`,
  consulta: 'Hola, tengo algunas preguntas sobre las herramientas cabalísticas.',
  sesion: 'Hola, me gustaría agendar una sesión. ¿Cuál es la disponibilidad?',
  paquete: (nombre) => `Hola, me interesa el ${nombre}. ¿Podrías darme más detalles?`
}