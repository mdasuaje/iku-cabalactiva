const translations = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.herramientas': 'Herramientas',
    'nav.contacto': 'Contacto',
    'common.loading': 'Cargando...',
    'hero.title': 'IKU Cábala Activa',
    'hero.session_btn': '💬 Quiero mi Sesión',
    'btn.reserve_session': 'Reservar Sesión',
    'form.name': 'Nombre',
    'form.email': 'Email'
  },
  en: {
    'nav.inicio': 'Home',
    'nav.herramientas': 'Tools',
    'nav.contacto': 'Contact',
    'common.loading': 'Loading...',
    'hero.title': 'IKU Active Kabbalah',
    'hero.session_btn': '💬 I Want My Session',
    'btn.reserve_session': 'Reserve Session',
    'form.name': 'Name',
    'form.email': 'Email'
  }
}

let currentLang = 'es'

export const setLanguage = (lang) => {
  if (translations[lang]) currentLang = lang
}

export const t = (key, fallback = key) => 
  translations[currentLang]?.[key] || translations.es[key] || fallback