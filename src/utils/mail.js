// Función para abrir el cliente de correo con destinatario y asunto
export const openMail = (subject = 'Consulta IKU', body = '') => {
  const email = 'contacto@iku-cabalactiva.com'
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(mailtoLink, '_blank')
}
