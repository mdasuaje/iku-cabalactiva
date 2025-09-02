const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3'
const CALENDAR_ID = 'maor@iku-cabalactiva.com'

export const createCalendarEvent = async (formData) => {
  const accessToken = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
  
  if (!accessToken) {
    throw new Error('Google Calendar API key not configured')
  }

  // Create event 7 days from now at 10 AM
  const eventDate = new Date()
  eventDate.setDate(eventDate.getDate() + 7)
  eventDate.setHours(10, 0, 0, 0)
  
  const endDate = new Date(eventDate)
  endDate.setHours(11, 30, 0, 0) // 1.5 hour session

  const event = {
    summary: `Consulta Cábala Activa - ${formData.name}`,
    description: `Cliente: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone || 'No proporcionado'}\nMensaje: ${formData.message}`,
    start: {
      dateTime: eventDate.toISOString(),
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'America/New_York'
    },
    attendees: [
      { email: 'contacto@iku-cabalactiva.com', displayName: 'Isaac Benzaquén' },
      { email: formData.email, displayName: formData.name }
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'email', minutes: 60 }       // 1 hour before
      ]
    }
  }

  const response = await fetch(`${CALENDAR_API_URL}/calendars/${CALENDAR_ID}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })

  if (!response.ok) {
    throw new Error('Failed to create calendar event')
  }

  return response.json()
}

export const sendNotificationEmail = async (formData, eventData) => {
  // Using EmailJS or similar service for notifications
  const emailData = {
    to_email: 'contacto@iku-cabalactiva.com',
    to_name: 'Isaac Benzaquén',
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone || 'No proporcionado',
    message: formData.message,
    event_date: new Date(eventData.start.dateTime).toLocaleString('es-ES'),
    event_link: eventData.htmlLink
  }

  // This would integrate with your email service
  console.log('Email notification data:', emailData)
  return emailData
}