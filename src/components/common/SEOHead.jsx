import React from 'react'
import { SEO_CONFIG } from '@utils/constants'

const SEOHead = ({ 
  title = SEO_CONFIG.defaultTitle,
  description = SEO_CONFIG.defaultDescription,
  keywords = SEO_CONFIG.keywords.join(', '),
  image = SEO_CONFIG.ogImage,
  url = 'https://iku-cabalactiva.com/'
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "IKU Cábala Activa",
          "url": "https://iku-cabalactiva.com",
          "logo": "https://iku-cabalactiva.com/images/logo.png",
          "description": "Instituto de Kabbalah Universal especializado en herramientas espirituales cabalísticas",
          "founder": {
            "@type": "Person",
            "name": "Isaac Benzaquén",
            "jobTitle": "Maestro y Rabino de Cábala"
          },
          "serviceType": ["Carta Astral Cabalística", "Constelación Familiar", "Limpieza Áurica", "Meditación Cabalística"],
          "areaServed": "Worldwide",
          "availableLanguage": ["Spanish", "English", "Hebrew"]
        })}
      </script>
    </>
  )
}

export default SEOHead