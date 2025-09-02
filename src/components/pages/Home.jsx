import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'

// Componentes con lazy loading para mejor performance
const Philosophy = lazy(() => import('@components/sections/Philosophy'))
const Home = () => {
  return (
    <>
      {/* DIAGNÓSTICO ACTIVO - Solo secciones: Hero, Herramientas, Philosophy */}
      <Hero />
      <Herramientas />
      
      {/* Secciones con lazy loading optimizado */}
      <Suspense fallback={<LoadingSpinner message="Cargando contenido..." />}>
        <Philosophy />
      </Suspense>
    </>
  )
}

export default Home