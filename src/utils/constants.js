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

export const PRICING_PLANS = {
  sesionUnica: {
    title: 'Sesión Única de Transformación',
    price: 297,
    paypalUrl: import.meta?.env?.VITE_PAYPAL_SESION_INDIVIDUAL,
    stripeUrl: import.meta?.env?.VITE_STRIPE_SESION_INDIVIDUAL,
  },
  paqueteCompleto: {
    title: 'Programa de Transformación Completa (6 Meses)',
    price: 997,
    originalPrice: 1441, // Para mostrar el ahorro
    paypalUrl: import.meta?.env?.VITE_PAYPAL_PAQUETE_COMPLETO,
    stripeUrl: import.meta?.env?.VITE_STRIPE_PAQUETE_COMPLETO,
    stripeInstallmentsUrl: import.meta?.env?.VITE_STRIPE_PAQUETE_PARTES,
    description: `
      <ul class="text-left space-y-2">
        <li class="flex items-center"><span class="text-green-500 mr-2">✔</span><strong>4 Herramientas Cabalísticas Esenciales</strong> (Valor $588)</li>
        <li class="flex items-center"><span class="text-green-500 mr-2">✔</span><strong>Kamea Personalizada</strong> (Valor $300)</li>
        <li class="flex items-center"><span class="text-green-500 mr-2">✔</span><strong>6 Sesiones de Seguimiento</strong> (Valor $600)</li>
        <li class="flex items-center"><span class="text-yellow-400 mr-2">🔥</span><strong>¡Ahorras $444!</strong></li>
      </ul>
    `
  }
};

export const HERRAMIENTAS_PRECIOS = {
  carta: { 
    price: 97, 
    paypalUrl: import.meta?.env?.VITE_PAYPAL_CARTA_URL, 
    stripeUrl: import.meta?.env?.VITE_STRIPE_CARTA_URL,
    title: 'Carta Astral Cabalística',
    features: ['Análisis profundo de tu árbol de la vida', 'Identificación de patrones y bloqueos', 'Guía para la toma de decisiones'],
    longDescription: 'La Carta Astral Cabalística es tu piedra fundacional del trabajo espiritual. Esta poderosa herramienta compagina la sabiduría ancestral de la Cábala con la astrología, creando tu árbol de la vida personal. Descubrirás las fortalezas y debilidades que tu alma debe resolver en esta encarnación, revelando un autodescubrimiento profundo de tu esencia divina y tu propósito vital según los secretos de la Cábala.'
  },
  constelacion: { 
    price: 147, 
    paypalUrl: import.meta?.env?.VITE_PAYPAL_CONSTELACION_URL, 
    stripeUrl: import.meta?.env?.VITE_STRIPE_CONSTELACION_URL,
    title: 'Constelación Familiar Cabalística',
    features: ['Sanación de lazos familiares', 'Liberación de cargas ancestrales', 'Comprensión de dinámicas sistémicas'],
    longDescription: 'La Constelación Familiar Cabalística interpreta tu árbol familiar desde la perspectiva sagrada de la Cábala. Esta técnica exclusiva del Maestro Isaac Benzaquén te permite constelar las figuras familiares en el Árbol de la Vida, sanando patrones transgeneracionales y liberando cargas ancestrales que han limitado tu crecimiento. Transformarás conflictos familiares en oportunidades de sanación y restaurarás el equilibrio en tus relaciones más importantes.'
  },
  meditacion: { 
    price: 97, 
    paypalUrl: import.meta?.env?.VITE_PAYPAL_MEDITACION_URL, 
    stripeUrl: import.meta?.env?.VITE_STRIPE_MEDITACION_URL,
    title: 'Meditación Cabalística',
    features: ['Conexión con las letras hebreas', 'Reducción de estrés y ansiedad', 'Expansión de la conciencia'],
    longDescription: 'La Meditación Cabalística es una práctica ancestral transmitida de Maestro a Discípulo por generaciones. Bajo la guía del Rabbí Isaac Benzaquén, experimentarás una "orquestación cósmica del alma" que emana de tu Chispa Divina. Esta meditación no solo es una de las mayores fuentes de placer espiritual, sino también una acción profundamente sanadora que transforma tu conciencia y te conecta con la Bondad Divina del Creador.'
  },
  limpieza: { 
    price: 247, 
    paypalUrl: import.meta?.env?.VITE_PAYPAL_LIMPIEZA_URL, 
    stripeUrl: import.meta?.env?.VITE_STRIPE_LIMPIEZA_URL,
    title: 'Limpieza Áurica - Shebet Oferet',
    features: ['Ritual del Cometa de Plomo', 'Purificación del campo energético', 'Eliminación de influencias negativas'],
    longDescription: 'La Limpieza Áurica Cabalística con el poderoso ritual Shebet Oferet es un proceso destinado a armonizar y acelerar tu desarrollo espiritual. Desde la perspectiva profunda de la Cábala, cada persona debe apropiarse de ciertas correcciones esenciales para alcanzar la plenitud. Esta limpieza representa el impulso fundamental para un Trabajo Espiritual consciente, integral y completo, despejando tus campos energéticos para que fluyan armónicamente todos tus procesos de crecimiento.'
  }
};

