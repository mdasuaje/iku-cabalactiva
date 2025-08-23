const translations = {
  // Navigation
  'nav.inicio': 'Inicio',
  'nav.herramientas': 'Herramientas',
  'nav.contacto': 'Contacto',
  
  // Common
  'common.loading': 'Cargando...',
  'common.error': 'Error',
  'common.success': 'Éxito',
  'common.contact': 'Contactar',
  'common.more_info': 'Más información',
  
  // Hero
  'hero.title': 'IKU Cábala Activa',
  'hero.subtitle': '¿Sientes que repites patrones una y otra vez? La Cábala Activa te muestra el \'por qué\' y el \'para qué\'.',
  'hero.cta': 'Da el primer paso hacia una vida plena',
  'hero.session_btn': '💬 Quiero mi Sesión',
  'hero.tools_btn': 'Conocer Herramientas',
  
  // Buttons
  'btn.reserve_session': 'Reservar Sesión',
  'btn.learn_more': 'Conocer más',
  'btn.contact_whatsapp': 'Contactar por WhatsApp',
  
  // Forms
  'form.name': 'Nombre',
  'form.email': 'Email',
  'form.phone': 'Teléfono',
  'form.message': 'Mensaje',
  'form.send': 'Enviar',
  'form.required': 'Este campo es obligatorio',
  
  // Sections
  'section.philosophy': 'Filosofía',
  'section.tools': 'Herramientas',
  'section.testimonials': 'Testimonios',
  'section.pricing': 'Precios',
  'section.faq': 'Preguntas Frecuentes',
  'section.contact': 'Contacto'
}

export const t = (key, fallback = key) => translations[key] || fallback