import React, { Suspense } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import Header from './components/common/Header'

import ScrollToTop from './components/common/ScrollToTop'
import SEOHead from './components/common/SEOHead'
import WhatsAppFloat from './components/common/WhatsAppFloat'
import LoadingSpinner from './components/common/LoadingSpinner'
import ExitIntentPopup from './components/common/ExitIntentPopup'

// Lazy load the Home component
const Home = React.lazy(() => import('./components/pages/Home'))

function App() {
  return (
    <ErrorBoundary>
      <SEOHead />
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Header />
        <main>
          <Suspense fallback={<LoadingSpinner message="Cargando página..." />}>
            <Home />
          </Suspense>
        </main>

        <WhatsAppFloat />
        <ExitIntentPopup />
      </div>
    </ErrorBoundary>
  )
}

export default App