// LEGACY ARRAY FOR BACKWARD COMPATIBILITY - Mantener temporalmente
export const PRICING_PLANS_LEGACY = [
  {
    id: 'carta',
    title: 'Carta Astral Cabalística',
    price: '97',
    features: ['Análisis profundo de tu árbol de la vida', 'Identificación de patrones y bloqueos', 'Guía para la toma de decisiones'],
    longDescription: 'La Carta Astral Cabalística es tu piedra fundacional del trabajo espiritual. Esta poderosa herramienta compagina la sabiduría ancestral de la Cábala con la astrología, creando tu árbol de la vida personal. Descubrirás las fortalezas y debilidades que tu alma debe resolver en esta encarnación, revelando un autodescubrimiento profundo de tu esencia divina y tu propósito vital según los secretos de la Cábala.',
    stripeUrlEnv: 'VITE_STRIPE_CARTA_URL',
    paypalUrlEnv: 'VITE_PAYPAL_CARTA_URL'
  },
  {
    id: 'constelacion',
    title: 'Constelación Familiar Cabalística',
    price: '147',
    features: ['Sanación de lazos familiares', 'Liberación de cargas ancestrales', 'Comprensión de dinámicas sistémicas'],
    longDescription: 'La Constelación Familiar Cabalística interpreta tu árbol familiar desde la perspectiva sagrada de la Cábala. Esta técnica exclusiva del Maestro Isaac Benzaquén te permite constelar las figuras familiares en el Árbol de la Vida, sanando patrones transgeneracionales y liberando cargas ancestrales que han limitado tu crecimiento. Transformarás conflictos familiares en oportunidades de sanación y restaurarás el equilibrio en tus relaciones más importantes.',
    stripeUrlEnv: 'VITE_STRIPE_CONSTELACION_URL',
    paypalUrlEnv: 'VITE_PAYPAL_CONSTELACION_URL'
  },
  {
    id: 'meditacion',
    title: 'Meditación Cabalística',
    price: '97',
    features: ['Conexión con las letras hebreas', 'Reducción de estrés y ansiedad', 'Expansión de la conciencia'],
    longDescription: 'La Meditación Cabalística es una práctica ancestral transmitida de Maestro a Discípulo por generaciones. Bajo la guía del Rabbí Isaac Benzaquén, experimentarás una "orquestación cósmica del alma" que emana de tu Chispa Divina. Esta meditación no solo es una de las mayores fuentes de placer espiritual, sino también una acción profundamente sanadora que transforma tu conciencia y te conecta con la Bondad Divina del Creador.',
    stripeUrlEnv: 'VITE_STRIPE_MEDITACION_URL',
    paypalUrlEnv: 'VITE_PAYPAL_MEDITACION_URL'
  },
  {
    id: 'limpieza',
    title: 'Limpieza Áurica - Shebet Oferet',
    price: '247',
    features: ['Ritual del Cometa de Plomo', 'Purificación del campo energético', 'Eliminación de influencias negativas'],
    longDescription: 'La Limpieza Áurica Cabalística con el poderoso ritual Shebet Oferet es un proceso destinado a armonizar y acelerar tu desarrollo espiritual. Desde la perspectiva profunda de la Cábala, cada persona debe apropiarse de ciertas correcciones esenciales para alcanzar la plenitud. Esta limpieza representa el impulso fundamental para un Trabajo Espiritual consciente, integral y completo, despejando tus campos energéticos para que fluyan armónicamente todos tus procesos de crecimiento.',
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
    longDescription: 'El Paquete de Transformación Completa está diseñado para iniciar tu viaje hacia la espiritualidad plena. Este programa integral te permitirá abordar tus inquietudes actuales, comprender el origen de tus dudas y las experiencias que han moldeado tu vida. Sumérgete en tu interior y elévate hacia el infinito de las realidades espirituales, donde la vida, la salud, la alegría y la felicidad plena existen para ti y tu familia. Crearás tu verdadera realidad con la guía experta del Maestro Isaac Benzaquén durante 6 meses de transformación profunda.',
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