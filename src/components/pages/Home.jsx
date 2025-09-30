import React from 'react'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'
import Testimonios from '@components/sections/Testimonios'
import FAQ from '@components/sections/FAQ'
import CTA from '@components/sections/CTA'
import Contact from '@components/sections/Contact'
import Pricing from '@components/sections/Pricing'
import Footer from '@components/common/Footer'

// AboutMaestro ha sido fusionado con Hero para mayor impacto visual y autoridad

const Home = () => {
  return (
    <>
      <Hero />
      <Herramientas />
      <Pricing />
      <Testimonios />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
    </>
  )
}

export default Home