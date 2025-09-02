import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'

// Componentes con lazy loading para mejor performance
const Philosophy = lazy(() => import('@components/sections/Philosophy'))
const ValueProposition = lazy(() => import('@components/sections/ValueProposition'))
const AboutMaestro = lazy(() => import('@components/sections/AboutMaestro'))
const Pricing = lazy(() => import('@components/sections/Pricing'))
const Testimonios = lazy(() => import('@components/sections/Testimonios'))
const SocialContent = lazy(() => import('@components/sections/SocialContent'))
const SocialProof = lazy(() => import('@components/sections/SocialProof'))
const CTA = lazy(() => import('@components/sections/CTA'))
const FAQ = lazy(() => import('@components/sections/FAQ'))
const Contact = lazy(() => import('@components/sections/Contact'))

const Home = () => {
  return (
    <>
      {/* Secciones principales */}
      <Hero />
      <Herramientas />
      
      {/* Secciones con lazy loading optimizado */}
      <Suspense fallback={<LoadingSpinner message="Cargando contenido..." />}>
        <Philosophy />
        <ValueProposition />
        <AboutMaestro />
        <Pricing />
        <Testimonios />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner message="Cargando comunidad..." />}>
        <SocialContent />
        <SocialProof />
        <CTA />
        <FAQ />
        <Contact />
      </Suspense>
    </>
  )
}

export default Home