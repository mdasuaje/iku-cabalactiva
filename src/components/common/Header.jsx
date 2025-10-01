import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SocialMediaBar from './SocialMediaBar'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navigationItems = [
    { id: 'hero', label: 'Inicio' },
    { id: 'herramientas', label: 'Herramientas' },
    { id: 'pricing', label: 'Precios' },
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'contact', label: 'Contacto' }
  ]

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-lg border-b border-yellow-500/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 min-w-0">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-3 group flex-shrink-0"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
              <span className="text-slate-900 font-bold text-sm lg:text-base select-none">
                IKU
              </span>
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="text-white font-semibold text-lg lg:text-xl truncate">
                Cábala Activa
              </div>
              <div className="text-yellow-500 text-xs lg:text-sm truncate">
                Sabiduría Ancestral
              </div>
            </div>
          </button>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8 flex-shrink-0">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Redes sociales y botones de acción */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Redes sociales - solo desktop */}
            <div className="hidden lg:block">
              <SocialMediaBar />
            </div>

            {/* Menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-yellow-500 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-slate-800/95 backdrop-blur-lg rounded-lg mt-2 overflow-hidden relative z-50"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Mobile menu click:', item.id)
                      
                      // Cerrar menú inmediatamente
                      setIsMenuOpen(false)
                      
                      // Pequeño delay para permitir que el menú se cierre
                      setTimeout(() => {
                        scrollToSection(item.id)
                      }, 100)
                    }}
                    className="block w-full text-left text-gray-300 hover:text-yellow-500 transition-colors duration-200 py-2 cursor-pointer"
                    style={{ 
                      pointerEvents: 'auto',
                      touchAction: 'manipulation',
                      userSelect: 'none'
                    }}
                  >
                    {item.label}
                  </button>
                ))}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header