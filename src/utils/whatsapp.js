import { SOCIAL_LINKS } from './constants'
import { formatPhoneNumber, checkPhoneNumber } from './phoneValidator'

// Función centralizada para generar enlaces de WhatsApp
export const createWhatsAppLink = (message = '') => {
  // Verificar que el número en constants sea correcto
  if (!checkPhoneNumber(SOCIAL_LINKS.whatsapp.number)) {
    console.warn('⚠️ Número en constants.js incorrecto, usando número validado')
  }
  
  // Usar siempre el número correcto validado
  const phoneNumber = formatPhoneNumber('whatsapp')
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
    // Fallback directo con número validado
    const phoneNumber = formatPhoneNumber('whatsapp')
    window.location.href = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  }
}

// Mensajes predefinidos - Solo para consultas específicas de sesiones
export const WHATSAPP_MESSAGES = {
  sesion: 'Hola Isaac, quiero agendar una sesión cabalística. ¿Cuál es tu disponibilidad?',
  herramienta: (nombre) => `Hola Isaac, me interesa comprar: ${nombre}. ¿Podrías confirmar disponibilidad para la sesión?`,
  urgente: 'Hola Isaac, tengo una consulta urgente sobre mi sesión programada.',
  paquete: (nombre) => `Hola Isaac, quiero adquirir ${nombre}. ¿Cuándo podríamos hacer la sesión?`
}