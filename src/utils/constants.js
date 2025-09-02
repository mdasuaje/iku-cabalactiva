export const APP_CONFIG = {
  name: 'IKU Cábala Activa',
  description: 'Herramientas Espirituales del Maestro Isaac Benzaquén',
  url: 'https://iku-cabalactiva.com',
  version: '1.0.0',
  author: 'Mauro Asuaje',
  email: 'mdasuaje@proton.me'
}

export const SOCIAL_LINKS = {
  whatsapp: {
    number: '+19298336069',
    channel: 'https://tr.ee/WhatsAppChannel-iku-cabalactiva',
    messages: {
      es: 'Hola, me interesa conocer más sobre las herramientas cabalísticas de IKU Cábala Activa',
      en: 'Hello, I\'m interested in learning more about the Kabbalistic tools of IKU Kabbalah Active',
      he: 'שלום, אני מעוניין לדעת יותר על הכלים הקבליים של IKU קבלה אקטיבית'
    }
  },
  email: 'contacto@iku-cabalactiva.com',
  ikuEmail: 'contacto@iku-cabalactiva.com',
  instagram: 'https://instagram.com/ikuuniversal',
  facebook: {
    institute: 'https://facebook.com/institutokabbalahuniversal',
    personal: 'https://facebook.com/isaac.benzaquenbenzaquen'
  },
  youtube: 'https://youtube.com/@kabbalahu',
  tiktok: 'https://tiktok.com/@ikuuniversal',
  telegram: 'https://t.me/IKUUNIVERSAL',
  twitter: 'https://twitter.com/iku_kabbalah'
}

export const PAYMENT_CONFIG = {
  currencies: ['USD'],
  paymentMethods: ['stripe', 'paypal'],
  stripe: {
    successUrl: `${APP_CONFIG.url}/success`,
    cancelUrl: `${APP_CONFIG.url}/pricing`
  },
  paypal: {
    currency: 'USD',
    intent: 'capture'
  }
}

export const SEO_CONFIG = {
  defaultTitle: 'IKU Cábala Activa | Herramientas Espirituales del Maestro Isaac Benzaquén',
  titleTemplate: '%s | IKU Cábala Activa',
  defaultDescription: 'Descubre la sabiduría ancestral de la Cábala con herramientas espirituales personalizadas: Carta Astral, Constelación Familiar, Limpieza Áurica y Meditación Cabalística.',
  keywords: [
    'cábala',
    'kabbalah',
    'Isaac Benzaquén',
    'carta astral cabalística',
    'constelación familiar',
    'limpieza áurica',
    'meditación cabalística',
    'espiritualidad',
    'desarrollo personal',
    'sabiduría ancestral',
    'árbol de la vida',
    'crecimiento espiritual'
  ],
  ogImage: `${APP_CONFIG.url}/images/og-image.jpg`,
  twitterHandle: '@ikucabalaactiva'
}

export const FORM_CONFIG = {
  validation: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    name: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/
  },
  messages: {
    required: 'Este campo es obligatorio',
    email: 'Introduce una dirección de email válida',
    phone: 'Introduce un número de teléfono válido',
    name: 'Solo se permiten letras y espacios'
  }
}