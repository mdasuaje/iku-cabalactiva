import React from 'react'
import SocialLinks from './SocialLinks'
import { SOCIAL_LINKS } from '../../utils/constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-yellow-500/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">IKU</span>
              </div>
              <div>
                <div className="text-white font-semibold text-lg">
                  Instituto de Kabbalah Universal
                </div>
                <div className="text-yellow-500 text-sm">
                  IKU Cábala Activa
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Conecta con la sabiduría ancestral de la Cábala קבלה a través de herramientas espirituales personalizadas del Maestro y Rabino Isaac Benzaquén.
            </p>
            <SocialLinks variant="footer" />
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#herramientas" className="text-gray-300 hover:text-yellow-500 transition-colors text-sm">Herramientas</a></li>
              <li><a href="#maestro" className="text-gray-300 hover:text-yellow-500 transition-colors text-sm">Sobre el Maestro</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-yellow-500 transition-colors text-sm">Precios</a></li>
              <li><a href="#testimonios" className="text-gray-300 hover:text-yellow-500 transition-colors text-sm">Testimonios</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-yellow-500 transition-colors text-sm">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                📧 {SOCIAL_LINKS.email}
              </p>
              <p className="text-gray-300 text-sm">
                💬 WhatsApp: {SOCIAL_LINKS.whatsapp.number}
              </p>
              <p className="text-gray-300 text-sm">
                🌐 iku-cabalactiva.com
              </p>
              <p className="text-gray-300 text-sm">
                🇻🇪 Venezuela
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Instituto de Kabbalah Universal - IKU Cábala Activa. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Maestro y Rabino Isaac Benzaquén | Transformación espiritual a través de la Kabbalah קבלה
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer