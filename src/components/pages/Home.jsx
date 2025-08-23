import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'

// Componentes con lazy loading para mejor performance
const AboutMaestro = lazy(() => import('@components/sections/AboutMaestro'))
const Pricing = lazy(() => import('@components/sections/Pricing'))
const Testimonios = lazy(() => import('@components/sections/Testimonios'))
const FAQ = lazy(() => import('@components/sections/FAQ'))
const Contact = lazy(() => import('@components/sections/Contact'))

const Home = () => {
  return (
    <>
      {/* Secciones principales */}
      <Hero />
      <Herramientas />
      
      {/* Secciones con lazy loading */}
      <Suspense fallback={<LoadingSpinner message="Cargando contenido..." />}>
        <AboutMaestro />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner message="Cargando precios..." />}>
        <Pricing />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner message="Cargando testimonios..." />}>
        <Testimonios />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner message="Cargando preguntas..." />}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner message="Cargando contacto..." />}>
        <Contact />
      </Suspense>
    </>
  )
}

export default Home