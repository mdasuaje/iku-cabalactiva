import { SOCIAL_LINKS } from './constants'

// Función para crear enlaces de email
export const createEmailLink = (subject = '', body = '') => {
  const email = SOCIAL_LINKS.ikuEmail
  const encodedSubject = encodeURIComponent(subject)
  const encodedBody = encodeURIComponent(body)
  
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`
}

// Función para abrir cliente de email
export const openEmail = (subject = '', body = '') => {
  try {
    const link = createEmailLink(subject, body)
    window.location.href = link
  } catch (error) {
    console.error('Error opening email client:', error)
    // Fallback directo
    window.location.href = `mailto:${SOCIAL_LINKS.ikuEmail}`
  }
}

// Mensajes predefinidos para email
export const EMAIL_MESSAGES = {
  sesion: {
    subject: 'Solicitud de Sesión Cabalística',
    body: 'Hola Isaac,\n\nMe interesa agendar una sesión cabalística contigo.\n\n¿Podrías confirmarme tu disponibilidad?\n\nGracias.'
  }
}