import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PRICING_PLANS } from '../../utils/constants'
import ContactModal from '../common/ContactModal'
import ToolDetailModal from '../common/ToolDetailModal'

const Herramientas = () => {
  const [showContactModal, setShowContactModal] = useState(false)
  const [showToolModal, setShowToolModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Filtrar solo las herramientas individuales (excluir el paquete)
  const herramientas = PRICING_PLANS.filter(plan => plan.id !== 'paquete-transformacion')

  const handleToolClick = (plan) => {
    setSelectedPlan(plan)
    setShowToolModal(true)
  }

  const handleOpenContact = (toolTitle) => {
    setSelectedTool(toolTitle)
    setShowContactModal(true)
  }

  return (
    <section id="herramientas" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Herramientas <span className="text-yellow-500">Cabalísticas</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre las cuatro herramientas espirituales que transformarán tu conexión con la sabiduría ancestral
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {herramientas.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              onClick={() => handleToolClick(plan)}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {plan.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4">
                  {plan.features.join(' • ')}
                </p>
                
                <div className="flex items-center justify-center mb-4">
                  <span className="text-yellow-500 font-bold text-lg">
                    ${plan.price} USD
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="bg-gradient-to-r from-purple-500/20 to-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-3">
                    <p className="text-yellow-400 text-xs font-semibold text-center">
                      ✨ Haz clic para conocer más detalles
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Tool Detail Modal */}
      <ToolDetailModal 
        isOpen={showToolModal}
        onClose={() => setShowToolModal(false)}
        plan={selectedPlan}
        onOpenContact={handleOpenContact}
      />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        herramienta={selectedTool}
      />
    </section>
  )
}

export default Herramientas