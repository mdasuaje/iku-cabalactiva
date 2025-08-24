import React from 'react'
import { motion } from 'framer-motion'
import { openWhatsApp, WHATSAPP_MESSAGES } from '@utils/whatsapp'
import UrgencyTimer from '@components/common/UrgencyTimer'
import Guarantee from '@components/common/Guarantee'

const CTA = () => {
  const handleWhatsAppClick = () => {
    openWhatsApp(WHATSAPP_MESSAGES.sesion)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-500">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            ¿Listo para Transformar tu Vida?
          </h2>
          
          <p className="text-xl text-slate-800 mb-8 leading-relaxed">
            Cábala Activa no es teoría: son herramientas prácticas que transforman tu vida 
            en lo personal, familiar, espiritual y profesional.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-slate-800/20 cursor-pointer"
              onClick={() => window.open('https://www.paypal.com/ncp/payment/FJGC4GE6SBS98', '_blank')}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Sesión Única
              </h3>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                $150 USD
              </div>
              <p className="text-slate-800 text-sm">
                Combinación personalizada de herramientas cabalísticas
              </p>
              <div className="mt-4 bg-slate-900 text-yellow-500 px-4 py-2 rounded-lg text-center font-semibold">
                💳 Pagar Ahora
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-900/30"
            >
              <div className="bg-slate-900 text-yellow-500 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                Más Popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Programa Completo
              </h3>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                $1,000 USD
              </div>
              <p className="text-slate-800 text-sm mb-4">
                10 sesiones / 6 meses (se puede financiar en 3 partes)
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.open('https://buy.stripe.com/3cIcN6fhNdAS1S34SCdnW00', '_blank')}
                  className="w-full bg-slate-900 text-yellow-500 px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  💳 Pagar con Tarjeta
                </button>
                <button
                  onClick={() => window.open('https://www.paypal.com/ncp/payment/QHUXGLD7VZ8RA', '_blank')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  🌐 Pagar con PayPal
                </button>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <UrgencyTimer />
            <Guarantee />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppClick}
              className="bg-slate-900 text-yellow-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              💬 Escríbeme "QUIERO MI SESIÓN"
            </motion.button>
            
            <p className="text-slate-800 text-sm">
              Te guiaré personalmente en tu proceso de transformación
            </p>
            
            <p className="text-slate-700 text-xs">
              ✅ Respuesta inmediata • ✅ Sin compromisos • ✅ Consulta gratuita
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900">30+</div>
              <div className="text-slate-800 text-sm">Años experiencia</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">5000+</div>
              <div className="text-slate-800 text-sm">Vidas transformadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">4</div>
              <div className="text-slate-800 text-sm">Herramientas únicas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-slate-800 text-sm">Resultados reales</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA