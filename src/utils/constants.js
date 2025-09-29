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
    channel: 'https://whatsapp.com/channel/0029Vb6pd6x5vKA0QDHung24',
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

export const PRICING_PLANS = [
  {
    id: 'carta',
    title: 'Carta Astral Cabalística',
    price: '97',
    features: ['Análisis profundo de tu árbol de la vida', 'Identificación de patrones y bloqueos', 'Guía para la toma de decisiones'],
    stripeUrlEnv: 'VITE_STRIPE_CARTA_URL',
    paypalUrlEnv: 'VITE_PAYPAL_CARTA_URL'
  },
  {
    id: 'constelacion',
    title: 'Constelación Familiar Cabalística',
    price: '147',
    features: ['Sanación de lazos familiares', 'Liberación de cargas ancestrales', 'Comprensión de dinámicas sistémicas'],
    stripeUrlEnv: 'VITE_STRIPE_CONSTELACION_URL',
    paypalUrlEnv: 'VITE_PAYPAL_CONSTELACION_URL'
  },
  {
    id: 'meditacion',
    title: 'Meditación Cabalística',
    price: '97',
    features: ['Conexión con las letras hebreas', 'Reducción de estrés y ansiedad', 'Expansión de la conciencia'],
    stripeUrlEnv: 'VITE_STRIPE_MEDITACION_URL',
    paypalUrlEnv: 'VITE_PAYPAL_MEDITACION_URL'
  },
  {
    id: 'limpieza',
    title: 'Limpieza Áurica - Shebet Oferet',
    price: '247',
    features: ['Ritual del Cometa de Plomo', 'Purificación del campo energético', 'Eliminación de influencias negativas'],
    stripeUrlEnv: 'VITE_STRIPE_LIMPIEZA_URL',
    paypalUrlEnv: 'VITE_PAYPAL_LIMPIEZA_URL'
  },
  {
    id: 'paquete-transformacion',
    title: 'Paquete de Transformación Completa',
    price: '997',
    isFeatured: true, // Para destacar esta tarjeta
    features: [
      'Sesiones de las 4 herramientas',
      'Limpieza Áurica con ritual Shebet Oferet',
      'Kamea: Mandala de Poder y Éxito (Personalizada)'
    ],
    stripeUrlEnv: 'VITE_STRIPE_PAQUETE_URL',
    stripePartesUrlEnv: 'VITE_STRIPE_PAQUETE_PARTES_URL',
    paypalUrlEnv: 'VITE_PAYPAL_PAQUETE_URL'
  }
];

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