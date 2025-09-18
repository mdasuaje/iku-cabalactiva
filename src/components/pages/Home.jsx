import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'
import TestimoniosSection from '@components/sections/TestimoniosSection'
import FAQSection from '@components/sections/FAQSection'
import CTA from '@components/sections/CTA'
import Contact from '@components/sections/Contact'
import Pricing from '@components/sections/Pricing'
import Footer from '@components/common/Footer'

// Componentes con lazy loading para mejor performance
const AboutMaestro = lazy(() => import('@components/sections/AboutMaestro'))

const Home = () => {
  return (
    <>
      <Hero />
      <Herramientas />
      <Suspense fallback={<LoadingSpinner />}>
        <AboutMaestro />
      </Suspense>
      <Pricing />
      <TestimoniosSection />
      <FAQSection />
      <Contact />
      <CTA />
      <Footer />
    </>
  )
}

export default Home
