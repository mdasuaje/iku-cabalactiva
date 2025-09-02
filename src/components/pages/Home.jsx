import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'
import Testimonios from '@components/sections/Testimonios'
import FAQ from '@components/sections/FAQ'
import CTA from '@components/sections/CTA'
import Footer from '@components/common/Footer'

// Componentes con lazy loading para mejor performance
const AboutMaestro = lazy(() => import('@components/sections/AboutMaestro'))
const WhatsAppFloat = lazy(() => import('@components/common/WhatsAppFloat'))

const Home = () => {
  return (
    <>
      <Hero />
      <Herramientas />
      <Suspense fallback={<LoadingSpinner />}>
        <AboutMaestro />
      </Suspense>
      <Testimonios />
      <FAQ />
      <CTA />
      <Footer />
      <Suspense fallback={null}>
        <WhatsAppFloat />
      </Suspense>
    </>
  )
}

export default Home