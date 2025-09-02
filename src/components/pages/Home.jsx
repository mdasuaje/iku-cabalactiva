import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'
import Testimonios from '@components/sections/Testimonios'
import FAQ from '@components/sections/FAQ'
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
      <Testimonios />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
    </>
  )
}

export default Home