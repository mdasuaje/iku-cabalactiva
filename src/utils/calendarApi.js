export const createCalendarEvent = async (formData) => {
  const eventData = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  // Send email notification to Isaac
  const emailBody = `
Nueva consulta de Cábala Activa:

Cliente: ${formData.name}
Email: ${formData.email}
Teléfono: ${formData.phone || 'No proporcionado'}
Mensaje: ${formData.message}

Fecha sugerida: ${new Date(eventData.eventDate).toLocaleDateString('es-ES')} a las 10:00 AM

Por favor, confirma la cita respondiendo a este email.
  `

  const mailtoLink = `mailto:contacto@iku-cabalactiva.com?subject=Nueva Consulta - ${formData.name}&body=${encodeURIComponent(emailBody)}`
  
  // Open email client
  window.open(mailtoLink)

  return { success: true, eventData }
}