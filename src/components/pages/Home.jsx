import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Componentes principales (carga inmediata)
import Hero from '@components/sections/Hero'
import Herramientas from '@components/sections/Herramientas'

// Componentes con lazy loading para mejor performance
const Home = () => {
  return (
    <>
      {/* DIAGNÓSTICO ACTIVO - Solo secciones: Hero, Herramientas */}
      <Hero />
      <Herramientas />
    </>
  )
}

export default Home