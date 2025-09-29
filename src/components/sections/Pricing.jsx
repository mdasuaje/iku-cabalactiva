import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PRICING_PLANS } from '../../utils/constants'
import ContactModal from '../common/ContactModal'
import PricingCard from '../common/PricingCard'

const Pricing = () => {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <section id="pricing" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Planes y <span className="text-yellow-500">Precios</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tu camino espiritual
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
        >
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard 
              key={plan.id}
              {...plan}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            ¿Necesitas más información? Contáctanos directamente
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            💬 Consultar Ahora
          </button>
        </motion.div>
        
        <ContactModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          herramienta="Consulta de Precios"
        />
      </div>
    </section>
  )
}

export default Pricing