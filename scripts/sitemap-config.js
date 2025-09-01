export const SITEMAP_CONFIG = {
  domain: 'https://iku-cabalactiva.com',
  
  // URLs principales con frecuencias optimizadas
  main: [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/#carta-astral', priority: '0.95', changefreq: 'yearly' },
    { loc: '/#constelacion-familiar', priority: '0.95', changefreq: 'yearly' },
    { loc: '/#limpieza-aurica', priority: '0.95', changefreq: 'yearly' },
    { loc: '/#meditacion-cabalistica', priority: '0.95', changefreq: 'yearly' }
  ],
  
  // Futuras expansiones
  future: {
    blog: { enabled: false, path: '/blog', priority: '0.8', changefreq: 'weekly' },
    about: { enabled: false, path: '/acerca-de-mi', priority: '0.6', changefreq: 'monthly' },
    testimonials: { enabled: false, path: '/testimonios', priority: '0.7', changefreq: 'monthly' }
  }
};