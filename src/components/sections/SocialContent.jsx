import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { whatsappPosts } from '../../data/whatsappPosts'
import { SOCIAL_LINKS } from '../../utils/constants'

const SocialContent = () => {
  const [selectedPost, setSelectedPost] = useState(null)

  const handleWhatsAppClick = (post) => {
    let message = 'Hola, '
    
    if (post.cta) {
      if (post.cta.includes('quiero mi sesión')) {
        message += 'quiero mi sesión de Cábala Activa'
      } else if (post.cta.includes('quiero limpiar mi aura')) {
        message += 'quiero limpiar mi aura'
      } else if (post.cta.includes('quiero cambiar')) {
        message += 'quiero cambiar mi vida'
      } else {
        message += 'me interesa Cábala Activa'
      }
    } else {
      message += 'me interesa Cábala Activa'
    }
    
    message += '. ¿Podrías guiarme?'
    
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsapp.number.replace('+', '')}?text=${encodedMessage}`, '_blank')
  }

  const getTypeColor = (type) => {
    const colors = {
      inspiration: 'from-purple-500 to-pink-500',
      education: 'from-blue-500 to-cyan-500',
      testimonial: 'from-green-500 to-emerald-500',
      offer: 'from-yellow-500 to-orange-500',
      engagement: 'from-indigo-500 to-purple-500',
      wisdom: 'from-amber-500 to-yellow-500'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contenido <span className="text-yellow-500">Inspirador</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre mensajes diarios que transforman tu perspectiva y te conectan con la sabiduría de la Cábala
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {whatsappPosts.slice(0, 6).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(post.type)} rounded-full flex items-center justify-center mb-4`}>
                <span className="text-2xl">{post.emoji}</span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3">
                {post.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {post.content}
              </p>
              
              {post.cta && (
                <div className="border-t border-gray-600 pt-4">
                  <p className="text-yellow-500 text-sm font-semibold mb-3">
                    👉 {post.cta}
                  </p>
                  <button
                    onClick={() => handleWhatsAppClick(post)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                  >
                    💬 Responder por WhatsApp
                  </button>
                </div>
              )}
              
              {post.urgency && (
                <div className="mt-3 bg-red-500/20 border border-red-500/30 rounded-lg p-2">
                  <p className="text-red-400 text-xs font-semibold text-center">
                    ⏰ Oferta por tiempo limitado
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 rounded-2xl p-8 border border-yellow-500/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Quieres recibir contenido exclusivo?
            </h3>
            <p className="text-gray-300 mb-6">
              Únete a nuestro canal de WhatsApp y recibe mensajes diarios de transformación, 
              ofertas especiales y contenido exclusivo del Maestro Isaac Benzaquén.
            </p>
            <button
              onClick={() => window.open(SOCIAL_LINKS.whatsapp.channel, '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              📱 Unirme al Canal de WhatsApp
            </button>
          </div>

          <p className="text-gray-400 text-sm">
            Contenido diario • Sin spam • Puedes salir cuando quieras
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialContent